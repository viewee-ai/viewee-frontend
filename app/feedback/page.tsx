// app/feedback/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const FeedbackPage: React.FC = () => {
  const [codeScore, setCodeScore] = useState<string | null>(null);
  // const [thoughtFeedback, setThoughtFeedback] = useState<string | null>(null);
  const [strengths, setStrengths] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<string | null>(null);
  const [solutionCode, setSolutionCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    document.body.classList.add("bg-gray-800");

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("bg-gray-800");
    };
  }, []);

  useEffect(() => {
    const score = searchParams.get("codeScore");
    const strengthsText = searchParams.get("strengths");
    const improvementsText = searchParams.get("improvements");
    const solutionCodeText = searchParams.get("solutionCode");

    if (score && strengthsText && improvementsText && solutionCodeText) {
      setCodeScore(score);
      setStrengths(strengthsText);
      setImprovements(improvementsText);
      setSolutionCode(solutionCodeText);
      setLoading(false);
    } else {
      console.error("Missing feedback data in query parameters.");
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
        className="bg-gray-800"
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-20 bg-gray-800 h-full">
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
      <div className="flex justify-center gap-8 mt-8">
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
        <Card className="p-4 bg-gray-800 text-white rounded-lg">
          <pre
            className="bg-gray-900 p-4 rounded-md overflow-x-auto"
            style={{
              maxHeight: "400px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {solutionCode ? solutionCode : "No solution code available."}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
