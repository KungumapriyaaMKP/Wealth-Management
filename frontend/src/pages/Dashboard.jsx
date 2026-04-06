import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis, ComposedChart, Bar, Line, CartesianGrid } from 'recharts';
import { Target, ArrowUpRight, ArrowDownRight, Zap, AlertCircle, Clock } from 'lucide-react';

const cashFlowData = [
  { name: 'Jan', income: 150000, expense: 110000, savings: 40000 },
  { name: 'Feb', income: 160000, expense: 125000, savings: 35000 },
  { name: 'Mar', income: 155000, expense: 105000, savings: 50000 },
  { name: 'Apr', income: 170000, expense: 125000, savings: 45000 },
  { name: 'May', income: 165000, expense: 105000, savings: 60000 },
  { name: 'Jun', income: 180000, expense: 125000, savings: 55000 },
];

const recentTransactions = [
  { id: 1, type: 'Expense', category: 'Business Supplies', amount: 15400, date: 'Today', status: 'Cleared' },
  { id: 2, type: 'Income', category: 'Client Payment', amount: 125000, date: 'Yesterday', status: 'Cleared' },
  { id: 3, type: 'Expense', category: 'Property EMI', amount: 45000, date: '3 Days Ago', status: 'Cleared' },
  { id: 4, type: 'Expense', category: 'Gold Purchase', amount: 72000, date: 'Last Week', status: 'Invested' },
];

export default function Dashboard({ isDark }) {
  const [advisory] = useState("Hey there! We noticed a lot of your money is tied up in Real Estate. Consider putting ₹2,00,000 into safer mutual funds so you have cash ready for emergencies.");
  const [marketRates, setMarketRates] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/market')
      .then(res => res.json())
      .then(data => setMarketRates(data))
      .catch(err => console.error("Error fetching market rates:", err));
  }, []);

  // Indian RUPEE Formatter
  const formatINR = (value) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Convert large numbers to Lakhs/Crores for short axis labels
  const formatINRLakhs = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cardBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-slate-200";
  const hoverBorder = isDark ? "hover:border-[#222]" : "hover:border-slate-300";
  const textMuted = isDark ? "text-[#666]" : "text-slate-500";
  const textBody = isDark ? "text-white" : "text-slate-900";
  const textDim = isDark ? "text-[#888]" : "text-slate-400";
  const gridLineColor = isDark ? "#111" : "#e2e8f0";
  const axisLineColor = isDark ? "#333" : "#cbd5e1";

  const assetData = [
    { name: 'Core Real Estate', value: 25000000 }, // 2.5 Cr
    { name: 'Physical Gold', value: 4500000 },    // 45 Lakhs
    { name: 'Liquid Cash', value: 1500000 },      // 15 Lakhs
    { name: 'Silver Reserves', value: 500000 },   // 5 Lakhs
  ];
  const totalNetWorth = 31500000; // 3.15 Cr
  
  const COLORS = isDark ? ['#1a1a1a', '#d4af37', '#333333', '#111111'] : ['#f1f5f9', '#d4af37', '#e2e8f0', '#cbd5e1'];

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col pb-10 transition-colors">
      <header className={`mb-8 flex justify-between items-end border-b pb-6 ${isDark ? 'border-[#111]' : 'border-slate-200'}`}>
        <div>
          <h2 className={`text-3xl font-semibold tracking-tight mb-2 ${textBody}`}>My Wealth Dashboard</h2>
          <p className={`${textMuted} text-sm`}>Welcome back! Here is a summary of your money.</p>
        </div>
        
        <div className={`flex items-center justify-center gap-6 border rounded-xl px-5 py-2 min-w-[200px] h-[52px] ${cardBg} ${borderColor} shadow-sm`}>
            {marketRates ? (
              <>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase tracking-wider ${textMuted}`}>Gold (24k/1g)</span>
                  <span className="text-sm font-numbers text-[#d4af37] flex items-center gap-1">
                    {formatINR(marketRates.gold.current_price)} 
                    {marketRates.gold.change_percent >= 0 ? 
                      <ArrowUpRight size={12} className="text-emerald-500"/> : 
                      <ArrowDownRight size={12} className="text-rose-500"/>}
                  </span>
                </div>
                <div className={`w-[1px] h-6 ${isDark ? 'bg-[#222]' : 'bg-slate-200'}`}></div>
                <div className="flex flex-col">
                  <span className={`text-[10px] uppercase tracking-wider ${textMuted}`}>Silver (1g)</span>
                  <span className={`text-sm font-numbers flex items-center gap-1 ${isDark ? 'text-[#ccc]' : 'text-slate-600'}`}>
                    {formatINR(marketRates.silver.current_price)} 
                    {marketRates.silver.change_percent >= 0 ? 
                      <ArrowUpRight size={12} className="text-emerald-500"/> : 
                      <ArrowDownRight size={12} className="text-rose-500"/>}
                  </span>
                </div>
              </>
            ) : (
                <span className={`text-xs ${textMuted} font-medium uppercase tracking-widest animate-pulse`}>Syncing Market Data...</span>
            )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} flex flex-col gap-2 group ${hoverBorder} transition-colors relative shadow-sm`}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff02] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className={`text-sm tracking-wide font-semibold ${textMuted} flex items-center gap-1.5`}><Target size={14}/> Total Wealth</span>
          <div className={`font-numbers text-3xl tracking-tight flex items-baseline gap-1 pt-1 ${textBody}`}>
            <span className={`text-xl font-light ${textDim}`}>₹</span>3.15<span className={`text-lg ${textDim}`}>Cr</span>
          </div>
          <span className="text-[#d4af37] text-[11px] font-semibold mt-1 flex items-center gap-1"><ArrowUpRight size={12}/> +5.2% Growth This Month</span>
        </div>

        <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} flex flex-col gap-2 group ${hoverBorder} transition-colors shadow-sm`}>
           <span className={`text-sm tracking-wide font-semibold ${textMuted}`}>Monthly Earnings</span>
          <div className={`font-numbers text-3xl tracking-tight flex items-baseline gap-1 pt-1 ${textBody}`}>
            <span className={`text-xl font-light ${textDim}`}>₹</span>1.8<span className={`text-lg ${textDim}`}>L</span>
          </div>
          <span className="text-emerald-500 text-[11px] font-semibold mt-1 flex items-center"><ArrowUpRight size={12}/> +12.5% more than last month</span>
        </div>

        <div className={`col-span-1 lg:col-span-2 p-6 rounded-2xl border relative overflow-hidden shadow-sm backdrop-blur-3xl ${isDark ? 'bg-[#0f0f0f] border-[#d4af37]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-gradient-to-r from-yellow-50/50 to-white border-[#d4af37]/30'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#d4af37]" />
                <span className="text-sm tracking-wide font-bold text-[#d4af37]">Smart AI Advice</span>
             </div>
          </div>
          <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-[#a0a0a0]' : 'text-slate-700'}`}>
            {advisory}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 flex flex-col gap-6">
          <div className={`p-6 rounded-2xl border flex flex-col shadow-sm ${isDark ? 'bg-[#120a0a] border-rose-900/30' : 'bg-rose-50 border-rose-100'}`}>
            <h3 className="text-sm tracking-wide font-bold text-rose-500 mb-4 flex items-center gap-2"><AlertCircle size={16}/> Alerts & Reminders</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>High Spending Warning</p>
                  <p className="text-[11px] text-rose-500/80 mt-1 uppercase font-medium tracking-wide">You spent 20% more on bills this week</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>Property EMI Due Soon</p>
                  <p className="text-xs text-amber-500/90 mt-1 uppercase tracking-wide">{formatINR(45000)} deduction in 2 days</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} flex-1 shadow-sm`}>
            <h3 className={`text-sm tracking-wide font-bold ${textMuted} mb-4 flex items-center gap-2`}><Target size={16}/> Progress Towards Target</h3>
            <div className="mb-2 flex justify-between items-end">
              <p className={`text-sm font-bold ${textBody}`}>Buy Commercial Land</p>
              <span className="font-numbers text-xs font-semibold text-[#d4af37]">45%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-slate-100 border-slate-200'}`}>
              <div className="bg-gradient-to-r from-[#d4af37] to-[#f9e596] h-full" style={{ width: '45%' }}></div>
            </div>
            <p className={`text-xs font-numbers ${textMuted} mt-3`}>₹45L / ₹1Cr Target</p>
          </div>
        </div>

        <div className={`col-span-2 ${cardBg} p-6 rounded-2xl border ${borderColor} flex flex-col shadow-sm`}>
          <h3 className={`text-sm tracking-wide font-bold ${textMuted} mb-6`}>Money Coming In vs Going Out</h3>
          <div className="flex-1 w-full min-h-[250px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlowData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={isDark ? 0.1 : 0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridLineColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisLineColor} tick={{fill: isDark ? '#555' : '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke={axisLineColor} tick={{fill: isDark ? '#555' : '#94a3b8', fontSize: 11, fontFamily: 'Space Grotesk'}} axisLine={false} tickLine={false} tickFormatter={formatINRLakhs} dx={-10} />
                <RechartsTooltip 
                  formatter={(value) => [formatINR(value), '']}
                  contentStyle={{ backgroundColor: isDark ? '#0a0a0a' : '#fff', borderColor: isDark ? '#222' : '#e2e8f0', borderRadius: '8px', color: isDark ? '#fff' : '#000', fontSize: '12px' }} 
                  itemStyle={{ padding: 0 }}
                  cursor={{fill: isDark ? '#111' : '#f1f5f9', opacity: 0.4}}
                />
                <Area type="monotone" dataKey="income" fill="url(#incomeGrad)" stroke="#10b981" strokeWidth={1} />
                <Bar dataKey="expense" fill={isDark ? "#222" : "#bbcbdb"} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="savings" stroke="#d4af37" strokeWidth={2} dot={{fill: '#d4af37', strokeWidth: 0, r: 3}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-2 ${cardBg} p-6 rounded-2xl border ${borderColor} shadow-sm`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-sm tracking-wide font-bold ${textMuted}`}>Recent Transactions</h3>
            <button className="text-[11px] uppercase tracking-widest text-[#d4af37] hover:text-[#f9e596] transition-colors font-bold">View All History</button>
          </div>
          <div className="w-full">
             <div className={`grid grid-cols-4 text-[11px] uppercase font-bold tracking-widest ${textMuted} mb-4 border-b pb-2 ${isDark ? 'border-[#111]' : 'border-slate-100'}`}>
                <div>Category</div>
                <div>Date</div>
                <div>Status</div>
                <div className="text-right">Amount</div>
             </div>
             <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-4 text-sm font-medium items-center group">
                    <div className={`${isDark ? 'text-[#ccc] group-hover:text-white' : 'text-slate-700 group-hover:text-black'} transition-colors`}>{tx.category}</div>
                    <div className={`${textMuted} text-xs flex items-center gap-1`}><Clock size={12}/> {tx.date}</div>
                    <div>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${tx.status === 'Cleared' ? (isDark ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-emerald-200 text-emerald-700 bg-emerald-50') : (isDark ? 'border-[#d4af37]/20 text-[#d4af37] bg-[#d4af37]/5' : 'border-[#d4af37]/30 text-[#b48d21] bg-amber-50')}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className={`text-right font-numbers ${tx.type === 'Income' ? 'text-emerald-500' : textBody}`}>
                      {tx.type === 'Income' ? '+' : '-'}{formatINR(tx.amount)}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className={`col-span-1 ${cardBg} p-6 rounded-2xl border ${borderColor} flex flex-col justify-between shadow-sm`}>
          <h3 className={`text-sm tracking-wide font-bold ${textMuted} mb-2`}>Where is your money?</h3>
          <div className="h-40 flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`${textMuted} text-[10px] tracking-widest mb-1`}>TOTAL</span>
                <span className={`font-numbers text-lg font-bold tracking-tight ${textBody}`}>₹3.15Cr</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetData} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => [formatINRLakhs(value), 'Value']}
                  contentStyle={{ backgroundColor: isDark ? '#0a0a0a' : '#fff', borderColor: isDark ? '#222' : '#e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: isDark ? '#fff' : '#000', padding: 0 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-2">
            {assetData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-xs tracking-wide">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className={`${textDim}`}>{entry.name}</span>
                </div>
                <span className={`font-numbers ${isDark ? 'text-[#a0a0a0]' : 'text-slate-600'}`}>{formatINRLakhs(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
