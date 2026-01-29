
import React from 'react';
import { LayoutDashboard, ShieldAlert, Terminal, List, FileText, Settings, PlusCircle } from 'lucide-react';
import { Vulnerability, ScanLog } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'new-scan', label: 'New Scan', icon: <PlusCircle size={20} /> },
  { id: 'live-scan', label: 'Live Scan', icon: <Terminal size={20} /> },
  { id: 'results', label: 'Results', icon: <List size={20} /> },
  { id: 'reports', label: 'Reports', icon: <FileText size={20} /> },
];

export const MOCK_RESULTS: Vulnerability[] = [
  {
    id: '1',
    url: 'https://api.target-app.com/v1/users',
    parameter: 'id',
    payload: "' OR 1=1 --",
    type: 'SQL Injection',
    severity: 'High',
    responseSnippet: 'HTTP/1.1 200 OK\nContent-Type: application/json\n[{"id":1,"user":"admin","pass":"$2a$12$..."}]',
    fixRecommendation: 'Use parameterized queries or ORMs to handle database inputs. Never concatenate user strings into SQL commands.'
  },
  {
    id: '2',
    url: 'https://target-app.com/search',
    parameter: 'q',
    payload: '<script>alert("XSS")</script>',
    type: 'Cross-Site Scripting (XSS)',
    severity: 'High',
    responseSnippet: '<div>Search results for: <script>alert("XSS")</script></div>',
    fixRecommendation: 'Sanitize all user-controlled input before rendering it in HTML. Use Content Security Policy (CSP) headers.'
  },
  {
    id: '3',
    url: 'https://target-app.com/login',
    parameter: 'redirect',
    payload: '//evil.com',
    type: 'Open Redirect',
    severity: 'Medium',
    responseSnippet: 'Location: //evil.com',
    fixRecommendation: 'Validate redirect URLs against a whitelist of allowed domains.'
  },
  {
    id: '4',
    url: 'https://api.target-app.com/v1/debug',
    parameter: 'None',
    payload: 'GET',
    type: 'Information Disclosure',
    severity: 'Low',
    responseSnippet: 'X-Powered-By: PHP/5.4.16\nServer: Apache/2.4.6 (CentOS)',
    fixRecommendation: 'Disable stack traces and remove version headers from server responses.'
  }
];

export const INITIAL_LOGS: ScanLog[] = [
  { id: 'l1', timestamp: '10:45:01', url: '/v1/users', payload: 'test', status: 200, method: 'GET' },
  { id: 'l2', timestamp: '10:45:03', url: '/v1/users?id=1', payload: 'id=1', status: 200, method: 'GET' },
  { id: 'l3', timestamp: '10:45:05', url: '/v1/users?id=1%27', payload: "id=1'", status: 500, method: 'GET' },
];
