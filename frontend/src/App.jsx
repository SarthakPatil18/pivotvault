import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { StartupDetail } from './pages/StartupDetail';
import { AIAssistant } from './pages/AIAssistant';
import { RiskScanner } from './pages/RiskScanner';
import { FounderPlaybook } from './pages/FounderPlaybook';
import { PitchDeckAutopsy } from './pages/PitchDeckAutopsy';
import { FinancialIntelligence } from './pages/FinancialIntelligence';
import { CompetitorCompare } from './pages/CompetitorCompare';
import { Insights } from './pages/Insights';
import { StartupGraph } from './pages/StartupGraph';
import { FailureQuiz } from './pages/FailureQuiz';
import { FounderConfessions } from './pages/FounderConfessions';
import { HallOfGhosts } from './pages/HallOfGhosts';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        {/* Persistent Top Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/startup/:id" element={<StartupDetail />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/risk-scanner" element={<RiskScanner />} />
            <Route path="/founder-playbook" element={<FounderPlaybook />} />
            <Route path="/pitch-deck-autopsy" element={<PitchDeckAutopsy />} />
            <Route path="/financial-intelligence" element={<FinancialIntelligence />} />
            <Route path="/competitor-compare" element={<CompetitorCompare />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/startup-graph" element={<StartupGraph />} />
            <Route path="/failure-quiz" element={<FailureQuiz />} />
            <Route path="/founder-confessions" element={<FounderConfessions />} />
            <Route path="/hall-of-ghosts" element={<HallOfGhosts />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
