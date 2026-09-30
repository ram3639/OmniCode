import json
import os

challenges = []

def tc(inp, out):
    return {"input": inp, "expectedOutput": out}

def ex(inp, out, exp):
    return {"input": inp, "output": out, "explanation": exp}

def make_prob(num, title, diff, cat, desc, examples, const, pub, hid, tags, hints, py_logic, cpp_logic, c_logic, java_logic, read_logic, print_logic, has_imports=True):
    slug = title.lower().replace(" ", "-")
    
    # Python
    py_start = f"def solve({read_logic['py_args']}):\n    pass\n\nif __name__ == '__main__':\n{read_logic['py_read']}"
    py_opt = f"def solve({read_logic['py_args']}):\n{py_logic}\n\nif __name__ == '__main__':\n{read_logic['py_read']}\n{print_logic['py_print']}"
    
    # C++
    cpp_start = f"#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {{\npublic:\n    {read_logic['cpp_ret']} solve({read_logic['cpp_args']}) {{\n        // Write your code here\n    }}\n}};\n\nint main() {{\n{read_logic['cpp_read']}\n    return 0;\n}}"
    cpp_opt = f"#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <unordered_map>\n#include <stack>\nusing namespace std;\n\nclass Solution {{\npublic:\n    {read_logic['cpp_ret']} solve({read_logic['cpp_args']}) {{\n{cpp_logic}\n    }}\n}};\n\nint main() {{\n{read_logic['cpp_read']}\n{print_logic['cpp_print']}\n    return 0;\n}}"

    # C
    c_start = f"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n{read_logic['c_ret']} solve({read_logic['c_args']}) {{\n    // Write your code here\n}}\n\nint main() {{\n{read_logic['c_read']}\n    return 0;\n}}"
    c_opt = f"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n{read_logic['c_ret']} solve({read_logic['c_args']}) {{\n{c_logic}\n}}\n\nint main() {{\n{read_logic['c_read']}\n{print_logic['c_print']}\n    return 0;\n}}"

    # Java
    java_start = f"import java.util.*;\nimport java.io.*;\n\npublic class Main {{\n    public {read_logic['java_ret']} solve({read_logic['java_args']}) {{\n        // Write your code here\n        return null;\n    }}\n    \n    public static void main(String[] args) throws Exception {{\n{read_logic['java_read']}\n    }}\n}}"
    java_opt = f"import java.util.*;\nimport java.io.*;\n\npublic class Main {{\n    public {read_logic['java_ret']} solve({read_logic['java_args']}) {{\n{java_logic}\n    }}\n    \n    public static void main(String[] args) throws Exception {{\n{read_logic['java_read']}\n{print_logic['java_print']}\n    }}\n}}"

    challenges.append({
        "problemNumber": num,
        "title": title,
        "slug": slug,
        "difficulty": diff,
        "category": cat,
        "description": desc,
        "examples": examples,
        "constraints": const,
        "publicTestCases": pub,
        "hiddenTestCases": hid,
        "starterCode": {"python": py_start, "cpp": cpp_start, "c": c_start, "java": java_start},
        "optimalSolutions": {"python": py_opt, "cpp": cpp_opt, "c": c_opt, "java": java_opt},
        "tags": tags,
        "hints": hints,
        "timeLimit": 2000,
        "memoryLimit": 256000
    })

# String category (21-30)

# 21. Valid Palindrome
make_prob(21, "Valid Palindrome", "Easy", "String",
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    [ex("A man, a plan, a canal: Panama", "true", "amanaplanacanalpanama is a palindrome")],
    ["1 <= s.length <= 2 * 10^5"],
    [tc("A man, a plan, a canal: Panama\n", "true\n"), tc("race a car\n", "false\n"), tc(" \n", "true\n")],
    [tc("a.\n", "true\n"), tc("ab@a\n", "true\n"), tc("0P\n", "false\n"), tc("bb\n", "true\n"), tc("12321\n", "true\n")],
    ["String"], ["Two pointers strategy"],
    "    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]",
    "        string t = \"\";\n        for (char c : s) if (isalnum(c)) t += tolower(c);\n        string r = t; reverse(r.begin(), r.end()); return t == r;",
    "    int l = 0, r = strlen(s) - 1;\n    while(l < r) {\n        while(l < r && !isalnum(s[l])) l++;\n        while(l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return 0;\n        l++; r--;\n    }\n    return 1;",
    "        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));\n        return sb.toString().equals(sb.reverse().toString());",
    {
        "py_args": "s", "py_read": "    import sys\n    s = sys.stdin.read().strip()", 
        "cpp_ret": "bool", "cpp_args": "string s", "cpp_read": "    string s;\n    getline(cin, s);", 
        "c_ret": "int", "c_args": "char* s", "c_read": "    char s[200005];\n    if(fgets(s, sizeof(s), stdin)) { s[strcspn(s, \"\\n\")] = 0; }", 
        "java_ret": "boolean", "java_args": "String s", "java_read": "        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null) s = \"\";"
    },
    {
        "py_print": "    print(str(solve(s)).lower())",
        "cpp_print": "    Solution obj;\n    cout << (obj.solve(s) ? \"true\" : \"false\") << endl;",
        "c_print": "    printf(\"%s\\n\", solve(s) ? \"true\" : \"false\");",
        "java_print": "        Main obj = new Main();\n        System.out.println(obj.solve(s));"
    }
)

# 22. Valid Anagram
make_prob(22, "Valid Anagram", "Easy", "String",
    "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    [ex("anagram\nnagaram", "true", "Both have same characters")],
    ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
    [tc("anagram\nnagaram\n", "true\n"), tc("rat\ncar\n", "false\n"), tc("a\na\n", "true\n")],
    [tc("ab\na\n", "false\n"), tc("a\nab\n", "false\n"), tc("z\nz\n", "true\n"), tc("abc\ncba\n", "true\n"), tc("aabb\nbbaa\n", "true\n")],
    ["String", "Hash Table"], ["Count character frequencies."],
    "    return sorted(s) == sorted(t)",
    "        if (s.length() != t.length()) return false;\n        vector<int> counts(26, 0);\n        for (char c : s) counts[c - 'a']++;\n        for (char c : t) counts[c - 'a']--;\n        for (int count : counts) if (count != 0) return false;\n        return true;",
    "    if (strlen(s) != strlen(t)) return 0;\n    int counts[26] = {0};\n    for (int i=0; s[i]; i++) counts[s[i] - 'a']++;\n    for (int i=0; t[i]; i++) counts[t[i] - 'a']--;\n    for (int i=0; i<26; i++) if (counts[i] != 0) return 0;\n    return 1;",
    "        if (s.length() != t.length()) return false;\n        int[] counts = new int[26];\n        for (char c : s.toCharArray()) counts[c - 'a']++;\n        for (char c : t.toCharArray()) counts[c - 'a']--;\n        for (int count : counts) if (count != 0) return false;\n        return true;",
    {
        "py_args": "s, t", "py_read": "    import sys\n    lines = sys.stdin.read().split()\n    s = lines[0] if len(lines) > 0 else ''\n    t = lines[1] if len(lines) > 1 else ''",
        "cpp_ret": "bool", "cpp_args": "string s, string t", "cpp_read": "    string s, t;\n    cin >> s >> t;",
        "c_ret": "int", "c_args": "char* s, char* t", "c_read": "    char s[50005], t[50005];\n    scanf(\"%s %s\", s, t);",
        "java_ret": "boolean", "java_args": "String s, String t", "java_read": "        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNext() ? sc.next() : \"\";\n        String t = sc.hasNext() ? sc.next() : \"\";"
    },
    {
        "py_print": "    print(str(solve(s, t)).lower())",
        "cpp_print": "    Solution obj;\n    cout << (obj.solve(s, t) ? \"true\" : \"false\") << endl;",
        "c_print": "    printf(\"%s\\n\", solve(s, t) ? \"true\" : \"false\");",
        "java_print": "        Main obj = new Main();\n        System.out.println(obj.solve(s, t));"
    }
)

with open(r'c:\Users\ram\Documents\Smart Coach\server\seed\challenges_string_stack.json', 'w') as f:
    json.dump(challenges, f, indent=2)

