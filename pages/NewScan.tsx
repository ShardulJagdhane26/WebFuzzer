
import React, { useState } from 'react';
import { Target, Zap, Settings, Cpu, ArrowRight, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { ScanConfig, ScanType } from '../types';

interface NewScanProps {
  onStartScan: (config: ScanConfig) => void;
  isAiGenerating: boolean;
}

const NewScan: React.FC<NewScanProps> = ({ onStartScan, isAiGenerating }) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState<ScanType>('Full Security Scan');
  const [depth, setDepth] = useState(3);
  const [payloads, setPayloads] = useState({
    sql: true,
    xss: true,
    longString: false,
    specialChar: false,
    custom: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl || isAiGenerating) return;
    onStartScan({ targetUrl, scanType, depth, payloads });
  };

  return (
    <div className="animate-in slide-in-from-bottom-12 duration-1000 space-y-12 pb-10">
      <div className="flex items-end justify-between border-b-4 border-slate-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Mission Config</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Define the security testing parameters for your audit.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-soft space-y-10">
            <div className="flex items-center gap-4 text-indigo-600">
              <Target size={28} strokeWidth={3} />
              <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Deployment Vector</h2>
            </div>
            
            <div className="space-y-8">
              <div className="group">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-indigo-600 transition-colors">Endpoint URI</label>
                <input
                  type="url"
                  placeholder="https://app.enterprise-security.com/api"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-6 py-5 rounded-3xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-300 font-bold mono shadow-inner"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Audit Mode</label>
                  <div className="relative group">
                    <select
                      value={scanType}
                      onChange={(e) => setScanType(e.target.value as ScanType)}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-6 py-5 pr-14 rounded-3xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold appearance-none cursor-pointer group-hover:bg-white group-hover:border-indigo-200"
                    >
                      <option className="py-4 px-6 font-bold">Basic Fuzzing</option>
                      <option className="py-4 px-6 font-bold">SQL Injection Test</option>
                      <option className="py-4 px-6 font-bold">XSS Test</option>
                      <option className="py-4 px-6 font-bold">Full Security Scan</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                      <ChevronDown size={22} strokeWidth={3} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Scan Depth (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-6 py-5 rounded-3xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-soft space-y-10">
            <div className="flex items-center gap-4 text-indigo-600">
              <Settings size={28} strokeWidth={3} />
              <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">AI Intelligence Tuning</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { key: 'sql', label: 'SQLi Deep Analysis' },
                { key: 'xss', label: 'XSS Vector Synthesis' },
                { key: 'longString', label: 'Overflow Simulation' },
                { key: 'specialChar', label: 'Encoding Obfuscation' },
              ].map((p) => (
                <label key={p.key} className="flex items-center gap-5 p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group select-none shadow-sm">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={(payloads as any)[p.key]} 
                      onChange={(e) => setPayloads({...payloads, [p.key]: e.target.checked})}
                      className="peer appearance-none w-7 h-7 rounded-xl border-2 border-slate-200 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all shadow-sm" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  </div>
                  <span className="text-slate-600 group-hover:text-indigo-700 font-extrabold text-sm tracking-tight transition-colors">{p.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Manual Seed Wordlist (Optional)</label>
              <textarea
                value={payloads.custom}
                onChange={(e) => setPayloads({...payloads, custom: e.target.value})}
                placeholder="Gemini 3 will automatically brainstorm sophisticated payloads based on your URL. You can seed the AI with specific words here..."
                className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-6 py-5 rounded-3xl h-44 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-200 mono text-xs leading-relaxed shadow-inner"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] shadow-soft">
             <div className="flex items-center justify-between mb-10">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Resource Health</span>
                <span className="text-emerald-600 font-black text-[10px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">Standby</span>
             </div>

             <button 
                type="submit"
                disabled={isAiGenerating}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-3xl font-black transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-4 text-xl active:scale-[0.97]"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 size={24} className="animate-spin" strokeWidth={3} />
                    AI Thinking...
                  </>
                ) : (
                  <>
                    <Cpu size={24} strokeWidth={3} />
                    Begin Audit
                    <ArrowRight size={22} strokeWidth={3} />
                  </>
                )}
             </button>
             <p className="text-[10px] text-center text-slate-300 mt-8 font-black uppercase tracking-[0.2em]">
               Power by Gemini 3 Intelligence
             </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewScan;
