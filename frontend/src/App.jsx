import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { StartupDetail } from './pages/StartupDetail';
import { RiskScanner } from './pages/RiskScanner';
import { FounderPlaybook } from './pages/FounderPlaybook';
import { PitchDeckAutopsy } from './pages/PitchDeckAutopsy';
import { CompetitorCompare } from './pages/CompetitorCompare';
import { Insights } from './pages/Insights';
import { StartupGraph } from './pages/StartupGraph';
import { FounderConfessions } from './pages/FounderConfessions';
import { HallOfGhosts } from './pages/HallOfGhosts';
import { AIAssistant } from './pages/AIAssistant';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
          {/* Persistent Top Navigation Bar */}
          <Navbar />

          {/* Dynamic Route Pages */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/startup/:id" element={<StartupDetail />} />
              <Route path="/risk-scanner" element={<RiskScanner />} />
              <Route path="/pitch-deck-autopsy" element={<PitchDeckAutopsy />} />
              <Route path="/competitor-compare" element={<CompetitorCompare />} />
              <Route path="/founder-playbook" element={<FounderPlaybook />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/startup-graph" element={<StartupGraph />} />
              <Route path="/founder-confessions" element={<FounderConfessions />} />
              <Route path="/hall-of-confessions" element={<Navigate to="/founder-confessions" replace />} />
              <Route path="/hall-of-ghosts" element={<HallOfGhosts />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
