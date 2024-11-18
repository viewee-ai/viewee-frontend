import axios from 'axios';

export async function executeCode(code: string, testInput: any) {
  // Prepare the code with test input
  const fullCode = `
  ${code}

  if __name__ == "__main__":
      solution = Solution()
      result = solution.twoSum(${JSON.stringify(testInput.nums)}, ${testInput.target})
      print(result)
  `;

  // Call the code execution API
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

  if (run.stderr) {
    throw new Error(run.stderr);
  }

  return run.output;
}