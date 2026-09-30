import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problems = [
  { title: "Two Sum", difficulty: "Easy" },
  { title: "Reverse String", difficulty: "Easy" },
  { title: "FizzBuzz", difficulty: "Easy" },
  { title: "Palindrome Check", difficulty: "Easy" },
  { title: "Maximum of Array", difficulty: "Easy" },
  { title: "Valid Parentheses", difficulty: "Medium" },
  { title: "Binary Search", difficulty: "Medium" },
  { title: "Merge Intervals", difficulty: "Medium" },
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
  { title: "Group Anagrams", difficulty: "Medium" },
  { title: "LRU Cache", difficulty: "Hard" },
  { title: "Median of Two Sorted Arrays", difficulty: "Hard" },
  { title: "Minimum Window Substring", difficulty: "Hard" },
  { title: "Word Break", difficulty: "Hard" },
  { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" }
];

const challenges = problems.map((prob, i) => {
  return {
    title: prob.title,
    slug: prob.title.toLowerCase().replace(/ /g, '-'),
    difficulty: prob.difficulty,
    description: `### ${prob.title}\n\nSolve the ${prob.title} problem. Write an optimal solution.`,
    examples: [
      { input: "example input", output: "example output", explanation: "example explanation" }
    ],
    constraints: ["length <= 10^5"],
    publicTestCases: [{ input: "example input", expectedOutput: "example output" }],
    hiddenTestCases: [{ input: "hidden input", expectedOutput: "hidden output" }],
    starterCode: {
      python: "def solve():\n    pass\n\nif __name__ == '__main__':\n    solve()",
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}",
      c: "#include <stdio.h>\n\nint main() {\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n    }\n}"
    },
    optimalSolutions: {
      python: "def solve():\n    print('example output')\n\nif __name__ == '__main__':\n    solve()",
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"example output\" << endl;\n    return 0;\n}",
      c: "#include <stdio.h>\n\nint main() {\n    printf(\"example output\\n\");\n    return 0;\n}",
      java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"example output\");\n    }\n}"
    },
    tags: ["Array", "Algorithm"],
    hints: ["Think carefully.", "Use appropriate data structures."]
  };
});

fs.writeFileSync(path.join(__dirname, 'challenges.json'), JSON.stringify(challenges, null, 2));
console.log("Generated 15 challenges.");
