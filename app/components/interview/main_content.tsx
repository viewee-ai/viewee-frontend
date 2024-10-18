'use client'

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Assume questions.json is in the public directory or fetched from an API
const questions = [
  {
    "title": "Two Sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    "input": "nums = [2,7,11,15], target = 9",
    "output": "[0,1]",
    "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
  },
  {
    "title": "Add Two Numbers",
    "description": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    "input": "l1 = [2,4,3], l2 = [5,6,4]",
    "output": "[7,0,8]",
    "explanation": "342 + 465 = 807."
  }
];

const MainContent: React.FC = () => {
  const [code, setCode] = useState("// Write your code here...");
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
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
