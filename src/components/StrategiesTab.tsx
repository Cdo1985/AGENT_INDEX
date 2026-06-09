import React, { useState } from "react";
import { wealthStrategies } from "../data";
import { WealthStrategy } from "../types";
import { jsPDF } from "jspdf";
import InteractiveArbitrageScanner from "./InteractiveArbitrageScanner";
import {
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Clock,
  Coins,
  Cpu,
  Check,
  Copy,
  Wrench,
  Compass,
  Code2,
  FileDown
} from "lucide-react";

export default function StrategiesTab() {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("defi-yield-strategy");
  const [copied, setCopied] = useState<boolean>(false);

  // Dynamic state for custom generation
  const [goal, setGoal] = useState("");
  const [complexity, setComplexity] = useState("Intermediate");
  const [budget, setBudget] = useState("Low (< $10/mo)");
  const [orchestrator, setOrchestrator] = useState("LangGraph");
  const [customBlueprint, setCustomBlueprint] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"expert" | "ai">("expert");

  const selectedStrategy = wealthStrategies.find((s) => s.id === selectedStrategyId) || wealthStrategies[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    try {
      const isExpert = (activeSubTab === "expert");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const title = isExpert ? selectedStrategy.title : (customBlueprint?.title || "Custom AI Strategy");
      const objective = isExpert ? selectedStrategy.objective : (customBlueprint?.justification || "");
      const overview = isExpert ? "" : (customBlueprint?.architectureOverview || "");
      const difficulty = isExpert ? selectedStrategy.difficulty : complexity;
      const deployment = isExpert ? selectedStrategy.timeToDeploy : (customBlueprint?.estimatedTime || "N/A");
      const returnVal = isExpert ? selectedStrategy.estimatedReturnPattern : (customBlueprint?.estimatedCostPerRun || "N/A");
      const stack = isExpert ? selectedStrategy.recommendedFrameworks.join(", ") : (customBlueprint?.recommendedFramework || "N/A");
      const code = isExpert ? selectedStrategy.codeExample : (customBlueprint?.codeSnippet || "");
      const safety = isExpert ? selectedStrategy.executionSafetyGuidelines : (customBlueprint?.criticalRisks || "");
      const steps = isExpert 
        ? selectedStrategy.workflow.map(w => ({ name: w.name, executor: w.executor, desc: w.description }))
        : (customBlueprint?.workflow || []).map((w: any) => ({ name: w.stepName || "Step", executor: w.executorAgent || "Agent", desc: w.actionDescription || "" }));
      const tipsList = isExpert ? selectedStrategy.tips : [
        "Monitor runtime latency to stay under budget bounds.",
        "Check JSON-schema validator compliance to prevent tool invocation faults."
      ];

      let y = 15;
      const pageHeight = 297;
      const margin = 15;
      const width = 180;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - margin) {
          doc.addPage();
          y = 20;
          drawPageDecorations();
        }
      };

      const drawPageDecorations = () => {
        // Small elegant running header
        doc.setFont("times", "bold");
        doc.setFontSize(8);
        doc.setTextColor(18, 18, 18);
        doc.text("THE INTELLIGENCE COMPENDIUM", margin, 12);
        
        doc.setFont("times", "normal");
        doc.text("EST. 2026 // State Transmission // SECURE INDEX", margin + 110, 12);
        
        // Thin line under running header
        doc.setDrawColor(18, 18, 18);
        doc.setLineWidth(0.2);
        doc.line(margin, 13.5, margin + width, 13.5);
      };

      // --- PAGE 1: HEADER & BANNER ---
      drawPageDecorations();
      y = 22;

      // Header Branding Banner
      doc.setFont("times", "bold");
      doc.setFontSize(10);
      doc.text("TACTICAL DOSSIER CATALOGUE", margin, y);
      y += 5;

      // Huge bold title
      doc.setFont("times", "bolditalic");
      doc.setFontSize(22);
      const splitTitle = doc.splitTextToSize(title.toUpperCase(), width);
      doc.text(splitTitle, margin, y);
      y += (splitTitle.length * 8) + 2;

      // Double elegant newspaper rules
      doc.setLineWidth(0.6);
      doc.line(margin, y, margin + width, y);
      y += 1.5;
      doc.setLineWidth(0.2);
      doc.line(margin, y, margin + width, y);
      y += 6;

      // SPECIFICATIONS BOX (Editorial frame)
      checkPageBreak(30);
      doc.setDrawColor(18, 18, 18);
      doc.setLineWidth(0.4);
      doc.setFillColor(240, 238, 233); // warm #f0eee9 editorial color background
      doc.rect(margin, y, width, 22, "FD");

      doc.setFont("times", "bold");
      doc.setFontSize(8);
      
      // Column 1
      doc.text("I. COMPLEXITY", margin + 5, y + 6);
      doc.setFont("times", "normal");
      doc.text(difficulty.toUpperCase(), margin + 5, y + 12);

      // Column 2
      doc.setFont("times", "bold");
      doc.text("II. SANDBOX BUILD", margin + 45, y + 6);
      doc.setFont("times", "normal");
      doc.text(deployment, margin + 45, y + 12);

      // Column 3
      doc.setFont("times", "bold");
      doc.text("III. VECTOR PAYOUT", margin + 95, y + 6);
      doc.setFont("times", "normal");
      doc.setFontSize(8);
      doc.text(returnVal, margin + 95, y + 12);

      // Column 4
      doc.setFont("times", "bold");
      doc.text("IV. STACK PREFERENCE", margin + 140, y + 6);
      doc.setFont("times", "normal");
      doc.text(stack.length > 20 ? stack.substring(0, 18) + "..." : stack, margin + 140, y + 12);

      y += 28;

      // ABSTRACT / OBJECTIVE
      checkPageBreak(30);
      doc.setFont("times", "bold");
      doc.setFontSize(9);
      doc.text("ABSTRACT & TACTICAL OBJECTIVE:", margin, y);
      y += 4.5;
      
      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      const splitObj = doc.splitTextToSize(objective, margin + width - 30);
      doc.text(splitObj, margin, y);
      y += (splitObj.length * 4.5) + 6;
      doc.setTextColor(18, 18, 18);

      if (overview) {
        checkPageBreak(30);
        doc.setFont("times", "bold");
        doc.setFontSize(9);
        doc.text("ARCHITECTURE OVERVIEW:", margin, y);
        y += 4.5;
        
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        const splitOver = doc.splitTextToSize(overview, width);
        doc.text(splitOver, margin, y);
        y += (splitOver.length * 4.5) + 6;
      }

      // WORKFLOW STEPS
      checkPageBreak(35);
      doc.setFont("times", "bold");
      doc.setFontSize(10);
      doc.text("SEQUENCE OF EXECUTION PROTOCOLS:", margin, y);
      y += 6;

      steps.forEach((step, idx) => {
        checkPageBreak(25);
        
        // Step Title & Executor
        doc.setFont("times", "bolditalic");
        doc.setFontSize(10);
        doc.text(`[${idx + 1}]  ${step.name}`, margin, y);
        
        doc.setFont("times", "bold");
        doc.setFontSize(8);
        const hostText = `EXEC_UNIT: ${step.executor.toUpperCase()}`;
        const hostX = margin + width - doc.getTextWidth(hostText);
        doc.text(hostText, hostX, y);
        
        y += 4;
        
        // Step description
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        const splitDesc = doc.splitTextToSize(step.desc, width - 4);
        doc.text(splitDesc, margin + 2, y);
        y += (splitDesc.length * 4.5) + 5;
      });

      // SECURITY & RISKS (Highlights)
      if (safety) {
        checkPageBreak(35);
        doc.setDrawColor(234, 88, 12); // Accent color orange boundary
        doc.setLineWidth(0.6);
        doc.setFillColor(254, 242, 237); // subtle warning orange hue background
        
        const splitSafety = doc.splitTextToSize(safety, width - 8);
        const boxHeight = (splitSafety.length * 4.5) + 12;
        
        doc.rect(margin, y, width, boxHeight, "FD");
        
        doc.setFont("times", "bold");
        doc.setFontSize(8);
        doc.setTextColor(234, 88, 12);
        doc.text("CRITICAL EXECUTION SAFETY DIRECTIVE", margin + 4, y + 5);
        
        doc.setFont("times", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(18, 18, 18);
        doc.text(splitSafety, margin + 4, y + 10);
        
        y += boxHeight + 8;
      }

      // CODE IMPLEMENTATION SEC
      if (code) {
        checkPageBreak(40);
        doc.setFont("times", "bold");
        doc.setFontSize(9.5);
        doc.text("STANDARD PYTHON CONFIGURATION MODULE:", margin, y);
        y += 5;

        // Draw light courier box
        doc.setFont("courier", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(40, 40, 40);

        // Simple lines split block wrapper
        const rawLines = code.split("\n");
        const wrappedLines: string[] = [];
        rawLines.forEach((line: string) => {
          const splitLine = doc.splitTextToSize(line, width - 8);
          if (Array.isArray(splitLine)) {
            wrappedLines.push(...splitLine);
          } else {
            wrappedLines.push(splitLine);
          }
        });

        // Split code box into chunks that flow pages perfectly!
        let linesLeft = wrappedLines;
        while (linesLeft.length > 0) {
          // how many lines fit on this page?
          const spaceLeft = pageHeight - margin - y - 6;
          const lineCapacity = Math.floor(spaceLeft / 3.2);
          
          if (lineCapacity <= 4) {
            // Add a page break and draw background box for remainder
            checkPageBreak(45);
            continue;
          }

          const countToTake = Math.min(linesLeft.length, lineCapacity);
          const chunk = linesLeft.slice(0, countToTake);
          linesLeft = linesLeft.slice(countToTake);

          const chunkHeight = (chunk.length * 3.2) + 4;
          
          // draw background rectangle for code block
          doc.setDrawColor(18, 18, 18);
          doc.setLineWidth(0.2);
          doc.setFillColor(248, 248, 248);
          doc.rect(margin, y, width, chunkHeight, "FD");

          doc.text(chunk, margin + 4, y + 4);
          y += chunkHeight + 6;
        }
        doc.setTextColor(18, 18, 18);
      }

      // PRO ADVICE TIPS
      if (tipsList.length > 0) {
        checkPageBreak(25);
        doc.setFont("times", "bold");
        doc.setFontSize(9.5);
        doc.text("PERFORMANCE CALIBRATION ADVICE:", margin, y);
        y += 5;

        tipsList.forEach((tip, idx) => {
          checkPageBreak(15);
          doc.setFont("times", "bold");
          doc.setFontSize(9.5);
          doc.text(`[!]`, margin, y);
          
          doc.setFont("times", "italic");
          doc.setFontSize(9.5);
          const splitTip = doc.splitTextToSize(tip, width - 8);
          doc.text(splitTip, margin + 5, y);
          y += (splitTip.length * 4.5) + 3;
        });
      }

      // SOLID BRAND FOOTER DIRECTIVE
      checkPageBreak(20);
      y += 4;
      doc.setLineWidth(0.6);
      doc.setDrawColor(18, 18, 18);
      doc.line(margin, y, margin + width, y);
      y += 4;

      doc.setFont("times", "bold");
      doc.setFontSize(8);
      doc.text("TRANSMISSION HASH: 8f2b-9e4a-11dc-9012-005056c00008", margin, y);
      doc.text("PRINT INTEGRITY SECURED", margin + width - doc.getTextWidth("PRINT INTEGRITY SECURED"), y);

      // trigger file download
      const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-blueprint.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error("PDF download failed", e);
    }
  };

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setErrorMsg("Please identify a clear target execution goal.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setCustomBlueprint(null);

    try {
      const response = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal,
          budget: budget,
          techLevel: complexity,
          preferredFramework: orchestrator,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate autonomous custom strategy.");
      }

      const block = await response.json();
      setCustomBlueprint(block);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Unable to reach tactical editor. Confirm your internet and secrets setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="strategies-tab-root">
      {/* Switch between expert vaults and dynamic generator */}
      <div className="flex border-b-2 border-[#121212]" id="strategy-headers-nav">
        <button
          onClick={() => setActiveSubTab("expert")}
          className={`pb-3.5 px-6 text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
            activeSubTab === "expert" ? "text-[#ea580c]" : "text-stone-500 hover:text-[#121212]"
          }`}
        >
          {activeSubTab === "expert" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#ea580c]" />
          )}
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4" /> Expert Wealth Blueprints
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("ai")}
          className={`pb-3.5 px-6 text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
            activeSubTab === "ai" ? "text-[#ea580c]" : "text-stone-500 hover:text-[#121212]"
          }`}
        >
          {activeSubTab === "ai" && (
            <span className="absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[#ea580c]" />
          )}
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ea580c]" /> Interactive Strategy Architect
          </span>
        </button>
      </div>

      {activeSubTab === "expert" ? (
        /* ================= EXPERT BLUEPRINTS SUB-TAB ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="expert-subtab-container">
          {/* List panel */}
          <div className="lg:col-span-4 space-y-4" id="stg-list-sidebar">
            <div className="p-5 bg-[#121212] text-white border-2 border-[#121212]" id="stg-sidebar-desc">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 font-mono">
                <Coins className="w-4 h-4 text-[#ea580c]" /> Capital & Task Pilots
              </h4>
              <p className="text-[11px] text-stone-300 mt-2 leading-relaxed font-serif italic">Review active, battle-tested agent strategy flows addressing delta-neutral yields, competitor trackers, and syndicated publications.</p>
            </div>

            <div className="space-y-2" id="stg-list-buttons">
              {wealthStrategies.map((s) => {
                const isSelected = s.id === selectedStrategy.id;
                return (
                  <button
                    key={s.id}
                    id={`btn-select-stg-${s.id}`}
                    onClick={() => {
                      setSelectedStrategyId(s.id);
                      setCopied(false);
                    }}
                    className={`w-full text-left p-4 rounded-none transition duration-150 border-2 flex flex-col gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#f0eee9] border-[#121212] text-[#121212]"
                        : "bg-white border-[#121212]/30 hover:border-[#121212] text-stone-600 hover:text-[#121212]"
                    }`}
                  >
                    <span className="text-sm font-bold font-serif leading-tight">
                      {s.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        s.difficulty === "Advanced" ? "bg-red-50 text-red-700 border-red-200" :
                        s.difficulty === "Intermediate" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                        "bg-teal-50 text-teal-700 border-teal-200"
                      }`}>
                        {s.difficulty}
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {s.timeToDeploy}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details viewport */}
          <div className="lg:col-span-8" id="stg-viewport">
            <div className="bg-white border-2 border-[#121212] p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="pb-6 border-b border-[#121212] flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 border border-[#121212] text-[9px] font-black uppercase text-[#ea580c] bg-white">
                    TACTICAL BLUEPRINT
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black font-serif italic text-[#121212]">{selectedStrategy.title}</h3>
                  <p className="text-sm text-stone-600 mt-1 font-serif italic">{selectedStrategy.objective}</p>
                </div>
                <button
                  id="btn-download-pdf-expert"
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#121212] bg-[#f0eee9] hover:bg-stone-200 transition border-2 border-[#121212] shadow-[2px_2px_0px_#121212] hover:shadow-[1px_1px_0px_#121212] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer shrink-0 self-start md:self-center font-mono"
                >
                  <FileDown className="w-4 h-4 text-[#ea580c]" /> Download PDF
                </button>
              </div>

              {/* Strategy specs banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f0eee9] border border-[#e5e4e2]">
                <div>
                  <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest font-mono block">Complexity</span>
                  <p className="text-xs font-bold text-[#121212] mt-1 uppercase">{selectedStrategy.difficulty}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest font-mono block">Sandbox Build</span>
                  <p className="text-xs font-bold text-[#121212] mt-1">{selectedStrategy.timeToDeploy}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest font-mono block">Return Vector</span>
                  <p className="text-xs font-bold text-[#ea580c] mt-1">{selectedStrategy.estimatedReturnPattern}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest font-mono block">Target Stack</span>
                  <p className="text-xs font-bold text-stone-700 mt-1 truncate">{selectedStrategy.recommendedFrameworks.join(", ")}</p>
                </div>
              </div>

              {/* Execution Workflow Flowchart */}
              <div className="space-y-4" id="stg-workflow">
                <h4 className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider font-mono">1. Workflow Execution Steps</h4>
                <div className="relative pl-6 space-y-6 border-l-2 border-[#121212]">
                  {selectedStrategy.workflow.map((w, idx) => (
                    <div key={w.name} className="relative" id={`workflow-step-${idx}`}>
                      {/* Number bubble */}
                      <span className="absolute left-[-34px] top-0 flex items-center justify-center w-6 h-6 rounded-none bg-[#121212] text-white font-mono text-[10px] font-bold border border-[#121212]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <h5 className="text-base font-bold text-[#121212] font-serif italic">{w.name}</h5>
                          <span className="text-[10px] bg-[#f0eee9] border border-[#e5e4e2] text-stone-700 px-2 py-0.5 font-mono font-medium w-fit">
                            Executor: {w.executor}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 font-sans">{w.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Web Worker Arbitrage Engine */}
              {selectedStrategy.id === "defi-yield-strategy" && (
                <div className="pt-6 border-t border-[#121212] space-y-4" id="section-live-worker-arbitrage">
                  <h4 className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider font-mono">2. Dynamic Sandbox Sandbox Deployment</h4>
                  <InteractiveArbitrageScanner />
                </div>
              )}

              {/* Code initialization block */}
              <div className="space-y-3 pt-6 border-t border-[#121212]" id="stg-code">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-stone-500" /> Implementation Blueprint (Python Source)
                  </h4>
                  <button
                    id="btn-copy-stg"
                    onClick={() => handleCopyCode(selectedStrategy.codeExample)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#121212] bg-[#f0eee9] hover:bg-stone-200 border border-[#121212]/30 rounded-none transition cursor-pointer"
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
                  <pre className="whitespace-pre">{selectedStrategy.codeExample}</pre>
                </div>
              </div>

              {/* Safety guidelines */}
              <div className="p-4 bg-white border-2 border-[#ea580c] space-y-2 flex gap-3 items-start" id="stg-safety">
                <ShieldAlert className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-[#ea580c] uppercase font-mono tracking-widest">Execution Safety Constraint</h5>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans mt-0.5">{selectedStrategy.executionSafetyGuidelines}</p>
                </div>
              </div>

              {/* Quick advice tips checklist */}
              <div className="space-y-2 pt-2" id="stg-tips">
                <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Expert Advice & Performance Calibration</h4>
                <ul className="space-y-2">
                  {selectedStrategy.tips.map((tip, index) => (
                    <li key={index} className="flex gap-2.5 text-xs text-stone-600 font-sans items-start">
                      <span className="text-[#ea580c] mt-0.5 text-xs font-bold">[!]</span>
                      <span className="font-serif italic text-stone-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= INTERACTIVE DYNAMIC AI ARCHITECT SUB-TAB ================= */
        <div className="space-y-6" id="ai-subtab-container">
          <div className="bg-[#121212] text-white border-2 border-[#121212] p-6 md:p-8 space-y-6" id="ai-prompt-card">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-2xl font-bold font-serif italic text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ea580c]" /> Architect Custom Agentic Strategy
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Describe a continuous execution loop or digital asset workflow you wish to automate (financial arbitrage, micro-SaaS data scrapers, niche alerts). Our system uses Gemini 3.5 Flash to generate a real, high-precision engineering architecture.
              </p>
            </div>

            <form onSubmit={handleGenerateStrategy} className="space-y-6 pt-2">
              {/* Target goal text */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider font-mono">Define Target Goal</label>
                <textarea
                  id="ai-goal-textarea"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Crawl Shopify stores daily for products under $50 with positive sentiment drops, then format an alert to my email..."
                  rows={3}
                  className="w-full text-xs bg-white text-[#121212] border-2 border-[#121212] p-4 outline-none transition placeholder-stone-400 leading-relaxed font-mono"
                />
              </div>

              {/* Parameters input grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Complexity */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider font-mono">Expertise Target</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full text-xs font-bold bg-[#121212] text-white border-2 border-white/30 py-2.5 px-3 outline-none"
                  >
                    <option value="Beginner">Beginner (Fast scripts)</option>
                    <option value="Intermediate">Intermediate (Normal setup)</option>
                    <option value="Advanced">Advanced (Cyclic validation)</option>
                  </select>
                </div>

                {/* 2. Budget */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider font-mono">API Cost Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full text-xs font-bold bg-[#121212] text-white border-2 border-white/30 py-2.5 px-3 outline-none"
                  >
                    <option value="Low (< $10/mo)">Low (Lite models / Low frequency)</option>
                    <option value="Medium (< $50/mo)">Medium (Full standard evaluation)</option>
                    <option value="Professional Scale">Professional (Continuous live poll)</option>
                  </select>
                </div>

                {/* 3. Orchestration preferences */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider font-mono">Framework Preference</label>
                  <select
                    value={orchestrator}
                    onChange={(e) => setOrchestrator(e.target.value)}
                    className="w-full text-xs font-bold bg-[#121212] text-white border-2 border-white/30 py-2.5 px-3 outline-none"
                  >
                    <option value="LangGraph">LangGraph (Graph Loops)</option>
                    <option value="CrewAI">CrewAI (Role Playing Agents)</option>
                    <option value="Pydantic AI">Pydantic AI (Type Schema validation)</option>
                    <option value="LlamaIndex Agents">LlamaIndex (Extensive RAG Data)</option>
                    <option value="Recommend Best Match">Match Most Compatible</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  id="btn-architect-blueprint"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#121212] bg-[#ea580c] text-white transition duration-150 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" /> Synthesizing loops...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Architect Agent Blueprint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Validation or Error warnings */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-sans font-bold" id="ai-error-box">
              {errorMsg}
            </div>
          )}

          {/* Dynamic Render of Custom generated Blueprint */}
          {customBlueprint && (
            <div className="bg-white border-2 border-[#121212] p-6 md:p-8 space-y-6 animate-fade-in" id="ai-render-panel">
              {/* Structural title header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#121212]">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold bg-[#f0eee9] text-[#121212] border border-[#121212]/20 font-mono uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#ea580c]" /> Active Dynamic AI Spec
                  </div>
                  <h3 className="text-2xl font-bold font-serif italic text-gray-900">{customBlueprint.title}</h3>
                  <p className="text-xs text-stone-500">Recommended Framework Engine: <span className="font-bold text-[#ea580c]">{customBlueprint.recommendedFramework}</span></p>

                  <div className="flex gap-6 pt-1">
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Build Estimation</span>
                      <p className="text-xs font-bold text-gray-800">{customBlueprint.estimatedTime}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest font-mono">Cost/Evaluation</span>
                      <p className="text-xs font-bold text-[#ea580c]">{customBlueprint.estimatedCostPerRun}</p>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-download-pdf-ai"
                  onClick={downloadPDF}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#121212] bg-[#f0eee9] hover:bg-stone-200 transition border-2 border-[#121212] shadow-[2px_2px_0px_#121212] hover:shadow-[1px_1px_0px_#121212] hover:translate-x-[1px] hover:translate-y-[1px] cursor-pointer shrink-0 self-start md:self-center font-mono"
                >
                  <FileDown className="w-4 h-4 text-[#ea580c]" /> Download PDF
                </button>
              </div>

              {/* Justification & Architecture Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Framework Match Justification</h4>
                  <p className="text-xs text-stone-700 leading-relaxed font-serif italic bg-[#f0eee9] border border-[#e5e4e2] p-4">{customBlueprint.justification}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Workflow Architecture Model</h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans bg-stone-50 border border-stone-200 p-4">{customBlueprint.architectureOverview}</p>
                </div>
              </div>

              {/* Workflow Flow Table */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">Sequential Tasks & Orchestration Loop</h4>
                <div className="border border-[#121212] divide-y divide-[#121212]" id="ai-workflow-steps">
                  {customBlueprint.workflow && Array.isArray(customBlueprint.workflow) && customBlueprint.workflow.map((step: any, index: number) => (
                    <div key={index} className="p-4 flex gap-4 items-start bg-white hover:bg-stone-50 transition duration-150">
                      <span className="flex items-center justify-center w-5 h-5 bg-[#121212] text-white font-mono text-[9px] font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-800 font-serif italic">{step.stepName}</span>
                          <span className="text-[9px] font-bold bg-[#f0eee9] border border-[#e5e4e2] text-stone-700 px-1.5 py-0.5 font-mono uppercase w-fit">
                            Role: {step.executorAgent}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-sans">{step.actionDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Auto-Generated Configuration Code
                  </h4>
                  <button
                    id="btn-copy-ai-stg"
                    onClick={() => handleCopyCode(customBlueprint.codeSnippet)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#121212] bg-[#f0eee9] hover:bg-stone-200 border border-[#121212]/30 rounded-none transition"
                  >
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
                <div className="relative rounded-none overflow-hidden bg-[#121212] border-2 border-[#121212] p-4 font-mono text-xs text-stone-200 leading-relaxed overflow-x-auto">
                  <pre className="whitespace-pre">{customBlueprint.codeSnippet}</pre>
                </div>
              </div>

              {/* Critical safety limits */}
              <div className="p-4 bg-red-50 border-2 border-red-200 flex gap-3 items-start" id="ai-safety-panel">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-red-800 uppercase font-mono tracking-widest">Security Risks & Rate Overheads</h5>
                  <p className="text-xs text-red-700 leading-relaxed font-sans mt-0.5">{customBlueprint.criticalRisks}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
