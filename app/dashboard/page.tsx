'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import questions from '@/data/75_blind.json';
import { UserButton } from '@clerk/nextjs'; 

interface Question {
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input: string;
  output: string;
  explanation: string;
}

interface CategoryTableProps {
  categoryName: string;
  questions: Question[];
  searchQuery: string;
  completedQuestions: Set<string>;
  onToggleComplete: (title: string) => void;
}

interface QuestionRowProps {
  question: Question;
  isCompleted: boolean;
  onToggleComplete: (title: string) => void;
}

type QuestionsData = {
  [key: string]: Question[];
};

const isValidLevel = (level: string): level is 'Easy' | 'Medium' | 'Hard' => {
  return ['Easy', 'Medium', 'Hard'].includes(level);
};

export default function DashboardPage() {  
  const [data, setData] = useState<QuestionsData>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed questions from localStorage on initial render
    const savedCompleted = localStorage.getItem('completedQuestions');
    if (savedCompleted) {
      setCompletedQuestions(new Set(JSON.parse(savedCompleted)));
    }

    const filteredQuestions = Object.keys(questions).reduce((acc, category) => {
      acc[category] = (questions as QuestionsData)[category].filter((question: Question) =>
        isValidLevel(question.level)
      ) as Question[];
      return acc;
    }, {} as QuestionsData);

    setData(filteredQuestions);
  }, []);

  const handleToggleComplete = (title: string) => {
    setCompletedQuestions(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(title)) {
        newCompleted.delete(title);
      } else {
        newCompleted.add(title);
      }
      // Save to localStorage whenever the set changes
      localStorage.setItem('completedQuestions', JSON.stringify([...newCompleted]));
      return newCompleted;
    });
  };

  const totalCompleted = completedQuestions.size;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 hover:bg-gray-800 text-white"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Button>
        </Link>

        <UserButton /> 
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{totalCompleted} / 75</h1>
        <p className="bg-gray-800 text-gray-300 p-2 rounded">
          The Blind 75 is a popular list of algorithm practice problems.
        </p>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded bg-gray-700 text-gray-300 mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          {Object.keys(data)
            .filter(categoryName => data[categoryName].some(question => 
              question.title.toLowerCase().includes(searchQuery.toLowerCase())
            ))
            .map((categoryName) => (
              <CategoryTable 
                key={categoryName} 
                categoryName={categoryName} 
                questions={data[categoryName]} 
                searchQuery={searchQuery}
                completedQuestions={completedQuestions}
                onToggleComplete={handleToggleComplete}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function CategoryTable({ categoryName, questions, searchQuery, completedQuestions, onToggleComplete }: CategoryTableProps) {
  const filteredQuestions = questions.filter((question) => 
    question.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-6 bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">{categoryName}</h2>
      <div className="flex flex-col">
        <div className="flex justify-between mb-2">
          <div className="w-1/4 text-center">Status</div>
          <div className="w-1/4 text-center">Problem</div>
          <div className="w-1/4 text-center">Difficulty</div>
          <div className="w-1/4 text-center">Solution</div>
        </div>
        {filteredQuestions.map((question, idx) => (
          <QuestionRow 
            key={idx} 
            question={question} 
            isCompleted={completedQuestions.has(question.title)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionRow({ question, isCompleted, onToggleComplete }: QuestionRowProps) {
  const router = useRouter();
  const difficulty = question.level;
  const difficultyColor =
    difficulty === 'Easy'
      ? 'text-green-400'
      : difficulty === 'Medium'
      ? 'text-yellow-400'
      : 'text-red-400';

  const handleClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.checkbox-container')) {
      router.push(`/dashboard/interview?title=${encodeURIComponent(question.title)}`);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(question.title);
  };

  return (
    <div className="flex justify-between border-b border-gray-700 py-2 cursor-pointer" onClick={handleClick}>
      <div className="w-1/4 text-center checkbox-container" onClick={handleCheckboxClick}>
        <input
          type="checkbox"
          checked={isCompleted}
          className="form-checkbox h-5 w-5 text-green-500 cursor-pointer"
          onChange={() => {}} // Required for controlled component
        />
      </div>
      <div className="w-1/4 text-center">{question.title}</div>
      <div className={`w-1/4 text-center ${difficultyColor}`}>{difficulty}</div>
      <div className="w-1/4 text-center flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
    </div>
  );
}