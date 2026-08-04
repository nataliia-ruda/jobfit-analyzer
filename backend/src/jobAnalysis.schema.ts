import { z } from "zod";

export const SkillGapSchema = z.object({
  skill: z.string(),
  required: z.boolean(),
  presentInCv: z.boolean(),
  note: z.string(),
});

export const CvSuggestionSchema = z.object({
  area: z.string(),
  suggestion: z.string(),
});

export const JobAnalysisSchema = z.object({
  jobTitle: z.string(),
  matchScore: z.number(),
  matchSummary: z.string(),
  skillGaps: z.array(SkillGapSchema),
  cvSuggestions: z.array(CvSuggestionSchema),
});

export type JobAnalysis = z.infer<typeof JobAnalysisSchema>;