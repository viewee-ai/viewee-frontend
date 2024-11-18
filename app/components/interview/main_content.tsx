"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { loadPyodide } from "pyodide";
import questions from "@/data/75_blind.json";
import { useSession } from "@/app/utils/session_provider";
import { useAppContext } from "@/app/utils/AppContext";


type Question = {
  title: string;
  level: string;
  description: string;
  input: string;
  output: string;
  explanation?: string;
};

type Questions = {
  [category: string]: Question[];
};

interface MainContentProps {
  title: string;
}

const MainContent: React.FC<MainContentProps> = ({ title }) => {
  const { code, setCode, setQuestion } = useAppContext();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  // const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(null);
  // const [sessionId, setSessionId] = useState<string | null>(null);
  const { setSessionId } = useSession();
  const [activeTab, setActiveTab] = useState<"testCase" | "output">("testCase");
  const [testCases, setTestCases] = useState([
    { nums: "[3,4,5,6]", target: "7", expectedOutput: [0, 1] },
    { nums: "[1,2,3]", target: "4", expectedOutput: [0, 2] },
  ]);
  
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [consoleOutput, setConsoleOutput] = useState<string>("");

  // template code
  const getTemplateCode = (questionTitle: string) => {
    return `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
`;
  };

  const addNewTestCase = () => {
    setTestCases([...testCases, { nums: "[]", target: "" }]);
    setActiveTestCase(testCases.length);
  };

  useEffect(() => {
    let foundQuestion: Question | undefined;
    for (const category in questions as Questions) {
      if (questions.hasOwnProperty(category)) {
        foundQuestion = (questions as Questions)[category].find(
          (q) => q.title === title
        );
        if (foundQuestion) break;
      }
    }
    if (foundQuestion) {
      setSelectedQuestion(foundQuestion);
      setQuestion(foundQuestion);
      if (!code) {
        setCode(getTemplateCode(foundQuestion.title));
      }
      initializeQuestion(foundQuestion);
    }
  }, [title, setQuestion, code, setCode]);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Initialize question data in the backend and store session ID
  const initializeQuestion = useCallback(
    async (question: Question) => {
      const response = await fetch(
        "http://localhost:8000/api/initialize-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(question),
        }
      );
      const result = await response.json();
      setSessionId(result.session_id);
      console.log("Session initialized with ID:", result.session_id);
    },
    [setSessionId]
  );

  /* const sendIncrementalFeedback = async (code: string) => {
      if (!sessionId) {
        console.warn("No session ID available from main content. Skipping sendIncrementalFeedback.");
        return;
      }
      console.log("Sending code to backend:", code);
  
      const response = await fetch('http://localhost:8000/api/incremental-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          code: code,
          status: "Thinking", 
          transcript: "" 
        }),
      });
      const result = await response.json();
      console.log("Code Feedback:", result.feedback);
  
    };
 */
  /* const sendCodeToBackend = async (code: string) => {
    const response = await fetch('http://localhost:8000/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        question: selectedQuestion.title,
      }),
    });
 
    const result = await response.json();
    console.log("Evaluation Result:", result);

    // TODO: Handle the evaluation result (e.g., display feedback)
  }; */

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");

    // Debounce the code change event
    /* if(changeTimeout) {
      clearTimeout(changeTimeout);
    }

    const timeout = setTimeout(() => {
      console.log("Code changed:", value);
      // sendCodeToBackend(value || ""); // Send code to the backend for evaluation
      sendIncrementalFeedback(value || ""); // Send incremental code updates to the backend
    }, 5000);
    setChangeTimeout(timeout); */
  };

  const runTestCase = async (index: number) => {
    try {
      const testInput = {
        nums: JSON.parse(testCases[index].nums),
        target: parseInt(testCases[index].target, 10),
      };
      const expectedOutput = testCases[index].expectedOutput;
    
      const response = await fetch('/api/execute_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          testInput: testInput,
          expectedOutput: expectedOutput,
        }),
      });
  
      if (!response.ok) {
        const errorResult = await response.json();
        setConsoleOutput(
          (prev) =>
            prev +
            `\nError running test case ${index + 1}: ${errorResult.error || 'Unknown error'}`
        );
        return;
      }
  
      const result = await response.json();
  
      const passFailIndicator = result.passed
        ? '✅ Passed'
        : `❌ Failed (Expected: ${JSON.stringify(result.expectedOutput)}, Got: ${result.actualOutput})`;
  
      setConsoleOutput(
        (prev) =>
          prev +
          `\nTest Case ${index + 1}: ${passFailIndicator}`
      );
  
      if (result.stderr) {
        setConsoleOutput(
          (prev) =>
            prev + `\nTest Case ${index + 1} Error:\n${result.stderr}`
        );
      }
  
      setActiveTab('output');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setConsoleOutput(
        (prev) => prev + `\nError running test case ${index + 1}: ${errorMessage}`
      );
    }
  };
  const runAllTests = async () => {
    setConsoleOutput("Running all test cases...\n");
    for (let i = 0; i < testCases.length; i++) {
      await runTestCase(i);
    }
  };

  if (!selectedQuestion) return <div>Loading...</div>;

  //////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="flex-1 p-6 bg-gray-800 text-white overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <a href="/dashboard" className="text-green-400">
          Back to Dashboard
        </a>
        <div className="text-sm">
          <span className="font-semibold text-gray-500">Level:</span>{" "}
          {selectedQuestion.level}
        </div>
      </div>

      {/* Display the selected question details */}
      <h1 className="text-2xl font-bold mb-2">{selectedQuestion.title}</h1>

      <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-primary-green">Description</h2>
      <p>{selectedQuestion.description}</p>
      </div>

      <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-primary-green">Input</h2>
      <pre>{selectedQuestion.input}</pre>
      </div>

      <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-primary-green">Output</h2>
      <pre>{selectedQuestion.output}</pre>
      </div>

      {selectedQuestion.explanation && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary-green">Explanation</h2>
          <p>{selectedQuestion.explanation}</p>
        </div>
      )}

      {/* Monaco Code Editor */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Editor
          height="50vh"
          defaultLanguage="python"
          value={code || getTemplateCode(selectedQuestion?.title || "")}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 16, 
            fontFamily: "'Fira Code', 'Menlo', monospace", 
            lineHeight: 24, 
            fontLigatures: true, 
            padding: { top: 16, bottom: 16 }, 
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
          }}
        />
      </div>

      {/* Test Cases and Console Section */}
      <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 ${activeTab === "testCase" ? "bg-gray-700 text-white" : "text-gray-400"}`}
            onClick={() => setActiveTab("testCase")}
          >
            Test Case
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "output" ? "bg-gray-700 text-white" : "text-gray-400"}`}
            onClick={() => setActiveTab("output")}
          >
            Output
          </button>
        </div>

        {activeTab === "testCase" ? (
          <div className="p-4">
            <div className="flex space-x-2 mb-4">
              {testCases.map((_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded ${
                    activeTestCase === index ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  onClick={() => setActiveTestCase(index)}
                >
                  Case {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                onClick={addNewTestCase}
              >
                +
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">nums =</label>
                <input
                  type="text"
                  value={testCases[activeTestCase].nums}
                  onChange={(e) => updateTestCase(activeTestCase, "nums", e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">target =</label>
                <input
                  type="text"
                  value={testCases[activeTestCase].target}
                  onChange={(e) => updateTestCase(activeTestCase, "target", e.target.value)}
                  className="w-full bg-gray-800 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => runTestCase(activeTestCase)}
              >
                Run
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                onClick={runAllTests}
              >
                Run All Tests
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {consoleOutput || "No output yet. Run your test cases to see results."}
            </pre>
            {consoleOutput && (
              <button
                className="mt-4 px-3 py-1 text-sm bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => setConsoleOutput("")}
              >
                Clear Console
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;