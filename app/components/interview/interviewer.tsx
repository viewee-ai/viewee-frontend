"use client";
import React, { useState, useRef, useEffect } from 'react';
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
  const [status, setStatus] = useState<'Speaking' | 'Listening' | 'Thinking'>('Listening');
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([
    { sender: 'interviewer', message: "you expect 'i + 1' to return in that case?" },
    { sender: 'user', message: 'Yes, I think so.' },
  ]);
  const [isRecording, setIsRecording] = useState(false);  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBufferSourceNode | null>(null);
  const ttsSocketRef = useRef<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { sessionId } = useSession();

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  }, []);
  
  /**
   * startRecording: Starts recording audio using the MediaRecorder API and streams it to Deepgram's WebSocket.
   * 
   * Data Flow:
   * 1. Access the user's microphone.
   * 2. Initialize a MediaRecorder to break audio into chunks.
   * 3. Connect to Deepgram's WebSocket with the specified model and token.
   * 4. Stream audio chunks to Deepgram and handle transcription responses.
   * 5. Final transcriptions are added to the transcript state and sent to the backend.
   */
  const startRecording = async () => {
    setStatus('Speaking');
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

          // Enable this line once the program uses auto speech detection, instead of manual toggle
          // sendTranscriptToBackend(transcriptText); 

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
    setStatus('Thinking');
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
    sendTranscriptToBackend();
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

  /**
   * sendTranscriptToBackend: Sends current transcript to backend for feedback generation
   * 
   * Data Flow:
   * 1. Validates session existence
   * 2. POSTs transcript data to /api/incremental-feedback endpoint
   * 3. Updates UI with received feedback
   * 4. Triggers TTS playback for audio feedback
   * 
   * @param sessionId - Unique identifier for the interview session
   * @param transcript - Array of transcript messages to be processed
   */
  const sendTranscriptToBackend = async () => {
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
          transcript: transcript.map(item => item.message).join(" "),
          status: 'Thinking',
        }),
      });
      const result = await response.json();
      setTranscript((prev) => [...prev, { sender: 'interviewer', message: result.feedback }]);
      setStatus('Listening');
      // console.log("Transcript feedback:", result.feedback);
      
      startTTSPlayback(sessionId);

    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    }
  };

  /**
   * startTTSPlayback: Establishes a WebSocket connection to receive audio data from the backend, accumulates chunks, decodes them, and stream audio data incrementally, enabling real-time feedback.
   * 
   * Data Flow:
   * 1. Connects to the backend WebSocket endpoint (/ws/tts) with the provided sessionId, also note that binaryType is set to "arraybuffer", so the WebSocket correctly interprets received data as binary.
   * 2. AudioContext is active by calling audioContextRef.current?.resume() to handle browser autoplay policies and allow audio to play immediately.
   * 3. Each onmessage event receives a 1024-byte audio chunk from the WebSocket and pushes it to audioChunks for accumulation. When 10 or more chunks are accumulated, they’re concatenated into a single ArrayBuffer using concatenateArrayBuffers.
   * 4. Decodes the concatenated buffer into an AudioBuffer, logs it, and pushes it to playbackQueue for sequential playback.
   * 5. playNextInQueue function handles playback in sequence. It checks if playbackQueue has any buffered audio and whether audio is currently playing.
   * 
   * @param sessionId - Session identifier for retrieving correct feedback audio
   */
  const startTTSPlayback = (sessionId: string) => {
    const ttsSocket = new WebSocket(`ws://localhost:8000/ws/tts?session_id=${sessionId}`);
    ttsSocket.binaryType = "arraybuffer"; // Set WebSocket to interpret data as binary
    const audioChunks: ArrayBuffer[] = []; // Array to accumulate chunks
    const playbackQueue: AudioBuffer[] = []; // Queue for sequential playback

    // Ensure AudioContext is resumed (required by some browsers)
    audioContextRef.current?.resume().then(() => console.log("AudioContext resumed"));

    ttsSocket.onopen = () => console.log("TTS WebSocket connected");

    ttsSocket.onmessage = async (event) => {
        if (!audioContextRef.current) {
            console.error("AudioContext not available");
            return;
        }

        const chunk = event.data;
        console.log("Received audio chunk of size:", chunk.byteLength);

        // Accumulate chunks
        audioChunks.push(chunk);

        // Decode and queue audio every time enough data is collected
        if (audioChunks.length >= 10) { // Adjust based on network and audio quality
            console.log("Decoding accumulated chunks");
            const combinedBuffer = concatenateArrayBuffers(audioChunks);
            audioChunks.length = 0; // Clear accumulated chunks

            try {
                audioContextRef.current.decodeAudioData(combinedBuffer, (buffer) => {
                    playbackQueue.push(buffer); // Add decoded audio to queue
                    console.log("Added decoded buffer to playback queue");
                    playNextInQueue(); // Start playback if not already playing
                }, (error) => {
                    console.error("Error decoding audio data:", error);
                });
            } catch (error) {
                console.error("Failed to decode audio data:", error);
            }
        }
    };

    // Play audio sequentially from the queue
    const playNextInQueue = () => {
        if (playbackQueue.length === 0 || audioBufferRef.current) {
            console.log("Playback queue empty or already playing");
            return;
        }

        const buffer = playbackQueue.shift(); 
        if (!buffer) return;

        console.log("Playing audio buffer");
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.playbackRate.value = 1; // Adjust playback rate if needed

        source.start();
        audioBufferRef.current = source;

        // When playback finishes, remove current source and play next in queue
        source.onended = () => {
            audioBufferRef.current = null;
            playNextInQueue();
        };
    };

    ttsSocket.onclose = () => {
        console.log("TTS WebSocket closed");
        ttsSocketRef.current = null;
    };

    ttsSocket.onerror = (error) => console.error("TTS WebSocket error:", error);

    ttsSocketRef.current = ttsSocket;
  };

  /**
   * MP3 and similar audio formats typically require a continuous stream or full audio segment to decode properly, otherwise it would cause corruption during decoding. This helper function essentially is used in startTTSPlayback after accumulating chunks to create a larger buffer for decoding.
   * 
   * Data Flow:
   * 1. Iterates through buffers to determine the total byte length.
   * 2. Allocates a Uint8Array of the total length, ready to hold the data from all buffers.
   * 3. Iterates over each buffer in buffers and copies its contents into result at the correct offset.
   * 4. Returns result.buffer, which is the single, merged buffer.
   * 
   * @param buffers 
   * @returns 
   */
  const concatenateArrayBuffers = (buffers: ArrayBuffer[]): ArrayBuffer => {
      const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buffer of buffers) {
          result.set(new Uint8Array(buffer), offset);
          offset += buffer.byteLength;
      }
      return result.buffer;
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
        {/* <button className="bg-yellow-500 text-white py-2 px-4 rounded">Interrupt</button> */}
        <button className="bg-red-500 text-white py-2 px-4 rounded">Finish Interview</button>
      </div>
    </div>
  );
};

export default InterviewerComponent;
