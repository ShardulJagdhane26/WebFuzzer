
import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Vulnerability } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  vulnerability: Vulnerability | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, vulnerability }) => {
  if (!isOpen || !vulnerability) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border-2 border-slate-100 w-full max-w-3xl rounded-[3rem] shadow-[0_25px_100px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-3xl shadow-sm ${
              vulnerability.severity === 'High' ? 'bg-rose-100 text-rose-500' : 
              vulnerability.severity === 'Medium' ? 'bg-amber-100 text-amber-500' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <AlertTriangle size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{vulnerability.type}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 bg-white px-3 py-1 rounded-lg inline-block border border-slate-100">Report ID: SEC-{vulnerability.id.padStart(6, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all border-2 border-transparent hover:border-slate-100">
            <X size={32} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto">
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Affected Resource</h3>
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border-2 border-slate-100 flex items-center justify-between group shadow-inner">
              <code className="text-indigo-600 text-sm mono font-extrabold break-all">{vulnerability.url}</code>
              <ExternalLink size={18} strokeWidth={2.5} className="text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-10">
            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Target Attribute</h3>
              <p className="text-slate-900 font-black bg-indigo-50 px-6 py-3 rounded-2xl inline-block border-2 border-indigo-100 shadow-sm">{vulnerability.parameter}</p>
            </section>
            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Threat Rating</h3>
              <span className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 shadow-sm ${
                vulnerability.severity === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                vulnerability.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}>
                {vulnerability.severity} Risk Factor
              </span>
            </section>
          </div>

          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Active Payload</h3>
            <div className="bg-slate-50 p-6 rounded-[1.5rem] border-2 border-slate-100 shadow-inner">
              <code className="text-amber-600 text-sm mono font-black">{vulnerability.payload}</code>
            </div>
          </section>

          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Response Excerpt</h3>
            <div className="bg-slate-900 p-8 rounded-[2rem] mono text-xs text-slate-400 leading-relaxed shadow-xl border-4 border-slate-800">
              <span className="text-emerald-400"># Response Data Received:</span><br/>
              {vulnerability.responseSnippet}
            </div>
          </section>

          <section className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <ShieldCheck className="text-emerald-600" size={24} strokeWidth={2.5} />
              <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest">Remediation Guide</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-bold">
              {vulnerability.fixRecommendation}
            </p>
          </section>
        </div>

        <div className="p-10 border-t-2 border-slate-50 bg-slate-50/50 flex justify-end gap-6">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-slate-500 hover:text-slate-900 transition-colors font-black text-sm uppercase tracking-widest"
          >
            Dismiss
          </button>
          <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black transition-all shadow-xl shadow-indigo-100 text-sm uppercase tracking-widest active:scale-95">
            Full Audit PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
