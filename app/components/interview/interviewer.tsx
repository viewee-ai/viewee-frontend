"use client";
import React, { useState } from 'react';

interface TranscriptMessage {
  sender: 'user' | 'interviewer';
  message: string;
}

const InterviewerComponent: React.FC = () => {
  const [status, setStatus] = useState<'Speaking' | 'Listening' | 'Thinking'>('Speaking');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([
    { sender: 'interviewer', message: "you expect 'i + 1' to return in that case?" },
    { sender: 'user', message: 'Yes, I think so.' },
  ]);

  return (
    <div className="w-80 p-6 bg-gray-900 text-white flex flex-col h-full">
      {/* Top Section: Interviewer Profile */}
      <div className="flex items-center mb-6">
        <img
          className="rounded-full h-16 w-16"
          src="https://via.placeholder.com/150"
          alt="Interviewer Profile"
        />
        <div className="ml-4">
          <p className="text-xl">Triet Ha</p>
          <span className="text-sm text-gray-400">{status}</span>
        </div>
      </div>

      {/* Middle Section: Live Transcript */}
      <div className="flex-grow bg-gray-800 p-4 rounded-lg overflow-y-auto mb-4">
        {transcript.map((item, index) => (
          <div key={index} className={`mb-2 ${item.sender === 'user' ? 'text-blue-300' : 'text-gray-400'}`}>
            <span className="font-bold">{item.sender === 'user' ? 'You' : 'Aidan'}: </span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex justify-between">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Send
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
          Interrupt
        </button>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Finish Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewerComponent;
