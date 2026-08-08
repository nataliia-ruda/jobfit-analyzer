import { useState } from "react";
import { Container, Typography, TextField, Button, Stack } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function App() {
  const [jobPosting, setJobPosting] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!cvFile) return;

    const formData = new FormData();
    formData.append("jobPosting", jobPosting);
    formData.append("cv", cvFile);

    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log("Analysis result:", result);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JobFit Analyzer
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Paste a job posting and your CV to see how well they match.
      </Typography>

      <Stack spacing={3} sx={{ mt: 4 }}>
        <TextField
          label="Job Posting"
          multiline
          minRows={6}
          value={jobPosting}
          onChange={(e) => setJobPosting(e.target.value)}
          fullWidth
        />

        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
          sx={{ justifyContent: "flex-start", py: 1.5 }}
        >
          {cvFile ? cvFile.name : "Upload your CV"}
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          />
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!jobPosting || !cvFile}
        >
          Analyze
        </Button>
      </Stack>
    </Container>
  );
}

export default App;