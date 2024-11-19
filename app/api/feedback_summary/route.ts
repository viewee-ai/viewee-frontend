import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export async function POST(req: Request) {
  try {
    const { code, userTranscript, question } = await req.json();
    console.log("Code:", code);
    console.log("Transcript:", userTranscript);
    console.log("Question:", question);
    

    const FeedbackSchema = z.object({
      code_correctness_score: z.number(),
      thought_process_score: z.number(),
      average_score: z.number(),
      areas_of_excellence: z.string(),
      areas_of_improvement: z.string(),
    });

    // Construct the prompt for OpenAI
    const prompt = `
    You are a technical interviewer evaluating a candidate's code and thought process. Give feedback directly to the user addressing the user as "you" and directly reference the following information in your evaluation:

    Question Context:
    ${question}

    ${
      code
        ? `Code to evaluate:
    ${code}`
        : "No code was provided. Please focus only on the thought process."
    }

    ${
      userTranscript
        ? `Transcript of the candidate's thought process:
    ${userTranscript}`
        : "No transcript was provided. Please focus only on the code."
    }

    Evaluation steps:
    1. Evaluate the provided code for correctness, efficiency, and readability. If no code is provided, skip this step.
    2. Evaluate the thought process for clarity, problem-solving skill, and logical flow. If no transcript is provided, skip this step.
    3. Assign a score out of 100 for code correctness.
    4. Assign a score out of 100 for thoughtfulness in the transcript.
    5. Combine these scores into an average score and provide structured feedback.

    Output the results in this format:
    - Code Correctness Score (0-100): <Score>
    - Thought Process Score (0-100): <Score>
    - Average Score (0-100): <Score>
    - Areas of Excellence: <Areas where the candidate excelled. Specify specifically on what they did well based on the transcript >
    - Areas for Improvement: <Suggestions for improvement>
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
      response_format: zodResponseFormat(FeedbackSchema, "evaluation_feedback"),
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