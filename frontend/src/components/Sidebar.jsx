import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ArrowRightLeft, Map, Activity, Target, LogOut, ChevronRight, Moon, Sun, CreditCard, CarFront, Diamond } from 'lucide-react';

export default function Sidebar({ isDark, setIsDark }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
    { name: 'Land Assets', path: '/land-assets', icon: Map },
    { name: 'Vehicle Assets', path: '/vehicles', icon: CarFront },
    { name: 'Vault & Metals', path: '/vault', icon: Diamond },
    { name: 'EMI & Loans', path: '/emi', icon: CreditCard },
    { name: 'AI Advisory', path: '/advisory', icon: Activity },
    { name: 'Targets', path: '/targets', icon: Target }
  ];

  return (
    <div className={`w-[280px] h-screen p-6 flex flex-col justify-between hidden lg:flex border-r transition-colors duration-500 ${isDark ? 'bg-[#080808] border-[#1a1a1a]' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div>
        <div className="mb-14 px-2 flex justify-between items-center">
          <h1 className="text-xl font-medium tracking-wide flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#d4af37] to-[#f9e596] shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center">
                 <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`}></div>
             </div>
             Wealth<span className={isDark ? "text-[#a0a0a0]" : "text-slate-500"}>Intel</span>
          </h1>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-[#d4af37]' : 'bg-slate-100 text-slate-500 hover:text-[#d4af37]'}`}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`group flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-300 border ${
                  isActive 
                  ? (isDark ? 'bg-[#121212] border-[#222] text-white shadow-xl' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-sm') 
                  : (isDark ? 'text-[#6a6a6a] hover:text-[#ddd] hover:bg-[#0c0c0c] border-transparent' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent')
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-[#d4af37]' : (isDark ? 'group-hover:text-white transition-colors' : 'group-hover:text-slate-900 transition-colors')} /> 
                  <span className="text-sm tracking-wide font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className={isDark ? "text-[#444]" : "text-slate-300"} />}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div>
        <div className={`rounded-xl p-4 mb-6 relative overflow-hidden backdrop-blur-md border ${isDark ? 'bg-[#0c0c0c] border-[#1a1a1a]' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#d4af37] to-transparent ${isDark ? 'opacity-50' : 'opacity-100'}`}></div>
            <p className={`text-xs mb-1.5 uppercase tracking-widest font-semibold flex items-center justify-between ${isDark ? 'text-[#666]' : 'text-slate-500'}`}>
              AI Engine 
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            </p>
            <p className={`text-sm font-medium tracking-wide ${isDark ? 'text-[#aaa]' : 'text-slate-700'}`}>Privacy Mode: ON</p>
        </div>

        <button className={`flex items-center gap-4 px-3 py-2 transition-colors w-full group ${isDark ? 'text-[#555] hover:text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}>
          <LogOut size={18} strokeWidth={1.5} /> 
          <span className="text-sm font-medium tracking-wide">Secure Exit</span>
        </button>
      </div>
    </div>
  );
}
