import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

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
import { FounderConfessions } from './pages/FounderConfessions';
import { HallOfGhosts } from './pages/HallOfGhosts';
import { AIAssistant } from './pages/AIAssistant';
import { SignIn } from './pages/SignIn';

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
        <ScrollToTop />
        <Routes>
          {/* Public Landing Page Entry */}
          <Route path="/" element={<LandingPage />} />

          {/* Dedicated Auth & Sign In Page */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route path="/signup" element={<SignIn />} />
          <Route path="/auth" element={<Navigate to="/signin" replace />} />

          {/* Main Dashboard & Application Platform */}
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Home />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/startup/:id" element={<StartupDetail />} />
            <Route path="/risk-scanner" element={<RiskScanner />} />
            <Route path="/scanner" element={<Navigate to="/risk-scanner" replace />} />
            <Route path="/risk" element={<Navigate to="/risk-scanner" replace />} />
            <Route path="/riskscanner" element={<Navigate to="/risk-scanner" replace />} />
            <Route path="/pitch-deck-autopsy" element={<PitchDeckAutopsy />} />
            <Route path="/competitor-compare" element={<CompetitorCompare />} />
            <Route path="/founder-playbook" element={<FounderPlaybook />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/startup-graph" element={<Navigate to="/insights" replace />} />
            <Route path="/founder-confessions" element={<FounderConfessions />} />
            <Route path="/hall-of-confessions" element={<Navigate to="/founder-confessions" replace />} />
            <Route path="/hall-of-ghosts" element={<HallOfGhosts />} />
            <Route path="/ghosts" element={<Navigate to="/hall-of-ghosts" replace />} />
            <Route path="/ghost" element={<Navigate to="/hall-of-ghosts" replace />} />
            <Route path="/hall-of-ghost" element={<Navigate to="/hall-of-ghosts" replace />} />
            <Route path="/hallofghosts" element={<Navigate to="/hall-of-ghosts" replace />} />
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
