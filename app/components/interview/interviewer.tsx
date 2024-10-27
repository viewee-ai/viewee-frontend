"use client";
import React, { useState, useRef } from 'react';
import { useSession  } from '@/app/utils/session_provider';


/**
 * Defines the structure of a transcript message, where each message has a sender ('user' or 'interviewer') 
 * and the message content as a string.
 */
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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { sessionId } = useSession();
  
  /**
   * startRecording: Starts recording audio using the MediaRecorder API and streams it to Deepgram's WebSocket.
   * 
   * Steps:
   * 1. Access the user's microphone.
   * 2. Initialize a MediaRecorder to break audio into chunks.
   * 3. Connect to Deepgram's WebSocket with the specified model and token.
   * 4. Stream audio chunks to Deepgram and handle transcription responses.
   * 5. Final transcriptions are added to the transcript state and sent to the backend.
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Request access to user's microphone
      const mediaRecorder = new MediaRecorder(stream); // The MediaRecorder is used later to chunk and stream audio data
      const response = await fetch('/api/stt_token');
      const { token } = await response.json();
      
      
      /**
       * Refference: 
       * https://developers.deepgram.com/docs/stt-streaming-feature-overview
       * https://developers.deepgram.com/reference/listen-live
       */
      const socket = new WebSocket( 
        `wss://api.deepgram.com/v1/listen?model=nova-2-conversationalai&smart_format=true&no_delay=true&interim_results=true&endpointing=250`,["token", token]
      );

      // Stream audio to Deepgram when the connection opens
      socket.onopen = () => {
        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && socket.readyState === 1) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(250); 
      };

      // Process messages received from Deepgram, updating transcript with final transcriptions
      socket.onmessage = (event) => {
        const received = JSON.parse(event.data);
        if (received.is_final) {
          const transcriptText = received.channel.alternatives[0].transcript;
          setTranscript((prev) => [...prev, { sender: 'user', message: transcriptText }]);

          sendTranscriptToBackend(transcriptText); 

        }
      };

      socket.onclose = () => console.log("WebSocket closed");
      socket.onerror = (error) => console.error("WebSocket error:", error);

      mediaRecorderRef.current = mediaRecorder;
      socketRef.current = socket;
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  /**
   * stopRecording: Stops audio recording and closes WebSocket connections.
   * - Stops MediaRecorder, closes the audio tracks, and resets recording state.
   * - Closes WebSocket connection with Deepgram gracefully.
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsRecording(false);
  };

  /**
   * handleMicClick: Toggles the recording state between starting and stopping.
   */
  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  /**
   * sendToBackend: Sends the final transcript text to a FastAPI backend.
   * @param message - The transcript string received from Deepgram to be sent to the backend.
   * 
   * This function posts the message as JSON to '/api/send-transcription'.
   * Any error during the fetch request will be logged to the console.
   */
  /* const sendToBackend = async (message: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error sending message: ${response.statusText} - ${errorText}`);
      }
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  }; */

  const sendTranscriptToBackend = async (transcript: string) => {
    if (!sessionId) {
      console.warn("No session ID available from Interviewer Component. Skipping sendTranscriptToBackend.");
      return;
    }
    console.log("Sending transcript to backend:", transcript);
    try {
      const response = await fetch('http://localhost:8000/api/incremental-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          transcript,
        }),
      });
      const result = await response.json();
      console.log("Transcript feedback:", result.feedback);
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    }
  };

  return (
    <div className="w-80 p-6 bg-gray-900 text-white flex flex-col h-full">
      {/* Top Section: Interviewer Profile */}
      <div className="flex items-center mb-6">
        <img className="rounded-full h-16 w-16" src="https://via.placeholder.com/150" alt="Interviewer Profile" />
        <div className="ml-4">
          <p className="text-xl">Triet Ha</p>
          <span className="text-sm text-gray-400">{status}</span>
        </div>
      </div>

      {/* Middle Section: Live Transcript Display */}
      <div className="flex-grow bg-gray-800 p-4 rounded-lg overflow-y-auto mb-4">
        {transcript.map((item, index) => (
          <div key={index} className={`mb-2 ${item.sender === 'user' ? 'text-blue-300' : 'text-gray-400'}`}>
            <span className="font-bold">{item.sender === 'user' ? 'You' : 'Triet'}: </span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>

      {/* Bottom Section: Control Buttons */}
      <div className="flex justify-between">
        <button className={`bg-${isRecording ? 'red' : 'blue'}-500 text-white py-2 px-4 rounded`} onClick={handleMicClick}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded">Interrupt</button>
        <button className="bg-red-500 text-white py-2 px-4 rounded">Finish Interview</button>
      </div>
    </div>
  );
};

export default InterviewerComponent;
