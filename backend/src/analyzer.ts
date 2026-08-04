import OpenAI from "openai";
import { AnalyzeRequest, JobAnalysis } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a precise job-fit analysis engine. Compare a job posting against a candidate's CV (provided as an attached file) and return ONLY a single valid JSON object, no markdown fences, no preamble, no extra text.

The JSON must match exactly this shape:
{
  "jobTitle": string,
  "matchScore": number (0-100),
  "matchSummary": string (1-2 honest, specific sentences),
  "skillGaps": [
    { "skill": string, "required": boolean, "presentInCv": boolean, "note": string }
  ],
  "cvSuggestions": [
    { "area": string, "suggestion": string }
  ]
}

List 5-10 skillGaps. Give 2-4 cvSuggestions that are concrete and actionable.`;

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
  input: AnalyzeRequest
): Promise<JobAnalysis> {
  //  uploading CV top OpenAI
  const uploadedFile = await openai.files.create({
    file: new File([Uint8Array.from(input.cvBuffer)], input.cvFilename, { type: "application/pdf" }),
    purpose: "user_data",
  });

  try {
  
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: `JOB POSTING:\n${input.jobPosting}` },
            {
              type: "file",
              file: { file_id: uploadedFile.id },
            } as any,
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(raw);
    if (!isJobAnalysis(parsed)) {
      throw new Error("OpenAI response did not match expected shape");
    }

    return parsed;
  } finally {
    // clean up from OpenAI
    await openai.files.delete(uploadedFile.id);
  }
}