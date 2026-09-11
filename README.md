# PivotVault — AI-Powered Startup Failure Intelligence Platform

Founders use PivotVault to learn from failed startups, validate ideas, scan risks, and make smarter decisions before building or raising money.

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

---

## Quickstart

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
