import { useState } from "react";
import { Container, Typography } from "@mui/material";

function App() {
  const [jobPosting, setJobPosting] = useState("");
  const [cvText, setCvText] = useState("");

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JobFit Analyzer
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Paste a job posting and your CV to see how well they match.
      </Typography>
    </Container>
  );
}

export default App;