"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface Solution {
  approach: string;
  code: string;
  time_complexity: string;
  space_complexity: string;
}

interface SolutionsData {
  problem_name: string;
  solutions: Solution[];
  length: number;
}

interface Solution {
  approach: string;
  code: string;
  time_complexity: string;
  space_complexity: string;
}

interface SolutionsData {
  problem_name: string;
  solutions: Solution[];
  length: number;
}

const FeedbackPage: React.FC = () => {
//const [averageScore, setAverageScore] = useState<number | null>(null);
const [codeScore, setCodeScore] = useState<number | null>(null);
const [strengths, setStrengths] = useState<string>("");
const [improvements, setImprovements] = useState<string>("");
const [loading, setLoading] = useState<boolean>(true);
const [solutionsData, setSolutionsData] = useState<SolutionsData | null>(
  null
);
const [error, setError] = useState<string | null>(null);
const [activeTab, setActiveTab] = useState<string>("0");

useEffect(() => {
  document.body.classList.add("bg-gray-800");
  return () => {
    document.body.classList.remove("bg-gray-800");
  };
}, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        //const averageScoreParam = Number(params.get("averageScore"));
        const codeScoreParam = Number(params.get("codeScore"));
        const strengthsParam = params.get("strengths") || "";
        const improvementsParam = params.get("improvements") || "";
        const questionParam = params.get("question") || "";

        //setAverageScore(averageScoreParam);
        setCodeScore(codeScoreParam);
        setStrengths(strengthsParam);
        setImprovements(improvementsParam);

        if (questionParam) {
          const response = await fetch(
            "http://localhost:8000/api/get-solutions",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ problem_name: questionParam }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch solutions");
          }

          const result = await response.json();
          setSolutionsData(result[0]); // Access first item since backend returns an array
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load solutions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSolutionContent = (solution: Solution) => (
    <div className="w-full">
      <h4 className="text-xl font-semibold mb-2">{solution.approach}</h4>
      <pre
        className="bg-gray-800 p-4 rounded-md overflow-x-auto mb-4"
        style={{
          maxHeight: "400px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <code>{solution.code}</code>
      </pre>
      <div className="flex flex-col gap-2 text-sm">
        <p className="text-green-400 text-xl font-light rounded-[15px]">
          Time Complexity: {solution.time_complexity}
        </p>
        <p className="text-blue-400 text-xl font-light">
          Space Complexity: {solution.space_complexity}
        </p>
      </div>
    </div>
  );

  const renderSolutionTabs = () => {
    if (error) {
      return (
        <Card className="p-4 bg-gray-900 text-white rounded-lg">
          <p className="text-red-500">{error}</p>
        </Card>
      );
    }

    if (!solutionsData?.solutions) {
      return (
        <Card className="p-4 bg-gray-900 text-white rounded-lg">
          <p>No solutions available.</p>
        </Card>
      );
    }

    return (
      <Tabs
        defaultValue="0"
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full bg-gray-900 mb-4">
          {solutionsData.solutions.map((solution, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="flex-1 data-[state=active]:bg-gray-800 data-[state=active]:border-2 data-[state=active]:border-green-500"
            >
              {solution.approach}
            </TabsTrigger>
          ))}
        </TabsList>
        {solutionsData.solutions.map((solution, index) => (
          <TabsContent key={index} value={index.toString()} className="mt-0">
            <Card className="p-4 bg-gray-900 text-white rounded-lg">
              {renderSolutionContent(solution)}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-20 bg-gray-800 min-h-screen pb-10">
      {/* Header with navigation */}
      <div className="flex justify-between items-center pt-6 px-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="text-slate-300 hover:text-green-500 transition-colors"
        >
          <Home size={24} />
        </button>
        <div className="text-5xl text-center font-semibold text-slate-300 pt-8 absolute left-1/2 transform -translate-x-1/2">
          Interview <span className="text-green-500">Insight</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Score Card */}
      <div className="flex justify-center items-center pb-6 pt-16">
        <div className="border rounded-[20px] min-w-[300px] p-5 text-center bg-gray-900">
          <div className="text-3xl font-semibold text-slate-300">
            Your Score:
          </div>
          <div className="text-3xl font-bold text-green-500">
            {codeScore !== null ? `${codeScore}%` : "N/A"}
          </div>
        </div>
      </div>

      <div className="border-b border-2 border-slate-400"></div>

      {/* Feedback Sections */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
        {/* Strengths Section */}
        <div className="flex-1">
          <h3 className="text-3xl font-semibold pb-4 text-left text-slate-300">
            🚀 Where You Excel
          </h3>
          <div className="mt-4 grid gap-4">
            {strengths ? (
              strengths.split("\n").map((strength, index) => (
                <Card
                  key={index}
                  className="p-4 bg-gray-900 text-slate-300 rounded-lg"
                >
                  <h4 className="text-xl font-semibold pb-6">
                    You Identified the Solution Well
                  </h4>
                  <p>{strength}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 bg-gray-900 text-slate-300 rounded-lg">
                <p>No strengths available.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Improvements Section */}
        <div className="flex-1">
          <h3 className="text-3xl font-semibold pb-4 text-left text-slate-300">
            ❗ What Needs Work
          </h3>
          <div className="mt-4 grid gap-4">
            {improvements ? (
              improvements.split("\n").map((improvement, index) => (
                <Card
                  key={index}
                  className="p-4 bg-gray-900 text-slate-300 rounded-lg"
                >
                  <h4 className="text-xl font-semibold pb-6">
                    Enhance Code Quality
                  </h4>
                  <p>{improvement}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 bg-gray-900 text-white rounded-lg">
                <p>No improvements available.</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Updated Solution Code Section */}
      <div className="my-10">
        <h3 className="text-3xl font-semibold pb-4 text-left">
          📝 Solution Code
        </h3>
        {renderSolutionTabs()}
      </div>
    </div>
  );
};

export default FeedbackPage;