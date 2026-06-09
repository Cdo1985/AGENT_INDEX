/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Framework } from "../types";
import { frameworksList } from "../data";
import { Code, BookOpen, Terminal, Check, Copy, Cpu, Layers, Star } from "lucide-react";

export default function WikisTab() {
  const [selectedId, setSelectedId] = useState<string>("langgraph");
  const [copied, setCopied] = useState<boolean>(false);

  const selected = frameworksList.find((f) => f.id === selectedId) || frameworksList[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="wiki-tab-container">
      {/* Sidebar: Frameworks List */}
      <div className="lg:col-span-4 space-y-4" id="wiki-sidebar">
        <div className="p-5 bg-[#121212] text-white border-2 border-[#121212]" id="wiki-sidebar-header">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 font-mono">
            <Cpu className="w-4 h-4 text-[#ea580c]" /> Framework Taxonomy
          </h3>
          <p className="text-[11px] text-stone-300 mt-2 leading-relaxed font-serif italic">
            Select an active development framework to inspect its parameters and capabilities.
          </p>
        </div>

        <div className="space-y-2" id="wiki-menu-list">
          {frameworksList.map((f, idx) => {
            const isSelected = f.id === selected.id;
            return (
              <button
                key={f.id}
                id={`btn-select-framework-${f.id}`}
                onClick={() => {
                  setSelectedId(f.id);
                  setCopied(false);
                }}
                className={`w-full text-left p-4 rounded-none transition-all duration-150 border-2 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? "bg-[#f0eee9] border-[#121212] shadow-none text-[#121212]"
                    : "bg-white border-[#121212]/30 hover:border-[#121212] hover:bg-stone-50 text-stone-600 hover:text-[#121212]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-[#121212] font-mono">
                    <span className="text-[10px] text-[#ea580c] font-bold">0{idx + 1}.</span>
                    {f.name}
                    {f.stars && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-[#121212] text-white font-mono">
                        ★ {f.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1.5 truncate max-w-[220px] font-serif italic">{f.description}</p>
                </div>
                <div className={`p-1.5 border transition-all ${
                  isSelected ? "bg-[#121212] text-white border-[#121212]" : "bg-transparent text-stone-400 group-hover:text-[#121212] border-transparent"
                }`}>
                  <Terminal className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Details Screen */}
      <div className="lg:col-span-8" id="wiki-main-panel">
        <div className="bg-white border-2 border-[#121212] p-6 md:p-8 space-y-6" id={`wiki-viewport-${selected.id}`}>
          
          {/* Header Title Information */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#121212]">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-white font-bold font-mono uppercase bg-[#ea580c] px-2.5 py-1 w-fit">
                <Layers className="w-3.5 h-3.5" /> {selected.architectureType} ARCHITECTURE
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#121212] mt-4 font-serif italic tracking-tight">{selected.name}</h2>
              <p className="text-xs text-stone-500 mt-1 font-serif">
                First-class development maintainer: <span className="font-bold underline text-[#121212]">{selected.developer}</span>
              </p>
            </div>
            <a
              href={selected.officialDocs}
              target="_blank"
              rel="noopener noreferrer"
              id={`link-docs-${selected.id}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#121212] hover:bg-stone-800 border border-[#121212] rounded-none transition"
            >
              <BookOpen className="w-3.5 h-3.5" /> Direct Docs
            </a>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 border border-[#121212] text-[9px] font-black uppercase text-[#ea580c]">
              DEEP ANALYSIS
            </span>
            <p className="text-sm text-stone-700 leading-relaxed font-serif italic text-lg">{selected.description}</p>
          </div>

          {/* Grid Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#f0eee9] border border-[#e5e4e2] space-y-1">
              <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-widest font-mono">Core Strengths</span>
              <p className="text-xs text-[#121212] leading-relaxed font-sans font-semibold">{selected.coreStrength}</p>
            </div>
            <div className="p-4 bg-white border border-[#121212] space-y-1">
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest font-mono">Best-Fit Deployment Range</span>
              <p className="text-xs text-[#121212] leading-relaxed font-serif italic">{selected.bestUseCase}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono">Supported Languages:</span>
            <div className="flex flex-wrap gap-1.5" id={`langs-${selected.id}`}>
              {selected.languageSupports.map((lang) => (
                <span key={lang} className="px-2.5 py-1 text-xs bg-[#121212] text-white font-mono font-bold">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Code Framework Snippet */}
          <div className="space-y-3 pt-6 border-t border-[#121212]" id="code-snippet-box">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" /> Standard Template Entry Point
              </h4>
              <button
                id="btn-copy-wiki-snippet"
                onClick={() => handleCopy(selected.codeSnippet)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#121212] bg-[#f0eee9] hover:bg-stone-200 border border-[#121212]/30 rounded-none transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#ea580c]" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="relative rounded-none overflow-hidden bg-[#121212] border-2 border-[#121212] p-4 font-mono text-xs text-stone-200 leading-relaxed overflow-x-auto">
              <pre className="whitespace-pre">{selected.codeSnippet}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
