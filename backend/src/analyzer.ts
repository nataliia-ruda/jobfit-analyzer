import OpenAI from "openai";
import { AnalyzeRequest, JobAnalysis } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a precise job-fit analysis engine. Compare a job posting against a candidate's CV and return ONLY a single valid JSON object, no markdown fences, no preamble, no extra text.

The JSON must match exactly this shape:
{
  "jobTitle": string,
  "matchScore": number (0-100),
  "matchSummary": string (1-2 honest, specific sentences, not generic praise),
  "skillGaps": [
    { "skill": string, 
     "required": boolean,
      "presentInCv": boolean, 
      "note": string }
  ],
  "cvSuggestions": [
    { "area": string, 
     "suggestion": string }
  ]
}

List 5-10 skillGaps covering the most important requirements from the posting. Give 2-4 cvSuggestions that are concrete and directly actionable. Be honest, not encouraging for its own sake.`;

function isJobAnalysis(data: any): data is JobAnalysis {
  return (
    typeof data.jobTitle === "string" &&
    typeof data.matchScore === "number" &&
    typeof data.matchSummary === "string" &&
    Array.isArray(data.skillGaps) &&
    Array.isArray(data.cvSuggestions)
  );
}

export async function analyzeJobFit(
  input: AnalyzeRequest,
): Promise<JobAnalysis> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `JOB POSTING:\n${input.jobPosting}\n\nCANDIDATE CV:\n${input.cvText}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(raw);

  if (!isJobAnalysis(parsed)) {
    throw new Error(
      "OpenAI response did not match the expected JobAnalysis shape",
    );
  }

  return parsed;
}
