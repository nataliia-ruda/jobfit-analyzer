import OpenAI, { toFile } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { JobAnalysisSchema, JobAnalysis } from "./jobAnalysis.schema";
import { AnalyzeRequest } from "./types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a precise job-fit analysis engine.
Compare the candidate's CV (attached as a file) against the job posting.
Rules:
- Only consider skills and experience explicitly supported by the CV.
- Do not assume missing information.
- Distinguish between required and preferred requirements.
- Be strict about years of experience.
- Do not invent qualifications.
- Give concrete, actionable CV suggestions.
Return ONLY a valid JSON object matching the required schema, no extra text.`;

export async function analyzeJobFit(input: AnalyzeRequest): Promise<JobAnalysis> {
  const uploadedCv = await openai.files.create({
    file: await toFile(input.cvBuffer, input.cvFilename, { type: "application/pdf" }),
    purpose: "user_data",
  });

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions: SYSTEM_PROMPT,
      text: {
        format: zodTextFormat(JobAnalysisSchema, "job_analysis"),
      },
      input: [
        {
          role: "user",
          content: [
            { type: "input_file", file_id: uploadedCv.id },
            {
              type: "input_text",
              text: `JOB POSTING:\n${input.jobPosting}\n\nAnalyze the attached CV against this job posting.`,
            },
          ],
        },
      ],
    });

    const raw = response.output_text;
    if (!raw) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(raw);
    return JobAnalysisSchema.parse(parsed);
  } finally {
    await openai.files.delete(uploadedCv.id);
  }
}