import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { RiskInsights } from './pages/RiskInsights';
import { Journal } from './pages/Journal';
import { Meditation } from './pages/Meditation';
import { Support } from './pages/Support';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import AffectiveAnalysis from './pages/AffectiveAnalysis';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden font-sans selection:bg-primary/30">
        <Sidebar />
        <main className="flex-1 overflow-auto w-full relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/risk" element={<RiskInsights />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/support" element={<Support />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/affective" element={<AffectiveAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;