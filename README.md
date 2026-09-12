# PivotVault — AI-Powered Startup Failure Intelligence Platform

**Team CodeRegime (KH024)**

Founders use PivotVault to learn from failed startups, validate ideas, scan risks, and make smarter decisions before building or raising money. Over 90% of startups fail by repeating known failure modes (unit economics collapse, premature scaling, lack of PMF). PivotVault provides defensive intelligence powered by 419+ verified post-mortems, pgvector semantic search, and Google Gemini RAG.

---

## Repository Structure

```
KH024-CodeRegime/
├── README.md                           # Project documentation & execution guide
├── LICENSE                             # MIT Open Source License
│
├── src/                                # Project Source Code
│   ├── frontend/                       # Vite + React 19 + Tailwind CSS platform
│   ├── backend/                        # Node.js + Express + Prisma + BullMQ API
│   ├── ml-services/                    # Python FastAPI IdeaScore ML scoring engine
│   └── pivotvault-landing/             # Standalone landing showcase
│
├── docs/                               # Documentation & Architectural Artifacts
│   ├── project-documentation.pdf       # Formal project presentation & report (3 pages)
│   ├── architecture.png                # Full-stack system architecture diagram
│   └── other-diagrams/                 # Pipeline & Entity-Relationship diagrams
│       ├── rag-agent-pipeline.png      # RAG forensic retrieval workflow
│       └── database-schema.png         # PostgreSQL + pgvector relational schema
│
├── screenshots/                        # High-Resolution UI Demonstrations
│   ├── screenshot-1.png                # Startup Failure Archive (419+ Startups)
│   └── screenshot-2.png                # AI Risk Scanner & Autopsy Matchmaker
│
├── data/                               # Canonical Forensic Datasets
│   ├── README.md                       # Data dictionary, taxonomy & sources
│   └── seed.json                       # 419+ verified startup post-mortems
│
├── requirements.txt                    # Python environment dependencies
├── package.json                        # Monorepo workspace scripts
├── vercel.json                         # Vercel deployment configuration
├── render.yaml                         # Render backend web service configuration
└── .gitignore                          # Git exclusions
```

---

## Quickstart Guide

### 1. Root Workspace (Frontend & Backend)

Install all dependencies across the monorepo:
```bash
npm run install:all
```

Start the frontend development server:
```bash
npm run dev
# Or: cd src/frontend && npm run dev
```

Build the production bundle:
```bash
npm run build
# Or: cd src/frontend && npm run build
```

---

### 2. Backend Service (Node.js + PostgreSQL + pgvector)

```bash
cd src/backend
npm install
cp .env.example .env

# Generate Prisma Client & Push Database Schema
npm run prisma:generate
npm run prisma:push

# Seed Canonical Failure Records & Run Direct Ingestion
npm run prisma:seed
npm run ingest:direct

# Start API Server
npm run dev
```

---

### 3. ML Scoring Service (Python FastAPI)

```bash
cd src/ml-services
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

---

## Core Platform Features

- **Startup Failure Archive**: 419+ verified post-mortems indexed with failure scores, capital burned, and root causes across 15 industries.
- **AI Risk Scanner**: Automated model audit cross-referencing startup hypotheses with vector embeddings to compute an objective risk score (0-100).
- **Historical Autopsy Matchmaker**: RAG-retrieved top 3 nearest failed ancestors via cosine distance over 768-dim embeddings.
- **Hall of Ghosts**: Conversational founder personas reconstructed from public testimony to interrogate historical decision points.
- **Pitch Deck Autopsy**: Slide-by-slide diagnostic identifying premature scaling, missing unit economics, and unverified TAM assumptions.
- **Macro Failure Heatmap Matrix**: Failure mode correlations and capital loss patterns across 7 major tech sectors.

---

## Verification & Documentation Assets

- Complete technical documentation is compiled in [`docs/project-documentation.pdf`](file:///Users/sarthak/Desktop/PivotVault/docs/project-documentation.pdf).
- System architecture diagram: [`docs/architecture.png`](file:///Users/sarthak/Desktop/PivotVault/docs/architecture.png).
- RAG pipeline workflow: [`docs/other-diagrams/rag-agent-pipeline.png`](file:///Users/sarthak/Desktop/PivotVault/docs/other-diagrams/rag-agent-pipeline.png).
- Database schema: [`docs/other-diagrams/database-schema.png`](file:///Users/sarthak/Desktop/PivotVault/docs/other-diagrams/database-schema.png).
- UI Screenshots: [`screenshots/screenshot-1.png`](file:///Users/sarthak/Desktop/PivotVault/screenshots/screenshot-1.png) and [`screenshots/screenshot-2.png`](file:///Users/sarthak/Desktop/PivotVault/screenshots/screenshot-2.png).
- Dataset documentation & data dictionary: [`data/README.md`](file:///Users/sarthak/Desktop/PivotVault/data/README.md).
