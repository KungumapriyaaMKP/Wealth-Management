import { useState } from 'react';
import { Plus, FolderOpen, Clock, CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockProjects = [
  { id: 1, name: 'Commercial Land construction', description: 'Phase 1 development', budget: 5000000, spent: 1250000, status: 'active', timeline: 'Nov 26 - Present' },
  { id: 2, name: 'Warehouse Renovation', description: 'Internal repairs', budget: 1500000, spent: 1500000, status: 'completed', timeline: 'Completed Oct 15' },
];

export default function Transactions({ isDark }) {
  const [activeTab, setActiveTab] = useState('projects'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Theme Adapters
  const cardBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-slate-200";
  const textMuted = isDark ? "text-[#666]" : "text-slate-500";
  const textBody = isDark ? "text-white" : "text-slate-900";
  const textDim = isDark ? "text-[#888]" : "text-slate-400";

  const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  const formatINRLakhs = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className={`animate-in fade-in duration-700 h-full flex flex-col pb-10 transition-colors`}>
      <header className={`mb-8 flex justify-between items-end border-b pb-6 ${isDark ? 'border-[#111]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-2xl font-semibold tracking-tight mb-2 ${textBody}`}>Transaction Directory</h2>
          <p className={`${textMuted} text-xs tracking-widest uppercase`}>Capital routing & project ledgers</p>
        </div>
        
        <div className="flex bg-[#111] p-1 rounded-lg border border-[#222]">
           <button 
             onClick={() => setActiveTab('ledger')}
             className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors ${activeTab === 'ledger' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-[#888] hover:text-[#ccc]'}`}
           >
             General Ledger
           </button>
           <button 
             onClick={() => setActiveTab('projects')}
             className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 ${activeTab === 'projects' ? 'bg-[#d4af37] text-black shadow-lg' : 'text-[#888] hover:text-[#ccc]'}`}
           >
             <FolderOpen size={14}/> Projects Mode
           </button>
        </div>
      </header>

      {activeTab === 'projects' && (
         <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                 <h3 className={`text-sm tracking-wide font-semibold ${textBody}`}>Your Active Asset Projects</h3>
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
                 >
                    <Plus size={16} /> New Project Allocation
                 </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Visual Project Cards Grid */}
                {mockProjects.map(project => (
                   <div 
                      key={project.id}
                      onClick={() => navigate(`/project/${project.id}`)}
                      className={`${cardBg} rounded-2xl border ${borderColor} p-6 shadow-sm cursor-pointer group hover:-translate-y-1 transition-all ${isDark ? 'hover:border-[#333]' : 'hover:border-slate-300'}`}
                   >
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#111] to-[#000] border border-[#222] flex items-center justify-center group-hover:scale-105 transition-transform">
                             <FolderOpen size={18} className="text-[#d4af37]" />
                         </div>
                         {project.status === 'completed' && <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">Completed</span>}
                      </div>
                      
                      <h4 className={`text-lg font-semibold ${textBody} leading-tight mb-1`}>{project.name}</h4>
                      <p className={`text-xs ${textMuted} mb-6`}>{project.description}</p>
                      
                      {/* Budget Tracker */}
                      <div className="mb-4">
                        <div className="flex justify-between items-end mb-2">
                           <div>
                              <p className={`text-[10px] uppercase tracking-widest ${textMuted} mb-0.5`}>Capital Deployed</p>
                              <span className={`text-lg font-numbers font-medium ${isDark ? 'text-white' : 'text-black'}`}>{formatINRLakhs(project.spent)}</span>
                           </div>
                           <div className="text-right">
                              <p className={`text-[10px] uppercase tracking-widest ${textMuted} mb-0.5`}>Allocated</p>
                              <span className={`text-lg font-numbers font-medium ${textMuted}`}>{formatINRLakhs(project.budget)}</span>
                           </div>
                        </div>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-slate-100 border-slate-200'}`}>
                          <div className={`h-full ${project.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#d4af37] to-[#f9e596]'}`} style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}></div>
                        </div>
                      </div>

                      <div className={`pt-4 border-t ${isDark ? 'border-[#1a1a1a]' : 'border-slate-100'} flex justify-between items-center`}>
                          <span className={`text-xs font-mono tracking-tighter ${textMuted}`}>{project.timeline}</span>
                          <span className={`${isDark ? 'text-[#444] group-hover:text-[#d4af37]' : 'text-slate-300 group-hover:text-[#d4af37]'} transition-colors`}><ArrowRight size={16}/></span>
                      </div>
                   </div>
                ))}
            </div>
         </div>
      )}

      {activeTab === 'ledger' && (
        <div className={`flex-1 ${cardBg} border ${borderColor} rounded-2xl flex items-center justify-center shadow-sm`}>
            <p className={`${textDim} font-medium`}>General Ledger fully synchronized.</p>
        </div>
      )}

      {/* Modern Modal for Project Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-md ${isDark ? 'bg-[#0a0a0a] border border-[#222]' : 'bg-white border-slate-200'} rounded-2xl p-6 shadow-2xl scale-in-center`}>
              <h3 className={`text-xl font-semibold mb-1 ${textBody}`}>Allocate New Project</h3>
              <p className={`text-xs ${textMuted} mb-6`}>Create an isolated ledger for macro expenses.</p>
              
              <div className="space-y-4 mb-8">
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Project Nomenclature</label>
                    <input type="text" placeholder="e.g. Hyderabad Land Wall Construction" className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-slate-900 border border-slate-200 placeholder-slate-400'}`} />
                 </div>
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Budget Allocation (INR)</label>
                    <div className="relative">
                       <IndianRupee size={16} className={`absolute left-4 top-3.5 ${isDark ? 'text-[#555]' : 'text-slate-400'}`} />
                       <input type="number" placeholder="5000000" className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-slate-900 border border-slate-200 placeholder-slate-400'}`} />
                    </div>
                 </div>
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Context / Phase</label>
                    <input type="text" placeholder="Describe the phase..." className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-slate-900 border border-slate-200 placeholder-slate-400'}`} />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setIsModalOpen(false)} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={() => setIsModalOpen(false)} className="flex-[2] py-3 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-colors">Initialize Project</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
