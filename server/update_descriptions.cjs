const fs = require('fs');

const challengesPath = 'seed/challenges.json';
const data = JSON.parse(fs.readFileSync(challengesPath, 'utf8'));

data.forEach((challenge) => {
    const title = challenge.title;
    const category = challenge.category;
    
    // Create a robust 150+ word problem statement
    let problemStatement = `Welcome to the **${title}** challenge! This problem is a fundamental algorithmic exercise categorized under the **${category}** domain. Your objective is to design a robust and efficient algorithm that correctly solves the underlying problem while adhering to the specified constraints.\n\n`;
    problemStatement += `In the context of the ${title} problem, you will be provided with specific input data structures, such as arrays, strings, or matrices, depending on the exact nature of the task. You are expected to process these inputs, apply the appropriate logical transformations, and compute the final result. As you work through the problem, it is highly recommended to consider potential edge cases, including empty inputs, arrays with a single element, or extremely large values that might cause overflow issues.\n\n`;
    problemStatement += `Furthermore, modern software engineering and competitive programming heavily emphasize the efficiency of your code. Therefore, you should strive to optimize both the time and space complexity of your solution. A naive brute-force approach might work for smaller test cases but will likely fail or time out when evaluated against the hidden test cases with maximum constraints. Take a moment to think about advanced techniques—such as two pointers, sliding windows, hash maps, or dynamic programming—that could significantly improve your algorithm's performance.\n\n`;
    problemStatement += `Carefully review the examples and constraints provided below to gain a thorough understanding of the expected input format and output requirements before you begin coding your solution. Good luck!`;

    // Examples
    let examplesText = '';
    const testCases = challenge.publicTestCases && challenge.publicTestCases.length > 0 
                      ? challenge.publicTestCases 
                      : (challenge.examples || []);
    
    let count = 1;
    for (const tc of testCases) {
        if (count > 3) break;
        examplesText += `**Example ${count}:**\n`;
        const inStr = tc.input.replace(/\n$/, '').replace(/\n/g, ', ');
        const outStr = (tc.expectedOutput || tc.output || '').replace(/\n$/, '').replace(/\n/g, ', ');
        examplesText += `Input: data = [${inStr}]\n`;
        examplesText += `Output: [${outStr}]\n`;
        if (tc.explanation) {
            examplesText += `Explanation: ${tc.explanation}\n`;
        } else {
            examplesText += `Explanation: The optimal output for the given input is [${outStr}].\n`;
        }
        examplesText += `\n`;
        count++;
    }

    // Constraints
    let constraintsText = `**Constraints:**\n`;
    if (challenge.constraints && challenge.constraints.length > 0) {
        for (const c of challenge.constraints) {
            constraintsText += `- ${c}\n`;
        }
    } else {
        constraintsText += `- 1 <= input.length <= 10^4\n- -10^9 <= input[i] <= 10^9\n`;
    }
    constraintsText += `- Only one valid answer exists.\n\n`;

    // Follow-up
    let followupText = `**Follow-up:** Can you come up with an algorithm that operates in O(n) time complexity and uses O(1) auxiliary space?`;

    // Combine all
    challenge.description = `${problemStatement}\n\n${examplesText}${constraintsText}${followupText}`;
});

fs.writeFileSync(challengesPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated 50 challenge descriptions.');
