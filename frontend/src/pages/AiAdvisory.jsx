import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe, Sparkles, Activity } from 'lucide-react';

export default function AiAdvisory({ isDark }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hello! I am your AI Wealth Advisor. How can I help you manage your money today?', lang: 'en-IN' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // For real data analysis, we'd normally pull this from a global state or database
  // For now, we'll simulate the "live" state based on the modules we've built
  const [financialProfile, setFinancialProfile] = useState({
     total_net_worth: "₹3.15 Crore",
     assets: {
        land: "2 Properties (Kondampatty & Kangeyam)",
        vehicles: "2 (Porsche 911 GT3 & Range Rover)",
        vault: "Gold Bullion (1.2Kg) & Diamond Necklace",
     },
     liabilities: {
        total_debt: "₹1.75 Crore",
        monthly_emi: "₹1.82 Lakhs"
     }
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
        recognitionRef.current.lang = language;
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthRef.current?.cancel();
      setIsSpeaking(false);
      recognitionRef.current?.start();
    }
  };

  const handleUserSpeech = async (userVoiceText) => {
    setChatHistory(prev => [...prev, { role: 'user', content: userVoiceText, lang: language }]);
    setIsProcessing(true);
    
    try {
        // CALL REAL BACKEND AI ADVISOR
        const response = await fetch('http://localhost:5000/api/advisory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: userVoiceText,
                assetSummary: financialProfile,
                language: language
            })
        });

        const data = await response.json();
        const aiResponse = data.advice || "சாரி, என்னால் இப்போது பதிலளிக்க முடியவில்லை.";

        setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse, lang: language }]);
        setIsProcessing(false);
        speakText(aiResponse, language);
        
    } catch (err) {
        console.error("AI Fetch Error:", err);
        const errorMsg = "வெல்த் அட்வைசர் சர்வர் தற்போது ஆஃப்லைனில் உள்ளது.";
        setChatHistory(prev => [...prev, { role: 'ai', content: errorMsg, lang: language }]);
        setIsProcessing(false);
        speakText(errorMsg, language);
    }
  };

  const speakText = (text, lang) => {
      if (!synthRef.current) return;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
      if (synthRef.current) {
          synthRef.current.cancel();
          setIsSpeaking(false);
      }
  };

  const textBody = isDark ? "text-white" : "text-slate-900";
  const textMuted = isDark ? "text-[#888]" : "text-slate-500";
  const cardBg = isDark ? "bg-[#0a0a0a]" : "bg-white";
  const borderColor = isDark ? "border-[#1a1a1a]" : "border-slate-200";

  return (
    <div className="animate-in fade-in duration-700 h-[calc(100vh-100px)] flex flex-col pb-6">
      <header className="mb-6 flex justify-between items-end px-2">
        <div>
          <h2 className={`text-4xl font-semibold tracking-tight gap-3 ${textBody} mb-2 flex items-center`}>
            <Sparkles className="text-[#d4af37]" /> Voice AI Advisor
          </h2>
          <p className={`text-sm ${textMuted} tracking-wide`}>Speak naturally. I can analyze your wealth and guide you in your native language.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Globe size={16} className={textMuted}/>
           <select 
             value={language} 
             onChange={(e) => setLanguage(e.target.value)}
             className={`px-4 py-2.5 rounded-lg text-sm font-semibold focus:outline-none focus:border-[#d4af37] border shadow-sm ${isDark ? 'bg-[#111] text-white border-[#222]' : 'bg-slate-50 text-slate-900 border-slate-200'}`}
           >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="ta-IN">தமிழ் (Tamil)</option>
                <option value="te-IN">తెలుగు (Telugu)</option>
                <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                <option value="ml-IN">മലയാളം (Malayalam)</option>
           </select>
        </div>
      </header>

      {/* Main AI Interaction Panel */}
      <div className={`flex-1 ${cardBg} border ${borderColor} rounded-3xl shadow-lg overflow-hidden flex flex-col relative`}>
         
         {/* Live Chat History */}
         <div className={`flex-1 p-8 overflow-y-auto ${isDark ? 'bg-[#0f0f0f]' : 'bg-slate-50'} space-y-6`}>
             {chatHistory.map((chat, idx) => (
                 <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                     <div className={`max-w-[70%] rounded-2xl p-5 ${
                         chat.role === 'user' 
                         ? `${isDark ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-white border border-slate-200 shadow-sm'} ${textBody}` 
                         : `bg-gradient-to-br from-[#d4af37]/20 to-[#f9e596]/10 border border-[#d4af37]/30 ${textBody} shadow-lg shadow-[#d4af37]/5`
                     }`}>
                         {chat.role === 'ai' && (
                             <div className="flex items-center gap-2 mb-2">
                                <Activity size={12} className="text-[#d4af37]" /> 
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">Vault AI Advisor</span>
                             </div>
                         )}
                         <p className={`text-xl leading-relaxed ${chat.lang === 'ta-IN' || chat.lang === 'hi-IN' ? 'font-medium' : 'font-normal'}`}>
                           {chat.content}
                         </p>
                     </div>
                 </div>
             ))}

             {isProcessing && (
                 <div className="flex justify-start animate-in fade-in">
                     <div className={`max-w-[70%] rounded-2xl p-5 bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20`}>
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                           <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                           <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                           <span className="text-xs text-[#d4af37] font-bold tracking-widest uppercase ml-3">Synthesizing Asset Data...</span>
                        </div>
                     </div>
                 </div>
             )}
         </div>

         {/* Control Sphere Deck */}
         <div className={`h-40 border-t ${borderColor} ${isDark ? 'bg-[#050505]' : 'bg-white'} flex flex-col items-center justify-center relative p-6`}>
             
             {/* Central Microphone / Orb */}
             <div className="flex items-center justify-center flex-1 w-full relative">
                 
                 {/* Visualizer Rings */}
                 {isListening && (
                     <>
                        <div className="absolute w-24 h-24 rounded-full border border-[#d4af37]/40 animate-ping"></div>
                        <div className="absolute w-32 h-32 rounded-full border border-[#d4af37]/20 animate-ping" style={{animationDelay: '300ms'}}></div>
                        <div className="absolute w-40 h-40 rounded-full bg-[#d4af37]/5 animate-pulse"></div>
                     </>
                 )}

                 <button 
                  onClick={toggleListen}
                  disabled={isProcessing}
                  className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 z-10 shadow-2xl disabled:opacity-50
                    ${isListening ? 'bg-rose-500 scale-110 text-white shadow-rose-500/40' : 'bg-[#d4af37] hover:bg-[#f9e596] text-black shadow-[#d4af37]/20'}
                  `}
                 >
                     {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                 </button>
             </div>

             <div className="w-full flex justify-between items-end mt-4">
                 <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-pulse' : 'bg-[#444]'}`}></div>
                     <span className={`text-[10px] uppercase font-bold tracking-widest ${isListening ? 'text-rose-500' : textMuted}`}>
                         {isListening ? 'Real-Time Voice Sink' : 'Mic Off'}
                     </span>
                 </div>
                 
                 {isSpeaking && (
                    <button onClick={stopSpeaking} className={`flex items-center gap-2 px-3 py-1.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 transition-colors hover:bg-rose-500/20`}>
                        <VolumeX size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Mute AI</span>
                    </button>
                 )}

                 {!isSpeaking && chatHistory.length > 0 && chatHistory[chatHistory.length-1].role === 'ai' && (
                     <button onClick={() => speakText(chatHistory[chatHistory.length-1].content, chatHistory[chatHistory.length-1].lang)} className={`flex items-center gap-2 px-3 py-1.5 rounded ${isDark ? 'bg-[#111] hover:bg-[#1a1a1a] text-[#888]' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'} transition-colors`}>
                        <Volume2 size={14} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Replay</span>
                    </button>
                 )}
             </div>

         </div>
      </div>
    </div>
  );
}
