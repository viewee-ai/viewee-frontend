"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
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
      initializeQuestion(foundQuestion); 
    }
  }, [title, setQuestion]);

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
          value={code}
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
    </div>
  );
};

export default MainContent;