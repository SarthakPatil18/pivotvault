import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
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

/**
 * DashboardLayout wraps the inner PivotVault intelligence platform
 * with the standard dashboard top navigation bar and global footer.
 */
function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-200">
      {/* Persistent Top Navigation Bar */}
      <Navbar />

      {/* Dynamic Route Pages */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page Entry */}
          <Route path="/" element={<LandingPage />} />

          {/* Main Dashboard & Application Platform */}
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
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
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
