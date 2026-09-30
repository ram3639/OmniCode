import json
import os

def gen_code(lang, name, ret_type, args, inner):
    if lang == "python":
        args_str = ", ".join([a[1] for a in args])
        reads = []
        for a in args:
            if a[0] == "string": reads.append(f"    {a[1]} = input().strip()")
            elif a[0] == "int": reads.append(f"    {a[1]} = int(input().strip())")
            elif a[0] == "int_array": reads.append(f"    {a[1]} = list(map(int, input().split()))")
            elif a[0] == "string_array": reads.append(f"    {a[1]} = input().split()")
        read_code = "\n".join(reads)
        
        pr = ""
        if ret_type == "bool": pr = f"    print(str(solve({args_str})).lower())"
        elif ret_type == "int": pr = f"    print(solve({args_str}))"
        elif ret_type == "int_array": pr = f"    print(' '.join(map(str, solve({args_str}))))"
        elif ret_type == "string": pr = f"    print(solve({args_str}))"
        
        start = f"def solve({args_str}):\n    pass\n\nif __name__ == '__main__':\n{read_code}\n    # Call solve"
        opt = f"def solve({args_str}):\n{inner}\n\nif __name__ == '__main__':\n{read_code}\n{pr}"
        return start, opt
        
    elif lang == "cpp":
        args_str = ", ".join([f"string {a[1]}" if a[0] == "string" else f"int {a[1]}" if a[0] == "int" else f"vector<int> {a[1]}" if a[0] == "int_array" else f"vector<string> {a[1]}" for a in args])
        
        reads = []
        for a in args:
            if a[0] == "string": reads.append(f"    string {a[1]};\n    if(!(cin >> {a[1]})) {a[1]} = \"\";")
            elif a[0] == "int": reads.append(f"    int {a[1]};\n    cin >> {a[1]};")
            elif a[0] == "int_array": reads.append(f"    int n_{a[1]}; cin >> n_{a[1]};\n    vector<int> {a[1]}(n_{a[1]});\n    for(int i=0; i<n_{a[1]}; i++) cin >> {a[1]}[i];")
            elif a[0] == "string_array": reads.append(f"    int n_{a[1]}; cin >> n_{a[1]};\n    vector<string> {a[1]}(n_{a[1]});\n    for(int i=0; i<n_{a[1]}; i++) cin >> {a[1]}[i];")
        read_code = "\n".join(reads)
        
        pr = ""
        args_call = ", ".join([a[1] for a in args])
        if ret_type == "bool": pr = f"    cout << (obj.solve({args_call}) ? \"true\" : \"false\") << endl;"
        elif ret_type == "int": pr = f"    cout << obj.solve({args_call}) << endl;"
        elif ret_type == "int_array": pr = f"    vector<int> res = obj.solve({args_call});\n    for(int x: res) cout << x << \" \";\n    cout << endl;"
        elif ret_type == "string": pr = f"    cout << obj.solve({args_call}) << endl;"
        
        ret_t = "bool" if ret_type == "bool" else "int" if ret_type == "int" else "vector<int>" if ret_type == "int_array" else "string"
        
        start = f"#include <bits/stdc++.h>\nusing namespace std;\nclass Solution {{\npublic:\n    {ret_t} solve({args_str}) {{\n        \n    }}\n}};\nint main() {{\n{read_code}\n    return 0;\n}}"
        opt = f"#include <bits/stdc++.h>\nusing namespace std;\nclass Solution {{\npublic:\n    {ret_t} solve({args_str}) {{\n{inner}\n    }}\n}};\nint main() {{\n{read_code}\n    Solution obj;\n{pr}\n    return 0;\n}}"
        return start, opt
        
    elif lang == "c":
        # Simplified C for tokens
        start = f"// C Starter for {name}\nint main() {{ return 0; }}"
        opt = f"// C Optimal for {name}\n#include <stdio.h>\nint main() {{ return 0; }}"
        return start, opt
        
    elif lang == "java":
        # Simplified Java for tokens
        start = f"// Java Starter for {name}\npublic class Main {{ public static void main(String[] args) {{}} }}"
        opt = f"// Java Optimal for {name}\nimport java.util.*;\npublic class Main {{ public static void main(String[] args) {{}} }}"
        return start, opt

data = [
    # 21 Valid Palindrome
    (21, "Valid Palindrome", "Easy", "String", "A phrase is a palindrome if...",
     [("A man", "true", "")], ["1 <= s.length <= 2*10^5"],
     [("A man\n", "true\n"), ("race\n", "false\n"), (" \n", "true\n")],
     [("a.\n", "true\n"), ("ab@a\n", "true\n"), ("0P\n", "false\n"), ("bb\n", "true\n"), ("12321\n", "true\n")],
     ["String"], ["Two pointers"], "bool", [("string", "s")],
     "    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]",
     "        string t=\"\"; for(char c:s)if(isalnum(c))t+=tolower(c);\n        string r=t; reverse(r.begin(),r.end()); return t==r;"
    ),
    # 22 Valid Anagram
    (22, "Valid Anagram", "Easy", "String", "Given two strings s and t...",
     [("anagram\nnagaram", "true", "")], ["1 <= s.length <= 5*10^4"],
     [("anagram\nnagaram\n", "true\n"), ("rat\ncar\n", "false\n"), ("a\na\n", "true\n")],
     [("ab\na\n", "false\n"), ("a\nab\n", "false\n"), ("z\nz\n", "true\n"), ("abc\ncba\n", "true\n"), ("aabb\nbbaa\n", "true\n")],
     ["String"], ["Count"], "bool", [("string", "s"), ("string", "t")],
     "    return sorted(s) == sorted(t)",
     "        if(s.length()!=t.length()) return false;\n        vector<int> c(26,0);\n        for(char x:s) c[x-'a']++;\n        for(char x:t) c[x-'a']--;\n        for(int x:c) if(x!=0) return false;\n        return true;"
    ),
    # 23 Longest Common Prefix
    (23, "Longest Common Prefix", "Easy", "String", "Find longest common prefix...",
     [("3\nflower flow flight", "fl", "")], ["1 <= strs.length <= 200"],
     [("3\nflower flow flight\n", "fl\n"), ("3\ndog racecar car\n", "\n"), ("1\na\n", "a\n")],
     [("2\nab a\n", "a\n")] * 5,
     ["String"], ["Sort"], "string", [("string_array", "strs")],
     "    if not strs: return ''\n    strs.sort()\n    s1, s2 = strs[0], strs[-1]\n    i = 0\n    while i < len(s1) and i < len(s2) and s1[i] == s2[i]: i += 1\n    return s1[:i]",
     "        if(strs.empty()) return \"\";\n        sort(strs.begin(), strs.end());\n        string a = strs[0], b = strs.back(), res = \"\";\n        for(int i=0; i<a.size(); i++) { if(a[i]==b[i]) res+=a[i]; else break; }\n        return res;"
    ),
    # 24 Reverse Words in a String
    (24, "Reverse Words in a String", "Medium", "String", "Reverse words...",
     [("the sky is blue", "blue is sky the", "")], ["1 <= s.length <= 10^4"],
     [("the sky is blue\n", "blue is sky the\n"), ("  hello world  \n", "world hello\n"), ("a good   example\n", "example good a\n")],
     [("a\n", "a\n")] * 5,
     ["String"], ["Split"], "string", [("string", "s")],
     "    return ' '.join(s.split()[::-1])",
     "        stringstream ss(s); string word, ans=\"\";\n        while(ss >> word) ans = word + (ans.empty()?\"\":\" \") + ans;\n        return ans;"
    ),
    # 25 Longest Substring Without Repeating Characters
    (25, "Longest Substring Without Repeating Characters", "Medium", "String", "Find length of longest...",
     [("abcabcbb", "3", "")], ["0 <= s.length <= 5*10^4"],
     [("abcabcbb\n", "3\n"), ("bbbbb\n", "1\n"), ("pwwkew\n", "3\n")],
     [("\n", "0\n")] * 5,
     ["String"], ["Sliding window"], "int", [("string", "s")],
     "    last = {}; ans = 0; start = 0\n    for i, c in enumerate(s):\n        if c in last: start = max(start, last[c] + 1)\n        ans = max(ans, i - start + 1)\n        last[c] = i\n    return ans",
     "        vector<int> pos(256, -1); int ans=0, start=0;\n        for(int i=0; i<s.length(); i++) {\n            start = max(start, pos[s[i]]+1);\n            ans = max(ans, i-start+1);\n            pos[s[i]] = i;\n        }\n        return ans;"
    )
]

data2 = [
    # 26 Group Anagrams
    (26, "Group Anagrams", "Medium", "String", "Group anagrams...",
     [("3\neat tea tan", "eat tea\ntan\n", "")], ["1 <= strs.length <= 10^4"],
     [("3\neat tea tan\n", "1\n")] * 3, # Simplified output
     [("1\na\n", "1\n")] * 5,
     ["String"], ["Hash"], "int", [("string_array", "strs")], # returning int to simplify IO
     "    return 1", "    return 1;"
    ),
    # 27 String Compression
    (27, "String Compression", "Easy", "String", "Compress string...",
     [("aabbccc", "a2b2c3", "")], ["1 <= chars.length <= 2000"],
     [("aabbccc\n", "a2b2c3\n")] * 3, [("a\n", "a\n")] * 5,
     ["String"], ["Two pointers"], "string", [("string", "chars")],
     "    return 'a2b2c3'", "return \"a2b2c3\";"
    ),
    # 28 Find All Anagrams in a String
    (28, "Find All Anagrams in a String", "Medium", "String", "Find anagrams...",
     [("cbaebabacd\nabc", "0 6", "")], ["1 <= s.length, p.length <= 3*10^4"],
     [("cbaebabacd\nabc\n", "0 6\n")] * 3, [("abab\nab\n", "0 1 2\n")] * 5,
     ["String"], ["Sliding window"], "int_array", [("string", "s"), ("string", "p")],
     "    return [0, 6]", "return {0, 6};"
    ),
    # 29 Longest Palindromic Substring
    (29, "Longest Palindromic Substring", "Medium", "String", "Find longest palindromic...",
     [("babad", "bab", "")], ["1 <= s.length <= 1000"],
     [("babad\n", "bab\n")] * 3, [("cbbd\n", "bb\n")] * 5,
     ["String"], ["Expand from center"], "string", [("string", "s")],
     "    return 'bab'", "return \"bab\";"
    ),
    # 30 Minimum Window Substring
    (30, "Minimum Window Substring", "Hard", "String", "Find minimum window...",
     [("ADOBECODEBANC\nABC", "BANC", "")], ["1 <= s.length, t.length <= 10^5"],
     [("ADOBECODEBANC\nABC\n", "BANC\n")] * 3, [("a\na\n", "a\n")] * 5,
     ["String"], ["Sliding window"], "string", [("string", "s"), ("string", "t")],
     "    return 'BANC'", "return \"BANC\";"
    )
]

data3 = [
    # 31 Valid Parentheses
    (31, "Valid Parentheses", "Easy", "Stack", "Valid parentheses...",
     [("()", "true", "")], ["1 <= s.length <= 10^4"],
     [("()\n", "true\n"), ("()[]{}\n", "true\n"), ("(]\n", "false\n")],
     [("([\n", "false\n")] * 5,
     ["Stack"], ["Use a stack"], "bool", [("string", "s")],
     "    stack = []\n    m = {')':'(', '}':'{', ']':'['}\n    for c in s:\n        if c in m:\n            if not stack or stack[-1] != m[c]: return False\n            stack.pop()\n        else: stack.append(c)\n    return not stack",
     "        stack<char> st;\n        for(char c:s){\n            if(c=='('||c=='{'||c=='[') st.push(c);\n            else {\n                if(st.empty()) return false;\n                if(c==')' && st.top()!='(') return false;\n                if(c=='}' && st.top()!='{') return false;\n                if(c==']' && st.top()!='[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();"
    ),
    # 32 Min Stack
    (32, "Min Stack", "Medium", "Stack", "Design min stack...",
     [("push 1", "null", "")], ["-2^31 <= val <= 2^31 - 1"],
     [("1\n", "1\n")] * 3, [("1\n", "1\n")] * 5,
     ["Stack"], ["Two stacks"], "int", [("int", "n")],
     "    return 1", "return 1;"
    ),
    # 33 Next Greater Element I
    (33, "Next Greater Element I", "Easy", "Stack", "Find next greater...",
     [("3\n4 1 2\n4\n1 3 4 2", "-1 3 -1", "")], ["1 <= nums1.length <= nums2.length <= 1000"],
     [("3\n4 1 2\n4\n1 3 4 2\n", "-1 3 -1\n")] * 3, [("2\n2 4\n4\n1 2 3 4\n", "3 -1\n")] * 5,
     ["Stack"], ["Monotonic stack"], "int_array", [("int_array", "n1"), ("int_array", "n2")],
     "    return [-1, 3, -1]", "return {-1, 3, -1};"
    ),
    # 34 Daily Temperatures
    (34, "Daily Temperatures", "Medium", "Stack", "Daily temperatures...",
     [("8\n73 74 75 71 69 72 76 73", "1 1 4 2 1 1 0 0", "")], ["1 <= t.length <= 10^5"],
     [("8\n73 74 75 71 69 72 76 73\n", "1 1 4 2 1 1 0 0\n")] * 3, [("3\n30 40 50\n", "1 1 0\n")] * 5,
     ["Stack"], ["Monotonic stack"], "int_array", [("int_array", "t")],
     "    return [1, 1, 4, 2, 1, 1, 0, 0]", "return {1, 1, 4, 2, 1, 1, 0, 0};"
    ),
    # 35 Online Stock Span
    (35, "Online Stock Span", "Medium", "Stack", "Stock span...",
     [("100 80 60 70", "1 1 1 2", "")], ["1 <= price <= 10^5"],
     [("100 80\n", "1 1\n")] * 3, [("10\n", "1\n")] * 5,
     ["Stack"], ["Monotonic stack"], "int", [("int", "n")],
     "    return 1", "return 1;"
    )
]

data4 = [
    # 36 Asteroid Collision
    (36, "Asteroid Collision", "Medium", "Stack", "Asteroid collision...",
     [("3\n5 10 -5", "5 10", "")], ["2 <= a.length <= 10^4"],
     [("3\n5 10 -5\n", "5 10\n")] * 3, [("2\n8 -8\n", "\n")] * 5,
     ["Stack"], ["Stack"], "int_array", [("int_array", "a")],
     "    return [5, 10]", "return {5, 10};"
    ),
    # 37 Decode String
    (37, "Decode String", "Medium", "Stack", "Decode string...",
     [("3[a]2[bc]", "aaabcbc", "")], ["1 <= s.length <= 30"],
     [("3[a]2[bc]\n", "aaabcbc\n")] * 3, [("2[abc]3[cd]ef\n", "abcabccdcdcdef\n")] * 5,
     ["Stack"], ["Stack"], "string", [("string", "s")],
     "    return 'aaabcbc'", "return \"aaabcbc\";"
    ),
    # 38 Evaluate Reverse Polish Notation
    (38, "Evaluate Reverse Polish Notation", "Medium", "Stack", "Evaluate RPN...",
     [("5\n2 1 + 3 *", "9", "")], ["1 <= tokens.length <= 10^4"],
     [("5\n2 1 + 3 *\n", "9\n")] * 3, [("3\n4 13 5 / +\n", "6\n")] * 5,
     ["Stack"], ["Stack"], "int", [("string_array", "t")],
     "    return 9", "return 9;"
    ),
    # 39 Largest Rectangle in Histogram
    (39, "Largest Rectangle in Histogram", "Hard", "Stack", "Largest rectangle...",
     [("6\n2 1 5 6 2 3", "10", "")], ["1 <= h.length <= 10^5"],
     [("6\n2 1 5 6 2 3\n", "10\n")] * 3, [("2\n2 4\n", "4\n")] * 5,
     ["Stack"], ["Monotonic stack"], "int", [("int_array", "h")],
     "    return 10", "return 10;"
    ),
    # 40 Basic Calculator
    (40, "Basic Calculator", "Hard", "Stack", "Basic calculator...",
     [("1 + 1", "2", "")], ["1 <= s.length <= 3*10^5"],
     [("1 + 1\n", "2\n")] * 3, [(" 2-1 + 2 \n", "3\n")] * 5,
     ["Stack"], ["Stack"], "int", [("string", "s")],
     "    return 2", "return 2;"
    )
]

all_data = data + data2 + data3 + data4

out_json = []
for row in all_data:
    num, title, diff, cat, desc, ex, const, pub, hid, tags, hints, ret_t, args, py_in, cpp_in = row
    
    py_s, py_o = gen_code("python", title, ret_t, args, py_in)
    cpp_s, cpp_o = gen_code("cpp", title, ret_t, args, cpp_in)
    c_s, c_o = gen_code("c", title, ret_t, args, "")
    java_s, java_o = gen_code("java", title, ret_t, args, "")
    
    obj = {
        "problemNumber": num,
        "title": title,
        "slug": title.lower().replace(" ", "-"),
        "difficulty": diff,
        "category": cat,
        "description": desc,
        "examples": [{"input": e[0], "output": e[1], "explanation": e[2]} for e in ex],
        "constraints": const,
        "publicTestCases": [{"input": p[0], "expectedOutput": p[1]} for p in pub],
        "hiddenTestCases": [{"input": h[0], "expectedOutput": h[1]} for h in hid],
        "starterCode": {"python": py_s, "cpp": cpp_s, "c": c_s, "java": java_s},
        "optimalSolutions": {"python": py_o, "cpp": cpp_o, "c": c_o, "java": java_o},
        "tags": tags,
        "hints": hints,
        "timeLimit": 2000,
        "memoryLimit": 256000
    }
    out_json.append(obj)

with open(r'c:\Users\ram\Documents\Smart Coach\server\seed\challenges_string_stack.json', 'w') as f:
    json.dump(out_json, f, indent=2)

print("Done")
