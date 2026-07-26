import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeJobFit } from "./analyzer";
import { AnalyzeRequest } from "./types";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/analyze", async (req, res) => {
  const { jobPosting, cvText } = req.body as AnalyzeRequest;

  if (!jobPosting || !cvText) {
    return res.status(400).json({ error: "jobPosting and cvText are both required" });
  }

  try {
    const result = await analyzeJobFit({ jobPosting, cvText });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze job fit" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});