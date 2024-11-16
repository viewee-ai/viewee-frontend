import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { session_id, code, transcript } = await req.json();

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required." },
        { status: 400 }
      );
    }

    // Construct the prompt for OpenAI
    const prompt = `
    You are a technical interviewer. Evaluate the following code and thought process:

    Code:
    ${code || "No code provided"}

    Thought Process:
    ${transcript || "No thought process provided"}

    Provide the following:
    1. Code Correctness Score (0-100%).
    2. Thought Process Feedback.
    3. Areas of Excellence.
    4. Areas for Improvement.
    `;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // OpenAI API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a technical interviewer." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const result = response.choices[0].message?.content;

    // Parse the response to structure the data
    const feedback = JSON.parse(result || "{}");

    const formattedResponse = {
      session_id,
      code_correctness: feedback.code_correctness || "N/A",
      thought_process_feedback: feedback.thought_process_feedback || "N/A",
      areas_of_excellence: feedback.areas_of_excellence || "N/A",
      areas_for_improvement: feedback.areas_for_improvement || "N/A",
      full_code: code || "No code provided",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error in API:", error.message);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 }
    );
  }
}
