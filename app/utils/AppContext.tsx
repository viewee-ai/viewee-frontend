import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Question {
  title: string;
  description: string;
  input: string;
  output: string;
}

interface AppState {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  question: Question | null;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [code, setCode] = useState<string>('');
  const [question, setQuestion] = useState<Question | null>(null);

  return (
    <AppContext.Provider value={{ code, setCode, question, setQuestion }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};