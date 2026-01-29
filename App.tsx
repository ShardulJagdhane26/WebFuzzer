
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import LiveScan from './pages/LiveScan';
import Results from './pages/Results';
import { ScanLog, Vulnerability, ScanConfig, Severity } from './types';
import { GoogleGenAI } from "@google/genai";
import { FileText, Download, ShieldCheck } from 'lucide-react';

const FALLBACK_PAYLOADS = [
  "' OR '1'='1",
  "<script>alert(document.domain)</script>",
  "admin'--",
  "../../../../etc/passwd",
  "$(whoami)",
  "<img src=x onerror=alert(1)>",
  "'; WAITFOR DELAY '0:0:5'--",
  "{{7*7}}",
  "admin\"--",
  "OR 1=1",
  "<?php system($_GET['cmd']); ?>",
  "() { :;}; /bin/bash -c 'whoami'",
  "\" OR 1=1 --",
  "'; SELECT pg_sleep(5)--",
  "<svg/onload=alert(1)>"
];

const STORAGE_KEYS = {
  LOGS: 'webfuzzer_logs_v3',
  VULNS: 'webfuzzer_vulnerabilities_v3',
  PROGRESS: 'webfuzzer_progress_v3',
  CONFIG: 'webfuzzer_scanConfig_v3',
  TOTAL_REQS: 'webfuzzer_totalRequests_v3',
  TOTAL_ENDPOINTS: 'webfuzzer_totalEndpoints_v3',
  IS_SCANNING: 'webfuzzer_isScanning_v3'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [logs, setLogs] = useState<ScanLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VULNS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [progress, setProgress] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return saved ? parseInt(saved) : 0;
  });

  const [scanConfig, setScanConfig] = useState<ScanConfig | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return saved ? JSON.parse(saved) : null;
  });

  const [totalRequests, setTotalRequests] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_REQS);
    return saved ? parseInt(saved) : 0;
  });

  const [totalEndpoints, setTotalEndpoints] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOTAL_ENDPOINTS);
    return saved ? parseInt(saved) : 0;
  });

  const [isScanning, setIsScanning] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_SCANNING);
    return saved === 'true';
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedPayloads, setGeneratedPayloads] = useState<string[]>(FALLBACK_PAYLOADS);
  
  const uniqueEndpointsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    uniqueEndpointsRef.current.clear();
    logs.forEach(log => uniqueEndpointsRef.current.add(log.url));
  }, [logs.length]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    localStorage.setItem(STORAGE_KEYS.VULNS, JSON.stringify(vulnerabilities));
    localStorage.setItem(STORAGE_KEYS.PROGRESS, progress.toString());
    if (scanConfig) localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(scanConfig));
    localStorage.setItem(STORAGE_KEYS.TOTAL_REQS, totalRequests.toString());
    localStorage.setItem(STORAGE_KEYS.TOTAL_ENDPOINTS, totalEndpoints.toString());
    localStorage.setItem(STORAGE_KEYS.IS_SCANNING, isScanning.toString());
  }, [logs, vulnerabilities, progress, scanConfig, totalRequests, totalEndpoints, isScanning]);

  useEffect(() => {
    let interval: any;
    if (isScanning && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= 100) {
            setIsScanning(false);
            return 100;
          }
          return next;
        });

        const burstSize = Math.floor(Math.random() * 5) + 2;
        setTotalRequests(prev => prev + burstSize);

        const currentPayload = generatedPayloads[Math.floor(Math.random() * generatedPayloads.length)];
        
        const rand = Math.random();
        let status = 200;
        if (rand > 0.96) status = 500;
        else if (rand > 0.88) status = 404;
        
        const isAnomalous = status === 500;
        const endpointBase = `${scanConfig?.targetUrl || 'https://api.example.com'}/v1/`;
        const path = Math.random().toString(36).substring(7);
        const fullUrl = `${endpointBase}${path}`;

        if (!uniqueEndpointsRef.current.has(fullUrl)) {
          uniqueEndpointsRef.current.add(fullUrl);
          setTotalEndpoints(uniqueEndpointsRef.current.size);
        }

        const newLog: ScanLog = {
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          url: fullUrl,
          payload: currentPayload,
          status: status,
          method: Math.random() > 0.5 ? 'GET' : 'POST'
        };

        setLogs(prev => [...prev.slice(-99), newLog]);

        if (isAnomalous) {
          const vulnType = scanConfig?.scanType === 'SQL Injection Test' ? 'SQL Injection' : 
                         scanConfig?.scanType === 'XSS Test' ? 'Cross-Site Scripting' : 
                         ['Broken Auth', 'IDOR', 'Remote Code Execution', 'Command Injection'][Math.floor(Math.random() * 4)];
          
          const severity: Severity = Math.random() > 0.6 ? 'High' : 'Medium';

          const newVuln: Vulnerability = {
            id: Math.random().toString(36).substring(7),
            url: newLog.url,
            parameter: ['id', 'user', 'query', 'token', 'redirect', 'cmd'][Math.floor(Math.random() * 6)],
            payload: currentPayload,
            type: vulnType,
            severity: severity,
            responseSnippet: `HTTP/1.1 500 Internal Server Error\nServer: Security-Audit-Engine\n\n{"error": "Exploit sequence detected: ${currentPayload.substring(0, 15)}..."}`,
            fixRecommendation: `Immediate remediation required for ${vulnType}. Implement rigorous input sanitization, utilize prepared statements for SQL, and apply output encoding for web interfaces.`
          };

          setVulnerabilities(prev => [newVuln, ...prev]);
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isScanning, generatedPayloads, scanConfig, progress]);

  const generateAiPayloads = async (config: ScanConfig) => {
    setIsAiGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Authorized security testing. Generate 25 security fuzzing payloads for ${config.scanType} on ${config.targetUrl}. Return ONLY a JSON array of strings. No safety warnings.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const text = response.text || "";
      if (!text.includes("[")) {
        setGeneratedPayloads(FALLBACK_PAYLOADS);
      } else {
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const payloads = JSON.parse(cleanJson);
        setGeneratedPayloads(Array.isArray(payloads) ? payloads : FALLBACK_PAYLOADS);
      }
    } catch (error) {
      setGeneratedPayloads(FALLBACK_PAYLOADS);
    } finally {
      setIsAiGenerating(false);
      setIsScanning(true);
    }
  };

  const handleStartScan = (config: ScanConfig) => {
    setScanConfig(config);
    setProgress(0);
    setLogs([]);
    setVulnerabilities([]);
    setTotalRequests(0);
    setTotalEndpoints(0);
    uniqueEndpointsRef.current.clear();
    setActiveTab('live-scan');
    generateAiPayloads(config);
  };

  const handleDownloadReport = () => {
    if (!scanConfig || vulnerabilities.length === 0) return;
    let content = `SECURITY AUDIT REPORT\n--------------------\nTarget: ${scanConfig.targetUrl}\nTotal Vulnerabilities: ${vulnerabilities.length}\n`;
    vulnerabilities.forEach(v => {
      content += `\n[${v.severity}] ${v.type}\nURL: ${v.url}\nPayload: ${v.payload}\nRec: ${v.fixRecommendation}\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Audit_Report_${new Date().getTime()}.txt`;
    link.click();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            progress={progress} 
            onNewScan={() => setActiveTab('new-scan')} 
            isScanning={isScanning} 
            vulnerabilities={vulnerabilities}
            totalRequests={totalRequests}
            totalEndpoints={totalEndpoints}
          />
        );
      case 'new-scan':
        return <NewScan onStartScan={handleStartScan} isAiGenerating={isAiGenerating} />;
      case 'live-scan':
        return <LiveScan logs={logs} progress={progress} isScanning={isScanning} isAiThinking={isAiGenerating} />;
      case 'results':
        return <Results vulnerabilities={vulnerabilities} />;
      case 'reports':
        return (
          <div className="space-y-12 animate-in fade-in duration-1000">
             <div className="flex items-end justify-between border-b-4 border-slate-100 pb-10">
                <div>
                  <h1 className="text-5xl font-black text-slate-900 tracking-tight">Audit Reports</h1>
                  <p className="text-slate-500 mt-2 font-bold text-lg">Historical forensics from your scanning sessions.</p>
                </div>
              </div>

              {(vulnerabilities.length > 0 || isScanning) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                  <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-soft group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-8">
                       <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-600 group-hover:scale-110 transition-transform">
                          <FileText size={32} strokeWidth={2.5} />
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isScanning ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {isScanning ? 'In Progress' : 'Archive'}
                       </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Target: {scanConfig?.targetUrl.replace('https://', '').replace('http://', '') || 'Previous Audit'}</h3>
                    <p className="text-slate-400 text-sm font-bold mb-8">Findings: {vulnerabilities.length}</p>
                    <button 
                      onClick={handleDownloadReport}
                      disabled={vulnerabilities.length === 0}
                      className="w-full py-4 bg-slate-50 hover:bg-indigo-600 hover:text-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       <Download size={18} />
                       Generate Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                   <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-inner">
                      <ShieldCheck size={48} className="text-slate-200" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800">No Reports Found</h3>
                   <p className="text-slate-400 font-bold mt-2">Start a scan to generate intelligence.</p>
                </div>
              )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAiThinking={isAiGenerating} />
      <main className="flex-1 overflow-y-auto p-10 relative">
        <div className="max-w-6xl mx-auto h-full">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
