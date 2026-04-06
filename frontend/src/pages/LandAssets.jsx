import { useState } from 'react';
import { Plus, MapPin, User, Phone, IndianRupee, Edit3, Trash2, Map } from 'lucide-react';

const initialLands = [
  {
    id: 1,
    landName: 'Greenfield Commercial Plot',
    location: 'Kondampatty',
    managerName: 'Arun Kumar',
    managerContact: '+91 98765 43210',
    landWorth: 150000000,
    purchasePrice: 110000000,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
  },
  {
    id: 2,
    landName: 'Riverside Agricultural Estate',
    location: 'Kangeyam',
    managerName: 'Thomas George',
    managerContact: '+91 87654 32109',
    landWorth: 85000000,
    purchasePrice: 45000000,
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80'
  }
];

export default function LandAssets({ isDark }) {
  const [lands, setLands] = useState(initialLands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    landName: '',
    location: '',
    managerName: '',
    managerContact: '',
    landWorth: '',
    purchasePrice: '',
    imageUrl: ''
  });

  const totalWorth = lands.reduce((sum, land) => sum + Number(land.landWorth || 0), 0);

  const handleSave = () => {
    if (!formData.landName || !formData.location || !formData.landWorth) return;

    if (editId) {
      setLands(lands.map(l => l.id === editId ? { ...l, ...formData } : l));
    } else {
      setLands([...lands, { id: Date.now(), ...formData, imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setLands(lands.filter(l => l.id !== id));
  };

  const openEditModal = (land) => {
    setFormData(land);
    setEditId(land.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ landName: '', location: '', managerName: '', managerContact: '', landWorth: '', purchasePrice: '', imageUrl: '' });
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
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
          <h2 className={`text-4xl font-semibold tracking-tight ${textBody} mb-2`}>Land Assets</h2>
          <p className={`text-sm ${textMuted} flex items-center gap-2`}><Map size={16}/> Total Valuation: <span className="font-numbers font-semibold text-[#d4af37]">{formatINRLakhs(totalWorth)}</span></p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-6 py-3 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Register Land Asset
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lands.map((land) => (
          <div key={land.id} className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden group hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm relative`}>
            {/* Image Section */}
            <div className="h-48 w-full relative overflow-hidden bg-[#111]">
              <img src={land.imageUrl} alt={land.landName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-emerald-400 font-numbers font-semibold border border-white/10 shadow-lg">
                {formatINRLakhs(land.landWorth)}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-4 left-5 text-white font-semibold text-lg max-w-[80%] leading-tight">{land.landName}</h3>
            </div>

            {/* Details Section */}
            <div className="p-5">
               <div className="flex items-center gap-2 text-sm text-[#888] mb-4">
                  <MapPin size={14} className="text-[#d4af37] text-opacity-80"/> {land.location}
               </div>

               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1">Acquired For</p>
                     <p className={`text-sm font-numbers font-medium ${isDark ? 'text-[#ddd]' : 'text-slate-800'}`}>{formatINRLakhs(land.purchasePrice || 0)}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1">Value Growth</p>
                     <p className={`text-sm font-numbers font-semibold ${land.landWorth >= land.purchasePrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {land.purchasePrice ? `${land.landWorth >= land.purchasePrice ? '+' : ''}${Math.round(((land.landWorth - land.purchasePrice) / land.purchasePrice) * 100)}%` : '---'}
                     </p>
                  </div>
               </div>
               
               <div className={`p-4 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} space-y-3`}>
                  <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666]">Managed By</p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <User size={14} className={textMuted}/>
                        <span className={`text-sm font-medium ${isDark ? 'text-[#ddd]' : 'text-slate-800'}`}>{land.managerName}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Phone size={14} className={textMuted}/>
                      <span className={`text-sm ${textMuted} font-numbers`}>{land.managerContact}</span>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-[#1a1a1a]">
                  <button onClick={() => openEditModal(land)} className="p-2 text-[#666] hover:text-[#d4af37] transition-colors bg-[#111] hover:bg-[#1a1a1a] rounded-lg"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(land.id)} className="p-2 text-[#666] hover:text-rose-500 transition-colors bg-[#111] hover:bg-rose-950/30 rounded-lg"><Trash2 size={16}/></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {lands.length === 0 && (
         <div className="w-full text-center py-20 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-[#555] mt-6">
            No land assets registered yet.
         </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-lg ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <h3 className={`text-xl font-semibold mb-2 ${textBody}`}>{editId ? 'Update Land Asset' : 'Register Land Asset'}</h3>
              <p className={`text-xs ${textMuted} mb-6`}>Enter the topographical and managerial details of the land.</p>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Land Name / Title</label>
                    <input type="text" value={formData.landName} onChange={(e) => setFormData({...formData, landName: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Geographic Location</label>
                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Manager Name</label>
                    <input type="text" value={formData.managerName} onChange={(e) => setFormData({...formData, managerName: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Contact Number</label>
                    <input type="text" value={formData.managerContact} onChange={(e) => setFormData({...formData, managerContact: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Purchased For (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Current Valuation (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.landWorth} onChange={(e) => setFormData({...formData, landWorth: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-emerald-400 border border-[#222]' : 'bg-slate-50 text-emerald-600 border-slate-200'}`} />
                    </div>
                 </div>
                 <div className="col-span-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Upload Land Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload} 
                      className={`w-full px-2 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#d4af37] file:text-black hover:file:bg-[#f9e596] rounded-lg text-xs font-medium focus:outline-none ${isDark ? 'bg-[#111] text-[#888] border border-[#222]' : 'bg-slate-50 text-slate-500 border border-slate-200'} cursor-pointer`} 
                    />
                    {formData.imageUrl && (
                      <div className="mt-2 text-[10px] font-semibold text-emerald-500 tracking-wider">✓ Image attached successfully</div>
                    )}
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleSave} className="flex-[2] py-3 rounded-lg text-sm font-semibold text-black bg-[#d4af37] hover:bg-[#f9e596] shadow-lg shadow-[#d4af37]/20 transition-all">
                   {editId ? 'Verify & Update' : 'Confirm Registration'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
