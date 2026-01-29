
import React, { useEffect, useRef } from 'react';
import { ScanLog } from '../types';

interface TerminalProps {
  logs: ScanLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-soft flex flex-col h-[520px]">
      <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-100 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-300"></div>
          <div className="w-3 h-3 rounded-full bg-amber-300"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
        </div>
        <span className="text-[10px] text-slate-400 mono font-black uppercase tracking-widest">fuzzer_runtime_env.log</span>
        <div className="w-10"></div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-8 mono text-[13px] overflow-y-auto space-y-2 selection:bg-indigo-100 selection:text-indigo-900"
      >
        {logs.length === 0 ? (
          <div className="text-slate-300 italic font-medium">Ready. Waiting for engine pulse...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="grid grid-cols-[100px_60px_40px_1fr_150px] gap-4 py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-indigo-200">
              <span className="text-slate-400 font-bold">[{log.timestamp}]</span>
              <span className="text-indigo-500 font-black">{log.method}</span>
              <span className={`font-black ${log.status >= 500 ? 'text-rose-500' : log.status >= 400 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {log.status}
              </span>
              <span className="text-slate-600 font-medium truncate">
                {log.url}
              </span>
              <span className="text-slate-400 truncate text-right text-[11px] font-bold">
                payload: {log.payload}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Terminal;
