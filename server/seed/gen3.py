import json

challenges = []

c43 = {
    "problemNumber": 43,
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "difficulty": "Hard",
    "category": "Queue",
    "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn *the max sliding window*.",
    "examples": [
        {
            "input": "8\n1 3 -1 -3 5 3 6 7\n3",
            "output": "3 3 5 5 6 7",
            "explanation": "Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7"
        }
    ],
    "constraints": [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
        "1 <= k <= nums.length"
    ],
    "publicTestCases": [
        {"input": "8\n1 3 -1 -3 5 3 6 7\n3", "expectedOutput": "3 3 5 5 6 7"},
        {"input": "1\n1\n1", "expectedOutput": "1"},
        {"input": "2\n9 11\n2", "expectedOutput": "11"}
    ],
    "hiddenTestCases": [
        {"input": "3\n4 -2 5\n2", "expectedOutput": "4 5"},
        {"input": "4\n-7 -8 7 5\n4", "expectedOutput": "7"},
        {"input": "5\n1 2 3 4 5\n3", "expectedOutput": "3 4 5"},
        {"input": "5\n5 4 3 2 1\n3", "expectedOutput": "5 4 3"},
        {"input": "6\n1 3 1 2 0 5\n3", "expectedOutput": "3 3 2 5"}
    ],
    "starterCode": {
        "python": "import sys\n\ndef maxSlidingWindow(nums, k):\n    pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    k = int(input_data[n+1])\n    ans = maxSlidingWindow(nums, k)\n    print(' '.join(map(str, ans)))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    return {};\n}\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    int k; cin >> k;\n    vector<int> ans = maxSlidingWindow(nums, k);\n    for (int i = 0; i < ans.size(); ++i) {\n        cout << ans[i] << (i == ans.size() - 1 ? \"\" : \" \");\n    }\n    cout << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {\n    *returnSize = 0;\n    return NULL;\n}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    int* nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; ++i) scanf(\"%d\", &nums[i]);\n    int k; scanf(\"%d\", &k);\n    int returnSize;\n    int* ans = maxSlidingWindow(nums, n, k, &returnSize);\n    for (int i = 0; i < returnSize; ++i) {\n        printf(\"%d%s\", ans[i], i == returnSize - 1 ? \"\" : \" \");\n    }\n    printf(\"\\n\");\n    free(nums); free(ans);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[]{};\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        Solution sol = new Solution();\n        int[] ans = sol.maxSlidingWindow(nums, k);\n        for (int i = 0; i < ans.length; i++) {\n            System.out.print(ans[i] + (i == ans.length - 1 ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\nfrom collections import deque\n\ndef maxSlidingWindow(nums, k):\n    dq = deque()\n    ans = []\n    for i in range(len(nums)):\n        if dq and dq[0] < i - k + 1:\n            dq.popleft()\n        while dq and nums[dq[-1]] < nums[i]:\n            dq.pop()\n        dq.append(i)\n        if i >= k - 1:\n            ans.append(nums[dq[0]])\n    return ans\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    k = int(input_data[n+1])\n    ans = maxSlidingWindow(nums, k)\n    print(' '.join(map(str, ans)))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nvector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;\n    vector<int> ans;\n    for (int i = 0; i < nums.size(); ++i) {\n        if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();\n        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n        dq.push_back(i);\n        if (i >= k - 1) ans.push_back(nums[dq.front()]);\n    }\n    return ans;\n}\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; ++i) cin >> nums[i];\n    int k; cin >> k;\n    vector<int> ans = maxSlidingWindow(nums, k);\n    for (int i = 0; i < ans.size(); ++i) {\n        cout << ans[i] << (i == ans.size() - 1 ? \"\" : \" \");\n    }\n    cout << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {\n    if (numsSize == 0) { *returnSize = 0; return NULL; }\n    *returnSize = numsSize - k + 1;\n    int* ans = (int*)malloc(*returnSize * sizeof(int));\n    int* dq = (int*)malloc(numsSize * sizeof(int));\n    int head = 0, tail = 0;\n    for (int i = 0; i < numsSize; ++i) {\n        if (head < tail && dq[head] < i - k + 1) head++;\n        while (head < tail && nums[dq[tail - 1]] < nums[i]) tail--;\n        dq[tail++] = i;\n        if (i >= k - 1) ans[i - k + 1] = nums[dq[head]];\n    }\n    free(dq);\n    return ans;\n}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    int* nums = (int*)malloc(n * sizeof(int));\n    for (int i = 0; i < n; ++i) scanf(\"%d\", &nums[i]);\n    int k; scanf(\"%d\", &k);\n    int returnSize;\n    int* ans = maxSlidingWindow(nums, n, k, &returnSize);\n    for (int i = 0; i < returnSize; ++i) {\n        printf(\"%d%s\", ans[i], i == returnSize - 1 ? \"\" : \" \");\n    }\n    printf(\"\\n\");\n    free(nums); free(ans);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        if (nums == null || nums.length == 0) return new int[0];\n        int[] ans = new int[nums.length - k + 1];\n        Deque<Integer> dq = new ArrayDeque<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();\n            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();\n            dq.offerLast(i);\n            if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];\n        }\n        return ans;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        Solution sol = new Solution();\n        int[] ans = sol.maxSlidingWindow(nums, k);\n        for (int i = 0; i < ans.length; i++) {\n            System.out.print(ans[i] + (i == ans.length - 1 ? \"\" : \" \"));\n        }\n        System.out.println();\n    }\n}"
    },
    "tags": ["Array", "Queue", "Sliding Window", "Monotonic Queue"],
    "hints": ["Use a monotonic queue to keep track of the maximum elements in the window.", "Remove elements from the front if they fall out of the window."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c43)

c44 = {
    "problemNumber": 44,
    "title": "Rotting Oranges",
    "slug": "rotting-oranges",
    "difficulty": "Medium",
    "category": "Queue",
    "description": "You are given an `m x n` `grid` where each cell can have one of three values:\n\n* `0` representing an empty cell,\n* `1` representing a fresh orange, or\n* `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.\n\nReturn *the minimum number of minutes that must elapse until no cell has a fresh orange*. If this is impossible, return `-1`.",
    "examples": [
        {
            "input": "3 3\n2 1 1\n1 1 0\n0 1 1",
            "output": "4",
            "explanation": "Minute 0: [2,1,1],[1,1,0],[0,1,1]\nMinute 1: [2,2,1],[2,1,0],[0,1,1]\nMinute 2: [2,2,2],[2,2,0],[0,1,1]\nMinute 3: [2,2,2],[2,2,0],[0,2,1]\nMinute 4: [2,2,2],[2,2,0],[0,2,2]\nNo fresh oranges left after 4 minutes."
        }
    ],
    "constraints": [
        "m == grid.length",
        "n == grid[i].length",
        "1 <= m, n <= 10",
        "grid[i][j] is 0, 1, or 2."
    ],
    "publicTestCases": [
        {"input": "3 3\n2 1 1\n1 1 0\n0 1 1", "expectedOutput": "4"},
        {"input": "3 3\n2 1 1\n0 1 1\n1 0 1", "expectedOutput": "-1"},
        {"input": "1 2\n0 2", "expectedOutput": "0"}
    ],
    "hiddenTestCases": [
        {"input": "2 2\n1 1\n1 1", "expectedOutput": "-1"},
        {"input": "3 3\n2 2 2\n2 2 2\n2 2 2", "expectedOutput": "0"},
        {"input": "3 3\n0 0 0\n0 0 0\n0 0 0", "expectedOutput": "0"},
        {"input": "2 3\n2 1 1\n1 1 1", "expectedOutput": "3"},
        {"input": "4 4\n2 1 0 2\n1 1 0 1\n0 0 0 1\n2 1 1 1", "expectedOutput": "3"}
    ],
    "starterCode": {
        "python": "import sys\n\ndef orangesRotting(grid):\n    pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    m = int(input_data[0])\n    n = int(input_data[1])\n    grid = []\n    idx = 2\n    for _ in range(m):\n        row = []\n        for _ in range(n):\n            row.append(int(input_data[idx]))\n            idx += 1\n        grid.append(row)\n    print(orangesRotting(grid))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint orangesRotting(vector<vector<int>>& grid) {\n    return -1;\n}\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> grid(m, vector<int>(n));\n    for(int i=0; i<m; ++i)\n        for(int j=0; j<n; ++j)\n            cin >> grid[i][j];\n    cout << orangesRotting(grid) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint orangesRotting(int** grid, int gridSize, int* gridColSize) {\n    return -1;\n}\n\nint main() {\n    int m, n; if (scanf(\"%d %d\", &m, &n) != 2) return 0;\n    int** grid = (int**)malloc(m * sizeof(int*));\n    int* cols = (int*)malloc(m * sizeof(int));\n    for(int i=0; i<m; ++i) {\n        grid[i] = (int*)malloc(n * sizeof(int));\n        cols[i] = n;\n        for(int j=0; j<n; ++j)\n            scanf(\"%d\", &grid[i][j]);\n    }\n    printf(\"%d\\n\", orangesRotting(grid, m, cols));\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int orangesRotting(int[][] grid) {\n        return -1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt();\n        int n = sc.nextInt();\n        int[][] grid = new int[m][n];\n        for(int i=0; i<m; i++)\n            for(int j=0; j<n; j++)\n                grid[i][j] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.orangesRotting(grid));\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\nfrom collections import deque\n\ndef orangesRotting(grid):\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == 2:\n                q.append((i, j))\n            elif grid[i][j] == 1:\n                fresh += 1\n    if fresh == 0: return 0\n    ans = 0\n    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]\n    while q:\n        sz = len(q)\n        rotten = False\n        for _ in range(sz):\n            r, c = q.popleft()\n            for dr, dc in dirs:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n                    rotten = True\n        if rotten: ans += 1\n    return ans if fresh == 0 else -1\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    m = int(input_data[0])\n    n = int(input_data[1])\n    grid = []\n    idx = 2\n    for _ in range(m):\n        row = []\n        for _ in range(n):\n            row.append(int(input_data[idx]))\n            idx += 1\n        grid.append(row)\n    print(orangesRotting(grid))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint orangesRotting(vector<vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size();\n    queue<pair<int, int>> q;\n    int fresh = 0;\n    for (int i = 0; i < m; ++i) {\n        for (int j = 0; j < n; ++j) {\n            if (grid[i][j] == 2) q.push({i, j});\n            else if (grid[i][j] == 1) fresh++;\n        }\n    }\n    if (fresh == 0) return 0;\n    int ans = 0;\n    int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};\n    while (!q.empty()) {\n        int sz = q.size();\n        bool rotten = false;\n        while (sz--) {\n            auto [r, c] = q.front(); q.pop();\n            for (auto& d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    q.push({nr, nc});\n                    rotten = true;\n                }\n            }\n        }\n        if (rotten) ans++;\n    }\n    return fresh == 0 ? ans : -1;\n}\n\nint main() {\n    int m, n; if (!(cin >> m >> n)) return 0;\n    vector<vector<int>> grid(m, vector<int>(n));\n    for(int i=0; i<m; ++i)\n        for(int j=0; j<n; ++j)\n            cin >> grid[i][j];\n    cout << orangesRotting(grid) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nint orangesRotting(int** grid, int gridSize, int* gridColSize) {\n    int m = gridSize, n = gridColSize[0];\n    int* qr = (int*)malloc(m * n * sizeof(int));\n    int* qc = (int*)malloc(m * n * sizeof(int));\n    int head = 0, tail = 0;\n    int fresh = 0;\n    for(int i=0; i<m; ++i) {\n        for(int j=0; j<n; ++j) {\n            if (grid[i][j] == 2) { qr[tail] = i; qc[tail] = j; tail++; }\n            else if (grid[i][j] == 1) fresh++;\n        }\n    }\n    if (fresh == 0) { free(qr); free(qc); return 0; }\n    int ans = 0;\n    int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};\n    while (head < tail) {\n        int sz = tail - head;\n        bool rotten = false;\n        for(int k=0; k<sz; ++k) {\n            int r = qr[head], c = qc[head]; head++;\n            for(int d=0; d<4; ++d) {\n                int nr = r + dirs[d][0], nc = c + dirs[d][1];\n                if (nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc] == 1) {\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    qr[tail] = nr; qc[tail] = nc; tail++;\n                    rotten = true;\n                }\n            }\n        }\n        if (rotten) ans++;\n    }\n    free(qr); free(qc);\n    return fresh == 0 ? ans : -1;\n}\n\nint main() {\n    int m, n; if (scanf(\"%d %d\", &m, &n) != 2) return 0;\n    int** grid = (int**)malloc(m * sizeof(int*));\n    int* cols = (int*)malloc(m * sizeof(int));\n    for(int i=0; i<m; ++i) {\n        grid[i] = (int*)malloc(n * sizeof(int));\n        cols[i] = n;\n        for(int j=0; j<n; ++j)\n            scanf(\"%d\", &grid[i][j]);\n    }\n    printf(\"%d\\n\", orangesRotting(grid, m, cols));\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        Queue<int[]> q = new LinkedList<>();\n        int fresh = 0;\n        for(int i=0; i<m; i++) {\n            for(int j=0; j<n; j++) {\n                if(grid[i][j] == 2) q.offer(new int[]{i, j});\n                else if(grid[i][j] == 1) fresh++;\n            }\n        }\n        if(fresh == 0) return 0;\n        int ans = 0;\n        int[][] dirs = {{-1,0}, {1,0}, {0,-1}, {0,1}};\n        while(!q.isEmpty()) {\n            int sz = q.size();\n            boolean rotten = false;\n            for(int i=0; i<sz; i++) {\n                int[] curr = q.poll();\n                for(int[] d : dirs) {\n                    int nr = curr[0] + d[0], nc = curr[1] + d[1];\n                    if(nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        q.offer(new int[]{nr, nc});\n                        rotten = true;\n                    }\n                }\n            }\n            if(rotten) ans++;\n        }\n        return fresh == 0 ? ans : -1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int m = sc.nextInt();\n        int n = sc.nextInt();\n        int[][] grid = new int[m][n];\n        for(int i=0; i<m; i++)\n            for(int j=0; j<n; j++)\n                grid[i][j] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.orangesRotting(grid));\n    }\n}"
    },
    "tags": ["Array", "Breadth-First Search", "Matrix"],
    "hints": ["Use Breadth-First Search (BFS) to model the rotting process.", "Track the number of fresh oranges and decrement when they rot."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c44)

c45 = {
    "problemNumber": 45,
    "title": "Task Scheduler",
    "slug": "task-scheduler",
    "difficulty": "Medium",
    "category": "Queue",
    "description": "You are given an array of CPU `tasks`, each represented by letters A to Z, and a cooling time `n`. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there's a constraint: **identical** tasks must be separated by at least `n` intervals due to cooling time.\n\nReturn the *minimum number of intervals* required to complete all tasks.",
    "examples": [
        {
            "input": "6\nA A A B B B\n2",
            "output": "8",
            "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B. There is at least 2 intervals between any two same tasks."
        }
    ],
    "constraints": [
        "1 <= tasks.length <= 10^4",
        "tasks[i] is an uppercase English letter.",
        "0 <= n <= 100"
    ],
    "publicTestCases": [
        {"input": "6\nA A A B B B\n2", "expectedOutput": "8"},
        {"input": "6\nA A A B B B\n0", "expectedOutput": "6"},
        {"input": "12\nA A A A A A B C D E F G\n2", "expectedOutput": "16"}
    ],
    "hiddenTestCases": [
        {"input": "3\nA B C\n3", "expectedOutput": "3"},
        {"input": "5\nA A B C D\n1", "expectedOutput": "5"},
        {"input": "4\nA A A A\n2", "expectedOutput": "10"},
        {"input": "6\nA B C A B C\n3", "expectedOutput": "7"},
        {"input": "8\nA B C D E A B C\n1", "expectedOutput": "8"}
    ],
    "starterCode": {
        "python": "import sys\n\ndef leastInterval(tasks, n):\n    pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    size = int(input_data[0])\n    tasks = input_data[1:size+1]\n    n = int(input_data[size+1])\n    print(leastInterval(tasks, n))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint leastInterval(vector<char>& tasks, int n) {\n    return 0;\n}\n\nint main() {\n    int size; if (!(cin >> size)) return 0;\n    vector<char> tasks(size);\n    for(int i=0; i<size; ++i) cin >> tasks[i];\n    int n; cin >> n;\n    cout << leastInterval(tasks, n) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint leastInterval(char* tasks, int tasksSize, int n) {\n    return 0;\n}\n\nint main() {\n    int size; if (scanf(\"%d\", &size) != 1) return 0;\n    char* tasks = (char*)malloc((size+1) * sizeof(char));\n    for(int i=0; i<size; ++i) {\n        char str[5]; scanf(\"%s\", str);\n        tasks[i] = str[0];\n    }\n    int n; scanf(\"%d\", &n);\n    printf(\"%d\\n\", leastInterval(tasks, size, n));\n    free(tasks);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int leastInterval(char[] tasks, int n) {\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int size = sc.nextInt();\n        char[] tasks = new char[size];\n        for(int i=0; i<size; i++) tasks[i] = sc.next().charAt(0);\n        int n = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.leastInterval(tasks, n));\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\nfrom collections import Counter\n\ndef leastInterval(tasks, n):\n    freq = Counter(tasks)\n    max_freq = max(freq.values())\n    max_count = sum(1 for v in freq.values() if v == max_freq)\n    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    size = int(input_data[0])\n    tasks = input_data[1:size+1]\n    n = int(input_data[size+1])\n    print(leastInterval(tasks, n))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint leastInterval(vector<char>& tasks, int n) {\n    vector<int> freq(26, 0);\n    int max_freq = 0, max_count = 0;\n    for (char c : tasks) {\n        freq[c - 'A']++;\n        if (freq[c - 'A'] > max_freq) {\n            max_freq = freq[c - 'A'];\n            max_count = 1;\n        } else if (freq[c - 'A'] == max_freq) {\n            max_count++;\n        }\n    }\n    return max((int)tasks.size(), (max_freq - 1) * (n + 1) + max_count);\n}\n\nint main() {\n    int size; if (!(cin >> size)) return 0;\n    vector<char> tasks(size);\n    for(int i=0; i<size; ++i) cin >> tasks[i];\n    int n; cin >> n;\n    cout << leastInterval(tasks, n) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\n#define MAX(a, b) ((a) > (b) ? (a) : (b))\n\nint leastInterval(char* tasks, int tasksSize, int n) {\n    int freq[26] = {0};\n    int max_freq = 0, max_count = 0;\n    for(int i=0; i<tasksSize; ++i) {\n        freq[tasks[i] - 'A']++;\n        if (freq[tasks[i] - 'A'] > max_freq) {\n            max_freq = freq[tasks[i] - 'A'];\n            max_count = 1;\n        } else if (freq[tasks[i] - 'A'] == max_freq) {\n            max_count++;\n        }\n    }\n    return MAX(tasksSize, (max_freq - 1) * (n + 1) + max_count);\n}\n\nint main() {\n    int size; if (scanf(\"%d\", &size) != 1) return 0;\n    char* tasks = (char*)malloc((size+1) * sizeof(char));\n    for(int i=0; i<size; ++i) {\n        char str[5]; scanf(\"%s\", str);\n        tasks[i] = str[0];\n    }\n    int n; scanf(\"%d\", &n);\n    printf(\"%d\\n\", leastInterval(tasks, size, n));\n    free(tasks);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] freq = new int[26];\n        int max_freq = 0, max_count = 0;\n        for(char c : tasks) {\n            freq[c - 'A']++;\n            if(freq[c - 'A'] > max_freq) {\n                max_freq = freq[c - 'A'];\n                max_count = 1;\n            } else if(freq[c - 'A'] == max_freq) {\n                max_count++;\n            }\n        }\n        return Math.max(tasks.length, (max_freq - 1) * (n + 1) + max_count);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int size = sc.nextInt();\n        char[] tasks = new char[size];\n        for(int i=0; i<size; i++) tasks[i] = sc.next().charAt(0);\n        int n = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.leastInterval(tasks, n));\n    }\n}"
    },
    "tags": ["Array", "Hash Table", "Greedy", "Sorting", "Heap (Priority Queue)"],
    "hints": ["Count the frequencies of the tasks.", "The most frequent task dictates the minimum length of the sequence."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c45)
