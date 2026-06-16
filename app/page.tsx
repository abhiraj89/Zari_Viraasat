'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, ShoppingBag, Shield, Heart, MapPin } from 'lucide-react';
import SpecsHub from '@/components/specs-hub';
import DemoPortal from '@/components/demo-portal';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'demo' | 'specs'>('demo');

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#2D2926]" id="zari-app-main">
      {/* Decorative Viraasat Style Header Banner */}
      <header className="relative w-full bg-[#FAF9F6] py-10 px-6 md:px-12 text-[#2D2926] border-b border-[#2D2926]/10 overflow-hidden">
        {/* Lattice embroidery overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#2D2926_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[linear-gradient(90deg,transparent_25%,#8B4513_25%,#8B4513_50%,transparent_50%,transparent_75%,#8B4513_75%)] [background-size:24px_1.5px] opacity-40"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B4513] font-bold">Designer SPOTLIGHT & BLUEPRINTS</span>
            <div className="flex items-center space-x-2 mt-1">
              <h1 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-[#2D2926]">
                ZARÌ × <span className="font-serif italic font-semibold text-[#8B4513]">Viraasat</span>
              </h1>
            </div>
            <p className="font-sans text-[11px] uppercase tracking-widest text-[#2D2926]/60">
              Traditional Indian Dress Designer Marketplace • Production Architecture Blueprints
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 bg-[#EAE8E4]/40 p-1.5 border border-[#2D2926]/10 rounded-full max-w-md shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('demo')}
              className={`py-2 px-6 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'demo'
                  ? 'bg-[#2D2926] text-[#FAF9F6] shadow-sm'
                  : 'text-[#2D2926]/70 hover:text-[#8B4513] hover:bg-[#FAF9F6]/80'
              }`}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Interactive Sandbox</span>
            </button>
            
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-2 px-6 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'specs'
                  ? 'bg-[#2D2926] text-[#FAF9F6] shadow-sm'
                  : 'text-[#2D2926]/70 hover:text-[#8B4513] hover:bg-[#FAF9F6]/80'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Platform Blueprints</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary Container */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === 'demo' ? (
          <div className="space-y-6">
            <div className="border border-[#2D2926]/10 bg-[#EAE8E4]/20 p-6 rounded-[28px] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] font-bold text-[#8B4513] uppercase tracking-widest">MOCK PLATFORM ENVIRONMENT</span>
                <h3 className="font-serif italic font-bold text-[#2D2926] text-xl">Zari Indian Fashion Sandbox</h3>
                <p className="text-xs text-[#2D2926]/70 leading-relaxed md:max-w-2xl">
                  Play with customer, boutique designer, and administrator roles dynamically. Upload mock pieces manually or leverage the server-side co-design module to generate fully populated high-fidelity catalog items using Gemini!
                </p>
              </div>
              <div className="flex gap-2 font-mono text-[10px] bg-[#FAF9F6] border border-[#2D2926]/10 p-2.5 rounded-xl text-[#2D2926]/70 shrink-0">
                <p className="flex items-center"><MapPin className="w-3 h-3 text-[#8B4513] mr-1" /> Varanasi, Lucknow, Jaipur, Mumbai</p>
              </div>
            </div>
            <DemoPortal />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border border-[#2D2926]/10 bg-[#EAE8E4]/20 p-6 rounded-[28px] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[9px] font-bold text-[#8B4513] uppercase tracking-widest">CTO BLUEPRINTS DECK</span>
                <h3 className="font-serif italic font-bold text-[#2D2926] text-xl">{"Architect's Technical Hub"}</h3>
                <p className="text-xs text-[#2D2926]/70 leading-relaxed md:max-w-2xl">
                  Deeply explore complete startup PRDs, multi-table database indexes, REST API specifications with test request trigger simulators, server folder maps, Multi-AZ AWS architecture pipelines, testing arrays, and budget Gantts.
                </p>
              </div>
              <div className="flex gap-2 font-mono text-[10px] bg-[#FAF9F6] border border-[#2D2926]/10 p-2.5 rounded-xl text-[#2D2926]/70 shrink-0">
                <p className="flex items-center"><Shield className="w-3 h-3 text-[#8B4513] mr-1" /> RBAC, KMS Encryption, OWASP-Guard Enabled</p>
              </div>
            </div>
            <SpecsHub />
          </div>
        )}
      </section>

      {/* Pure Artisan footer credits */}
      <footer className="mt-16 py-12 border-t border-[#2D2926]/10 bg-[#EAE8E4]/40 text-center text-[#2D2926]/60 text-xs font-sans tracking-wide">
        <p className="font-serif font-bold text-[#2D2926] tracking-widest">ZARI × VIRAASAT PLATFORM SYSTEMS</p>
        <p className="text-[11px] text-[#2D2926]/70 mt-1.5 max-w-md mx-auto leading-relaxed">
          Inspired by Etsy, Myntra Luxe, and Pinterest. Crafted in a Next.js 15, TypeScript, and Tailwind CSS configuration.
        </p>
      </footer>
    </main>
  );
}
