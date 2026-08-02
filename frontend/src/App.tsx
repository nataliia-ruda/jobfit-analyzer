import { useState } from "react";
import { Container, Typography, TextField, Button, Stack } from "@mui/material";

function App() {
  const [jobPosting, setJobPosting] = useState("");
  const [cvText, setCvText] = useState("");

  const handleSubmit = () => {
    console.log("Job posting:", jobPosting);
    console.log("CV text:", cvText);
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

        <TextField
          label="Your CV"
          multiline
          minRows={6}
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={!jobPosting || !cvText}
        >
          Analyze
        </Button>
      </Stack>
    </Container>
  );
}

export default App;