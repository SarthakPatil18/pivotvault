# PivotVault — AI-Powered Startup Failure Intelligence Platform

Founders use PivotVault to learn from failed startups, validate ideas, scan risks, and make smarter decisions before building or raising money.

---

## Repository Structure

```
pivotvault/
├── backend/                  # PostgreSQL + Prisma + BullMQ Scraper Pipeline & Vector Ingestion
└── frontend/                 # Vite + React + Tailwind Minimal Editorial Intelligence Platform
```

---

## Frontend Architecture & Intelligence Suite

- **Hero & First Viewport**: 60/40 viewport-filling layout engineered for 100% desktop scale.
- **Editorial Design System**: Strictly adheres to `design.md` with a clean monochrome aesthetic, high information density, and soft red accents strictly reserved for high-risk telemetry.
- **Live Failure Intelligence**: Ranked distribution charts across 14 failure vectors and a historical collapse event timeline.
- **Cross-Industry Heatmap Matrix**: Failure mode correlations across 7 industries.
- **The Startup Failure Network**: Interactive Knowledge Graph with relationship explorer.
- **Risk Scanner**: Interactive startup model audit with real-time risk score gauge (0-100) and historical autopsy matchmaker.
- **Hall of Ghosts**: AI-reconstructed founder debriefs grounded in public records and testimonies.
- **Diagnostic Tools**: Pitch Deck Autopsy, Competitor Comparison, and Financial Intelligence.

### Frontend Quickstart

```bash
cd frontend
npm install
npm run dev
```

Production build:
```bash
npm run build
```

---

## v0-database Architecture & Status (Developer 1)

- **Database Layer**: PostgreSQL with `pgvector` (`vector(768)`).
- **Prisma Schema**: Models for `Company`, `Evidence`, `Claim`, `Embedding`, `FailurePattern`, `AgentExecution`, and `RiskScan`.
- **Pre-Seeded Companies**: 20 canonical startup postmortems (WeWork, Theranos, Quibi, Juicero, Vine, Clubhouse, Yo App, Color Labs, Pets.com, Webvan, Byju's, FTX, Solyndra, MoviePass, Jawbone, Fab.com, Homejoy, Rdio, Meerkat, Secret).
- **Web Scraper Suite**:
  - `StartupGraveyard.js` (`https://startupgraveyard.io`)
  - `Failory.js` (`https://www.failory.com/cemetery`)
  - `TheStartupGraveyard.js` (`https://www.thestartupgraveyard.com`)
  - `StartupGraveyardCo.js` (`https://www.startupgraveyard.co`)
  - `HackerNews`, `Reddit`, `YCombinator`, `ProductHunt`, `IndieHackers`, `TechCrunch`
- **Data Pipelines**:
  - `ingest:direct`: Direct scraper-to-database loader with concurrent batching.
  - `pipeline:start`: 9-stage BullMQ asynchronous queue system with Handoff Contract (`embeddingQueue`) for Developer 2.

### Backend Quickstart

```bash
cd backend
npm install
cp .env.example .env

# Generate Prisma Client & Push Schema
npm run prisma:generate
npm run prisma:push

# Seed Canonical Startups & Run Direct Scraper Ingestion
npm run prisma:seed
npm run ingest:direct
```
