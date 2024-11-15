"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

interface FeedbackPageProps {
  userId: string;
  problemId: string;
}

const FeedbackPage: React.FC<FeedbackPageProps> = ({ userId, problemId }) => {
  const [codeScore, setCodeScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<string | null>(null);
  const [solutionCode, setSolutionCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        // Placeholder for API call to get feedback data from backend
        const response = await fetch(
          "http://localhost:8000/api/feedback-summary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              problemId,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        const { code, strengthsText, improvementsText, solutionCodeText } =
          data;
        setCodeScore(code);
        console.log("Code Score:", code);

        setStrengths(strengthsText);
        console.log("Strengths:", strengthsText);

        setImprovements(improvementsText);
        console.log("Improvements:", improvementsText);

        setSolutionCode(solutionCodeText);
        console.log("Solution Code:", solutionCodeText);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [userId, problemId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-20">
      {/* Header */}
      <div className="text-5xl text-center font-semibold pb-6">
        Interview <span className="text-green-500">Insight</span>
      </div>

      {/* Score Card */}
      <div className="flex justify-center items-center pb-6">
        <div className="border rounded-[20px] min-w-[300px] p-5 text-center bg-blue-950">
          <div className="text-3xl font-semibold">Your Score:</div>
          <div className="text-3xl font-bold text-green-500">
            {codeScore !== null ? `${codeScore}%` : "N/A"}
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
                  className="p-4 bg-blue-950 text-white rounded-lg"
                >
                  <h4 className="text-xl font-semibold">
                    You Identified the Solution Well
                  </h4>
                  <p>{strength}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 bg-blue-950 text-white rounded-lg">
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
                  className="p-4 bg-blue-950 text-white rounded-lg"
                >
                  <h4 className="text-xl font-semibold">
                    Enhance Code Quality
                  </h4>
                  <p>{improvement}</p>
                </Card>
              ))
            ) : (
              <Card className="p-4 bg-blue-950 text-white rounded-lg">
                <p>No improvements available.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
