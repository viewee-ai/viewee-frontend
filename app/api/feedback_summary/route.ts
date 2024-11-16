import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export async function POST(req: Request) {
  try {
    const { code, transcript } = await req.json();

    const Feedback = z.object({
      Score: z.string(),
      thought_process: z.string(),
      areas_of_excellence: z.string(),
      areas_of_improvement: z.string(),
    });

    // Construct the prompt for OpenAI
    const prompt = `
    You are a technical interviewer. Evaluate the following code and thought process:

    Code:
    ${code}

    Thought Process:
    ${transcript}

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
      response_format: zodResponseFormat(Feedback, "evaluation_feedback"),
    });

    const result = response.choices[0].message?.content;

    console.log("OpenAI Response:", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    // Narrow down the type of error
    if (error instanceof Error) {
      console.error("Error in API:", error.message);
      return NextResponse.json(
        { error: error.message || "Evaluation failed. Please try again." },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unknown error occurred." },
      { status: 500 }
    );
  }
}
