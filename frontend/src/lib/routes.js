/**
 * PivotVault Central Route Configuration and Navigation Hierarchy
 * Following the primary navigation structure from specification
 */

export const NAV_CATEGORIES = [
  {
    id: 'explore',
    name: 'Explore',
    href: '/explore'
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    href: '/risk-scanner',
    items: [
      { name: 'Risk Scanner', href: '/risk-scanner', description: 'Scan your startup idea against historical failure distributions.' },
      { name: 'Founder Playbook', href: '/founder-playbook', description: 'Convert historical failure lessons into defensive plays.' }
    ]
  },
  {
    id: 'analysis',
    name: 'Analysis',
    href: '/pitch-deck-autopsy',
    items: [
      { name: 'Pitch Deck Autopsy', href: '/pitch-deck-autopsy', description: 'Audit pitch decks against historical failure models.' },
      { name: 'Competitor Compare', href: '/competitor-compare', description: 'Compare failed competitors side-by-side.' }
    ]
  },
  {
    id: 'insights',
    name: 'Insights',
    href: '/insights',
    items: [
      { name: 'Insights Dashboard', href: '/insights', description: 'Macro analytics, failure causes, and capital loss patterns.' },
      { name: 'Knowledge Graph', href: '/startup-graph', description: 'Interactive network mapping founders, investors, and causes.' }
    ]
  },
  {
    id: 'learn',
    name: 'Stories & Personas',
    href: '/hall-of-ghosts',
    items: [
      { name: 'Hall of Ghosts', href: '/hall-of-ghosts', description: 'AI-reconstructed founder personas based on public evidence.' },
      { name: 'Founder Confessions', href: '/founder-confessions', description: 'Editorial first-person post-mortems and candid lessons.' }
    ]
  }
];

export const ALL_ROUTES = [
  { path: '/', name: 'Landing Page' },
  { path: '/app', name: 'Dashboard' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/explore', name: 'Failure Explorer' },
  { path: '/startup/:id', name: 'Startup Intelligence' },
  { path: '/risk-scanner', name: 'Risk Scanner' },
  { path: '/founder-playbook', name: 'Founder Playbook' },
  { path: '/pitch-deck-autopsy', name: 'Pitch Deck Autopsy' },
  { path: '/competitor-compare', name: 'Competitor Compare' },
  { path: '/insights', name: 'Insights Dashboard' },
  { path: '/startup-graph', name: 'Knowledge Graph' },
  { path: '/founder-confessions', name: 'Founder Confessions' },
  { path: '/hall-of-ghosts', name: 'Hall of Ghosts' },
];

