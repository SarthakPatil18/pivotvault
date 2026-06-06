const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Startups
  const fitAI = await prisma.startup.upsert({
    where: { slug: 'fit-ai' },
    update: {},
    create: {
      name: 'FitAI',
      slug: 'fit-ai',
      status: 'failed',
      industry: 'Fitness & AI',
      country: 'India',
      foundingYear: 2024,
      shutdownYear: 2025,
      lifetimeMonths: 14,
      fundingInr: 15000000n, // 1.5 Cr
      peakUsers: 12000,
      teamSize: 12,
      summary: 'Personalized AI personal trainer app that pivoted to a B2B corporate wellness platform before running out of cash.',
      founderStory: '# The FitAI Story\n\nWe started FitAI with a simple dream: a personal trainer in every pocket. Our computer vision tech was ahead of its time, but our burn rate was even faster.\n\n## The Beginning\nLaunched in early 2024 with 5,000 users on waitlist. Everyone loved the idea, but nobody wanted to pay ₹999/month for fitness when they could watch YouTube for free.\n\n## The Pivot\nWe tried selling to HR departments. "Corporate Wellness" sounds good in boardrooms but employees didn\'t use it. We burned 80% of our seed round in 6 months trying to find PMF.\n\n## The End\nBy May 2025, we had 3 months of runway left. We tried to raise a Bridge round but the metrics weren\'t there. We decided to shut down and return the remaining ₹20L to investors.',
      failureReasons: {
        create: [
          { category: 'pmf', severityScore: 90, description: 'Built features for a market that refused to pay.', isPrimary: true },
          { category: 'monetization', severityScore: 75, description: 'B2C subscription fatigue + high churn.' },
          { category: 'cac', severityScore: 60, description: 'Cost to acquire a paying user exceeded LTV.' },
        ],
      },
      timelineEvents: {
        create: [
          { stage: 'idea', eventDate: new Date('2023-11-01'), title: 'The Vision', description: 'Founders start building the CV model.' },
          { stage: 'prototype', eventDate: new Date('2024-02-15'), title: 'Alpha Launch', description: 'Internal testing with 100 users.' },
          { stage: 'launch', eventDate: new Date('2024-05-10'), title: 'App Store Launch', description: '5,000 users in first week.' },
          { stage: 'growth', eventDate: new Date('2024-09-20'), title: 'The Peak', description: 'Hit 12,000 active users, but revenue stalling.' },
          { stage: 'decline', eventDate: new Date('2025-02-05'), title: 'The Pivot Attempt', description: 'Shifted focus to Corporate Wellness B2B.' },
          { stage: 'shutdown', eventDate: new Date('2025-06-30'), title: 'Final Shutdown', description: 'Servers turned off.' },
        ],
      },
      metricsSnapshots: {
        create: [
          { recordedMonth: new Date('2024-05-01'), users: 5000, revenueInr: 50000n, burnRateInr: 800000n, churnRate: 15 },
          { recordedMonth: new Date('2024-09-01'), users: 12000, revenueInr: 250000n, burnRateInr: 1200000n, churnRate: 22 },
          { recordedMonth: new Date('2025-01-01'), users: 9500, revenueInr: 300000n, burnRateInr: 1500000n, churnRate: 35 },
          { recordedMonth: new Date('2025-05-01'), users: 4000, revenueInr: 150000n, burnRateInr: 1000000n, churnRate: 50 },
        ],
      },
      aiAnalyses: {
        create: {
          retentionScore: 85,
          monetizationScore: 90,
          pmfScore: 95,
          marketingScore: 40,
          primaryCause: 'Product-Market Fit',
          confidence: 92,
          recommendations: [
            { priority: 'high', action: 'Validate willingness to pay before writing code.', rationale: 'FitAI spent 8 months on tech for a feature users liked but wouldn\'t pay for.' },
            { priority: 'medium', action: 'Monitor churn trends weekly, not monthly.', rationale: 'The retention death spiral was visible 3 months before they pivoted.' },
          ],
        },
      },
    },
  });

  const quibi = await prisma.startup.upsert({
    where: { slug: 'quibi' },
    update: {},
    create: {
      name: 'Quibi',
      slug: 'quibi',
      status: 'failed',
      industry: 'Streaming / Entertainment',
      country: 'USA',
      foundingYear: 2018,
      shutdownYear: 2020,
      lifetimeMonths: 6,
      fundingInr: 150000000000n, // $1.75B ~ 15000 Cr
      summary: 'Short-form high-production streaming service designed specifically for mobile users on the go.',
      founderStory: 'Quibi (short for "quick bites") raised nearly $2 billion to revolutionize mobile video. It launched during the COVID-19 pandemic when nobody was "on the go," leading to one of the most expensive startup collapses in history.',
      failureReasons: {
        create: [
          { category: 'timing', severityScore: 95, description: 'Launched mobile-only platform when the world went into lockdown.', isPrimary: true },
          { category: 'pmf', severityScore: 80, description: 'Misjudged how people consume premium short-form content.' },
        ],
      },
      aiAnalyses: {
        create: {
          retentionScore: 92,
          monetizationScore: 70,
          pmfScore: 85,
          marketingScore: 60,
          primaryCause: 'Timing & Market Conditions',
          confidence: 88,
          recommendations: [
            { priority: 'high', action: 'Ensure cross-platform accessibility from launch.', rationale: 'Restricting content to mobile-only limited user context significantly.' },
          ],
        },
      },
    },
  });

  // 2. Seed Graph Edges
  await prisma.graphEdge.createMany({
    data: [
      { sourceStartupId: fitAI.id, mistakeCategory: 'no_pmf', outcome: 'shutdown', edgeWeight: 0.9 },
      { sourceStartupId: fitAI.id, mistakeCategory: 'high_burn', outcome: 'shutdown', edgeWeight: 0.7 },
      { sourceStartupId: quibi.id, mistakeCategory: 'bad_timing', outcome: 'shutdown', edgeWeight: 0.95 },
      { sourceStartupId: quibi.id, mistakeCategory: 'no_pmf', outcome: 'shutdown', edgeWeight: 0.6 },
    ],
  });

  // 3. Seed Confessions
  await prisma.confession.createMany({
    data: [
      { text: "I spent 6 months building a feature nobody used because I was too scared to talk to customers.", upvotes: 142 },
      { text: "We raised a seed round and immediately moved to a fancy office. We shut down 9 months later with ₹0 in the bank.", upvotes: 89 },
      { text: "I lied to my board about our retention metrics for two quarters. Closing the company was a relief.", upvotes: 215 },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });