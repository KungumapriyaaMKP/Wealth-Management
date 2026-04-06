import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import ProjectAnalytics from './pages/ProjectAnalytics';
import LandAssets from './pages/LandAssets';
import VehicleAssets from './pages/VehicleAssets';
import VaultAssets from './pages/VaultAssets';
import EmiTracker from './pages/EmiTracker';
import Targets from './pages/Targets';
import AiAdvisory from './pages/AiAdvisory';
import Sidebar from './components/Sidebar';

function App() {
  // Default to dark mode for the premium feel
  const [isDark, setIsDark] = useState(true);

  // Apply dark class to body so it propagates universally if needed
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <div className={`flex min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#030303] text-white selection:bg-[#d4af37]/30' : 'bg-[#f4f4f5] text-slate-900 selection:bg-[#d4af37]/30'}`}>
        <Sidebar isDark={isDark} setIsDark={setIsDark} />
        <main className="flex-1 p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard isDark={isDark} />} />
            <Route path="/transactions" element={<Transactions isDark={isDark} />} />
            <Route path="/project/:id" element={<ProjectAnalytics isDark={isDark} />} />
            <Route path="/land-assets" element={<LandAssets isDark={isDark} />} />
            <Route path="/vehicles" element={<VehicleAssets isDark={isDark} />} />
            <Route path="/vault" element={<VaultAssets isDark={isDark} />} />
            <Route path="/emi" element={<EmiTracker isDark={isDark} />} />
            <Route path="/targets" element={<Targets isDark={isDark} />} />
            <Route path="/advisory" element={<AiAdvisory isDark={isDark} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
