
import React from 'react';
import { Globe, Bug, Database, Activity, Play, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Vulnerability } from '../types';

interface DashboardProps {
  progress: number;
  onNewScan: () => void;
  isScanning: boolean;
  vulnerabilities: Vulnerability[];
  totalRequests: number;
  totalEndpoints: number;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, onNewScan, isScanning, vulnerabilities, totalRequests, totalEndpoints }) => {
  const criticalCount = vulnerabilities.filter(v => v.severity === 'High').length;
  
  // Dynamic vulnerability mapping
  const vulnStats = [
    { label: 'SQL Injection', count: vulnerabilities.filter(v => v.type === 'SQL Injection').length, max: 10, color: 'bg-rose-500' },
    { label: 'XSS (Reflected)', count: vulnerabilities.filter(v => v.type === 'Cross-Site Scripting').length, max: 10, color: 'bg-amber-500' },
    { label: 'Broken Auth', count: vulnerabilities.filter(v => v.type === 'Broken Auth').length, max: 10, color: 'bg-indigo-500' },
    { label: 'Other Vectors', count: vulnerabilities.filter(v => !['SQL Injection', 'Cross-Site Scripting', 'Broken Auth'].includes(v.type)).length, max: 10, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Scanner Suite</h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Targeting vulnerabilities with surgical precision.</p>
        </div>
        <button 
          onClick={onNewScan}
          disabled={isScanning}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[1.5rem] font-black transition-all shadow-xl shadow-indigo-200 group active:scale-95"
        >
          <Play size={20} fill="currentColor" strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
          {isScanning ? 'Scan Active' : 'Launch Fuzzer'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Endpoints Hit" 
          value={totalEndpoints.toLocaleString()} 
          icon={<Globe />} 
          trend={isScanning ? "+100%" : ""} 
          trendType="up" 
        />
        <StatCard 
          label="Requests Sent" 
          value={totalRequests.toLocaleString()} 
          icon={<Database />} 
          trend={isScanning ? "Live" : ""} 
          trendType="up" 
        />
        <StatCard 
          label="Critical Vulns" 
          value={criticalCount.toString().padStart(2, '0')} 
          icon={<Bug />} 
          trend={criticalCount > 0 ? "Alert" : "Clean"} 
          trendType={criticalCount > 0 ? "down" : "up"} 
        />
        <StatCard 
          label="System Load" 
          value={isScanning ? "Bursting" : "Idle"} 
          icon={<Activity />} 
        />
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-soft relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className={`w-4 h-4 rounded-full ${isScanning ? 'bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse' : 'bg-slate-300'}`}></div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sequence Execution</h2>
          </div>
          <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-5 py-2 rounded-full border-2 border-indigo-100">{progress}% Mapped</span>
        </div>
        
        <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden mb-12 shadow-inner border-4 border-white">
          <div 
            className="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-lg shadow-indigo-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Bitrate', val: isScanning ? `${Math.floor(Math.random() * 50 + 200)} req/s` : '0 req/s', icon: <Zap size={16} />, color: 'text-indigo-600' },
            { label: 'Avg Latency', val: isScanning ? `${Math.floor(Math.random() * 20 + 30)}ms` : '0ms', icon: <Activity size={16} />, color: 'text-emerald-600' },
            { label: 'Findings Count', val: vulnerabilities.length.toString(), icon: <Bug size={16} />, color: 'text-rose-600' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100 flex flex-col items-center text-center hover-lift">
              <p className="text-[11px] text-slate-400 mb-2 uppercase tracking-[0.2em] font-black">{item.label}</p>
              <div className={`flex items-center gap-2 mb-1 ${item.color}`}>
                <p className="text-3xl font-black tracking-tighter">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 pb-10">
        <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-soft">
          <h2 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
            <span className="w-2 h-8 bg-rose-400 rounded-full"></span>
            Vulnerability Density
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {vulnStats.map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-extrabold text-slate-600">{item.label}</span>
                  <span className="text-slate-900 text-xs font-black mono bg-slate-100 px-3 py-1 rounded-lg">{item.count} Detected</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border-2 border-white shadow-inner">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${Math.min((item.count / item.max) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
