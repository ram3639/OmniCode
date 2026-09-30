import json

def get_io_boilerplate(lang, p_idx):
    if lang == "python":
        return "def solve(nums):\\n    pass\\n\\nimport sys\\ndata = sys.stdin.read().split()\\nif not data: sys.exit(0)\\nn = int(data[0])\\nnums = [int(x) for x in data[1:n+1]]\\nres = solve(nums)\\nprint(res)"
    elif lang == "cpp":
        return "#include <iostream>\\n#include <vector>\\nusing namespace std;\\n\\nint main() {\\n    int n; if(!(cin >> n)) return 0;\\n    vector<int> nums(n);\\n    for(int i=0; i<n; i++) cin >> nums[i];\\n    // Call solve and print\\n    return 0;\\n}"
    elif lang == "c":
        return "#include <stdio.h>\\n#include <stdlib.h>\\n\\nint main() {\\n    int n; if(scanf(\\"%d\\", &n) != 1) return 0;\\n    int *nums = malloc(n * sizeof(int));\\n    for(int i=0; i<n; i++) scanf(\\"%d\\", &nums[i]);\\n    // Call solve and print\\n    free(nums);\\n    return 0;\\n}"
    elif lang == "java":
        return "import java.util.*;\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        if(!sc.hasNextInt()) return;\\n        int n = sc.nextInt();\\n        int[] nums = new int[n];\\n        for(int i=0; i<n; i++) nums[i] = sc.nextInt();\\n        // Call solve and print\\n    }\\n}"

# I will write a script that generates the 20 problems with real working code.
# To fit in one file, I'll use simple templates.

problems = []
with open(r"c:\Users\ram\Documents\Smart Coach\server\seed\challenges_array.json", "w") as f:
    json.dump(problems, f)
