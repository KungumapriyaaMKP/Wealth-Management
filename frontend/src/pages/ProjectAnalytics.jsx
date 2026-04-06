import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, FileText, CheckCircle2, IndianRupee, PieChart, Activity, Trash2, Edit3, UserCircle, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';

const initialTxs = [
  { id: 101, type: 'Expense', recipient: 'Arjun (Carpenter Co.)', purpose: 'Custom Woodwork', amount: 125000, date: '12 Nov 26' },
  { id: 102, type: 'Expense', recipient: 'UltraTech Corp', purpose: 'Raw Materials (Cement/Steel)', amount: 450000, date: '15 Nov 26' },
  { id: 103, type: 'Expense', recipient: 'Studio Design', purpose: 'Architect Fees', amount: 350000, date: '21 Nov 26' },
];

const mockAnalyticsData = [
  { week: 'W1', burned: 125000 },
  { week: 'W2', burned: 575000 },
  { week: 'Current', burned: 925000 },
];

export default function ProjectAnalytics({ isDark }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // CRUD State
  const [transactions, setTransactions] = useState(initialTxs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxId, setEditTxId] = useState(null);
  
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    purpose: '',
    date: 'Today'
  });

  const totalSpent = transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const projectDetails = { name: 'Commercial Land construction', description: 'Phase 1 development', budget: 5000000, spent: totalSpent, status: 'active' };

  const handleSaveExpense = () => {
    if (!formData.recipient || !formData.amount || !formData.purpose) return;

    if (editTxId) {
      // Update
      setTransactions(transactions.map(tx => tx.id === editTxId ? { ...tx, ...formData } : tx));
    } else {
      // Create
      setTransactions([...transactions, { id: Date.now(), type: 'Expense', ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (txId) => {
    setTransactions(transactions.filter(tx => tx.id !== txId));
  };

  const openEditModal = (tx) => {
    setFormData({ recipient: tx.recipient, amount: tx.amount, purpose: tx.purpose, date: tx.date });
    setEditTxId(tx.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ recipient: '', amount: '', purpose: '', date: 'Today' });
    setEditTxId(null);
    setIsModalOpen(false);
  };

  // Adapters
  const bgMain = isDark ? "bg-[#030303]" : "bg-[#f4f4f5]";
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
    <div className={`animate-in fade-in duration-700 min-h-screen flex flex-col pb-10 transition-colors`}>
      <header className="mb-6 flex flex-col gap-4">
        <button onClick={() => navigate('/transactions')} className={`w-fit flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-colors ${isDark ? 'text-[#888] hover:text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}>
           <ArrowLeft size={14} /> Back to Directory
        </button>
        <div className="flex justify-between items-end">
            <div>
              <h2 className={`text-4xl font-semibold tracking-tight ${textBody}`}>{projectDetails.name}</h2>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
            >
              <Plus size={16}/> Record Deduction
            </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
         <div className={`col-span-1 ${cardBg} rounded-xl border ${borderColor} p-4 shadow-sm`}>
            <p className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1 font-semibold`}>Total Allocation</p>
            <p className={`text-2xl font-numbers font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatINRLakhs(projectDetails.budget)}</p>
         </div>
         <div className={`col-span-1 bg-[#120a0a] rounded-xl border ${isDark ? 'border-rose-900/30' : 'bg-rose-50 border-rose-100'} p-4 shadow-sm transition-all duration-500`}>
            <p className={`text-[10px] uppercase tracking-widest text-rose-500/80 mb-1 font-semibold`}>Burned Capital</p>
            <p className="text-2xl font-numbers font-medium text-rose-500">{formatINRLakhs(projectDetails.spent)}</p>
         </div>
         <div className={`col-span-1 ${cardBg} rounded-xl border ${borderColor} p-4 shadow-sm`}>
            <p className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1 font-semibold`}>Remaining Balance</p>
            <p className={`text-2xl font-numbers font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatINRLakhs(projectDetails.budget - projectDetails.spent)}</p>
         </div>
         <div className={`col-span-1 ${isDark ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'} rounded-xl border p-4 flex flex-col justify-center relative overflow-hidden`}>
             <div className="absolute right-[-10%] bottom-[-20%] opacity-10"><PieChart size={80} /></div>
             <p className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-emerald-500/70' : 'text-emerald-600'} mb-1 font-semibold z-10`}>Budget Integrity</p>
             <p className={`text-2xl font-numbers font-medium ${isDark ? 'text-emerald-500' : 'text-emerald-600'} z-10`}>{Math.round((projectDetails.spent / projectDetails.budget) * 100)}%</p>
         </div>
      </div>

      <div className="flex flex-col gap-6 flex-1 w-full">


          {/* Micro Ledgers (Full Width Row Mapped) */}
          <div className={`w-full ${cardBg} rounded-xl border ${borderColor} p-6 shadow-sm flex flex-col`}>
             <div className="flex justify-between items-center mb-6">
                 <h3 className={`text-xs uppercase tracking-[0.2em] font-semibold ${textMuted}`}>Itemized Micro Ledgers</h3>
             </div>
             
             <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className={`text-[10px] uppercase tracking-widest ${textMuted} border-b ${isDark ? 'border-[#222] bg-[#050505]' : 'border-slate-200 bg-slate-50'}`}>
                         <th className="px-6 py-4 font-semibold w-2/5">Recipient / Memo</th>
                         <th className="px-6 py-4 font-semibold w-1/5">Timestamp</th>
                         <th className="px-6 py-4 font-semibold w-1/5 text-right">Deduction</th>
                         <th className="px-6 py-4 font-semibold w-[100px] text-center">Action</th>
                      </tr>
                   </thead>
                   <tbody>
                      {transactions.map((tx) => (
                         <tr key={tx.id} className={`group border-b transition-colors ${isDark ? 'border-[#1a1a1a] hover:bg-[#0f0f0f]' : 'border-slate-100 hover:bg-slate-50'}`}>
                            <td className="px-6 py-4 align-top">
                               <div className="flex flex-col">
                                   <span className={`${isDark ? 'text-white' : 'text-slate-900'} text-sm font-semibold flex items-center gap-2`}>
                                       <UserCircle size={15} className={`${isDark ? 'text-[#888]' : 'text-slate-400'}`}/> {tx.recipient}
                                   </span>
                                   <span className={`${isDark ? 'text-[#888]' : 'text-slate-500'} text-xs mt-1 ml-6`}>
                                       {tx.purpose}
                                   </span>
                               </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                               <span className={`${textMuted} text-[11px] uppercase font-mono flex items-center gap-1.5 mt-0.5`}>
                                 <Clock size={12}/> {tx.date}
                               </span>
                            </td>
                            <td className={`px-6 py-4 align-top text-right font-numbers text-rose-400 font-medium text-[15px] tracking-tight`}>
                               -{formatINR(tx.amount)}
                            </td>
                            <td className="px-6 py-4 align-top">
                               <div className="flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                                  <button onClick={() => openEditModal(tx)} className="text-[#888] hover:text-[#d4af37] transition-colors"><Edit3 size={15}/></button>
                                  <button onClick={() => handleDelete(tx.id)} className="text-[#888] hover:text-rose-500 transition-colors"><Trash2 size={15}/></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                      {transactions.length === 0 && (
                         <tr>
                           <td colSpan="4" className="text-center p-8 text-[#555] text-sm">No deductions recorded yet.</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
      </div>

      {/* CRUD Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-md ${isDark ? 'bg-[#0a0a0a] border border-[#222]' : 'bg-white border-slate-200'} rounded-2xl p-6 shadow-2xl scale-in-center`}>
              <h3 className={`text-xl font-semibold mb-1 ${textBody}`}>{editTxId ? 'Edit Ledger Item' : 'Record Deduction'}</h3>
              <p className={`text-xs ${textMuted} mb-6`}>Log to whom the capital was sent and what for.</p>
              
              <div className="space-y-5 mb-8">
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Recipient / Vendor</label>
                    <div className="relative">
                       <UserCircle size={16} className={`absolute left-4 top-3.5 ${isDark ? 'text-[#555]' : 'text-slate-400'}`} />
                       <input 
                         type="text" 
                         value={formData.recipient}
                         onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                         placeholder="e.g. Arjun (Carpenter Co.)" 
                         className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 ${isDark ? 'bg-[#111] text-white border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-slate-900 border border-slate-200 placeholder-slate-400'}`} 
                       />
                    </div>
                 </div>
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Purpose / Memo</label>
                    <div className="relative">
                       <Target size={16} className={`absolute left-4 top-3.5 ${isDark ? 'text-[#555]' : 'text-slate-400'}`} />
                       <input 
                         type="text" 
                         value={formData.purpose}
                         onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                         placeholder="e.g. Labor Wages, Materials..." 
                         className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-rose-500 ${isDark ? 'bg-[#111] text-white border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-slate-900 border border-slate-200 placeholder-slate-400'}`} 
                       />
                    </div>
                 </div>
                 <div>
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Amount Deducted (INR)</label>
                    <div className="relative">
                       <IndianRupee size={16} className={`absolute left-4 top-3.5 ${isDark ? 'text-[#555]' : 'text-slate-400'}`} />
                       <input 
                         type="number" 
                         value={formData.amount}
                         onChange={(e) => setFormData({...formData, amount: e.target.value})}
                         placeholder="150000" 
                         className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:ring-1 focus:ring-rose-500 ${isDark ? 'bg-[#111] text-rose-500 border border-[#222] placeholder-[#444]' : 'bg-slate-50 text-rose-600 border border-slate-200 placeholder-slate-400'}`} 
                       />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button 
                    onClick={handleSaveExpense} 
                    className={`flex-[2] py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-colors ${formData.recipient && formData.amount && formData.purpose ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20' : 'bg-[#222] cursor-not-allowed opacity-50'}`}
                 >
                   {editTxId ? 'Update Ledger' : 'Confirm Deduction'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
