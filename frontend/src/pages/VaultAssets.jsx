import { useState, useEffect } from 'react';
import { Plus, Diamond, Archive, IndianRupee, Edit3, Trash2, Tag, TrendingUp, TrendingDown } from 'lucide-react';

const initialVault = [
  {
    id: 1,
    assetName: '24K Solid Gold Bullion',
    materialType: 'Gold',
    weight: '2 Kg',
    storageLoc: 'HDFC Bank Locker 104',
    purchasePrice: 12000000,
    currentValue: 15500000,
    imageUrl: ''
  },
  {
    id: 2,
    assetName: 'Heirloom Diamond Necklace',
    materialType: 'Diamond',
    weight: '15 Carats',
    storageLoc: 'Home Master Safe',
    purchasePrice: 4500000,
    currentValue: 4700000,
    imageUrl: ''
  }
];

export default function VaultAssets({ isDark }) {
  const [vault, setVault] = useState(initialVault);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    assetName: '',
    materialType: 'Gold',
    weight: '',
    storageLoc: '',
    purchasePrice: '',
    currentValue: '',
    imageUrl: ''
  });

  const [marketRates, setMarketRates] = useState(null);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/market');
        const data = await res.json();
        setMarketRates(data);
      } catch (err) {
        console.log('Using default market fallback (API offline)');
        setMarketRates({
            gold: { current_price: 7250, change_percent: 0.15 },
            silver: { current_price: 86.20, change_percent: -0.2 }
        });
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000); // 1-minute ticker
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
  };

  const totalVaultValue = vault.reduce((sum, v) => sum + Number(v.currentValue || 0), 0);
  const totalInvested = vault.reduce((sum, v) => sum + Number(v.purchasePrice || 0), 0);
  const netROI = ((totalVaultValue - totalInvested) / totalInvested) * 100;

  const handleSave = () => {
    if (!formData.assetName || !formData.purchasePrice || !formData.currentValue) return;

    if (editId) {
      setVault(vault.map(v => v.id === editId ? { ...v, ...formData } : v));
    } else {
      setVault([...vault, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => setVault(vault.filter(v => v.id !== id));

  const openEditModal = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ assetName: '', materialType: 'Gold', weight: '', storageLoc: '', purchasePrice: '', currentValue: '', imageUrl: '' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const formatINRLakhs = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const textBody = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-[#888]" : "text-slate-500";
  const cardBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-slate-200";

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col pb-10">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className={`text-4xl font-semibold tracking-tight ${textBody} mb-2`}>Vault & Metals</h2>
          <p className={`text-sm ${textMuted} flex items-center gap-3`}>
             <span className="flex items-center gap-1.5"><Archive size={16}/> Vault Equity: <span className="font-numbers font-semibold text-[#d4af37]">{formatINRLakhs(totalVaultValue)}</span></span>
             |
             <span className={`font-numbers font-semibold ${netROI >= 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                 {netROI >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {Math.abs(netROI).toFixed(1)}% Net Growth
             </span>
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-6 py-3 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Add Commodity
        </button>
      </header>

      {/* Live Market Ticker */}
      {marketRates && (
         <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            {/* Gold Ticker Card */}
            <div className={`p-6 rounded-2xl border ${borderColor} ${cardBg} shadow-md relative overflow-hidden flex justify-between items-center group hover:border-[#d4af37]/40 transition-all`}>
               <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${isDark ? 'from-yellow-400 to-yellow-600' : 'from-yellow-300 to-yellow-500'}`}></div>
               <div className="flex flex-col ml-3">
                   <div className="flex items-center gap-2 mb-2">
                       <span className={`text-xs font-semibold ${isDark ? 'text-yellow-500' : 'text-yellow-600'} uppercase tracking-widest flex items-center gap-1.5`}><Diamond size={13}/> GOLD (1g)</span>
                   </div>
                   <span className={`text-3xl font-numbers font-semibold ${textBody} tracking-tight`}>₹{marketRates.gold.current_price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
               </div>
               <div className={`flex flex-col items-end`}>
                   <div className="flex items-center gap-1.5 mb-2 opacity-80 backdrop-blur-md">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                       <span className="text-[9px] uppercase tracking-widest text-[#888] font-bold">Live Spot</span>
                   </div>
                   <span className={`text-sm font-semibold ${marketRates.gold.change_percent >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'} font-numbers px-2.5 py-1 rounded-md border flex items-center gap-1 shadow-sm`}>
                      {marketRates.gold.change_percent >= 0 ? '▲' : '▼'} {Math.abs(marketRates.gold.change_percent)}%
                   </span>
               </div>
            </div>

            {/* Silver Ticker Card */}
            <div className={`p-6 rounded-2xl border ${borderColor} ${cardBg} shadow-md relative overflow-hidden flex justify-between items-center group hover:border-slate-400/40 transition-all`}>
               <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${isDark ? 'from-slate-300 to-slate-500' : 'from-slate-200 to-slate-400'}`}></div>
               <div className="flex flex-col ml-3">
                   <div className="flex items-center gap-2 mb-2">
                       <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-500'} uppercase tracking-widest flex items-center gap-1.5`}><Archive size={13}/> SILVER (1g)</span>
                   </div>
                   <span className={`text-3xl font-numbers font-semibold ${textBody} tracking-tight`}>₹{marketRates.silver.current_price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
               </div>
               <div className={`flex flex-col items-end`}>
                   <div className="flex items-center gap-1.5 mb-2 opacity-80 backdrop-blur-md">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                       <span className="text-[9px] uppercase tracking-widest text-[#888] font-bold">Live Spot</span>
                   </div>
                   <span className={`text-sm font-semibold ${marketRates.silver.change_percent >= 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'} font-numbers px-2.5 py-1 rounded-md border flex items-center gap-1 shadow-sm`}>
                      {marketRates.silver.change_percent >= 0 ? '▲' : '▼'} {Math.abs(marketRates.silver.change_percent)}%
                   </span>
               </div>
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vault.map((v) => (
          <div key={v.id} className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden group hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm relative flex flex-col`}>
            {/* Image Section */}
            <div className="h-40 w-full relative overflow-hidden bg-[#111] flex items-center justify-center">
              {v.imageUrl ? (
                <img src={v.imageUrl} alt={v.assetName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] flex flex-col items-center justify-center opacity-70">
                   <Diamond size={42} className="text-[#333] mb-2" />
                   <span className="text-[10px] tracking-widest uppercase text-[#555] font-semibold">Image Missing</span>
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white font-semibold text-xs border border-white/10 shadow-lg flex items-center gap-1.5 uppercase tracking-widest z-10">
                <Tag size={12} className={v.materialType === 'Gold' ? 'text-yellow-500' : v.materialType === 'Silver' ? 'text-slate-300' : 'text-cyan-300'}/> {v.materialType}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-4 left-5 text-white font-semibold text-lg leading-tight tracking-wide z-10 w-[80%] truncate">{v.assetName}</h3>
            </div>

            {/* Details Section */}
            <div className="p-5 flex-1 flex flex-col">
               
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1">Acquired For</p>
                     <p className={`text-[15px] font-numbers font-medium ${isDark ? 'text-[#ddd]' : 'text-slate-800'}`}>{formatINRLakhs(v.purchasePrice)}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1 flex items-center gap-1">Est. Value</p>
                     <p className={`text-[15px] font-numbers font-semibold ${v.currentValue >= v.purchasePrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatINRLakhs(v.currentValue)}
                     </p>
                  </div>
               </div>
               
               <div className={`p-4 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex items-center justify-between`}>
                   <div className="flex flex-col gap-3">
                       <div>
                           <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666] flex items-center gap-1.5"><Archive size={12}/> Secure Storage Location</p>
                           <p className={`text-xs font-medium mt-1 ${isDark ? 'text-[#aaa]' : 'text-slate-700'}`}>{v.storageLoc || 'Not Specified'}</p>
                       </div>
                       <div>
                           <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666]">Net Weight / Carat</p>
                           <p className={`text-xs font-medium mt-1 ${isDark ? 'text-white' : 'text-black'}`}>{v.weight || 'N/A'}</p>
                       </div>
                   </div>
               </div>

               {/* Actions */}
               <div className="flex justify-end gap-3 mt-auto pt-5">
                  <button onClick={() => openEditModal(v)} className="p-2 text-[#666] hover:text-[#d4af37] transition-colors bg-[#111] hover:bg-[#1a1a1a] rounded-lg"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 text-[#666] hover:text-rose-500 transition-colors bg-[#111] hover:bg-rose-950/30 rounded-lg"><Trash2 size={16}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {vault.length === 0 && (
         <div className="w-full text-center py-20 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-[#555] mt-6">
            No commodities registered yet.
         </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-lg ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <h3 className={`text-xl font-semibold mb-2 ${textBody}`}>{editId ? 'Update Asset Info' : 'Secure Vault Asset'}</h3>
              <p className={`text-[11px] ${textMuted} mb-6 tracking-wide`}>Enter metrics for precious metals or high-value commodities.</p>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Commodity Title</label>
                    <input type="text" placeholder="e.g. 24K Gold Bar, Swiss Rolex" value={formData.assetName} onChange={(e) => setFormData({...formData, assetName: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Material Class</label>
                    <select value={formData.materialType} onChange={(e) => setFormData({...formData, materialType: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`}>
                         <option>Gold</option>
                         <option>Silver</option>
                         <option>Diamond</option>
                         <option>Platinum</option>
                         <option>Watch / Timepiece</option>
                         <option>Other Luxury</option>
                    </select>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Weight / Quantity</label>
                    <input type="text" placeholder="e.g. 500g, 2.5 Carat" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Secure Storage Location</label>
                    <input type="text" placeholder="e.g. HDFC Fort Safebox" value={formData.storageLoc} onChange={(e) => setFormData({...formData, storageLoc: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>

                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Acquired For (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Current Valuation (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.currentValue} onChange={(e) => setFormData({...formData, currentValue: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-emerald-400 border border-[#222]' : 'bg-slate-50 text-emerald-600 border-slate-200'}`} />
                    </div>
                 </div>

                 <div className="col-span-2 pt-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Upload Visual Evidence</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      className={`w-full px-2 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-black hover:file:bg-[#f9e596] rounded-lg text-xs font-medium focus:outline-none ${isDark ? 'bg-[#111] text-[#888] border border-[#222]' : 'bg-slate-50 text-slate-500 border border-slate-200'} cursor-pointer`} 
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 text-[10px] font-semibold text-emerald-500 tracking-wider">✓ High-res Image cached successfully</div>
                    )}
                 </div>

              </div>

              <div className="flex gap-3">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleSave} className="flex-[2] py-3 rounded-lg text-sm font-semibold text-black bg-[#d4af37] hover:bg-[#f9e596] shadow-lg shadow-[#d4af37]/20 transition-all">
                   {editId ? 'Verify & Update' : 'Lock in Vault'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
