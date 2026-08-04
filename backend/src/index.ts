import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { analyzeJobFit } from "./analyzer";

const app = express();
const PORT = 5000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/analyze", upload.single("cv"), async (req, res) => {
  const { jobPosting } = req.body;
  const cvFile = req.file;

  if (!jobPosting || !cvFile) {
    return res.status(400).json({ error: "jobPosting and cv file are both required" });
  }

  try {
    const result = await analyzeJobFit({
      jobPosting,
      cvBuffer: cvFile.buffer,
      cvFilename: cvFile.originalname,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze job fit" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});