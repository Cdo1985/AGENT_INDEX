/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import WikisTab from "./components/WikisTab";
import DictionaryTab from "./components/DictionaryTab";
import StrategiesTab from "./components/StrategiesTab";
import NewsletterTab from "./components/NewsletterTab";
import ConsultantTab from "./components/ConsultantTab";
import {
  Cpu,
  BookOpen,
  TrendingUp,
  Mail,
  MessageSquare,
  Layers,
  CircleAlert,
  Compass,
  Sun,
  Moon
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"wiki" | "concepts" | "strategies" | "dispatch" | "advisor">("wiki");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("agent-index-theme");
      return saved === "dark";
    }
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("agent-index-theme", next ? "dark" : "light");
      return next;
    });
  };

  // Exact live data metrics matching our data.ts exactly
  const totalFrameworks = 6;
  const totalConcepts = 6;
  const totalExpertStrategies = 3;

  return (
    <div className={`min-h-screen bg-[#F9F8F6] text-[#121212] antialiased font-sans pb-16 flex flex-col justify-between ${isDarkMode ? "dark" : ""}`} id="app-root">
      {/* Newspaper border styled wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full relative z-10" id="main-grid">
        
        {/* Editorial Top Info Header */}
        <div className="flex justify-between items-center border-b-2 border-[#121212] pb-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80" id="top-bar-branding">
          <span>The Intelligence Compendium</span>
          <span className="hidden md:inline">Active Transmission // No. 042</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">EST. 2026</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#121212] bg-[#f0eee9] text-[#121212] hover:bg-white transition cursor-pointer font-mono font-bold text-[9px] tracking-wider select-none uppercase shadow-[1px_1px_0px_#121212] active:translate-y-0.5 active:shadow-none"
              title="Toggle editorial theme mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3 h-3 text-[#ea580c]" /> Mode: Charcoal
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-[#ea580c]" /> Mode: Cream
                </>
              )}
            </button>
          </div>
        </div>

        {/* Banner header and Telemetry stats */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#121212]" id="header-banner">
          <div className="space-y-3">
            <span className="inline-block px-2 py-0.5 border border-[#121212] text-[9px] font-black uppercase tracking-widest text-[#ea580c] bg-white">
              DEEP DIVE REPORT
            </span>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none text-[#121212]" style={{ fontFamily: "Georgia, serif" }}>
              AGENT_INDEX
            </h1>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed font-serif">
              An authoritative index cataloging top orchestration frameworks (<span className="italic font-semibold">LangGraph, CrewAI, Pydantic AI</span>) and autonomous wealth agent strategies with secure, live server-side AI integrations.
            </p>
          </div>

          {/* Telemetry block */}
          <div className="grid grid-cols-3 gap-8 pl-0 md:pl-6 pt-4 md:pt-0" id="telemetry-grid">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Frameworks</span>
              <p className="text-xl font-bold text-[#121212] font-serif italic leading-none">{totalFrameworks} Cataloged</p>
            </div>
            <div className="space-y-1 border-x border-[#121212]/20 px-8">
              <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Dictionary</span>
              <p className="text-xl font-bold text-[#121212] font-serif italic leading-none">{totalConcepts} Terms</p>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Expert Specs</span>
              <p className="text-xl font-bold text-[#ea580c] font-serif italic leading-none">{totalExpertStrategies} Pilots</p>
            </div>
          </div>
        </header>

        {/* Global tab navigation */}
        <div className="flex flex-wrap gap-2 pt-2" id="root-tabs-bar">
          {/* Tab 1: Wikis */}
          <button
            id="tab-btn-wiki"
            onClick={() => setActiveTab("wiki")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 border-2 border-[#121212] ${
              activeTab === "wiki"
                ? "bg-[#121212] text-white shadow-none"
                : "bg-white text-[#121212] hover:bg-stone-100"
            }`}
          >
            I. Frameworks Wiki
          </button>

          {/* Tab 2: Concepts */}
          <button
            id="tab-btn-concepts"
            onClick={() => setActiveTab("concepts")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 border-2 border-[#121212] ${
              activeTab === "concepts"
                ? "bg-[#121212] text-white shadow-none"
                : "bg-white text-[#121212] hover:bg-stone-100"
            }`}
          >
            II. Cognitive Dictionary
          </button>

          {/* Tab 3: Strategies */}
          <button
            id="tab-btn-strategies"
            onClick={() => setActiveTab("strategies")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 border-2 border-[#121212] ${
              activeTab === "strategies"
                ? "bg-[#121212] text-white shadow-none"
                : "bg-white text-[#121212] hover:bg-stone-100"
            }`}
          >
            III. Wealth Strategy Vault
          </button>

          {/* Tab 4: Dispatch */}
          <button
            id="tab-btn-dispatch"
            onClick={() => setActiveTab("dispatch")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 border-2 border-[#121212] ${
              activeTab === "dispatch"
                ? "bg-[#121212] text-white shadow-none"
                : "bg-white text-[#121212] hover:bg-stone-100"
            }`}
          >
            IV. Weekly Dispatch
          </button>

          {/* Tab 5: Advisor */}
          <button
            id="tab-btn-advisor"
            onClick={() => setActiveTab("advisor")}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-150 border-2 border-[#121212] ${
              activeTab === "advisor"
                ? "bg-[#121212] text-white shadow-none"
                : "bg-white text-[#121212] hover:bg-stone-100"
            }`}
          >
            V. Architect Consultation
          </button>
        </div>

        {/* Security / Live indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#121212] bg-[#f0eee9] border border-[#e5e4e2] p-4 rounded-none" id="api-security-alert">
          <span className="flex items-center gap-2">
            <CircleAlert className="w-4 h-4 text-[#ea580c] shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Security Protocol:</span>
            <span className="font-serif italic text-stone-700">All evaluation execution calls are strictly proxied server-side to guarantee developer security.</span>
          </span>
          <span className="font-mono text-[10px] border border-[#121212] px-2 py-0.5 bg-white text-[#121212] shrink-0 select-none">
            PORT: 3000 // INGRESS SECURED
          </span>
        </div>

        {/* Dynamic Tab Body Render */}
        <main className="min-h-[480px] pt-2" id="tab-body-container">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "wiki" && <WikisTab />}
            {activeTab === "concepts" && <DictionaryTab />}
            {activeTab === "strategies" && <StrategiesTab />}
            {activeTab === "dispatch" && <NewsletterTab />}
            {activeTab === "advisor" && <ConsultantTab />}
          </motion.div>
        </main>
      </div>

      {/* Styled Crimson/Orange Editorial Footer */}
      <footer className="mt-16 w-full" id="app-footer">
        <div className="bg-[#ea580c] text-white px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4 border-t-2 border-[#121212]">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em]">Encrypted Transmission // Agentic State 2026</p>
          <div className="flex gap-6 font-mono text-[10px] items-center text-white/90">
            <span>MODEL: GEMINI_3.5_FLASH</span>
            <span className="hidden sm:inline">•</span>
            <span className="font-mono bg-[#121212] px-2.5 py-0.5 text-white">HASH: 8f2b-9e4a-11dc-9012-005056c00008</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
