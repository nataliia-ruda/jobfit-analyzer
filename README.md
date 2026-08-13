# JobFit Analyzer

Paste a job posting and upload your CV to get an AI-generated match analysis: a fit score, skill gaps, and concrete CV suggestions.

## Stack

- **Frontend**: React + TypeScript + Vite, MUI components
- **Backend**: Express + TypeScript, OpenAI API (`gpt-4o-mini` via the Responses API with structured outputs)

## Project structure

```
frontend/   React app (Vite dev server on port 5173 by default)
backend/    Express API (listens on port 5000)
```

## Setup

### Backend

```
cd backend
npm install
```

Create a `backend/.env` file with your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

Run the dev server:

```
npm run dev
```

The API starts on `http://localhost:5000`.

### Frontend

```
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` (default Vite port).

## Usage

1. Start the backend and frontend dev servers (both must be running).
2. Open the frontend in your browser.
3. Paste a job posting and upload a CV (PDF).
4. Click **Analyze** to get a match score, skill gaps, and CV suggestions.

## API

`POST /analyze` — multipart form data:

| Field | Type | Description |
|---|---|---|
| `jobPosting` | text | The job description |
| `cv` | file | CV file (PDF) |

Returns a JSON object with `jobTitle`, `matchScore`, `matchSummary`, `skillGaps`, and `cvSuggestions`.
