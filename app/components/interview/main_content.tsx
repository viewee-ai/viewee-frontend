'use client'

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import questions from '@/data/75_blind.json';

const MainContent: React.FC = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [changeTimeout, setChangeTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");

    // Debounce the code change event
    if(changeTimeout) {
      clearTimeout(changeTimeout);
    }

    const timeout = setTimeout(() => {
      console.log("Code changed:", value);
      // Call the API to run the code
    }, 5000);
    setChangeTimeout(timeout);
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTitle = event.target.value;
    const question = questions.find(q => q.title === selectedTitle);
    if (question) {
      setSelectedQuestion(question);
      // Optionally, reset the code editor or provide a template based on the question
      setCode("// Start your solution here for: " + question.title);
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-800 text-white">
      <div className="flex justify-between items-center mb-4">
        <a href="#" className="text-teal-400">Back to Dashboard</a>
        <span className="text-green-400">Level 2</span>
      </div>

      {/* Dropdown to select a question */}
      <select
        className="bg-gray-700 text-white p-2 mb-4"
        value={selectedQuestion.title}
        onChange={handleQuestionChange}
      >
        {questions.map((question) => (
          <option key={question.title} value={question.title}>
            {question.title}
          </option>
        ))}
      </select>

      {/* Display the selected question details */}
      <h1 className="text-2xl font-bold mb-2">{selectedQuestion.title}</h1>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Description</h2>
        <p>{selectedQuestion.description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Input</h2>
        <pre>{selectedQuestion.input}</pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Output</h2>
        <pre>{selectedQuestion.output}</pre>
      </div>

      {selectedQuestion.explanation && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Explanation</h2>
          <p>{selectedQuestion.explanation}</p>
        </div>
      )}

      {/* Monaco Code Editor */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <Editor
          height="300px"
          defaultLanguage="python"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
};

export default MainContent;
