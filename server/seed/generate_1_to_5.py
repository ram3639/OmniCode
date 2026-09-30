import json

problems = []

def make_problem(num, title, slug, diff, category, desc, examples, constraints, pub_tests, hid_tests, tags, hints, time_limit, mem_limit, starters, optimals):
    return {
        "problemNumber": num, "title": title, "slug": slug, "difficulty": diff, "category": category,
        "description": desc, "examples": examples, "constraints": constraints, "publicTestCases": pub_tests,
        "hiddenTestCases": hid_tests, "starterCode": starters, "optimalSolutions": optimals, "tags": tags,
        "hints": hints, "timeLimit": time_limit, "memoryLimit": mem_limit
    }

# 1. Two Sum
problems.append(make_problem(
    1, "Two Sum", "two-sum", "Easy", "Array",
    "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}],
    ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    [{"input": "4\n2 7 11 15\n9", "expectedOutput": "0 1"}, {"input": "3\n3 2 4\n6", "expectedOutput": "1 2"}, {"input": "2\n3 3\n6", "expectedOutput": "0 1"}],
    [{"input": "5\n-1 -2 -3 -4 -5\n-8", "expectedOutput": "2 4"}, {"input": "4\n0 4 3 0\n0", "expectedOutput": "0 3"}, {"input": "3\n1000000000 500000000 -1000000000\n0", "expectedOutput": "0 2"}, {"input": "2\n-1000000000 1000000000\n0", "expectedOutput": "0 1"}, {"input": "4\n1 2 3 4\n7", "expectedOutput": "2 3"}],
    ["Array", "Hash Table"], ["Use a hash map to store complements.", "Check if target - num exists in the map."], 2000, 256000,
    {
        "python": "def two_sum(nums, target):\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nres = two_sum(nums, target)\nprint(*res)",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    int target; scanf(\"%d\", &target);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n    }\n}"
    },
    {
        "python": "def two_sum(nums, target):\n    d = {}\n    for i, n in enumerate(nums):\n        if target - n in d:\n            return [d[target-n], i]\n        d[n] = i\n\nn = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\nres = two_sum(nums, target)\nprint(*res)",
        "cpp": "#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n    unordered_map<int, int> m;\n    for(int i=0; i<n; i++) {\n        if(m.count(target - nums[i])) {\n            cout << m[target - nums[i]] << \" \" << i << endl;\n            return 0;\n        }\n        m[nums[i]] = i;\n    }\n    return 0;\n}",
        "c": "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int* nums = malloc(n * sizeof(int));\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    int target; scanf(\"%d\", &target);\n    for(int i=0; i<n; i++) {\n        for(int j=i+1; j<n; j++) {\n            if(nums[i] + nums[j] == target) {\n                printf(\"%d %d\\n\", i, j);\n                free(nums);\n                return 0;\n            }\n        }\n    }\n    free(nums);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for(int i=0; i<n; i++) {\n            if(map.containsKey(target - nums[i])) {\n                System.out.println(map.get(target - nums[i]) + \" \" + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}"
    }
))

# 2. Best Time to Buy and Sell Stock
problems.append(make_problem(
    2, "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy", "Array",
    "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    [{"input": "prices = [7,1,5,3,6,4]", "output": "5", "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."}],
    ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    [{"input": "6\n7 1 5 3 6 4", "expectedOutput": "5"}, {"input": "5\n7 6 4 3 1", "expectedOutput": "0"}, {"input": "1\n5", "expectedOutput": "0"}],
    [{"input": "3\n2 4 1", "expectedOutput": "2"}, {"input": "2\n1 2", "expectedOutput": "1"}, {"input": "4\n3 2 6 5 0 3", "expectedOutput": "4"}, {"input": "4\n1 2 3 4", "expectedOutput": "3"}, {"input": "5\n2 1 2 1 0 1 2", "expectedOutput": "2"}],
    ["Array", "Dynamic Programming"], ["Track the minimum price seen so far.", "Update the maximum profit for each day if we sell at current price."], 2000, 256000,
    {
        "python": "def max_profit(prices):\n    pass\n\nn = int(input())\nprices = list(map(int, input().split()))\nprint(max_profit(prices))",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> prices(n);\n    for(int i=0; i<n; i++) cin >> prices[i];\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int prices[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &prices[i]);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] prices = new int[n];\n        for(int i=0; i<n; i++) prices[i] = sc.nextInt();\n    }\n}"
    },
    {
        "python": "def max_profit(prices):\n    min_p, max_p = float('inf'), 0\n    for p in prices:\n        if p < min_p: min_p = p\n        elif p - min_p > max_p: max_p = p - min_p\n    return max_p\n\nn = int(input())\nprices = list(map(int, input().split()))\nprint(max_profit(prices))",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int min_p = 100000, max_p = 0;\n    for(int i=0; i<n; i++) {\n        int p; cin >> p;\n        if (p < min_p) min_p = p;\n        else if (p - min_p > max_p) max_p = p - min_p;\n    }\n    cout << max_p << endl;\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int min_p = 100000, max_p = 0;\n    for(int i=0; i<n; i++) {\n        int p; scanf(\"%d\", &p);\n        if(p < min_p) min_p = p;\n        else if(p - min_p > max_p) max_p = p - min_p;\n    }\n    printf(\"%d\\n\", max_p);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int minP = Integer.MAX_VALUE, maxP = 0;\n        for(int i=0; i<n; i++) {\n            int p = sc.nextInt();\n            if(p < minP) minP = p;\n            else if(p - minP > maxP) maxP = p - minP;\n        }\n        System.out.println(maxP);\n    }\n}"
    }
))

# 3. Move Zeroes
problems.append(make_problem(
    3, "Move Zeroes", "move-zeroes", "Easy", "Array",
    "Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
    [{"input": "nums = [0,1,0,3,12]", "output": "[1,3,12,0,0]", "explanation": "Zeros are moved to end."}],
    ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
    [{"input": "5\n0 1 0 3 12", "expectedOutput": "1 3 12 0 0"}, {"input": "1\n0", "expectedOutput": "0"}, {"input": "3\n1 2 3", "expectedOutput": "1 2 3"}],
    [{"input": "5\n0 0 0 0 0", "expectedOutput": "0 0 0 0 0"}, {"input": "6\n4 2 4 0 0 3", "expectedOutput": "4 2 4 3 0 0"}, {"input": "2\n1 0", "expectedOutput": "1 0"}, {"input": "2\n0 1", "expectedOutput": "1 0"}, {"input": "7\n0 1 0 2 0 3 0", "expectedOutput": "1 2 3 0 0 0 0"}],
    ["Array", "Two Pointers"], ["Keep a pointer for the last non-zero element.", "Swap non-zero elements with the pointer."], 2000, 256000,
    {
        "python": "def move_zeroes(nums):\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\nmove_zeroes(nums)\nprint(*nums)",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n    }\n}"
    },
    {
        "python": "def move_zeroes(nums):\n    idx = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[idx], nums[i] = nums[i], nums[idx]\n            idx += 1\n\nn = int(input())\nnums = list(map(int, input().split()))\nmove_zeroes(nums)\nprint(*nums)",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int idx = 0;\n    for(int i=0; i<n; i++) {\n        if(nums[i] != 0) {\n            swap(nums[idx++], nums[i]);\n        }\n    }\n    for(int i=0; i<n; i++) cout << nums[i] << (i==n-1?\"\":\" \");\n    cout << endl;\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    int idx = 0;\n    for(int i=0; i<n; i++) {\n        if(nums[i] != 0) {\n            int temp = nums[idx];\n            nums[idx] = nums[i];\n            nums[i] = temp;\n            idx++;\n        }\n    }\n    for(int i=0; i<n; i++) printf(\"%d%s\", nums[i], (i==n-1?\"\":\" \"));\n    printf(\"\\n\");\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int idx = 0;\n        for(int i=0; i<n; i++) {\n            if(nums[i] != 0) {\n                int t = nums[idx];\n                nums[idx++] = nums[i];\n                nums[i] = t;\n            }\n        }\n        for(int i=0; i<n; i++) System.out.print(nums[i] + (i==n-1?\"\":\" \"));\n        System.out.println();\n    }\n}"
    }
))

# 4. Remove Duplicates from Sorted Array
problems.append(make_problem(
    4, "Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "Easy", "Array",
    "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nReturn `k` after placing the final result in the first `k` slots of `nums`.",
    [{"input": "nums = [1,1,2]", "output": "2, nums = [1,2,_]", "explanation": "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively."}],
    ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100", "nums is sorted in non-decreasing order."],
    [{"input": "3\n1 1 2", "expectedOutput": "1 2"}, {"input": "10\n0 0 1 1 1 2 2 3 3 4", "expectedOutput": "0 1 2 3 4"}, {"input": "1\n1", "expectedOutput": "1"}],
    [{"input": "5\n1 1 1 1 1", "expectedOutput": "1"}, {"input": "4\n-100 -100 0 100", "expectedOutput": "-100 0 100"}, {"input": "2\n1 2", "expectedOutput": "1 2"}, {"input": "5\n1 2 2 3 3", "expectedOutput": "1 2 3"}, {"input": "8\n-5 -5 -1 0 0 2 2 2", "expectedOutput": "-5 -1 0 2"}],
    ["Array", "Two Pointers"], ["Keep an index of the last unique element.", "Iterate and update when encountering a new element."], 2000, 256000,
    {
        "python": "def remove_duplicates(nums):\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\nk = remove_duplicates(nums)\nprint(*nums[:k])",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n    }\n}"
    },
    {
        "python": "def remove_duplicates(nums):\n    if not nums: return 0\n    i = 0\n    for j in range(1, len(nums)):\n        if nums[j] != nums[i]:\n            i += 1\n            nums[i] = nums[j]\n    return i + 1\n\nn = int(input())\nnums = list(map(int, input().split()))\nk = remove_duplicates(nums)\nprint(*nums[:k])",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    if(n == 0) return 0;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    int idx = 0;\n    for(int i=1; i<n; i++) {\n        if(nums[i] != nums[idx]) nums[++idx] = nums[i];\n    }\n    for(int i=0; i<=idx; i++) cout << nums[i] << (i==idx?\"\":\" \");\n    cout << endl;\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    if(n == 0) return 0;\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    int idx = 0;\n    for(int i=1; i<n; i++) {\n        if(nums[i] != nums[idx]) nums[++idx] = nums[i];\n    }\n    for(int i=0; i<=idx; i++) printf(\"%d%s\", nums[i], (i==idx?\"\":\" \"));\n    printf(\"\\n\");\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        if(n == 0) return;\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int idx = 0;\n        for(int i=1; i<n; i++) {\n            if(nums[i] != nums[idx]) nums[++idx] = nums[i];\n        }\n        for(int i=0; i<=idx; i++) System.out.print(nums[i] + (i==idx?\"\":\" \"));\n        System.out.println();\n    }\n}"
    }
))

# 5. Majority Element
problems.append(make_problem(
    5, "Majority Element", "majority-element", "Easy", "Array",
    "Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
    [{"input": "nums = [3,2,3]", "output": "3", "explanation": "3 appears twice, which is more than 3/2 = 1.5 times."}],
    ["n == nums.length", "1 <= n <= 5 * 10^4", "-10^9 <= nums[i] <= 10^9"],
    [{"input": "3\n3 2 3", "expectedOutput": "3"}, {"input": "7\n2 2 1 1 1 2 2", "expectedOutput": "2"}, {"input": "1\n1", "expectedOutput": "1"}],
    [{"input": "5\n1 1 1 2 3", "expectedOutput": "1"}, {"input": "5\n2 3 1 1 1", "expectedOutput": "1"}, {"input": "3\n-1 -1 2", "expectedOutput": "-1"}, {"input": "9\n5 5 5 5 5 0 0 0 0", "expectedOutput": "5"}, {"input": "7\n1 2 3 4 4 4 4", "expectedOutput": "4"}],
    ["Array", "Hash Table", "Divide and Conquer", "Sorting", "Counting"], ["Boyer-Moore Voting Algorithm is optimal O(n) time, O(1) space.", "Alternatively, sort and return middle element."], 2000, 256000,
    {
        "python": "def majority_element(nums):\n    pass\n\nn = int(input())\nnums = list(map(int, input().split()))\nprint(majority_element(nums))",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for(int i=0; i<n; i++) cin >> nums[i];\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int nums[n];\n    for(int i=0; i<n; i++) scanf(\"%d\", &nums[i]);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n    }\n}"
    },
    {
        "python": "def majority_element(nums):\n    count = 0; candidate = None\n    for num in nums:\n        if count == 0: candidate = num\n        count += (1 if num == candidate else -1)\n    return candidate\n\nn = int(input())\nnums = list(map(int, input().split()))\nprint(majority_element(nums))",
        "cpp": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int count = 0, candidate = 0;\n    for(int i=0; i<n; i++) {\n        int p; cin >> p;\n        if(count == 0) candidate = p;\n        count += (p == candidate) ? 1 : -1;\n    }\n    cout << candidate << endl;\n    return 0;\n}",
        "c": "#include <stdio.h>\n\nint main() {\n    int n; scanf(\"%d\", &n);\n    int count = 0, candidate = 0;\n    for(int i=0; i<n; i++) {\n        int p; scanf(\"%d\", &p);\n        if(count == 0) candidate = p;\n        count += (p == candidate) ? 1 : -1;\n    }\n    printf(\"%d\\n\", candidate);\n    return 0;\n}",
        "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int count = 0, candidate = 0;\n        for(int i=0; i<n; i++) {\n            int p = sc.nextInt();\n            if(count == 0) candidate = p;\n            count += (p == candidate) ? 1 : -1;\n        }\n        System.out.println(candidate);\n    }\n}"
    }
))

with open(r"c:\Users\ram\Documents\Smart Coach\server\seed\generate_1_to_5.py", "w") as f:
    f.write("import json\nwith open(r'c:\\Users\\ram\\Documents\\Smart Coach\\server\\seed\\p1_5.json', 'w') as out:\n    json.dump(problems, out)")
