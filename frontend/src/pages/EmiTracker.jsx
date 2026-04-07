import { useState, useEffect } from 'react';
import { Plus, CreditCard, Landmark, Percent, IndianRupee, Edit3, Trash2, CalendarCheck, CalendarDays, Check } from 'lucide-react';

const initialLoans = [
  {
    id: 1,
    lender: 'HDFC Home Loans',
    loanType: 'Property Mortgage',
    principal: 15000000,
    interestRate: 8.4,
    monthlyEmi: 129000,
    tenureMonths: 240,
    monthsPaid: 45,
    status: 'Active'
  },
  {
    id: 2,
    lender: 'Axis Bank',
    loanType: 'Vehicle Loan',
    principal: 2500000,
    interestRate: 9.5,
    monthlyEmi: 53000,
    tenureMonths: 60,
    monthsPaid: 12,
    status: 'Active'
  }
];

export default function EmiTracker({ isDark }) {
  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem('wealth_loans');
    return saved ? JSON.parse(saved) : initialLoans;
  });

  useEffect(() => {
    localStorage.setItem('wealth_loans', JSON.stringify(loans));
  }, [loans]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    lender: '',
    loanType: 'Home Loan',
    principal: '',
    interestRate: '',
    monthlyEmi: '',
    tenureMonths: '',
    monthsPaid: '',
    status: 'Active'
  });

  const totalMonthlyOutflow = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + Number(l.monthlyEmi || 0), 0);
  const totalDebtOutstanding = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + Number(l.principal || 0), 0);

  const handleEMIIncrement = (id) => {
    setLoans(loans.map(loan => {
      if (loan.id === id) {
        const currentPaid = Number(loan.monthsPaid) || 0;
        const maxMonths = Number(loan.tenureMonths) || 0;
        if (currentPaid < maxMonths) {
           return { ...loan, monthsPaid: currentPaid + 1, status: currentPaid + 1 >= maxMonths ? 'Closed / Paid Off' : loan.status };
        }
      }
      return loan;
    }));
  };

  const handleSave = () => {
    if (!formData.lender || !formData.principal || !formData.monthlyEmi) return;

    if (editId) {
      setLoans(loans.map(l => l.id === editId ? { ...l, ...formData } : l));
    } else {
      setLoans([...loans, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => setLoans(loans.filter(l => l.id !== id));

  const openEditModal = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ lender: '', loanType: 'Home Loan', principal: '', interestRate: '', monthlyEmi: '', tenureMonths: '', monthsPaid: '', status: 'Active' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const formatINRLakhs = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${Number(value).toLocaleString('en-IN')}`;
  };

  const textBody = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-[#888]" : "text-slate-500";
  const cardBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-slate-200";

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col pb-10">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className={`text-4xl font-semibold tracking-tight ${textBody} mb-2`}>EMI & Liabilities</h2>
          <p className={`text-sm ${textMuted} flex items-center gap-4`}>
             <span className="flex items-center gap-1.5"><CreditCard size={16}/> Active Debt: <span className="font-numbers font-semibold text-rose-500">{formatINRLakhs(totalDebtOutstanding)}</span></span>
             <span className="text-[#333]">|</span>
             <span className="font-numbers font-semibold text-orange-400 flex items-center gap-1">
                 Total Monthly Outflow: {formatINRLakhs(totalMonthlyOutflow)} / mo
             </span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-6 py-3 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Record EMI Line
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map((loan) => {
          const progressPercent = Math.min(100, (Number(loan.monthsPaid) / Number(loan.tenureMonths)) * 100) || 0;
          
          return (
          <div key={loan.id} className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden group hover:border-rose-900/50 transition-all duration-300 shadow-sm relative flex flex-col`}>
            {/* Top Header Block */}
            <div className={`p-5 ${isDark ? 'bg-[#0f0a0a] border-b border-[#221010]' : 'bg-rose-50 border-b border-rose-100'} flex justify-between items-center relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full ${loan.status === 'Active' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                <div className="flex flex-col ml-1 relative z-10">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-rose-400/80' : 'text-rose-600'} mb-1`}>{loan.loanType}</span>
                    <h3 className={`text-xl font-semibold tracking-tight ${textBody}`}>{loan.lender}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${loan.status === 'Active' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                    {loan.status}
                </div>
            </div>

            {/* Metrics Block */}
            <div className="p-5 flex-1 flex flex-col">
               
               <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1">Principal Base</p>
                     <p className={`text-lg font-numbers font-semibold ${isDark ? 'text-[#ddd]' : 'text-slate-800'}`}>{formatINRLakhs(loan.principal)}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1 flex items-center gap-1 text-rose-500">Monthly EMI Hit</p>
                     <p className={`text-lg font-numbers font-semibold text-rose-500`}>
                        {formatINRLakhs(loan.monthlyEmi)}
                     </p>
                  </div>
               </div>
               
               <div className={`p-4 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col gap-4 mb-4`}>
                   
                   <div className="flex items-center justify-between">
                       <div>
                           <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666] flex items-center gap-1.5"><Percent size={12}/> Interest Rate</p>
                           <p className={`text-xs font-semibold font-numbers mt-1 ${isDark ? 'text-[#aaa]' : 'text-slate-700'}`}>{loan.interestRate}% <span className="text-[9px] text-[#555] font-sans">p.a.</span></p>
                       </div>
                       <div className="text-right">
                           <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666] flex items-center justify-end gap-1.5"><CalendarDays size={12}/> Term Length</p>
                           <p className={`text-xs font-semibold font-numbers mt-1 ${isDark ? 'text-[#aaa]' : 'text-slate-700'}`}>{loan.tenureMonths} <span className="text-[9px] text-[#555] font-sans">Months</span></p>
                       </div>
                   </div>

                   {/* Progress Tracker */}
                   <div>
                       <div className="flex justify-between items-center mb-2">
                           <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] flex items-center gap-1.5"><CalendarCheck size={12}/> Amortization Status</p>
                           <p className="text-[10px] font-numbers text-[#d4af37] font-semibold">{loan.monthsPaid} / {loan.tenureMonths} <span className="text-[9px] text-[#555] font-sans">Paid</span></p>
                       </div>
                       <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-[#222]' : 'bg-slate-200'} overflow-hidden`}>
                           <div className="h-full bg-gradient-to-r from-orange-400 to-[#d4af37] transition-all duration-1000 relative" style={{ width: `${progressPercent}%` }}>
                               {progressPercent >= 100 && <div className="absolute inset-0 bg-emerald-500"></div>}
                           </div>
                       </div>
                       
                       {/* Quick Pay Action Checkbox */}
                       <div className={`mt-4 flex justify-between items-center ${isDark ? 'bg-[#0f0f0f] border-[#222]' : 'bg-slate-100 border-slate-200'} border px-3 py-2 rounded-lg`}>
                           <span className={`text-[9px] uppercase font-semibold tracking-wider ${isDark ? 'text-[#777]' : 'text-slate-500'}`}>Log Current Month EMI</span>
                           
                           <button 
                             onClick={() => handleEMIIncrement(loan.id)}
                             disabled={loan.monthsPaid >= loan.tenureMonths}
                             className={`w-6 h-6 rounded flex items-center justify-center border transition-all duration-300 transform active:scale-95 ${
                                loan.monthsPaid >= loan.tenureMonths 
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500 cursor-not-allowed' 
                                : `border-[#d4af37] ${isDark ? 'bg-[#111]' : 'bg-white'} hover:bg-[#d4af37]/20 text-[#d4af37] cursor-pointer shadow-[0_0_8px_rgba(212,175,55,0.2)]`
                             }`}
                           >
                              <Check size={14} className={loan.monthsPaid >= loan.tenureMonths ? 'opacity-100' : 'opacity-0 hover:opacity-100'} />
                           </button>
                       </div>
                   </div>

               </div>

               {/* Actions */}
               <div className="flex justify-end gap-3 mt-auto pt-2">
                  <button onClick={() => openEditModal(loan)} className="p-2 text-[#666] hover:text-[#d4af37] transition-colors bg-[#111] hover:bg-[#1a1a1a] rounded-lg"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(loan.id)} className="p-2 text-[#666] hover:text-rose-500 transition-colors bg-[#111] hover:bg-rose-950/30 rounded-lg"><Trash2 size={16}/></button>
               </div>
            </div>
          </div>
        )})}
      </div>

      {loans.length === 0 && (
         <div className="w-full text-center py-20 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-[#555] mt-6">
            Zero active liabilities detected mapped.
         </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-xl ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <h3 className={`text-xl font-semibold mb-2 ${textBody}`}>{editId ? 'Modify Loan Structure' : 'Record Liability Stream (EMI)'}</h3>
              <p className={`text-[11px] ${textMuted} mb-6 tracking-wide`}>Accurately track your monthly debt drains and amortization schedule.</p>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}><Landmark size={10} className="inline mr-1"/> Lending Institution</label>
                    <input type="text" placeholder="e.g. SBI, HDFC, Bajaj Finance" value={formData.lender} onChange={(e) => setFormData({...formData, lender: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Liability Class</label>
                    <select value={formData.loanType} onChange={(e) => setFormData({...formData, loanType: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`}>
                         <option>Home/Property Mortgage</option>
                         <option>Vehicle Loan</option>
                         <option>Personal Debt</option>
                         <option>Business Credit Line</option>
                         <option>Student Loan</option>
                    </select>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Current Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-emerald-500 ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`}>
                         <option>Active</option>
                         <option>Closed / Paid Off</option>
                    </select>
                 </div>

                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Original Principal Size (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.principal} onChange={(e) => setFormData({...formData, principal: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-rose-500 ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Monthly EMI Debit (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 text-rose-500/50`}/>
                       <input type="number" value={formData.monthlyEmi} onChange={(e) => setFormData({...formData, monthlyEmi: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-rose-500 ${isDark ? 'bg-[#111] text-rose-400 border border-[#222]' : 'bg-slate-50 text-rose-600 border-slate-200'}`} />
                    </div>
                 </div>

                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Rate of Interest (%)</label>
                    <div className="relative">
                       <Percent size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" step="0.1" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-orange-500 ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>
                 
                 <div className="col-span-1 grid grid-cols-2 gap-3">
                    <div>
                       <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold text-center`}>Tenure</label>
                       <input type="number" placeholder="Months" value={formData.tenureMonths} onChange={(e) => setFormData({...formData, tenureMonths: e.target.value})} className={`w-full px-3 py-3 rounded-lg text-sm text-center font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    <div>
                       <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold text-center`}>Paid</label>
                       <input type="number" placeholder="Months" value={formData.monthsPaid} onChange={(e) => setFormData({...formData, monthsPaid: e.target.value})} className={`w-full px-3 py-3 rounded-lg text-sm text-center font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-[#d4af37] border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                 </div>

              </div>

              <div className="flex gap-3 mt-4">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleSave} className="flex-[2] py-3 rounded-lg text-sm font-semibold text-black bg-[#d4af37] hover:bg-[#f9e596] shadow-lg shadow-[#d4af37]/20 transition-all">
                   {editId ? 'Verify & Commit Adjustments' : 'Log Debt Profile'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
