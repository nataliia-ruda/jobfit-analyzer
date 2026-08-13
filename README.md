# JobFit Analyzer

Paste a job posting and upload your CV to get an AI-generated match analysis: a fit score, skill gaps, and concrete CV suggestions.

## Stack

- **Frontend**: React + TypeScript + Vite, MUI components
- **Backend**: Express + TypeScript, OpenAI API (gpt-4o-mini)

## Project structure

```
frontend/   React app 
backend/    Express API 
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


### Frontend

```
cd frontend
npm install
npm run dev
```

## Usage

1. Start the backend and frontend dev servers (both must be running).
2. Open the frontend in your browser.
3. Paste a job posting and upload a CV (PDF).
4. Click Analyze to get a match score, skill gaps, and CV suggestions.


