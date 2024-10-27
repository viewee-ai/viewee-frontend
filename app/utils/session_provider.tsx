/**
 * The session_id is created when a question is selected in MainContent 
 * and is shared with InterviewerComponent through the SessionContext.
 * Both components send updates to the backend using the shared session_id, 
 * allowing the backend to aggregate code and transcript data for combined feedback.
 * 
 * 1. SessionProvider creates a shared context accessible by both MainContent and InterviewerComponent
 * 2. When user selects a question in MainContent:
 *    - Calls initializeQuestion() to create new session with backend
 *    - Backend returns session_id stored in SessionContext
 * 3. Both components access same session_id via useSession() hook to send updates:
 *    - MainContent: sends code changes via sendIncrementalFeedback
 *    - InterviewerComponent: sends speech transcripts via sendTranscriptToBackend
 */
'use client'
import React, { createContext, useContext, useState } from 'react';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  const updateSessionId = (newSessionId: string) => {
    console.log("Updating session ID:", newSessionId);
    setSessionId(newSessionId);
  };

  return (
    <SessionContext.Provider value={{ sessionId, setSessionId : updateSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
