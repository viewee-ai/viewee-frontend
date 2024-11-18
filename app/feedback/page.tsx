"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

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
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [codeScore, setCodeScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string>("");
  const [improvements, setImprovements] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [solutionsData, setSolutionsData] = useState<SolutionsData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

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
        const averageScoreParam = Number(params.get("averageScore"));
        const codeScoreParam = Number(params.get("codeScore"));
        const strengthsParam = params.get("strengths") || "";
        const improvementsParam = params.get("improvements") || "";
        const questionParam = params.get("question") || "";

        setAverageScore(averageScoreParam);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-20 bg-gray-800 min-h-screen pb-10">
      {/* Header */}
      <div className="text-5xl text-center font-semibold pb-6">
        Interview <span className="text-green-500">Insight</span>
      </div>

      {/* Score Card */}
      <div className="flex justify-center items-center pb-6">
        <div className="border rounded-[20px] min-w-[300px] p-5 text-center bg-gray-900">
          <div className="text-3xl font-semibold">Your Score:</div>
          <div className="text-3xl font-bold text-green-500">
            {codeScore !== null ? `${codeScore}` : "N/A"}
          </div>
        </div>
      </div>

      <div className="border rounded-[15px]"></div>

      {/* Feedback Sections */}
      <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
        {/* Strengths Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold pb-4 text-left">
            🚀 Where You Excel
          </h3>
          <div className="mt-4 grid gap-4">
            {strengths ? (
              strengths.split("\n").map((strength, index) => (
                <Card
                  key={index}
                  className="p-4 bg-gray-900 text-white rounded-lg"
                >
                  <h4 className="text-xl font-semibold">
                    You Identified the Solution Well
                  </h4>
                  <p>{strength}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 bg-gray-900 text-white rounded-lg">
                <p>No strengths available.</p>
              </Card>
            )}
          </div>
        </div>

        {/* Improvements Section */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold pb-4 text-left">
            ❗ What Needs Work
          </h3>
          <div className="mt-4 grid gap-4">
            {improvements ? (
              improvements.split("\n").map((improvement, index) => (
                <Card
                  key={index}
                  className="p-4 bg-gray-900 text-white rounded-lg"
                >
                  <h4 className="text-xl font-semibold">
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

      {/* Solution Code Section */}
      <div className="my-10">
        <h3 className="text-2xl font-semibold pb-4 text-left">
          📝 Solution Code
        </h3>
        {error ? (
          <Card className="p-4 bg-gray-900 text-white rounded-lg">
            <p className="text-red-500">{error}</p>
          </Card>
        ) : solutionsData && solutionsData.solutions ? (
          solutionsData.solutions.map((solution: Solution, index: number) => (
            <Card
              key={index}
              className="p-4 bg-gray-900 text-white rounded-lg mb-4"
            >
              <h4 className="text-xl font-semibold mb-2">
                {solution.approach}
              </h4>
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
                <p className="text-green-400">
                  Time Complexity: {solution.time_complexity}
                </p>
                <p className="text-blue-400">
                  Space Complexity: {solution.space_complexity}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-4 bg-gray-900 text-white rounded-lg">
            <p>No solutions available.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
