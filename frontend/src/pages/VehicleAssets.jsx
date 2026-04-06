import { useState } from 'react';
import { Plus, CarFront, ShieldCheck, GaugeCircle, IndianRupee, Edit3, Trash2, Tag, TrendingDown } from 'lucide-react';

const initialVehicles = [
  {
    id: 1,
    brand: 'Porsche',
    model: '911 GT3',
    type: 'Sports Car',
    purchasePrice: 25000000,
    insuranceAttached: true,
    imageUrl: ''
  },
  {
    id: 2,
    brand: 'Land Rover',
    model: 'Range Rover Autobiography',
    type: 'SUV',
    purchasePrice: 32000000,
    insuranceAttached: true,
    imageUrl: ''
  }
];

export default function VehicleAssets({ isDark }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: 'Sedan',
    purchasePrice: '',
    insuranceAttached: false,
    imageUrl: ''
  });

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, insuranceAttached: true });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const totalCapital = vehicles.reduce((sum, v) => sum + Number(v.purchasePrice || 0), 0);
  
  // Predict Standard Depreciation (Roughly 15% drop overall as a tracking demo)
  const currentEstValue = totalCapital * 0.85;

  const handleSave = () => {
    if (!formData.brand || !formData.model || !formData.purchasePrice) return;

    if (editId) {
      setVehicles(vehicles.map(v => v.id === editId ? { ...v, ...formData } : v));
    } else {
      setVehicles([...vehicles, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => setVehicles(vehicles.filter(v => v.id !== id));

  const openEditModal = (vehicle) => {
    setFormData(vehicle);
    setEditId(vehicle.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ brand: '', model: '', type: 'Sedan', purchasePrice: '', insuranceAttached: false, imageUrl: '' });
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
          <h2 className={`text-4xl font-semibold tracking-tight ${textBody} mb-2`}>Vehicle Assets</h2>
          <p className={`text-sm ${textMuted} flex items-center gap-2`}><GaugeCircle size={16}/> Fleet Valuation: <span className="font-numbers font-semibold text-[#d4af37]">{formatINRLakhs(currentEstValue)}</span> <span className="text-xs text-rose-500/70 ml-2">(Est. Depreciated)</span></p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] hover:bg-[#f9e596] text-black px-6 py-3 rounded-lg text-sm font-semibold shadow-lg shadow-[#d4af37]/20 transition-all flex items-center gap-2"
        >
          <Plus size={16}/> Register Vehicle
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className={`${cardBg} border ${borderColor} rounded-2xl overflow-hidden group hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm relative flex flex-col`}>
            {/* Image Section */}
            <div className="h-44 w-full relative overflow-hidden bg-[#111] flex items-center justify-center">
              {v.imageUrl ? (
                <img src={v.imageUrl} alt={v.brand} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#050505] flex flex-col items-center justify-center opacity-70">
                   <CarFront size={48} className="text-[#333] mb-2" />
                   <span className="text-[10px] tracking-widest uppercase text-[#555] font-semibold">Image Missing</span>
                </div>
              )}
              
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white font-semibold text-xs border border-white/10 shadow-lg flex items-center gap-1.5 uppercase tracking-widest z-10">
                <Tag size={12} className="text-[#d4af37]"/> {v.type}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <h3 className="absolute bottom-4 left-5 text-white font-semibold text-xl leading-tight tracking-wide z-10">{v.brand} <span className="font-light">{v.model}</span></h3>
            </div>

            {/* Details Section */}
            <div className="p-5 flex-1 flex flex-col">
               
               <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1">Acquired For</p>
                     <p className={`text-[15px] font-numbers font-medium ${isDark ? 'text-[#ddd]' : 'text-slate-800'}`}>{formatINRLakhs(v.purchasePrice)}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex flex-col justify-center`}>
                     <p className="text-[9px] uppercase font-semibold tracking-widest text-[#666] mb-1 flex items-center gap-1">Est. Value <TrendingDown size={10} className="text-rose-500"/></p>
                     <p className={`text-[15px] font-numbers font-semibold text-rose-500`}>
                        {formatINRLakhs(v.purchasePrice * 0.85)}
                     </p>
                  </div>
               </div>
               
               <div className={`p-4 rounded-xl ${isDark ? 'bg-[#050505] border border-[#1a1a1a]' : 'bg-slate-50 border border-slate-100'} flex items-center justify-between`}>
                   
                   <div className="flex items-center gap-3">
                       <ShieldCheck size={20} className={v.insuranceAttached ? 'text-emerald-500' : 'text-slate-600'} />
                       <div>
                           <p className="text-[10px] uppercase font-semibold tracking-widest text-[#666]">Insurance Cover</p>
                           <p className={`text-xs font-medium mt-0.5 ${v.insuranceAttached ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : textMuted}`}>
                             {v.insuranceAttached ? 'Active & Up-to-date' : 'Missing File'}
                           </p>
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

      {vehicles.length === 0 && (
         <div className="w-full text-center py-20 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] text-[#555] mt-6">
            No vehicle assets registered yet.
         </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
           <div className={`w-full max-w-lg ${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]`}>
              <h3 className={`text-xl font-semibold mb-2 ${textBody}`}>{editId ? 'Update Vehicle' : 'Register Vehicle Asset'}</h3>
              <p className={`text-[11px] ${textMuted} mb-6 tracking-wide`}>Enter fleet mechanics and attach local files securely.</p>
              
              <div className="grid grid-cols-2 gap-5 mb-8">
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Vehicle Brand</label>
                    <input type="text" placeholder="e.g. Porsche, BMW" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Model Variant</label>
                    <input type="text" placeholder="e.g. 911 GT3 RS" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`} />
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Chassis Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className={`w-full px-4 py-3 rounded-lg text-sm font-medium focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 border-slate-200'}`}>
                         <option>Sedan</option>
                         <option>SUV</option>
                         <option>Sports Car</option>
                         <option>Hatchback</option>
                         <option>Truck / Offroad</option>
                    </select>
                 </div>
                 <div className="col-span-1">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Acquired For (INR)</label>
                    <div className="relative">
                       <IndianRupee size={14} className={`absolute left-3 top-3.5 ${textMuted}`}/>
                       <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className={`w-full pl-8 pr-4 py-3 rounded-lg text-sm font-numbers focus:outline-none focus:border-[#d4af37] ${isDark ? 'bg-[#111] text-white border border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`} />
                    </div>
                 </div>

                 {/* New Image Upload */}
                 <div className="col-span-2 pt-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Upload Vehicle Photo</label>
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

                 {/* RC/Insurance Upload */}
                 <div className="col-span-2 pt-2">
                    <label className={`text-[10px] uppercase tracking-widest ${textMuted} mb-1.5 block font-semibold`}>Upload Insurance/RC Document</label>
                    <div className="flex flex-col gap-2">
                        <input 
                          type="file" 
                          accept=".pdf,image/*"
                          onChange={handleDocumentUpload} 
                          className={`w-full px-2 py-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1a1a1a] hover:file:bg-[#222] file:text-[#d4af37] rounded-lg text-xs font-medium focus:outline-none ${isDark ? 'bg-[#050505] text-[#888] border border-[#222]' : 'bg-slate-50 text-slate-500 border border-slate-200'} cursor-pointer`} 
                        />
                        {formData.insuranceAttached && (
                         <div className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1.5"><ShieldCheck size={12}/> Shield Protocol Active: Document Linked</div>
                        )}
                    </div>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button onClick={closeModal} className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#888] hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Cancel</button>
                 <button onClick={handleSave} className="flex-[2] py-3 rounded-lg text-sm font-semibold text-black bg-[#d4af37] hover:bg-[#f9e596] shadow-lg shadow-[#d4af37]/20 transition-all">
                   {editId ? 'Verify & Update' : 'Register Vehicle to Fleet'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
