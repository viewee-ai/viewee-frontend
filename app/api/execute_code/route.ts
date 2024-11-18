import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { code, testInput, expectedOutput } = await request.json();

    // Add 'from typing import List' if not already present
    const typingImport = 'from typing import List';
    let codeWithImport = code;
    if (!code.includes(typingImport)) {
      codeWithImport = `${typingImport}\n\n${code}`;
    }

    // Prepare the code to include the test input
    const fullCode = `
${codeWithImport}

if __name__ == "__main__":
    solution = Solution()
    result = solution.twoSum(${JSON.stringify(testInput.nums)}, ${testInput.target})
    print(result)
`;

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: 'python',
      version: '3.10.0',
      files: [
        {
          name: 'main.py',
          content: fullCode,
        },
      ],
    });

    const { run } = response.data;

    // Compare actual output with expected output
    const actualOutput = JSON.stringify(JSON.parse(run.stdout.trim())); 
    const passed = actualOutput === JSON.stringify(expectedOutput);

    return NextResponse.json({
      passed,
      actualOutput,
      expectedOutput,
      stderr: run.stderr,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred during code execution' },
      { status: 500 }
    );
  }
}
