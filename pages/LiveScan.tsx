
import React, { useMemo } from 'react';
import Terminal from '../components/Terminal';
import { ScanLog } from '../types';
import { Activity, ShieldAlert, Search, Sparkles, Loader2 } from 'lucide-react';

interface LiveScanProps {
  logs: ScanLog[];
  progress: number;
  isScanning: boolean;
  isAiThinking?: boolean;
}

const LiveScan: React.FC<LiveScanProps> = ({ logs, progress, isScanning, isAiThinking }) => {
  const stats = useMemo(() => {
    if (logs.length === 0) return { success: 0, missing: 0, errors: 0 };
    const success = logs.filter(l => l.status < 400).length;
    const missing = logs.filter(l => l.status >= 400 && l.status < 500).length;
    const errors = logs.filter(l => l.status >= 500).length;
    const total = logs.length;
    
    return {
      success: ((success / total) * 100).toFixed(1),
      missing: ((missing / total) * 100).toFixed(1),
      errors: ((errors / total) * 100).toFixed(1),
    };
  }, [logs]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between border-b-4 border-slate-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Runtime Stream</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Real-time fuzzer activity and AI-generated payload analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {isAiThinking && logs.length === 0 ? (
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] h-[520px] flex flex-col items-center justify-center p-10 text-center shadow-soft">
              <div className="p-6 bg-indigo-50 rounded-full mb-8 relative">
                <Sparkles size={48} className="text-indigo-600 animate-pulse" fill="currentColor" />
                <div className="absolute inset-0 bg-indigo-200/20 rounded-full animate-ping"></div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">AI Brainstorming Initialized</h3>
              <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                Gemini is currently analyzing your target URL and synthesizing a bespoke set of security vectors...
              </p>
              <div className="mt-8 flex items-center gap-3 text-indigo-600 font-black text-sm uppercase tracking-widest">
                <Loader2 size={18} className="animate-spin" strokeWidth={3} />
                Building Wordlist
              </div>
            </div>
          ) : (
            <Terminal logs={logs} />
          )}
        </div>
        
        <div className="space-y-10">
           <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-soft">
              <h3 className="text-slate-900 font-black mb-8 flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Search size={20} className="text-indigo-600" strokeWidth={3} />
                </div>
                Audit Stats
              </h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                       <span className="text-slate-400">Success (2xx/3xx)</span>
                       <span className="text-emerald-600 mono">{stats.success}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.success}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                       <span className="text-slate-400">Missing (404)</span>
                       <span className="text-amber-600 mono">{stats.missing}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.missing}%` }}></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                       <span className="text-slate-400">Anomalies (5xx)</span>
                       <span className="text-rose-600 mono">{stats.errors}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.errors}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-soft">
              <h3 className="text-slate-900 font-black mb-8 flex items-center gap-4">
                <div className="p-2 bg-rose-50 rounded-xl">
                  <ShieldAlert size={20} className="text-rose-600" strokeWidth={3} />
                </div>
                Threat Alarms
              </h3>
              <div className="space-y-4">
                 {logs.filter(l => l.status >= 500).slice(-3).map((alert, i) => (
                    <div key={i} className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl animate-in slide-in-from-right-4">
                       <p className="text-rose-600 font-black text-xs uppercase tracking-widest mb-2">Target Vulnerability Detected</p>
                       <p className="text-slate-500 truncate mono text-[11px] font-bold">{alert.url}</p>
                    </div>
                 ))}
                 {logs.filter(l => l.status >= 500).length === 0 && (
                   <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-100">
                        <Activity size={20} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-bold">Waiting for anomalies...</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-center shadow-xl shadow-indigo-100">
              <p className="text-indigo-100 text-[10px] uppercase tracking-[0.2em] font-black mb-3">Audit Progress</p>
              <div className="text-5xl font-black text-white mb-6 tracking-tighter">{progress}%</div>
              <div className="w-full h-4 bg-indigo-900/30 rounded-full overflow-hidden border-2 border-indigo-500/50">
                 <div className="bg-white h-full rounded-full transition-all duration-500 shadow-lg" style={{ width: `${progress}%` }}></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScan;
