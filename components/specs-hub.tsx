'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Database, Network, Workflow, TrendingUp, Terminal,
  CheckCircle, Code, Cloud, Layers, Settings, AlertCircle,
  IndianRupee, Calendar, DollarSign, Activity, ChevronRight, Check
} from 'lucide-react';
import { PRD_DATA, SCHEMA_DATA, API_SPEC_DATA, FOLDER_TREE_FRONTEND, FOLDER_TREE_BACKEND, ROADMAP_12W, COST_DATA } from '@/app/specs-data';

export default function SpecsHub() {
  const [activeTab, setActiveTab] = useState<'prd' | 'db' | 'api' | 'wireframes' | 'infra' | 'scale' | 'roadmap' | 'costs'>('prd');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedApi, setSelectedApi] = useState(0);
  const [apiConsoleLogs, setApiConsoleLogs] = useState<string[]>([]);
  const [apiTriggered, setApiTriggered] = useState(false);
  const [scaleUsers, setScaleUsers] = useState(10000); // Dynamic range from 1k to 1M

  // API testing simulation
  const handleTestApi = (index: number) => {
    const api = API_SPEC_DATA[index];
    setApiTriggered(true);
    setApiConsoleLogs([
      `[SECURE TUNNEL] Initializing request to ${api.path}...`,
      `[HEADERS] Exposing secure tokens: HTTP Bearer JWT`,
      `[PAYLOAD] Sending payload: ${api.requestPayload ? 'Strict Content Attached' : 'Empty Block'}`,
      `[OWASP GUARD] Performing malware scan on file variables... OK!`,
      `[DATABASE] Resolving connection pool to Postgres Cluster (Multi-AZ)...`,
      `[RESPONSE] Received code 200 OK. Parsing split payouts calculation payload...`,
      `[DONE] Command parsed successfully!`
    ]);
  };

  // Dynamic Scale Calculator
  const getScaleMetrics = (users: number) => {
    const hitsPerS = Math.max(1, Math.round((users * 0.15) / 60)); // 15% concurrent active users
    const rdsIops = Math.max(100, Math.round(users * 0.05));
    const cloudfrontGb = Math.max(5, Math.round((users * 0.12)));
    const databaseMasterRole = users > 250000 ? "Multi-AZ Aurora Serverless Engine + 3 Read Replicas" : "Single db.r6g cluster";
    const cacheHitRatio = "98.4% (Redis Cluster Multi-Node)";
    const totalCost = Math.round(95 + (users / 1000000) * 1400);

    return { hitsPerS, rdsIops, cloudfrontGb, databaseMasterRole, cacheHitRatio, totalCost };
  };

  const metrics = getScaleMetrics(scaleUsers);

  const sidebarItems = [
    { id: 'prd', label: '1. Executive PRD', icon: FileTextIcon },
    { id: 'db', label: '2. DB Schema (Postgres)', icon: Database },
    { id: 'api', label: '3. API Endpoints (Rails)', icon: Code },
    { id: 'wireframes', label: '4. Folder & Clean Architecture', icon: Layers },
    { id: 'infra', label: '5. AWS Deployment Diagram', icon: Cloud },
    { id: 'scale', label: '6. High Scale (1M Users)', icon: TrendingUp },
    { id: 'roadmap', label: '7. 12-Week MVP Roadmap', icon: Calendar },
    { id: 'costs', label: '8. MVP & Pro cost estimator', icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="specs-hub-root">
      {/* Sidebar navigation */}
      <div className="lg:col-span-3 flex flex-col space-y-2 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-rose-100 shadow-sm">
        <div className="p-3 mb-2 border-b border-rose-50/50">
          <p className="text-xs font-mono tracking-wider text-rose-500 uppercase font-semibold">{"Architect's Office"}</p>
          <h3 className="font-serif text-lg text-slate-800 font-bold mt-0.5">Specifications</h3>
        </div>
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all text-left text-sm ${
                isActive
                  ? 'bg-brand-500 text-white font-medium shadow-md shadow-brand-500/20 translate-x-1'
                  : 'text-slate-600 hover:bg-rose-50/50 hover:text-brand-500 hover:translate-x-0.5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primary specs viewport */}
      <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-2xl border border-rose-100 shadow-sm min-h-[600px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {/* 1. PRD SCREEN */}
            {activeTab === 'prd' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Workflow className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">{PRD_DATA.title}</h2>
                    <p className="text-xs text-slate-500">Core Product Requirements Blueprint</p>
                  </div>
                </div>

                <div className="bg-brand-50/50 border border-brand-100 p-5 rounded-xl">
                  <h4 className="font-medium text-brand-800 text-sm mb-1.5 uppercase tracking-wider font-mono">Executive Summary</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{PRD_DATA.executiveSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PRD_DATA.goals.map((g, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/35">
                      <h5 className="font-serif text-brand-500 font-bold mb-1">{g.target}</h5>
                      <p className="text-slate-500 text-xs leading-relaxed">{g.metric}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-800 mb-3">User Journeys & Personas</h4>
                  <div className="space-y-3">
                    {PRD_DATA.userPersonas.map((p, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                        <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 shrink-0"></span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{p.role}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{p.needs}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-800 mb-3">Key Functional Epics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PRD_DATA.epics.map((e) => (
                      <div key={e.id} className="p-4 rounded-xl border border-rose-50 bg-gradient-to-br from-white to-rose-50/20 relative">
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-mono bg-brand-100 text-brand-800 rounded font-bold">{e.id}</span>
                        <h5 className="font-semibold text-slate-800 pr-12 text-sm">{e.title}</h5>
                        <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{e.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-800 mb-3">Non-Functional & Security Frameworks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PRD_DATA.nonFunctional.map((nf, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">{nf.aspect}</p>
                        <p className="text-xs text-slate-600 font-medium mt-2 leading-relaxed">{nf.req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. DATABASE SCHEMA */}
            {activeTab === 'db' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Database className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">PostgreSQL Schema Details</h2>
                    <p className="text-xs text-slate-500">Relational Database Schemas & Indexing keys</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-amber-800">Relational Pointer:</strong> Hover or click on items below to review database constraints. This leverages secure RBAC mapping. Foreign keys refer strictly to core IDs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SCHEMA_DATA.map((tbl) => (
                    <div
                      key={tbl.name}
                      onClick={() => setSelectedTable(tbl.name === selectedTable ? null : tbl.name)}
                      className={`cursor-pointer border p-5 rounded-xl transition-all relative ${
                        tbl.name === selectedTable 
                          ? 'border-brand-500 ring-2 ring-brand-100 shadow-md bg-brand-50/10' 
                          : 'border-slate-200 hover:border-brand-200 hover:shadow-sm bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-mono text-base font-bold text-brand-600 flex items-center">
                          <span className="w-2 h-2 rounded bg-brand-500 mr-2"></span>
                          {tbl.name}
                        </h4>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">Table</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{tbl.description}</p>
                      
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {tbl.fields.map((fld) => (
                          <div key={fld.name} className="flex justify-between items-start text-xs border-b border-dashed border-slate-150 pb-1.5 last:border-0 last:pb-0">
                            <div>
                              <span className="font-mono font-bold text-slate-700">{fld.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono ml-2">({fld.type})</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{fld.desc}</p>
                            </div>
                            <span className="text-[9px] text-rose-600 font-mono font-semibold max-w-[120px] truncate">{fld.constraints}</span>
                          </div>
                        ))}
                      </div>

                      {tbl.indexes.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <p className="text-[9px] font-mono uppercase text-slate-400 font-bold tracking-widest mb-1.5">Primary Indexes</p>
                          {tbl.indexes.map((idx, i) => (
                            <code key={i} className="block text-[9px] font-mono text-slate-500 leading-tight bg-slate-50 p-1 rounded mb-1">{idx}</code>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. API SPECIFICATIONS */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Code className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">REST API & Payments Webhooks</h2>
                    <p className="text-xs text-slate-500">Robust secure Ruby on Rails API Specifications</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Selector list */}
                  <div className="lg:col-span-5 space-y-2">
                    <p className="text-xs font-mono font-bold text-slate-400 tracking-wider">ENDPOINTS</p>
                    {API_SPEC_DATA.map((api, idx) => {
                      const colorMap = {
                        GET: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                        POST: 'bg-blue-100 text-blue-800 border-blue-200',
                        PUT: 'bg-amber-100 text-amber-800 border-amber-200',
                        DELETE: 'bg-rose-100 text-rose-800 border-rose-200',
                        PATCH: 'bg-purple-100 text-purple-800 border-purple-200'
                      }[api.method];

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedApi(idx);
                            setApiTriggered(false);
                            setApiConsoleLogs([]);
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col ${
                            idx === selectedApi 
                              ? 'border-brand-500 bg-brand-50/20 shadow-sm' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${colorMap}`}>
                              {api.method}
                            </span>
                            <span className="font-mono text-xs text-slate-800 font-bold truncate">{api.path}</span>
                          </div>
                          <span className="text-xs text-slate-500 mt-1.5 line-clamp-1">{api.description}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sandbox playground */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white/90 relative flex flex-col justify-between h-full min-h-[420px]">
                      <div>
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                          <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-mono text-slate-500 ml-2">Secure API Tester</span>
                          </div>
                          <button
                            onClick={() => handleTestApi(selectedApi)}
                            className="bg-brand-500 hover:bg-brand-600 text-white text-xs px-3.5 py-1.5 rounded-lg transition-all font-medium flex items-center space-x-1.5 shadow-md shadow-brand-500/20 shrink-0"
                          >
                            <Terminal className="w-3 h-3" />
                            <span>Trigger Request</span>
                          </button>
                        </div>

                        {/* Method & Path Display */}
                        <div className="mb-4">
                          <p className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">ENDPOINT DETAILS</p>
                          <div className="flex items-center space-x-3 mt-1.5 font-mono text-xs">
                            <span className="font-bold text-indigo-400">{API_SPEC_DATA[selectedApi].method}</span>
                            <span className="text-slate-200 bg-slate-800/80 px-2 py-0.5 rounded">{API_SPEC_DATA[selectedApi].path}</span>
                          </div>
                        </div>

                        {/* Request parameters */}
                        {API_SPEC_DATA[selectedApi].requestPayload && (
                          <div className="mb-4">
                            <p className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">REQUEST BODY</p>
                            <pre className="text-xs text-indigo-200 mt-1.5 bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-[120px] font-mono line-clamp-4">
                              {API_SPEC_DATA[selectedApi].requestPayload}
                            </pre>
                          </div>
                        )}

                        {/* Response display */}
                        <div>
                          <p className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">RESPONSE SCHEMA (200 OK)</p>
                          <pre className="text-xs text-brand-200 mt-1.5 bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-[140px] font-mono">
                            {API_SPEC_DATA[selectedApi].responsePayload}
                          </pre>
                        </div>
                      </div>

                      {/* Console simulation outputs */}
                      {apiTriggered && (
                        <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/80 p-3 rounded-lg">
                          <p className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider mb-2 flex items-center">
                            <Activity className="w-3 h-3 mr-1.5 animate-pulse" /> Live Terminal Outputs
                          </p>
                          <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                            {apiConsoleLogs.map((log, lidx) => (
                              <p key={lidx} className="font-mono text-[10px] text-emerald-300 leading-relaxed">
                                {log}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. WIREFRAMES & CLEAN ARCHITECTURE */}
            {activeTab === 'wireframes' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Layers className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">System Folder Directories Structure</h2>
                    <p className="text-xs text-slate-500">Robust file layouts mapping React Next.js & Ruby on Rails API backend</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                  {/* Next.js Directory */}
                  <div className="bg-slate-50 border p-5 rounded-xl border-slate-200">
                    <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 mb-3">
                      <span className="p-1 bg-rose-100 text-rose-700 rounded"><Code className="w-3.5 h-3.5"/></span>
                      <h4 className="text-slate-800 font-bold">Next.js 15 Frontend Layout</h4>
                    </div>
                    <pre className="text-slate-600 overflow-x-auto max-h-[460px] whitespace-pre p-2 rounded bg-slate-100/50">
                      {FOLDER_TREE_FRONTEND}
                    </pre>
                  </div>

                  {/* Rails Directory */}
                  <div className="bg-slate-50 border p-5 rounded-xl border-slate-200">
                    <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 mb-3">
                      <span className="p-1 bg-amber-100 text-amber-700 rounded"><Database className="w-3.5 h-3.5"/></span>
                      <h4 className="text-slate-800 font-bold">Ruby on Rails API Backend</h4>
                    </div>
                    <pre className="text-slate-600 overflow-x-auto max-h-[460px] whitespace-pre p-2 rounded bg-slate-100/50">
                      {FOLDER_TREE_BACKEND}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 5. AWS DEPLOYMENT */}
            {activeTab === 'infra' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Cloud className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">Production AWS Deployment Architecture</h2>
                    <p className="text-xs text-slate-500">Secure Multi-AZ highly available Orchestrated infrastructure</p>
                  </div>
                </div>

                {/* Drawn AWS Infrastructure diagram in beautiful CSS elements */}
                <div className="border border-slate-200 bg-slate-900 rounded-2xl p-6 text-white min-h-[450px] relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

                  <div className="text-center mb-6">
                    <span className="px-3 py-1 bg-brand-500/35 border border-brand-500 rounded-full text-xs font-mono font-bold text-brand-300">CLOUD FLOW MATRIX</span>
                    <h4 className="font-serif text-lg font-bold text-slate-100 mt-2">AWS secure edge pipeline map</h4>
                  </div>

                  {/* Interactive flow items */}
                  <div className="space-y-4 max-w-2xl mx-auto w-full">
                    {/* Layer 1: Edge (DNS -> CDN -> WAF) */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs flex flex-col items-center justify-center font-mono">
                        <span className="text-rose-400 font-bold">Route 53</span>
                        <span className="text-[9px] text-slate-400 mt-1">Multi-Latency DNS</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs flex flex-col items-center justify-center font-mono">
                        <span className="text-amber-400 font-bold">CloudFront CDN</span>
                        <span className="text-[9px] text-slate-400 mt-1">200+ Edge Nodes</span>
                      </div>
                      <div className="p-2.5 bg-rose-955/25 border border-rose-900 rounded-xl text-xs flex flex-col items-center justify-center font-mono">
                        <span className="text-red-400 font-bold">AWS WAF v2</span>
                        <span className="text-[9px] text-slate-400 mt-1">DDOS Shield Layer</span>
                      </div>
                    </div>

                    {/* Arrow node */}
                    <div className="flex justify-center"><ChevronRight className="rotate-90 w-4 h-4 text-brand-300" /></div>

                    {/* Layer 2: Routing / App load balancer */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center">
                      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">Amazon VPC (Secure Subnets)</span>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
                          <span className="text-indigo-400 font-bold">ALB Load Balancer</span>
                          <span className="block text-[9px] text-slate-400 mt-1">SSL Offloading Gateway</span>
                        </div>
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
                          <span className="text-sky-400 font-bold">Public Bastion Hub</span>
                          <span className="block text-[9px] text-slate-400 mt-1">Audit-Logged Entry</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow node */}
                    <div className="flex justify-center"><ChevronRight className="rotate-90 w-4 h-4 text-brand-300" /></div>

                    {/* Layer 3: Application Clusters */}
                    <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-center relative">
                      <span className="text-[9px] text-emerald-400 font-mono tracking-widest uppercase">PRIVATE SECURE SUBNETS (AZ-A & AZ-B)</span>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono leading-tight">
                          <span className="text-emerald-400 font-bold">Next.js SSR</span>
                          <p className="text-[8px] text-slate-500 mt-0.5">ECS Container</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono leading-tight bg-slate-950">
                          <span className="text-orange-400 font-bold">Rails API</span>
                          <p className="text-[8px] text-slate-500 mt-0.5">ECS Docker Core</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono leading-tight">
                          <span className="text-purple-400 font-bold">Sidekiq Thread</span>
                          <p className="text-[8px] text-slate-500 mt-0.5">Scheduler Pool</p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow node */}
                    <div className="flex justify-center"><ChevronRight className="rotate-90 w-4 h-4 text-brand-300" /></div>

                    {/* Layer 4: Storage systems */}
                    <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                      <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex flex-col justify-center items-center">
                        <span className="text-indigo-400 font-bold">RDS Postgres</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Aurora Serverless</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex flex-col justify-center items-center">
                        <span className="text-rose-400 font-bold">AWS S3 (KMS)</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Product Images</span>
                      </div>
                      <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl flex flex-col justify-center items-center font-mono">
                        <span className="text-red-400 font-bold">Redis Cache</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Session Store</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 text-center">
                    All storage interfaces (S3 & RDS) are encrypted at rest with custom AWS KMS Customer Managed Keys.
                  </div>
                </div>
              </div>
            )}

            {/* 6. SCALABILITY STRATEGY */}
            {activeTab === 'scale' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><TrendingUp className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">Dynamic Scale Performance Slider</h2>
                    <p className="text-xs text-slate-500">Calculate systems load requirements dynamically up to 1,000,000 users</p>
                  </div>
                </div>

                {/* Range slider */}
                <div className="bg-slate-50 border p-5 md:p-6 rounded-xl border-rose-100">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                    <div>
                      <p className="text-xs font-mono text-rose-500 font-bold uppercase tracking-wider">PROJECTED USER BASE</p>
                      <h4 className="font-serif text-2xl font-bold text-brand-800 flex items-center mt-1">
                        {scaleUsers.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500 ml-1.5">Registered Accounts</span>
                      </h4>
                    </div>
                    {/* Input range */}
                    <div className="w-full md:w-64">
                      <input
                        type="range"
                        min="1000"
                        max="1000000"
                        step="10000"
                        value={scaleUsers}
                        onChange={(e) => setScaleUsers(Number(e.target.value))}
                        className="w-full accent-brand-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>1K Users</span>
                        <span>1 Million</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculations breakdown cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-white border border-rose-50 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase block">Estimated Requests Rate</span>
                      <strong className="text-xl font-serif text-slate-800 block mt-1">{metrics.hitsPerS.toLocaleString()} Req/Sec</strong>
                      <span className="text-[10px] text-slate-500 mt-1 block">Hits based on average session active ratios</span>
                    </div>

                    <div className="p-4 bg-white border border-rose-50 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase block">AWS RDS PostgreSQL Load</span>
                      <strong className="text-xl font-serif text-slate-800 block mt-1">{metrics.rdsIops.toLocaleString()} Target IOPS</strong>
                      <span className="text-[10px] text-slate-500 mt-1 block">Projected disk reads/writes operations scale</span>
                    </div>

                    <div className="p-4 bg-white border border-rose-50 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-400 font-semibold font-mono uppercase block">CloudFront CDN Outbound</span>
                      <strong className="text-xl font-serif text-slate-800 block mt-1">{metrics.cloudfrontGb.toLocaleString()} GB/Day</strong>
                      <span className="text-[10px] text-slate-500 mt-1 block">Image streaming throughput capacity needed</span>
                    </div>
                  </div>

                  <div className="mt-5 p-4 bg-brand-50/50 border border-brand-100 rounded-xl space-y-2.5">
                    <h5 className="text-xs font-mono font-bold text-brand-800 uppercase tracking-widest">Scalability Blueprint Guide</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 font-medium">Database Node Allocation</p>
                        <p className="text-slate-700 font-mono font-bold mt-0.5">{metrics.databaseMasterRole}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Redis Optimization Hit Ratio</p>
                        <p className="text-slate-700 font-mono font-bold mt-0.5">{metrics.cacheHitRatio}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><Calendar className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">12-Week MVP Development Gantt Roadmap</h2>
                    <p className="text-xs text-slate-500">Milestones breakdown to secure a production launch with boutique cohorts</p>
                  </div>
                </div>

                <div className="relative border-l border-brand-200 ml-4 pl-6 space-y-8">
                  {ROADMAP_12W.map((r, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 bg-brand-500 border-4 border-brand-50 rounded-full flex items-center justify-center shrink-0"></span>
                      
                      <div className="bg-white border hover:border-brand-300 transition-all p-4 rounded-xl shadow-sm max-w-2xl relative">
                        <span className="absolute top-3 right-4 font-mono font-bold text-brand-500 text-xs bg-rose-50 px-2 py-0.5 rounded">
                          {r.week}
                        </span>
                        <h4 className="font-serif font-bold text-slate-800 text-base leading-tight pr-20">{r.title}</h4>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. MVP & SCALE PRICING ROADMAP */}
            {activeTab === 'costs' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 border-b pb-4">
                  <span className="p-2.5 bg-rose-50 text-brand-500 rounded-lg"><DollarSign className="w-5 h-5"/></span>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-800">Hosting Cost Estimations (AWS & Tools)</h2>
                    <p className="text-xs text-slate-500">Estimations comparing bootstrap MVP versus a heavy high-scale ecosystem page</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {/* MVP costs */}
                  <div className="border border-slate-200 p-5 rounded-xl bg-slate-50">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                      <h4 className="font-serif font-bold text-slate-800 text-base">Cost Tier 1: Bootstrap MVP ({'<'}$100/mo)</h4>
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Optimal</span>
                    </div>

                    <div className="space-y-2.5">
                      {COST_DATA.mvp.map((item, id) => (
                        <div key={id} className={`flex justify-between items-center text-xs py-1.5 ${item.total ? 'font-bold border-t pt-3 mt-3' : 'border-b border-dashed border-slate-200 pb-2'}`}>
                          <span className="text-slate-600">{item.item || 'Calculated Total (Monthly)'}</span>
                          <span className="font-mono text-slate-800">{item.cost || item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scale costs */}
                  <div className="border border-rose-100 p-5 rounded-xl bg-rose-50/10">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-rose-100">
                      <h4 className="font-serif font-bold text-brand-800 text-base">Cost Tier 2: Core Scale (1M Users)</h4>
                      <span className="text-xs font-mono font-bold bg-brand-100 text-brand-800 px-2' pad px-2 py-0.5 rounded">Pro Production</span>
                    </div>

                    <div className="space-y-2.5">
                      {COST_DATA.scale.map((item, id) => (
                        <div key={id} className={`flex justify-between items-center text-xs py-1.5 ${item.total ? 'font-bold border-t pt-3 mt-3' : 'border-b border-dashed border-rose-100 pb-2'}`}>
                          <span className="text-slate-600">{item.item || 'Calculated Total (Monthly)'}</span>
                          <span className="font-mono text-slate-800">{item.cost || item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-100 text-xs text-amber-700 rounded-xl leading-relaxed flex items-start space-x-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <p>
                    <strong>Estimated transaction billing:</strong> Razorpay splitsettle collects 1.8% to 2% standard rate on capture. For the scale tier, savings are optimized using AWS Reservation Instances (RI) on Fargate and RDS nodes reducing infrastructure billing up to 35%.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer info inside spec hub */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs text-slate-400 font-mono">
          <span>SPECIFICATION LEVEL: SECURED PRODUCTION READY (SECURE SEEDS)</span>
          <span>DATE GENERATED: 2026-06-16 UTC</span>
        </div>
      </div>
    </div>
  );
}

// Custom simple File icon since we used normal FileTextIcon or standard Text
function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2500/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
