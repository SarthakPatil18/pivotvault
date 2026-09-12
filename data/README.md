# PivotVault Dataset Documentation

## Overview
The PivotVault dataset powers forensic failure intelligence, providing structured forensic records on **419+ verified startup collapses** spanning from the dot-com era to recent 2024 failure signals.

---

## Data Structure (`seed.json`)

The primary canonical dataset is stored in `data/seed.json` (and mirrored in `src/backend/seed.json`). Each startup failure autopsy is represented with standardized metadata:

```json
{
  "id": "quibi",
  "name": "Quibi",
  "domain": "Streaming / Media",
  "industry": "Media",
  "country": "United States",
  "foundedYear": 2018,
  "failedYear": 2020,
  "capitalRaised": 1750000000,
  "failureScore": 94,
  "failureMode": "Product-Market Fit Void",
  "primaryRootCause": "Ignored mobile-only usage constraints and free content competition",
  "rootCauses": [
    "Product-market fit never stabilized",
    "Underestimated competition from free short-form video (TikTok, YouTube)",
    "Content sharing restrictions crippled organic virality",
    "Extreme cash burn before unit economic validation"
  ],
  "founders": [
    { "name": "Jeffrey Katzenberg", "role": "Co-founder & Chairman" },
    { "name": "Meg Whitman", "role": "CEO" }
  ],
  "investors": [
    "Disney", "Sony Pictures", "Warner Bros.", "Alibaba Group", "JPMorgan Chase"
  ],
  "lessons": [
    "Distribution and timing outrank Hollywood-grade production budgets.",
    "Mobile consumer habits cannot be forced through capital alone."
  ],
  "embedding": [ ...768-dimensional vector... ]
}
```

---

## 14 Primary Failure Vectors

1. **Unit Economics Collapse** (Negative gross margins, unsustainable delivery subsidies)
2. **Lack of Market Need / PMF** (Solving non-existent or low-urgency problems)
3. **Execution & Operational Drag** (Supply chain breakdown, scaling friction)
4. **Competition & Moat Deficit** (Incumbents cloning features, margin compression)
5. **Runway Exhaustion / Burn Rate** (Premature hiring, overcapitalized burn)
6. **Fraud & Governance Void** (Falsified metrics, regulatory deception)
7. **Hardware & Manufacturing Bottlenecks** (BOM cost overruns, yield failures)
8. **Regulatory & Legal Impediments** (Licensing blocks, FTC/SEC injunctions)
9. **Market Timing Mismatch** (Too early for infrastructure or too late to market)
10. **Revenue Concentration Danger** (Over-reliance on single channels or clients)
11. **Founder-Market Fit Dissolution** (Domain ignorance, co-founder conflict)
12. **Customer Acquisition Cost Surges** (Paid ad addiction exceeding LTV)
13. **Pivot Paralysis** (Late strategic direction shifts)
14. **Over-reliance on Subsidized Growth** (Buying usage without retention)

---

## Data Sources & Provenance

Data points are verified across multi-party sources to avoid survivorship bias or PR spin:
- **Founder Postmortems & Retrospectives** (Medium, Substack, LinkedIn)
- **Public SEC Filings, Bankruptcy Dockets & Liquidations** (Chapter 7/11 filings)
- **Venture Archives** (CB Insights, Failory, Dealroom, Tracxn, PitchBook)
- **Community Post-Mortems** (Hacker News, Y Combinator founder retrospectives)

---

## Vector Embeddings & Similarity Search

- **Embedding Dimension**: `768`
- **Vector Database**: PostgreSQL with the `pgvector` extension
- **Distance Metric**: Cosine Distance (`vector_cosine_ops`)
- **Indexing**: IVFFlat / HNSW indexes for sub-10ms nearest-neighbor semantic search over failure scenarios
