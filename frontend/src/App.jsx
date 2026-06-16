import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FailureExplorer from './pages/FailureExplorer';
import PostmortemPage from './pages/PostmortemPage';
import RiskScanner from './pages/RiskScanner';
import KnowledgeGraph from './pages/KnowledgeGraph';
import ConfessionWall from './pages/ConfessionWall';
import InsightsDashboard from './pages/InsightsDashboard';
import AiAssistant from './pages/AiAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookmarksPage from './pages/BookmarksPage';
import HistoryPage from './pages/HistoryPage';
import FailureQuiz from './pages/FailureQuiz';
import FounderPlaybook from './pages/FounderPlaybook';
import CompareStartups from './pages/CompareStartups';
import HallOfGhosts from './pages/HallOfGhosts';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PitchDeckAutopsy from './pages/PitchDeckAutopsy.jsx';
import { clsx } from 'clsx';

function App() {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : true;
  });
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <Router>
      <div className="flex min-h-screen bg-bg overflow-x-hidden">
        <ScrollToTop />
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <div 
          className={clsx(
            "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0",
            isCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
          )}
        >
          <main className="flex-1 flex flex-col pt-16 lg:pt-0">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/explore" element={<FailureExplorer />} />
              <Route path="/startup/:slug" element={<PostmortemPage />} />
              <Route path="/scan" element={<ProtectedRoute><RiskScanner /></ProtectedRoute>} />
              <Route path="/graph" element={<KnowledgeGraph />} />
              <Route path="/confessions" element={<ConfessionWall />} />
              <Route path="/insights" element={<InsightsDashboard />} />
              <Route path="/assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="/playbook" element={<ProtectedRoute><FounderPlaybook /></ProtectedRoute>} />
              <Route path="/quiz" element={<FailureQuiz />} />
              <Route path="/compare" element={<CompareStartups />} />
              <Route path="/ghosts" element={<HallOfGhosts />} />
              <Route path="/autopsy" element={<ProtectedRoute><PitchDeckAutopsy /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}


export default App;
