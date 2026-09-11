/**
 * PivotVault Central Route Configuration and Navigation Hierarchy
 * Following the primary navigation structure from specification
 */

export const NAV_CATEGORIES = [
  {
    id: 'explore',
    name: 'Explore',
    href: '/explore',
    description: 'Browse the 413+ archive of documented startup failures.',
    items: [
      { name: 'Startup Archive', href: '/explore', description: 'Search, filter, and discover 413+ startup post-mortems.' },
      { name: 'Recent Failures', href: '/explore?filter=recent', description: 'Recent post-mortems and pandemic-era collapses.' },
      { name: 'Search Startups', href: '/explore?focus=search', description: 'Deep investigative search across industries and failure vectors.' }
    ]
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    href: '/risk-scanner',
    description: 'AI reasoning, risk scanning, and defensive founder playbooks.',
    items: [
      { name: 'AI Assistant', href: '/ai-assistant', description: 'Investigative startup-failure research assistant.' },
      { name: 'Risk Scanner', href: '/risk-scanner', description: 'Scan your startup idea against historical failure distributions.' },
      { name: 'Founder Playbook', href: '/founder-playbook', description: 'Convert historical failure lessons into defensive plays.' }
    ]
  },
  {
    id: 'analysis',
    name: 'Analysis',
    href: '/pitch-deck-autopsy',
    description: 'Pitch deck forensics, financial signals, and competitor autopsy.',
    items: [
      { name: 'Pitch Deck Autopsy', href: '/pitch-deck-autopsy', description: 'Audit pitch decks against historical failure models.' },
      { name: 'Financial Intelligence', href: '/financial-intelligence', description: 'Runway analysis, burn rates, and valuation collapses.' },
      { name: 'Competitor Compare', href: '/competitor-compare', description: 'Compare failed competitors side-by-side.' }
    ]
  },
  {
    id: 'insights',
    name: 'Insights',
    href: '/insights',
    description: 'Aggregate macro analytics and interactive structural graphs.',
    items: [
      { name: 'Insights Dashboard', href: '/insights', description: 'Macro analytics, failure causes, and capital loss patterns.' },
      { name: 'Knowledge Graph', href: '/startup-graph', description: 'Interactive network mapping founders, investors, and causes.' }
    ]
  },
  {
    id: 'learn',
    name: 'Learn',
    href: '/hall-of-ghosts',
    description: 'Interactive educational scenarios and reconstructed founder personas.',
    items: [
      { name: 'Failure Quiz', href: '/failure-quiz', description: 'Test startup survival instincts across real failure scenarios.' },
      { name: 'Founder Confessions', href: '/founder-confessions', description: 'Editorial first-person post-mortems and candid lessons.' },
      { name: 'Hall of Ghosts', href: '/hall-of-ghosts', description: 'AI-reconstructed founder personas based on public evidence.' }
    ]
  }
];

export const ALL_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/explore', name: 'Explore Archive' },
  { path: '/startup/:id', name: 'Startup Intelligence' },
  { path: '/ai-assistant', name: 'AI Assistant' },
  { path: '/risk-scanner', name: 'Risk Scanner' },
  { path: '/founder-playbook', name: 'Founder Playbook' },
  { path: '/pitch-deck-autopsy', name: 'Pitch Deck Autopsy' },
  { path: '/financial-intelligence', name: 'Financial Intelligence' },
  { path: '/competitor-compare', name: 'Competitor Compare' },
  { path: '/insights', name: 'Insights Dashboard' },
  { path: '/startup-graph', name: 'Knowledge Graph' },
  { path: '/failure-quiz', name: 'Failure Quiz' },
  { path: '/founder-confessions', name: 'Founder Confessions' },
  { path: '/hall-of-ghosts', name: 'Hall of Ghosts' },
  { path: '/settings', name: 'Settings & Disclosures' },
];

