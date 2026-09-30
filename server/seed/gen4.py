import json

challenges = []

c46 = {
    "problemNumber": 46,
    "title": "Gas Station",
    "slug": "gas-station",
    "difficulty": "Medium",
    "category": "Mixed",
    "description": "There are `n` gas stations along a circular route, where the amount of gas at the `i`th station is `gas[i]`.\n\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i`th station to its next `(i + 1)`th station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays `gas` and `cost`, return *the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return* `-1`. If there exists a solution, it is **guaranteed** to be **unique**.",
    "examples": [
        {
            "input": "5\n1 2 3 4 5\n5\n3 4 5 1 2",
            "output": "3",
            "explanation": "Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4\nTravel to station 4. Your tank = 4 - 1 + 5 = 8\nTravel to station 0. Your tank = 8 - 2 + 1 = 7\nTravel to station 1. Your tank = 7 - 3 + 2 = 6\nTravel to station 2. Your tank = 6 - 4 + 3 = 5\nTravel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.\nTherefore, return 3 as the starting index."
        }
    ],
    "constraints": [
        "n == gas.length == cost.length",
        "1 <= n <= 10^5",
        "0 <= gas[i], cost[i] <= 10^4"
    ],
    "publicTestCases": [
        {"input": "5\n1 2 3 4 5\n5\n3 4 5 1 2", "expectedOutput": "3"},
        {"input": "3\n2 3 4\n3\n3 4 3", "expectedOutput": "-1"},
        {"input": "1\n5\n1\n4", "expectedOutput": "0"}
    ],
    "hiddenTestCases": [
        {"input": "4\n5 1 2 3\n4\n2 2 2 2", "expectedOutput": "0"},
        {"input": "2\n2 2\n2\n3 3", "expectedOutput": "-1"},
        {"input": "5\n1 2 3 4 5\n5\n1 2 3 4 5", "expectedOutput": "0"},
        {"input": "5\n4 5 1 2 3\n5\n1 2 3 4 5", "expectedOutput": "0"},
        {"input": "1\n2\n1\n2", "expectedOutput": "0"}
    ],
    "starterCode": {
        "python": "import sys\n\ndef canCompleteCircuit(gas, cost):\n    pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n1 = int(input_data[0])\n    gas = [int(x) for x in input_data[1:n1+1]]\n    n2 = int(input_data[n1+1])\n    cost = [int(x) for x in input_data[n1+2:n1+2+n2]]\n    print(canCompleteCircuit(gas, cost))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    return -1;\n}\n\nint main() {\n    int n1; if (!(cin >> n1)) return 0;\n    vector<int> gas(n1);\n    for(int i=0; i<n1; ++i) cin >> gas[i];\n    int n2; cin >> n2;\n    vector<int> cost(n2);\n    for(int i=0; i<n2; ++i) cin >> cost[i];\n    cout << canCompleteCircuit(gas, cost) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {\n    return -1;\n}\n\nint main() {\n    int n1; if (scanf(\"%d\", &n1) != 1) return 0;\n    int* gas = (int*)malloc(n1 * sizeof(int));\n    for(int i=0; i<n1; ++i) scanf(\"%d\", &gas[i]);\n    int n2; scanf(\"%d\", &n2);\n    int* cost = (int*)malloc(n2 * sizeof(int));\n    for(int i=0; i<n2; ++i) scanf(\"%d\", &cost[i]);\n    printf(\"%d\\n\", canCompleteCircuit(gas, n1, cost, n2));\n    free(gas); free(cost);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        return -1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n1 = sc.nextInt();\n        int[] gas = new int[n1];\n        for(int i=0; i<n1; i++) gas[i] = sc.nextInt();\n        int n2 = sc.nextInt();\n        int[] cost = new int[n2];\n        for(int i=0; i<n2; i++) cost[i] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.canCompleteCircuit(gas, cost));\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\n\ndef canCompleteCircuit(gas, cost):\n    total_surplus, current_surplus, start_idx = 0, 0, 0\n    for i in range(len(gas)):\n        total_surplus += gas[i] - cost[i]\n        current_surplus += gas[i] - cost[i]\n        if current_surplus < 0:\n            start_idx = i + 1\n            current_surplus = 0\n    return start_idx if total_surplus >= 0 else -1\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n1 = int(input_data[0])\n    gas = [int(x) for x in input_data[1:n1+1]]\n    n2 = int(input_data[n1+1])\n    cost = [int(x) for x in input_data[n1+2:n1+2+n2]]\n    print(canCompleteCircuit(gas, cost))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n    int total_surplus = 0, current_surplus = 0, start_idx = 0;\n    for(int i = 0; i < gas.size(); ++i) {\n        total_surplus += gas[i] - cost[i];\n        current_surplus += gas[i] - cost[i];\n        if (current_surplus < 0) {\n            start_idx = i + 1;\n            current_surplus = 0;\n        }\n    }\n    return total_surplus >= 0 ? start_idx : -1;\n}\n\nint main() {\n    int n1; if (!(cin >> n1)) return 0;\n    vector<int> gas(n1);\n    for(int i=0; i<n1; ++i) cin >> gas[i];\n    int n2; cin >> n2;\n    vector<int> cost(n2);\n    for(int i=0; i<n2; ++i) cin >> cost[i];\n    cout << canCompleteCircuit(gas, cost) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint canCompleteCircuit(int* gas, int gasSize, int* cost, int costSize) {\n    int total_surplus = 0, current_surplus = 0, start_idx = 0;\n    for(int i = 0; i < gasSize; ++i) {\n        total_surplus += gas[i] - cost[i];\n        current_surplus += gas[i] - cost[i];\n        if (current_surplus < 0) {\n            start_idx = i + 1;\n            current_surplus = 0;\n        }\n    }\n    return total_surplus >= 0 ? start_idx : -1;\n}\n\nint main() {\n    int n1; if (scanf(\"%d\", &n1) != 1) return 0;\n    int* gas = (int*)malloc(n1 * sizeof(int));\n    for(int i=0; i<n1; ++i) scanf(\"%d\", &gas[i]);\n    int n2; scanf(\"%d\", &n2);\n    int* cost = (int*)malloc(n2 * sizeof(int));\n    for(int i=0; i<n2; ++i) scanf(\"%d\", &cost[i]);\n    printf(\"%d\\n\", canCompleteCircuit(gas, n1, cost, n2));\n    free(gas); free(cost);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        int total_surplus = 0, current_surplus = 0, start_idx = 0;\n        for(int i = 0; i < gas.length; ++i) {\n            total_surplus += gas[i] - cost[i];\n            current_surplus += gas[i] - cost[i];\n            if (current_surplus < 0) {\n                start_idx = i + 1;\n                current_surplus = 0;\n            }\n        }\n        return total_surplus >= 0 ? start_idx : -1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n1 = sc.nextInt();\n        int[] gas = new int[n1];\n        for(int i=0; i<n1; i++) gas[i] = sc.nextInt();\n        int n2 = sc.nextInt();\n        int[] cost = new int[n2];\n        for(int i=0; i<n2; i++) cost[i] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.canCompleteCircuit(gas, cost));\n    }\n}"
    },
    "tags": ["Array", "Greedy"],
    "hints": ["If the total number of gas is bigger than the total number of cost, there must be a solution.", "The station where the current surplus becomes negative cannot be the starting station."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c46)

c47 = {
    "problemNumber": 47,
    "title": "First Missing Positive",
    "slug": "first-missing-positive",
    "difficulty": "Hard",
    "category": "Mixed",
    "description": "Given an unsorted integer array `nums`, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in `O(n)` time and uses constant extra space.",
    "examples": [
        {
            "input": "3\n1 2 0",
            "output": "3",
            "explanation": "The numbers in the range [1,2] are all in the array."
        }
    ],
    "constraints": [
        "1 <= nums.length <= 10^5",
        "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "publicTestCases": [
        {"input": "3\n1 2 0", "expectedOutput": "3"},
        {"input": "4\n3 4 -1 1", "expectedOutput": "2"},
        {"input": "5\n7 8 9 11 12", "expectedOutput": "1"}
    ],
    "hiddenTestCases": [
        {"input": "2\n1 1", "expectedOutput": "2"},
        {"input": "1\n2", "expectedOutput": "1"},
        {"input": "6\n2 1 4 3 6 5", "expectedOutput": "7"},
        {"input": "1\n-5", "expectedOutput": "1"},
        {"input": "4\n0 2 2 1", "expectedOutput": "3"}
    ],
    "starterCode": {
        "python": "import sys\n\ndef firstMissingPositive(nums):\n    pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    print(firstMissingPositive(nums))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint firstMissingPositive(vector<int>& nums) {\n    return 0;\n}\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; ++i) cin >> nums[i];\n    cout << firstMissingPositive(nums) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint firstMissingPositive(int* nums, int numsSize) {\n    return 0;\n}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    int* nums = (int*)malloc(n * sizeof(int));\n    for(int i=0; i<n; ++i) scanf(\"%d\", &nums[i]);\n    printf(\"%d\\n\", firstMissingPositive(nums, n));\n    free(nums);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int firstMissingPositive(int[] nums) {\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.firstMissingPositive(nums));\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\n\ndef firstMissingPositive(nums):\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            nums[nums[i] - 1], nums[i] = nums[i], nums[nums[i] - 1]\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    print(firstMissingPositive(nums))\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint firstMissingPositive(vector<int>& nums) {\n    int n = nums.size();\n    for(int i=0; i<n; ++i) {\n        while(nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {\n            swap(nums[i], nums[nums[i] - 1]);\n        }\n    }\n    for(int i=0; i<n; ++i) {\n        if (nums[i] != i + 1) return i + 1;\n    }\n    return n + 1;\n}\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; ++i) cin >> nums[i];\n    cout << firstMissingPositive(nums) << \"\\n\";\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint firstMissingPositive(int* nums, int numsSize) {\n    for(int i=0; i<numsSize; ++i) {\n        while(nums[i] > 0 && nums[i] <= numsSize && nums[nums[i] - 1] != nums[i]) {\n            int temp = nums[nums[i] - 1];\n            nums[nums[i] - 1] = nums[i];\n            nums[i] = temp;\n        }\n    }\n    for(int i=0; i<numsSize; ++i) {\n        if (nums[i] != i + 1) return i + 1;\n    }\n    return numsSize + 1;\n}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    int* nums = (int*)malloc(n * sizeof(int));\n    for(int i=0; i<n; ++i) scanf(\"%d\", &nums[i]);\n    printf(\"%d\\n\", firstMissingPositive(nums, n));\n    free(nums);\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Solution {\n    public int firstMissingPositive(int[] nums) {\n        int n = nums.length;\n        for(int i=0; i<n; i++) {\n            while(nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {\n                int temp = nums[nums[i] - 1];\n                nums[nums[i] - 1] = nums[i];\n                nums[i] = temp;\n            }\n        }\n        for(int i=0; i<n; i++) {\n            if(nums[i] != i + 1) return i + 1;\n        }\n        return n + 1;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        Solution sol = new Solution();\n        System.out.println(sol.firstMissingPositive(nums));\n    }\n}"
    },
    "tags": ["Array", "Hash Table"],
    "hints": ["Think about how you can use the array itself as a hash table.", "Put each number in its right place. E.g., put 5 at index 4."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c47)

c48 = {
    "problemNumber": 48,
    "title": "LRU Cache",
    "slug": "lru-cache",
    "difficulty": "Medium",
    "category": "Mixed",
    "description": "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n\n* `LRUCache(int capacity)` Initialize the LRU cache with **positive** size `capacity`.\n* `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n* `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.",
    "examples": [
        {
            "input": "9\nLRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4",
            "output": "null\nnull\nnull\n1\nnull\n-1\nnull\n-1\n3\n4",
            "explanation": "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); // cache is {1=1}\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
        }
    ],
    "constraints": [
        "1 <= capacity <= 3000",
        "0 <= key <= 10^4",
        "0 <= value <= 10^5",
        "At most 2 * 10^5 calls will be made to get and put."
    ],
    "publicTestCases": [
        {"input": "10\nLRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4", "expectedOutput": "null\nnull\nnull\n1\nnull\n-1\nnull\n-1\n3\n4"},
        {"input": "5\nLRUCache 1\nput 2 1\nget 2\nput 3 2\nget 2", "expectedOutput": "null\nnull\n1\nnull\n-1"},
        {"input": "6\nLRUCache 2\nput 2 1\nput 2 2\nget 2\nput 1 1\nput 4 1", "expectedOutput": "null\nnull\nnull\n2\nnull\nnull"}
    ],
    "hiddenTestCases": [
        {"input": "3\nLRUCache 1\nput 1 1\nput 1 2", "expectedOutput": "null\nnull\nnull"},
        {"input": "6\nLRUCache 3\nput 1 1\nput 2 2\nput 3 3\nget 1\nput 4 4", "expectedOutput": "null\nnull\nnull\nnull\n1\nnull"},
        {"input": "7\nLRUCache 2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4", "expectedOutput": "null\nnull\nnull\n1\nnull\n-1\nnull"},
        {"input": "4\nLRUCache 2\nput 2 1\nput 1 1\nput 2 3", "expectedOutput": "null\nnull\nnull\nnull"},
        {"input": "5\nLRUCache 2\nput 1 1\nget 1\nput 2 2\nget 1", "expectedOutput": "null\nnull\n1\nnull\n1"}
    ],
    "starterCode": {
        "python": "import sys\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        pass\n    def put(self, key: int, value: int) -> None:\n        pass\n\ndef main():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    obj = None\n    for i in range(1, n + 1):\n        parts = lines[i].split()\n        cmd = parts[0]\n        if cmd == 'LRUCache':\n            obj = LRUCache(int(parts[1]))\n            print('null')\n        elif cmd == 'get':\n            print(obj.get(int(parts[1])))\n        elif cmd == 'put':\n            obj.put(int(parts[1]), int(parts[2]))\n            print('null')\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    LRUCache* obj = nullptr;\n    for (int i = 0; i < n; ++i) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == \"LRUCache\") {\n            int capacity; cin >> capacity;\n            obj = new LRUCache(capacity);\n            cout << \"null\\n\";\n        } else if (cmd == \"get\") {\n            int k; cin >> k;\n            cout << obj->get(k) << \"\\n\";\n        } else if (cmd == \"put\") {\n            int k, v; cin >> k >> v;\n            obj->put(k, v);\n            cout << \"null\\n\";\n        }\n    }\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    \n} LRUCache;\n\nLRUCache* lRUCacheCreate(int capacity) { return NULL; }\nint lRUCacheGet(LRUCache* obj, int key) { return -1; }\nvoid lRUCachePut(LRUCache* obj, int key, int value) {}\nvoid lRUCacheFree(LRUCache* obj) {}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    LRUCache* obj = NULL;\n    for (int i = 0; i < n; ++i) {\n        char cmd[20];\n        scanf(\"%s\", cmd);\n        if (strcmp(cmd, \"LRUCache\") == 0) {\n            int capacity; scanf(\"%d\", &capacity);\n            obj = lRUCacheCreate(capacity);\n            printf(\"null\\n\");\n        } else if (strcmp(cmd, \"get\") == 0) {\n            int k; scanf(\"%d\", &k);\n            printf(\"%d\\n\", lRUCacheGet(obj, k));\n        } else if (strcmp(cmd, \"put\") == 0) {\n            int k, v; scanf(\"%d %d\", &k, &v);\n            lRUCachePut(obj, k, v);\n            printf(\"null\\n\");\n        }\n    }\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        LRUCache obj = null;\n        for (int i = 0; i < n; i++) {\n            String cmd = sc.next();\n            if (cmd.equals(\"LRUCache\")) {\n                int capacity = sc.nextInt();\n                obj = new LRUCache(capacity);\n                System.out.println(\"null\");\n            } else if (cmd.equals(\"get\")) {\n                int k = sc.nextInt();\n                System.out.println(obj.get(k));\n            } else if (cmd.equals(\"put\")) {\n                int k = sc.nextInt();\n                int v = sc.nextInt();\n                obj.put(k, v);\n                System.out.println(\"null\");\n            }\n        }\n    }\n}"
    },
    "optimalSolutions": {
        "python": "import sys\n\nclass Node:\n    def __init__(self, key=0, val=0):\n        self.key, self.val = key, val\n        self.prev = self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n        self.head = Node()\n        self.tail = Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def remove(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def insert(self, node):\n        node.prev = self.head\n        node.next = self.head.next\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            self.remove(self.cache[key])\n            self.insert(self.cache[key])\n            return self.cache[key].val\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.remove(self.cache[key])\n        self.cache[key] = Node(key, value)\n        self.insert(self.cache[key])\n        if len(self.cache) > self.cap:\n            lru = self.tail.prev\n            self.remove(lru)\n            del self.cache[lru.key]\n\ndef main():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    obj = None\n    for i in range(1, n + 1):\n        parts = lines[i].split()\n        cmd = parts[0]\n        if cmd == 'LRUCache':\n            obj = LRUCache(int(parts[1]))\n            print('null')\n        elif cmd == 'get':\n            print(obj.get(int(parts[1])))\n        elif cmd == 'put':\n            obj.put(int(parts[1]), int(parts[2]))\n            print('null')\n\nif __name__ == '__main__':\n    main()",
        "cpp": "#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct Node {\n    int key, val;\n    Node *prev, *next;\n    Node(int k=0, int v=0): key(k), val(v), prev(nullptr), next(nullptr) {}\n};\n\nclass LRUCache {\n    int cap;\n    unordered_map<int, Node*> cache;\n    Node* head;\n    Node* tail;\n    void remove(Node* node) {\n        node->prev->next = node->next;\n        node->next->prev = node->prev;\n    }\n    void insert(Node* node) {\n        node->prev = head;\n        node->next = head->next;\n        head->next->prev = node;\n        head->next = node;\n    }\npublic:\n    LRUCache(int capacity) {\n        cap = capacity;\n        head = new Node();\n        tail = new Node();\n        head->next = tail;\n        tail->prev = head;\n    }\n    int get(int key) {\n        if (cache.count(key)) {\n            remove(cache[key]);\n            insert(cache[key]);\n            return cache[key]->val;\n        }\n        return -1;\n    }\n    void put(int key, int value) {\n        if (cache.count(key)) {\n            remove(cache[key]);\n            cache[key]->val = value;\n            insert(cache[key]);\n            return;\n        }\n        if (cache.size() == cap) {\n            Node* lru = tail->prev;\n            cache.erase(lru->key);\n            remove(lru);\n            delete lru;\n        }\n        Node* node = new Node(key, value);\n        cache[key] = node;\n        insert(node);\n    }\n};\n\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    LRUCache* obj = nullptr;\n    for (int i = 0; i < n; ++i) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == \"LRUCache\") {\n            int capacity; cin >> capacity;\n            obj = new LRUCache(capacity);\n            cout << \"null\\n\";\n        } else if (cmd == \"get\") {\n            int k; cin >> k;\n            cout << obj->get(k) << \"\\n\";\n        } else if (cmd == \"put\") {\n            int k, v; cin >> k >> v;\n            obj->put(k, v);\n            cout << \"null\\n\";\n        }\n    }\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct Node {\n    int key, val;\n    struct Node *prev, *next;\n} Node;\n\ntypedef struct {\n    int cap, size;\n    Node* head;\n    Node* tail;\n    Node** map;\n} LRUCache;\n\nLRUCache* lRUCacheCreate(int capacity) {\n    LRUCache* cache = (LRUCache*)malloc(sizeof(LRUCache));\n    cache->cap = capacity;\n    cache->size = 0;\n    cache->head = (Node*)malloc(sizeof(Node));\n    cache->tail = (Node*)malloc(sizeof(Node));\n    cache->head->next = cache->tail;\n    cache->tail->prev = cache->head;\n    cache->map = (Node**)calloc(10001, sizeof(Node*));\n    return cache;\n}\n\nvoid removeNode(Node* node) {\n    node->prev->next = node->next;\n    node->next->prev = node->prev;\n}\n\nvoid insertNode(LRUCache* cache, Node* node) {\n    node->prev = cache->head;\n    node->next = cache->head->next;\n    cache->head->next->prev = node;\n    cache->head->next = node;\n}\n\nint lRUCacheGet(LRUCache* obj, int key) {\n    if (obj->map[key]) {\n        removeNode(obj->map[key]);\n        insertNode(obj, obj->map[key]);\n        return obj->map[key]->val;\n    }\n    return -1;\n}\n\nvoid lRUCachePut(LRUCache* obj, int key, int value) {\n    if (obj->map[key]) {\n        removeNode(obj->map[key]);\n        obj->map[key]->val = value;\n        insertNode(obj, obj->map[key]);\n        return;\n    }\n    if (obj->size == obj->cap) {\n        Node* lru = obj->tail->prev;\n        obj->map[lru->key] = NULL;\n        removeNode(lru);\n        free(lru);\n        obj->size--;\n    }\n    Node* node = (Node*)malloc(sizeof(Node));\n    node->key = key; node->val = value;\n    obj->map[key] = node;\n    insertNode(obj, node);\n    obj->size++;\n}\n\nvoid lRUCacheFree(LRUCache* obj) {\n    Node* curr = obj->head;\n    while (curr) {\n        Node* next = curr->next;\n        free(curr);\n        curr = next;\n    }\n    free(obj->map);\n    free(obj);\n}\n\nint main() {\n    int n; if (scanf(\"%d\", &n) != 1) return 0;\n    LRUCache* obj = NULL;\n    for (int i = 0; i < n; ++i) {\n        char cmd[20];\n        scanf(\"%s\", cmd);\n        if (strcmp(cmd, \"LRUCache\") == 0) {\n            int capacity; scanf(\"%d\", &capacity);\n            obj = lRUCacheCreate(capacity);\n            printf(\"null\\n\");\n        } else if (strcmp(cmd, \"get\") == 0) {\n            int k; scanf(\"%d\", &k);\n            printf(\"%d\\n\", lRUCacheGet(obj, k));\n        } else if (strcmp(cmd, \"put\") == 0) {\n            int k, v; scanf(\"%d %d\", &k, &v);\n            lRUCachePut(obj, k, v);\n            printf(\"null\\n\");\n        }\n    }\n    return 0;\n}",
        "java": "import java.util.*;\n\nclass Node {\n    int key, val;\n    Node prev, next;\n    Node(int k, int v) { key = k; val = v; }\n}\n\nclass LRUCache {\n    int cap;\n    Map<Integer, Node> cache;\n    Node head, tail;\n    public LRUCache(int capacity) {\n        cap = capacity;\n        cache = new HashMap<>();\n        head = new Node(0, 0);\n        tail = new Node(0, 0);\n        head.next = tail;\n        tail.prev = head;\n    }\n    private void remove(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n    private void insert(Node node) {\n        node.prev = head;\n        node.next = head.next;\n        head.next.prev = node;\n        head.next = node;\n    }\n    public int get(int key) {\n        if(cache.containsKey(key)) {\n            Node node = cache.get(key);\n            remove(node);\n            insert(node);\n            return node.val;\n        }\n        return -1;\n    }\n    public void put(int key, int value) {\n        if(cache.containsKey(key)) {\n            remove(cache.get(key));\n        }\n        if(cache.size() == cap && !cache.containsKey(key)) {\n            Node lru = tail.prev;\n            remove(lru);\n            cache.remove(lru.key);\n        }\n        Node node = new Node(key, value);\n        cache.put(key, node);\n        insert(node);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        LRUCache obj = null;\n        for (int i = 0; i < n; i++) {\n            String cmd = sc.next();\n            if (cmd.equals(\"LRUCache\")) {\n                int capacity = sc.nextInt();\n                obj = new LRUCache(capacity);\n                System.out.println(\"null\");\n            } else if (cmd.equals(\"get\")) {\n                int k = sc.nextInt();\n                System.out.println(obj.get(k));\n            } else if (cmd.equals(\"put\")) {\n                int k = sc.nextInt();\n                int v = sc.nextInt();\n                obj.put(k, v);\n                System.out.println(\"null\");\n            }\n        }\n    }\n}"
    },
    "tags": ["Design", "Hash Table", "Linked List", "Doubly-Linked List"],
    "hints": ["Use a combination of a hash map and a doubly-linked list.", "The hash map allows O(1) access, while the doubly-linked list allows O(1) removals and insertions."],
    "timeLimit": 2000,
    "memoryLimit": 256000
}

challenges.append(c48)
