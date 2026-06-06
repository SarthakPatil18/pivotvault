# PivotVault — Startup Failure Intelligence Platform

The world's first open knowledge base of startup failures.

## Quick Start

### 1. Environment
Copy `.env.example` to `backend/.env` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- `GEMINI_API_KEY` — Google Gemini API key
- `GROQ_API_KEY` — Groq API key (optional fallback)

### 2. Backend
```
cd backend
npm install
npx prisma migrate dev --name init
npm run db:seed
npm start
```

### 3. Frontend
```
cd frontend
npm install
npm run dev
```

### 4. Open
Visit `http://localhost:3000`

## Tech Stack
- **Frontend**: React 18 + Vite, Tailwind CSS, Recharts, D3.js, Framer Motion
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **AI**: Google Gemini 1.5 Flash, Groq/Llama 3.1 fallback
- **Auth**: None for MVP (public read access)

## Architecture
Monorepo with SPA frontend and REST API backend.
Follows the specifications in the PivotVault v2.0 documents (PRD, Architecture, Security, Frontend Design, Feature Tickets).
