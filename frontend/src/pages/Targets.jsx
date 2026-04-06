import { useState } from 'react';
import { Plus, Target, PiggyBank, Calendar, IndianRupee, Edit3, Trash2, TrendingUp, PartyPopper } from 'lucide-react';

const initialTargets = [
  {
    id: 1,
    title: 'Buy Commercial Land',
    category: 'Real Estate',
    targetAmount: 10000000,
    savedAmount: 4500000,
    deadline: 'Dec 2026',
    imageUrl: ''
  },
  {
    id: 2,
    title: "Daughter's College Fund",
    category: 'Education',
    targetAmount: 2500000,
    savedAmount: 800000,
    deadline: 'Aug 2028',
    imageUrl: ''
  }
];

export default function Targets({ isDark }) {
  const [targets, setTargets] = useState(initialTargets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Real Estate',
    targetAmount: '',
    savedAmount: '',
    deadline: '',
    imageUrl: ''
  });

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [activeTargetId, setActiveTargetId] = useState(null);

  const totalGoalsValuation = targets.reduce((sum, t) => sum + Number(t.targetAmount || 0), 0);
  const totalSaved = targets.reduce((sum, t) => sum + Number(t.savedAmount || 0), 0);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
  };

  const handleSave = () => {
    if (!formData.title || !formData.targetAmount) return;

    if (editId) {
      setTargets(targets.map(t => t.id === editId ? { ...t, ...formData } : t));
    } else {
      setTargets([...targets, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleDeposit = () => {
    if (!depositAmount || !activeTargetId) return;
    setTargets(targets.map(t => {
       if (t.id === activeTargetId) {
          const newSaved = Number(t.savedAmount) + Number(depositAmount);
          return { ...t, savedAmount: newSaved > t.targetAmount ? t.targetAmount : newSaved };
       }
       return t;
    }));
    setDepositModalOpen(false);
    setDepositAmount('');
  };

  const openDepositModal = (id) => {
     setActiveTargetId(id);
     setDepositModalOpen(true);
  };

  const handleDelete = (id) => setTargets(targets.filter(t => t.id !== id));

  const openEditModal = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ title: '', category: 'Real Estate', targetAmount: '', savedAmount: '', deadline: '', imageUrl: '' });
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
          <h2 className={`text-4xl font-semibold tracking-tight ${textBody} mb-2`}>Financial Targets</h2>
          <p className={`text-sm ${textMuted} flex items-center gap-4`}>
             <span className="flex items-center gap-1.5"><PiggyBank size={16}/> Total Stashed For Goals: <span className="font-numbers font-semibold text-emerald-500">{formatINRLakhs(totalSaved)}</span></span>
             <span className="text-[#333]">|</span>
             <span className="font-numbers font-semibold text-[#d4af37] flex items-center gap-1">
                 Total Targets Size: {formatINRLakhs(totalGoalsValuation)}
             </span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-6 py-3 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Create a New Goal
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((t) => {
          const progressPercent = Math.min(100, (Number(t.savedAmount) / Number(t.targetAmount)) * 100) || 0;
          const isComplete = progressPercent >= 100;

          return (
          <div key={t.id} className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300 shadow-sm relative flex flex-col`}>
            
            {/* Visual Header Block */}
            <div className="h-32 w-full relative overflow-hidden bg-[#111] flex items-center justify-center">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.title} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 ${isComplete ? 'grayscale-0' : 'grayscale-[40%]'}`} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] flex flex-col items-center justify-center opacity-70">
                   <Target size={36} className="text-[#333] mb-2" />
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white font-semibold text-[10px] border border-white/10 shadow-lg flex items-center gap-1.5 uppercase tracking-widest z-10">
                {t.category}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <h3 className="absolute bottom-3 left-4 text-white font-semibold text-xl leading-tight tracking-wide z-10 w-[90%] truncate pr-2">{t.title}</h3>
            </div>

            {/* Metrics Block */}
            <div className="p-5 flex-1 flex flex-col">
               
               <div className="flex justify-between items-center mb-4">
                  <div>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-[#666] mb-0.5">Target Amount</p>
                      <p className={`text-lg font-numbers font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatINRLakhs(t.targetAmount)}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                      <p className="text-[9px] uppercase font-bold tracking-widest text-[#666] mb-0.5 flex items-center gap-1"><Calendar size={10}/> Deadline</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white bg-[#111]' : 'text-slate-900 bg-slate-100'} px-2 py-0.5 rounded border ${borderColor}`}>{t.deadline || 'No Set Date'}</p>
                  </div>
               </div>
               
               <div className={`p-4 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col gap-3 mb-4`}>
                   
                   {/* Progress Tracker */}
                   <div>
                       <div className="flex justify-between items-center mb-2">
                           <p className="text-[9px] uppercase font-bold tracking-widest text-[#666] flex items-center gap-1.5">
                             <PiggyBank size={12}/> Current Savings
                           </p>
                           <p className={`text-[11px] font-numbers font-semibold ${isComplete ? 'text-emerald-500' : 'text-[#d4af37]'}`}>
                             {formatINRLakhs(t.savedAmount)} 
                             <span className="text-[9px] text-[#555] font-sans ml-1">({progressPercent.toFixed(1)}%)</span>
                           </p>
                       </div>
                       <div className={`w-full h-2 rounded-full ${isDark ? 'bg-[#222]' : 'bg-slate-200'} overflow-hidden shadow-inner`}>
                           <div className={`h-full transition-all duration-1000 relative ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-yellow-500 to-[#d4af37]'}`} style={{ width: `${progressPercent}%` }}>
                           </div>
                       </div>
                   </div>

               </div>

               {/* Quick Deposit Action */}
               <div className="mt-auto">
                   {!isComplete ? (
                     <button onClick={() => openDepositModal(t.id)} className={`w-full py-2.5 rounded-lg border border-dashed ${isDark ? 'border-[#333] hover:border-[#d4af37] text-[#888] hover:text-[#d4af37] hover:bg-[#d4af37]/5' : 'border-slate-300 hover:border-yellow-600 text-slate-500 hover:text-yellow-700 hover:bg-yellow-50'} flex justify-center items-center gap-2 text-xs font-semibold tracking-wide transition-all`}>
                        <TrendingUp size={14}/> Deposit Funds to Goal
                     </button>
                   ) : (
                     <div className={`w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-widest`}>
                        <PartyPopper size={14}/> Goal Achieved!
                     </div>
                   )}
               </div>

               {/* Actions */}
               <div className="flex justify-end gap-3 pt-4 border-t mt-4 border-slate-200/10">
                  <button onClick={() => openEditModal(t)} className="text-[#666] hover:text-[#d4af37] transition-colors"><Edit3 size={14}/></button>
                  <button onClick={() => handleDelete(t.id)} className="text-[#666] hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
               </div>
            </div>
          </div>
        )})}
      </div>

      {targets.length === 0 && (
         <div className="w-full text-center py-20 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-[#555] mt-6">
            You haven't set any financial goals yet. Dream big and add one!
         </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-lg ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <h3 className={`text-xl font-semibold mb-2 ${textBody}`}>{editId ? 'Modify Goal' : 'Create a Savings Goal'}</h3>
              <p className={`text-xs ${textMuted} mb-6 tracking-wide`}>Set a target amount and track your progress natively.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>What are you saving for?</label>
                    <input type="text" placeholder="e.g. Dream House, European Vacation" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>Goal Type</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`}>
                         <option>Real Estate</option>
                         <option>Vehicle</option>
                         <option>Education</option>
                         <option>Retirement</option>
                         <option>Travel / Experience</option>
                         <option>Emergency Fund</option>
                         <option>Other Goal</option>
                    </select>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>When do you need it?</label>
                    <input type="text" placeholder="e.g. Dec 2026, In 2 Years" value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>

                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>Total Money Needed (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>How much is saved already?</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.savedAmount} onChange={(e) => setFormData({...formData, savedAmount: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-emerald-500 ${isDark ? 'bg-[#111] text-emerald-400 border border-[#222]' : 'bg-slate-50 text-emerald-600 border-slate-200'}`} />
                    </div>
                 </div>
                 
                 <div className="col-span-2 pt-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-bold`}>Upload Vision Board Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      className={`w-full px-2 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#d4af37] file:text-black hover:file:bg-[#f9e596] rounded-lg text-xs font-medium focus:outline-none ${isDark ? 'bg-[#111] text-[#888] border border-[#222]' : 'bg-slate-50 text-slate-500 border border-slate-200'} cursor-pointer`} 
                    />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleSave} className="flex-[2] py-3 rounded-lg text-sm font-semibold text-black bg-[#d4af37] hover:bg-[#f9e596] shadow-lg shadow-[#d4af37]/20 transition-all">
                   {editId ? 'Update Target Status' : 'Set Financial Target'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Quick Deposit Modal */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in duration-200">
           <div className={`w-full max-w-sm ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto`}>
              <h3 className={`text-lg font-semibold mb-2 ${textBody}`}>Deposit to Goal Engine</h3>
              <p className={`text-xs ${textMuted} mb-6 tracking-wide`}>Add new funds you've saved toward this specific target.</p>
              
              <div className="mb-6">
                 <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-2 block font-bold`}>Deposit Amount (INR)</label>
                 <div className="relative">
                    <IndianRupee size={20} className={`absolute left-4 top-4 ${textMuted}`}/>
                    <input type="number" placeholder="Enter amount..." autoFocus value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className={`w-full pl-12 pr-4 py-4 rounded-xl text-xl font-numbers focus:outline-none focus:border-emerald-500 ${isDark ? 'bg-[#111] text-emerald-400 border border-[#222]' : 'bg-slate-50 text-emerald-600 border-slate-200'}`} />
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={() => setDepositModalOpen(false)} className={`py-3 px-5 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleDeposit} disabled={!depositAmount} className="flex-1 py-3 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                   Confirm Deposit
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
