import json

def p(num, title, diff, desc, examples, constraints, pub, hid, tags, hints, start, opt):
    return {"problemNumber": num, "title": title, "slug": title.lower().replace(" ","-"),
            "difficulty": diff, "category": "Array", "description": desc, "examples": examples,
            "constraints": constraints, "publicTestCases": pub, "hiddenTestCases": hid,
            "starterCode": start, "optimalSolutions": opt, "tags": tags, "hints": hints,
            "timeLimit": 2000, "memoryLimit": 256000}

p1 = p(1, "Two Sum", "Easy", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    [{"input": "4\n2 7 11 15\n9", "output": "0 1", "explanation": "nums[0]+nums[1]==9"}],
    ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    [{"input": "4\n2 7 11 15\n9", "expectedOutput": "0 1"}],
    [{"input": "3\n3 2 4\n6", "expectedOutput": "1 2"}],
    ["Array"], ["Use hash map"], 
    {"python": "import sys\ndef two_sum(nums, t): pass\ndata=sys.stdin.read().split()\nn=int(data[0])\nnums=[int(x) for x in data[1:n+1]]\nt=int(data[-1])\nprint(*two_sum(nums,t))",
     "cpp": "int main(){}", "c": "int main(){}", "java": "class Main{}"},
    {"python": "import sys\ndef two_sum(nums, t):\n d={}\n for i,x in enumerate(nums):\n  if t-x in d: return [d[t-x], i]\n  d[x]=i\ndata=sys.stdin.read().split()\nn=int(data[0])\nnums=[int(x) for x in data[1:n+1]]\nt=int(data[-1])\nprint(*two_sum(nums,t))",
     "cpp": "#include<iostream>\n#include<vector>\n#include<unordered_map>\nusing namespace std;\nint main(){int n;if(!(cin>>n))return 0;vector<int> a(n);for(int i=0;i<n;i++)cin>>a[i];int t;cin>>t;unordered_map<int,int> m;for(int i=0;i<n;i++){if(m.count(t-a[i])){cout<<m[t-a[i]]<<\" \"<<i<<endl;return 0;}m[a[i]]=i;}return 0;}",
     "c": "#include<stdio.h>\n#include<stdlib.h>\nint main(){int n;if(scanf(\"%d\",&n)!=1)return 0;int* a=malloc(n*sizeof(int));for(int i=0;i<n;i++)scanf(\"%d\",&a[i]);int t;scanf(\"%d\",&t);for(int i=0;i<n;i++)for(int j=i+1;j<n;j++)if(a[i]+a[j]==t){printf(\"%d %d\\n\",i,j);return 0;}return 0;}",
     "java": "import java.util.*;public class Main{public static void main(String[] args){Scanner s=new Scanner(System.in);if(!s.hasNextInt())return;int n=s.nextInt();int[] a=new int[n];for(int i=0;i<n;i++)a[i]=s.nextInt();int t=s.nextInt();Map<Integer,Integer> m=new HashMap<>();for(int i=0;i<n;i++){if(m.containsKey(t-a[i])){System.out.println(m.get(t-a[i])+\" \"+i);return;}m.put(a[i],i);}}}"}
)

with open(r"c:\Users\ram\Documents\Smart Coach\server\seed\p1.json", "w") as f:
    json.dump([p1], f)
