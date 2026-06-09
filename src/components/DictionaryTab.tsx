import React, { useState } from "react";
import { dictionaryList } from "../data";
import { DictionaryTerm } from "../types";
import { Search, Hash, LayoutGrid, Cpu, Activity, RefreshCw } from "lucide-react";

export default function DictionaryTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Cognitive Patterns", "Memory & Context", "Tools & Actions", "Architectures"];

  const filteredTerms = dictionaryList.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="dictionary-tab-root">
      {/* Search and Filters panel */}
      <div className="bg-white border-2 border-[#121212] p-5 flex flex-col md:flex-row gap-4 items-center justify-between" id="search-filter-card">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            id="dict-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search structural terms..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#f0eee9] border border-[#121212]/30 hover:border-[#121212] focus:border-[#121212] focus:bg-white rounded-none transition duration-150 outline-none font-mono"
          />
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 justify-start md:justify-end w-full md:w-auto" id="dict-category-list">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-none font-bold transition duration-150 border cursor-pointer ${
                  isSelected
                    ? "bg-[#121212] border-[#121212] text-white"
                    : "bg-white border-[#121212]/30 text-stone-600 hover:text-[#121212] hover:border-[#121212]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid List of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dict-results-container">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((t, idx) => {
            // Pick icon for category
            const categoryIcon = () => {
              switch (t.category) {
                case "Architectures":
                  return <LayoutGrid className="w-3.5 h-3.5 text-[#121212]" />;
                case "Cognitive Patterns":
                  return <Cpu className="w-3.5 h-3.5 text-[#ea580c]" />;
                case "Memory & Context":
                  return <Activity className="w-3.5 h-3.5 text-[#121212]" />;
                case "Tools & Actions":
                  return <RefreshCw className="w-3.5 h-3.5 text-[#ea580c]" />;
                default:
                  return <Hash className="w-3.5 h-3.5 text-stone-400" />;
              }
            };

            return (
              <div
                key={t.term}
                id={`term-card-${idx}`}
                className="bg-white border-2 border-[#121212] p-6 shadow-[3px_3px_0px_#121212] flex flex-col justify-between group h-full transition-transform hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-bold bg-[#f0eee9] border border-[#121212]/20 text-[#121212] uppercase font-mono">
                    {categoryIcon()}
                    {t.category}
                  </div>

                  {/* Term Name */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-serif italic text-[#121212] group-hover:text-[#ea580c] transition duration-150">
                      {t.term}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">Core Paradigm definition</p>
                  </div>

                  {/* Definitions */}
                  <div className="space-y-3">
                    <p className="text-sm text-[#121212] font-semibold font-serif leading-snug">
                      {t.definition}
                    </p>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {t.explanation}
                    </p>
                  </div>
                </div>

                {/* ASCII Execution Flowchart (Dynamic structural rendering) */}
                {t.diagramPattern && (
                  <div className="mt-5 space-y-1.5" id={`diagram-sec-${idx}`}>
                    <span className="text-[9px] font-bold text-[#ea580c] uppercase tracking-widest font-mono">Execution Flow Blueprint</span>
                    <div className="p-3 bg-stone-50 border border-[#121212]/20 rounded-none overflow-x-auto">
                      <code className="text-[10px] font-mono text-stone-700 whitespace-pre block leading-relaxed">{t.diagramPattern}</code>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white border-2 border-dashed border-[#121212]/30 rounded-none" id="dict-no-results">
            <LayoutGrid className="w-8 h-8 text-stone-400 mx-auto" />
            <h4 className="text-sm font-bold text-stone-800 mt-3 font-mono">No matching dictionary term found</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-serif">Try typing standard agent concepts like "RAG", "ReAct", "Reflection", "Memory", or "Cyclic State".</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 inline-flex items-center text-xs font-bold text-white bg-[#121212] hover:bg-stone-800 px-3 py-1.5 rounded-none transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
