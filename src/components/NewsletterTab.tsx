import React, { useState, useEffect } from "react";
import { newsletterIssues } from "../data";
import { NewsletterIssue } from "../types";
import { Mail, Check, Bell, Loader, RefreshCw, Send, Users, Sparkles } from "lucide-react";

export default function NewsletterTab() {
  const [selectedIssueId, setSelectedIssueId] = useState<string>("issue-12");
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [subscribedToast, setSubscribedToast] = useState(false);

  // Dynamic news compiler
  const [customBriefTopic, setCustomBriefTopic] = useState("");
  const [compiledNews, setCompiledNews] = useState<string | null>(null);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    // Populate subscribers list from local storage securely
    const saved = localStorage.getItem("dispatch_subscribers");
    if (saved) {
      try {
        setSubscribers(JSON.parse(saved));
      } catch (e) {
        setSubscribers(["shmeel2011@gmail.com", "analyst@hedgecore.net"]);
      }
    } else {
      const defaults = ["shmeel2011@gmail.com", "analyst@hedgecore.net"];
      setSubscribers(defaults);
      localStorage.setItem("dispatch_subscribers", JSON.stringify(defaults));
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    if (subscribers.includes(emailInput.trim().toLowerCase())) {
      setSubscribedToast(true);
      setTimeout(() => setSubscribedToast(false), 3000);
      setEmailInput("");
      return;
    }

    const updated = [...subscribers, emailInput.trim().toLowerCase()];
    setSubscribers(updated);
    localStorage.setItem("dispatch_subscribers", JSON.stringify(updated));
    setSubscribedToast(true);
    setTimeout(() => setSubscribedToast(false), 3500);
    setEmailInput("");
    setNameInput("");
  };

  const handleCompileNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBriefTopic.trim()) {
      setNewsError("Please provide specific research topics for compile.");
      return;
    }

    setLoadingNews(true);
    setNewsError(null);
    setCompiledNews(null);

    try {
      const response = await fetch("/api/generate-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics: customBriefTopic }),
      });

      if (!response.ok) {
        throw new Error("Unable to trigger dynamic editorial engine.");
      }

      const data = await response.json();
      setCompiledNews(data.content);
    } catch (err: any) {
      console.error(err);
      setNewsError(err.message || "Newsletter compiler failed. Check server status.");
    } finally {
      setLoadingNews(false);
    }
  };

  const currentIssue = newsletterIssues.find((n) => n.id === selectedIssueId) || newsletterIssues[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="news-tab-root">
      {/* Sidebar navigation for past issues & subscription card */}
      <div className="lg:col-span-4 space-y-6" id="news-sidebar-panel">
        
        {/* Real Live Subscription Box */}
        <div className="bg-white border-2 border-[#121212] p-5 space-y-4" id="subscription-box">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 bg-[#ea580c] text-white">
              <Bell className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-[#121212]">Weekly Tech Dispatch</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
            Subscribe to receive real curated reports on multi-agent consensus, stable arbitrages, and runtime benchmarks.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3">
            <div>
              <input
                type="text"
                id="newsletter-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First Name"
                className="w-full text-xs bg-[#f0eee9] border border-[#121212]/30 p-2.5 outline-none font-mono"
              />
            </div>
            <div className="relative">
              <input
                type="email"
                id="newsletter-email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="developer@workplace.com"
                className="w-full text-xs bg-[#f0eee9] border border-[#121212]/30 pl-2.5 pr-10 py-2.5 outline-none font-mono"
              />
              <button
                type="submit"
                id="btn-sub-send"
                className="absolute inset-y-1 right-1 flex items-center justify-center w-8 h-8 bg-[#121212] text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#ea580c]" />
              </button>
            </div>
          </form>

          {/* Success messages */}
          {subscribedToast && (
            <div className="p-3 bg-stone-100 border border-[#121212]/20 flex items-center gap-2 text-stone-800 text-xs font-serif italic animate-fade-in" id="sub-success-box">
              <Check className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span>Registered successfully to weekly dispatch!</span>
            </div>
          )}

          {/* Core register checklist */}
          <div className="pt-4 border-t border-[#121212]/30 space-y-2" id="live-subscriber-register">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#121212]" /> Active Registry ({subscribers.length})
            </span>
            <div className="max-h-24 overflow-y-auto divide-y divide-[#121212]/10 text-[11px] font-mono text-[#121212]" id="sub-list-container">
              {subscribers.map((sub, i) => (
                <div key={i} className="py-1 flex items-center justify-between">
                  <span className="truncate max-w-[190px]">{sub}</span>
                  <span className="text-[9px] text-[#ea580c] font-bold">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* List of past newsletters */}
        <div className="bg-white border-2 border-[#121212] p-4 space-y-3" id="newsletter-history-box">
          <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono">Expert Archive Issues</h4>
          <div className="space-y-1.5" id="newsletter-issue-buttons">
            {newsletterIssues.map((issue) => {
              const isSelected = selectedIssueId === issue.id && !compiledNews;
              return (
                <button
                  key={issue.id}
                  id={`btn-select-issue-${issue.id}`}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setCompiledNews(null);
                  }}
                  className={`w-full text-left p-2 px-3 transition duration-150 text-xs block cursor-pointer ${
                    isSelected
                      ? "bg-[#f0eee9] font-bold text-[#121212] border-l-4 border-[#ea580c] pl-4"
                      : "bg-transparent text-stone-600 hover:bg-stone-50 hover:text-stone-900 border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-[9px] text-stone-400 font-mono">
                    <span>{issue.date}</span>
                    <span className="text-[#ea580c] font-bold">{issue.category.toUpperCase()}</span>
                  </div>
                  <p className="mt-1 font-serif leading-tight text-stone-850">{issue.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic AI brief triggers */}
        <div className="bg-[#121212] text-white border-2 border-[#121212] p-5 space-y-4" id="newsletter-compiler-card">
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" /> AI Briefing Compiler
            </h4>
            <p className="text-[11px] text-stone-300 font-serif italic leading-relaxed">
              Dynamically draft a bespoke tactical issue focusing on custom frameworks or strategies using real-time compiler logic.
            </p>
          </div>

          <form onSubmit={handleCompileNews} className="space-y-3">
            <textarea
              id="compiler-topic"
              value={customBriefTopic}
              onChange={(e) => setCustomBriefTopic(e.target.value)}
              placeholder="e.g. LangGraph vs CrewAI comparison for gas fees..."
              rows={2}
              className="w-full text-xs bg-white text-[#121212] border-2 border-[#121212] p-3 outline-none font-mono"
            />
            <button
              type="submit"
              disabled={loadingNews}
              id="btn-compile-issue"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold uppercase tracking-widest bg-[#ea580c] text-white hover:bg-orange-700 transition cursor-pointer disabled:opacity-50"
            >
              {loadingNews ? (
                <>
                  <Loader className="w-3 h-3 animate-spin" /> Compiling news...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" /> Compile Bespoke Issue
                </>
              )}
            </button>
          </form>

          {newsError && (
            <p className="text-[11px] text-red-400 font-mono leading-tight block">{newsError}</p>
          )}
        </div>
      </div>

      {/* Main viewport rendering selected or dynamic issue */}
      <div className="lg:col-span-8" id="news-viewport">
        {compiledNews ? (
          /* Dynamic compiled newsletter */
          <div className="bg-white border-2 border-[#121212] p-6 md:p-8 space-y-6 animate-fade-in" id="news-bespoke-reader">
            <div className="pb-6 border-b border-[#121212] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-[#f0eee9] border border-[#121212]/20 text-[#121212] font-mono tracking-wider uppercase">
                  <Sparkles className="w-3 h-3 text-[#ea580c]" /> Dynamic Bespoke Edition
                </span>
                <h3 className="text-2xl md:text-3xl font-black font-serif italic text-gray-900 mt-2">Bespoke Strategic Briefing</h3>
                <p className="text-[10px] text-stone-500 font-mono mt-1">Generated topics: {customBriefTopic}</p>
              </div>
              <button
                id="btn-clear-compiled-news"
                onClick={() => setCompiledNews(null)}
                className="text-xs font-bold uppercase tracking-wider text-[#121212] bg-[#f0eee9] border border-[#121212] px-3.5 py-2 transition hover:bg-stone-200 cursor-pointer"
              >
                Return to Expert Archives
              </button>
            </div>

            {/* Compiled content */}
            <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed font-serif text-lg space-y-4" id="ai-news-raw-rendered">
              <div className="whitespace-pre-line text-sm leading-relaxed">{compiledNews}</div>
            </div>
          </div>
        ) : (
          /* Archive newsletter */
          <div className="bg-white border-2 border-[#121212] p-6 md:p-8 space-y-6" id={`news-archive-view-${currentIssue.id}`}>
            {/* Header info */}
            <div className="pb-6 border-b border-[#121212] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-[#121212] text-white font-mono uppercase">
                  {currentIssue.category}
                </span>
                <h3 className="text-3xl font-black font-serif italic text-[#121212] mt-4 tracking-tight">{currentIssue.title}</h3>
                <div className="flex gap-4 items-center text-xs text-stone-500 mt-2 font-mono">
                  <span>Published: {currentIssue.date}</span>
                  <span>•</span>
                  <span>Reads: {currentIssue.reads.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Description intro */}
            <blockquote className="border-l-4 border-[#ea580c] pl-4 italic text-stone-700 leading-relaxed bg-[#f0eee9] p-4 font-serif">
              {currentIssue.summary}
            </blockquote>

            {/* Newsletter rich content */}
            <div className="text-sm text-stone-800 leading-relaxed font-serif space-y-4 whitespace-pre-wrap italic">
              {currentIssue.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
