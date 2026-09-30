// Node 18+ has native fetch — no import needed
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:3b';
const OLLAMA_TIMEOUT = 30000;
const JUDGE0_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';

const LANG_IDS = { javascript: 63, python: 71, java: 62, cpp: 54 };

/**
 * POST /api/playground/validate
 * Send user code + context to Ollama for error explanation and hints
 */
export const validateCode = async (req, res) => {
  try {
    const { code, topic, error: userError, functionName, language, solution, mode } = req.body;

    if (!code || !topic) {
      return res.status(400).json({ error: 'Code and topic are required' });
    }

    const langLabel = language || 'javascript';
    
    let prompt;
    if (mode === 'validate' && solution) {
      // Validation mode: compare user code against solution
      prompt = `You are a strict code reviewer. Compare the student's ${langLabel} implementation of "${functionName || topic}" against the reference solution.

Student's code:
\`\`\`${langLabel}
${code}
\`\`\`

Reference solution:
\`\`\`${langLabel}
${solution}
\`\`\`

Rules:
- If the student's code implements the SAME algorithm/logic correctly (variable names can differ, minor style differences are OK), respond starting with "CORRECT" followed by brief praise.
- If the code has logical errors, missing logic, or is fundamentally wrong, respond starting with "INCORRECT" followed by 2-3 sentences explaining what's wrong and a hint to fix it (without giving the answer).
- Be strict: empty functions, placeholder code, or missing core logic = INCORRECT.

Respond in 2-3 sentences maximum.`;
    } else if (userError) {
      prompt = `You are a coding tutor. The student is implementing "${functionName || topic}" for a ${topic} data structure/algorithm in ${langLabel}.

Their code:
\`\`\`${langLabel}
${code}
\`\`\`

The code produced this error: "${userError}"

In 2-3 short sentences:
1. Explain what went wrong in simple terms
2. Give a specific hint to fix it (without giving the full answer)

Be encouraging. Don't give the complete solution.`;
    } else {
      prompt = `You are a coding tutor. The student is implementing "${functionName || topic}" for a ${topic} data structure/algorithm in ${langLabel}.

Their code:
\`\`\`${langLabel}
${code}
\`\`\`

In 2-3 short sentences, analyze this code:
1. Is the logic correct for ${topic}?
2. If there are issues, give a hint (without the full answer)
3. If correct, confirm it works and briefly explain why

Be encouraging and concise.`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT);

    try {
      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          options: { temperature: 0.3, num_predict: 200 }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Ollama responded with ${response.status}`);
      }

      const data = await response.json();
      return res.json({ feedback: data.response?.trim() || 'No feedback generated.' });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        return res.json({ feedback: 'AI is taking too long. Check your code for infinite loops or try again.' });
      }
      if (userError) {
        return res.json({ feedback: `Error: ${userError}. Check your function logic and make sure you're returning the correct value.` });
      }
      return res.json({ feedback: 'AI feedback unavailable. Code was executed — check the visualizer for results.' });
    }
  } catch (error) {
    console.error('Playground validate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * POST /api/playground/run
 * Execute user code in any language via Judge0
 * Wraps the user's function with instrumented test harness that outputs JSON steps
 */
export const runCode = async (req, res) => {
  try {
    const { code, language, templateId, testData } = req.body;

    if (!code || !language || !templateId) {
      return res.status(400).json({ error: 'code, language, and templateId are required' });
    }

    const langId = LANG_IDS[language];
    if (!langId) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    // Check Judge0 availability
    try {
      await axios.get(`${JUDGE0_URL}/about`, { timeout: 3000 });
    } catch {
      return res.status(503).json({ error: 'Judge0 is not running. Start it with: docker-compose up -d' });
    }

    // Build the full program by wrapping user code with instrumented harness
    const fullProgram = buildInstrumentedProgram(code, language, templateId, testData);

    if (!fullProgram) {
      return res.status(400).json({ error: 'Could not build program for this template/language combination.' });
    }

    // Java: ensure public class Main
    let processedCode = fullProgram;
    if (language === 'java') {
      if (/public\s+class\s+\w+/.test(processedCode)) {
        processedCode = processedCode.replace(/public\s+class\s+\w+/g, 'public class Main');
      }
    }

    const isJava = language === 'java';
    // Submit to Judge0
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
      {
        language_id: langId,
        source_code: Buffer.from(processedCode).toString('base64'),
        stdin: '',
        cpu_time_limit: 5,
        memory_limit: isJava ? 1024000 : 512000,
        max_processes_and_or_threads: isJava ? 256 : 60,
        enable_per_process_and_thread_memory_limit: true,
        enable_per_process_and_thread_time_limit: true
      },
      { timeout: 30000 }
    );

    const result = submitRes.data;
    const decode = (s) => s ? Buffer.from(s, 'base64').toString('utf-8') : '';

    const stdout = decode(result.stdout);
    const stderr = decode(result.stderr);
    const compileOutput = decode(result.compile_output);

    if (result.status?.id !== 3) {
      // Not Accepted
      const errMsg = compileOutput || stderr || result.status?.description || 'Execution failed';
      return res.json({ success: false, error: errMsg, steps: [] });
    }

    // Parse JSON steps from stdout
    try {
      const steps = JSON.parse(stdout.trim());
      return res.json({ success: true, steps, error: null });
    } catch {
      return res.json({ success: false, error: `Code ran but output was not valid JSON.\nOutput: ${stdout.substring(0, 500)}`, steps: [] });
    }
  } catch (error) {
    console.error('Playground run error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Cannot connect to Judge0. Ensure Docker is running.' });
    }
    res.status(500).json({ error: error.message || 'Execution failed' });
  }
};

/**
 * Build instrumented program for a given language/template
 * The program runs the user's function and outputs JSON steps to stdout
 */
function buildInstrumentedProgram(userCode, language, templateId, testData) {
  const category = templateId.split('-')[0]; // e.g., 'bubble' from 'bubble-sort'
  const isSorting = ['bubble-sort', 'selection-sort', 'insertion-sort', 'quick-sort', 'merge-sort'].includes(templateId);
  const isSearching = ['linear-search', 'binary-search'].includes(templateId);
  const isStack = ['stack-push', 'stack-pop'].includes(templateId);
  const isQueue = ['queue-enqueue', 'queue-dequeue'].includes(templateId);

  if (language === 'python') {
    if (isSorting) {
      const arr = JSON.stringify(testData || [64, 34, 25, 12, 22, 11, 90, 45]);
      return `import json
arr = ${arr}
steps = [{"state": list(arr), "comparing": [], "swapping": [], "action": "init"}]

def swap(i, j):
    steps.append({"state": list(arr), "comparing": [i, j], "swapping": [], "action": "compare"})
    arr[i], arr[j] = arr[j], arr[i]
    steps.append({"state": list(arr), "comparing": [], "swapping": [i, j], "action": "swap"})

${userCode}

try:
    if 'quick_sort' in dir() or 'quickSort' in dir():
        fn = quick_sort if 'quick_sort' in dir() else quickSort
        fn(arr, swap, 0, len(arr) - 1)
    elif 'merge_sort' in dir() or 'mergeSort' in dir():
        def merge_fn(a, l, m, r):
            left = a[l:m+1]
            right = a[m+1:r+1]
            i = j = 0
            k = l
            while i < len(left) and j < len(right):
                steps.append({"state": list(a), "comparing": [l+i, m+1+j], "swapping": [], "action": "compare"})
                if left[i] <= right[j]:
                    a[k] = left[i]; i += 1
                else:
                    a[k] = right[j]; j += 1
                k += 1
                steps.append({"state": list(a), "comparing": [], "swapping": [k-1], "action": "swap"})
            while i < len(left):
                a[k] = left[i]; i += 1; k += 1
            while j < len(right):
                a[k] = right[j]; j += 1; k += 1
        fn = merge_sort if 'merge_sort' in dir() else mergeSort
        fn(arr, 0, len(arr) - 1, merge_fn)
    else:
        # Try to find any sorting function
        for name in ['bubble_sort', 'bubbleSort', 'selection_sort', 'selectionSort', 'insertion_sort', 'insertionSort']:
            if name in dir():
                eval(f"{name}(arr, swap)")
                break
except Exception as e:
    steps.append({"state": list(arr), "comparing": [], "swapping": [], "action": "error", "error": str(e)})

steps.append({"state": list(arr), "comparing": [], "swapping": [], "action": "done"})
print(json.dumps(steps))
`;
    }

    if (isSearching) {
      const data = testData || { array: [10, 23, 45, 12, 67, 34, 89, 56], target: 34 };
      return `import json
arr = ${JSON.stringify(data.array)}
target = ${data.target}
steps = [{"state": list(arr), "target": target, "checking": -1, "found": False, "action": "init"}]

def check(idx):
    steps.append({"state": list(arr), "target": target, "checking": idx, "found": arr[idx] == target, "action": "check"})

${userCode}

try:
    for name in ['linear_search', 'linearSearch', 'binary_search', 'binarySearch']:
        if name in dir():
            result = eval(f"{name}(arr, target, check)")
            break
    else:
        result = -1
except Exception as e:
    result = -1
    steps.append({"state": list(arr), "target": target, "checking": -1, "found": False, "action": "error", "error": str(e)})

steps.append({"state": list(arr), "target": target, "checking": result if result else -1, "found": result is not None and result != -1, "action": "done", "resultIndex": result if result else -1})
print(json.dumps(steps))
`;
    }

    if (isStack) {
      return `import json
stack = []
steps = [{"state": list(stack), "action": "init", "lastOp": ""}]

${userCode}

try:
    if 'push' in dir():
        for v in [10, 20, 30, 40, 50]:
            push(stack, v)
            steps.append({"state": list(stack), "action": "push", "lastOp": f"push({v})", "highlight": len(stack)-1})
    elif 'pop' in dir():
        stack = [10, 20, 30, 40, 50]
        steps = [{"state": list(stack), "action": "init", "lastOp": ""}]
        for _ in range(3):
            v = pop(stack)
            steps.append({"state": list(stack), "action": "pop", "lastOp": f"pop() -> {v}", "highlight": len(stack)})
except Exception as e:
    steps.append({"state": list(stack), "action": "error", "lastOp": str(e)})

print(json.dumps(steps))
`;
    }

    if (isQueue) {
      return `import json
queue = []
steps = [{"state": list(queue), "action": "init", "lastOp": ""}]

${userCode}

try:
    if 'enqueue' in dir():
        for v in [10, 20, 30, 40, 50]:
            enqueue(queue, v)
            steps.append({"state": list(queue), "action": "enqueue", "lastOp": f"enqueue({v})", "highlight": len(queue)-1})
    elif 'dequeue' in dir():
        queue = [10, 20, 30, 40, 50]
        steps = [{"state": list(queue), "action": "init", "lastOp": ""}]
        for _ in range(3):
            v = dequeue(queue)
            steps.append({"state": list(queue), "action": "dequeue", "lastOp": f"dequeue() -> {v}", "highlight": 0})
except Exception as e:
    steps.append({"state": list(queue), "action": "error", "lastOp": str(e)})

print(json.dumps(steps))
`;
    }

    // Generic fallback for Python
    return `import json
${userCode}
print(json.dumps([{"action": "done", "state": []}]))
`;
  }

  if (language === 'java') {
    if (isSorting) {
      const arr = testData || [64, 34, 25, 12, 22, 11, 90, 45];
      return `import java.util.*;
public class Main {
    static List<String> steps = new ArrayList<>();
    static int[] arr = new int[]{${arr.join(',')}};

    static String stateJson() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) { if (i > 0) sb.append(","); sb.append(arr[i]); }
        sb.append("]"); return sb.toString();
    }

    static void swap(int i, int j) {
        steps.add("{\\"state\\":" + stateJson() + ",\\"comparing\\":[" + i + "," + j + "],\\"swapping\\":[],\\"action\\":\\"compare\\"}");
        int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        steps.add("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[" + i + "," + j + "],\\"action\\":\\"swap\\"}");
    }

    ${userCode.replace(/public\s+class\s+\w+\s*\{/, '').replace(/\}\s*$/, '')}

    public static void main(String[] args) {
        steps.add("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[],\\"action\\":\\"init\\"}");
        try {
            // Try calling the user's sort function
            ${templateId === 'quick-sort' ? 'quickSort(arr, null, 0, arr.length-1);' : templateId === 'merge-sort' ? 'mergeSort(arr, 0, arr.length-1, null);' : templateId.replace('-sort', 'Sort').replace(/(^[a-z])/, (m) => m) + '(arr, null);'}
        } catch (Exception e) {
            steps.add("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[],\\"action\\":\\"error\\"}");
        }
        steps.add("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[],\\"action\\":\\"done\\"}");
        System.out.println("[" + String.join(",", steps) + "]");
    }
}`;
    }

    // Generic Java fallback
    return `public class Main {
    ${userCode.replace(/public\s+class\s+\w+\s*\{/, '').replace(/\}\s*$/, '')}
    public static void main(String[] args) {
        System.out.println("[{\\"action\\":\\"done\\",\\"state\\":[]}]");
    }
}`;
  }

  if (language === 'cpp') {
    if (isSorting) {
      const arr = testData || [64, 34, 25, 12, 22, 11, 90, 45];
      return `#include <iostream>
#include <vector>
#include <string>
#include <functional>
using namespace std;

vector<string> steps;
vector<int> arr = {${arr.join(',')}};

string stateJson() {
    string s = "[";
    for (int i = 0; i < (int)arr.size(); i++) { if (i) s += ","; s += to_string(arr[i]); }
    return s + "]";
}

void swap_fn(int i, int j) {
    steps.push_back("{\\"state\\":" + stateJson() + ",\\"comparing\\":[" + to_string(i) + "," + to_string(j) + "],\\"swapping\\":[],\\"action\\":\\"compare\\"}");
    swap(arr[i], arr[j]);
    steps.push_back("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[" + to_string(i) + "," + to_string(j) + "],\\"action\\":\\"swap\\"}");
}

${userCode}

int main() {
    steps.push_back("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[],\\"action\\":\\"init\\"}");
    try {
        // Call sorting function - uses swap_fn
    } catch (...) {}
    steps.push_back("{\\"state\\":" + stateJson() + ",\\"comparing\\":[],\\"swapping\\":[],\\"action\\":\\"done\\"}");
    cout << "[";
    for (int i = 0; i < (int)steps.size(); i++) { if (i) cout << ","; cout << steps[i]; }
    cout << "]" << endl;
}
`;
    }

    // Generic C++ fallback
    return `#include <iostream>
using namespace std;
${userCode}
int main() {
    cout << "[{\\"action\\":\\"done\\",\\"state\\":[]}]" << endl;
}
`;
  }

  return null; // Unsupported
}
