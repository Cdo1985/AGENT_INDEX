import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Cpu, Loader, AlertTriangle, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ConsultantTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am Dr. Cooper, Principal Architect of Autonomous Agentic Systems. 

Whether you are designing **cyclic graphs** in LangGraph, configuring **role-playing squads** in CrewAI, or implementing **rigid schema validation** in Pydantic AI, I can provide precise, technically accurate architectures and execution blueprints. 

Select a quick question below, or outline your specific automation task!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    "When should I choose CrewAI instead of LangGraph for a production task?",
    "How do I securely handle keys when running an autonomous yield agent?",
    "Explain cyclic state graphs in LangGraph with a simplified code outline.",
    "How does Pydantic AI enforce rigid JSON schemas for financial backends?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const updatedUserMsgs = [...messages, { role: "user" as const, content: text }];
    setMessages(updatedUserMsgs);
    setChatInput("");
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedUserMsgs.filter((m) => m.role !== "system"),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed secure conversation proxy.");
      }

      const block = await response.json();
      setMessages([...updatedUserMsgs, { role: "assistant" as const, content: block.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Dr. Cooper is currently offline. Review your Secrets setup and server.ts configs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="chat-consultant-root">
      {/* Question starter side-rail */}
      <div className="lg:col-span-4 space-y-4" id="chat-side-rail">
        <div className="bg-white border-2 border-[#121212] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#ea580c] text-white">
              <Cpu className="w-4 h-4" />
            </span>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] font-mono text-[#121212]">Architect Consults</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
            Tap on a technical prompt or framework dilemma below to immediately query Dr. Cooper on architectural mechanics.
          </p>

          <div className="space-y-2 pt-2" id="stg-starter-questions">
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                id={`btn-starter-q-${idx}`}
                disabled={loading}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-3 bg-white hover:bg-[#f0eee9] border border-[#121212]/30 text-xs text-stone-700 hover:text-[#121212] transition font-sans font-semibold leading-relaxed cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Informational tip banner */}
        <div className="p-4 bg-[#f0eee9] border border-[#e5e4e2] text-xs text-stone-700 leading-relaxed font-serif italic flex gap-2">
          <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
          <span>Our expert chats analyze code blocks sequentially. All agent recommendations are verified against framework schemas.</span>
        </div>
      </div>

      {/* Primary chat window */}
      <div className="lg:col-span-8 flex flex-col h-[520px] bg-white border-2 border-[#121212]" id="chat-viewport-card">
        {/* Chat header */}
        <div className="bg-[#121212] text-white p-4 flex items-center justify-between border-b-2 border-[#121212]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-[#ea580c] text-white font-black font-serif italic flex items-center justify-center text-sm border border-white/20">
                DC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#121212] rounded-none animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-serif italic text-white leading-tight">Dr. Cooper</h4>
              <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">Lead Systems Architect</p>
            </div>
          </div>
          <button
            id="btn-reset-chat"
            onClick={() => {
              setMessages([
                {
                  role: "assistant",
                  content: "Chat log initialized. Ask me any conceptual or layout questions about Multi-Agent frameworks, memory structures, or delta-neutral execution plans.",
                },
              ]);
              setErrorMsg(null);
            }}
            className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#121212] border border-white/30 px-3 py-1.5 transition hover:bg-stone-800 cursor-pointer"
          >
            Clear History
          </button>
        </div>

        {/* Message streams */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f9f8f6]/50" id="chat-messages-container">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`} id={`chat-msg-${i}`}>
                {/* Icon avatar */}
                <div className={`w-8 h-8 rounded-none border-2 flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  isUser ? "bg-[#121212] text-white border-[#121212]" : "bg-[#f0eee9] text-[#121212] border-[#121212]"
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4 text-[#ea580c]" />}
                </div>

                {/* Bubble box */}
                <div className={`p-4 rounded-none text-xs leading-relaxed font-sans border-2 ${
                  isUser
                    ? "bg-[#121212] text-white border-[#121212]"
                    : "bg-white border-[#121212]/45 text-stone-850 whitespace-pre-line"
                }`}>
                  {m.content}
                </div>
              </div>
            );
          })}

          {/* Typing/Analysis loader */}
          {loading && (
            <div className="flex gap-3 mr-auto items-center animate-pulse" id="chat-thinking-loader">
              <div className="w-8 h-8 bg-[#f0eee9] border-2 border-[#121212] flex items-center justify-center text-[#ea580c]">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212] font-semibold">Dr. Cooper is formulating an architectural plan...</span>
            </div>
          )}

          {/* Error warning inside chat */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800 text-xs font-sans flex gap-3 items-start" id="chat-error-panel">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5 w-full">
                <p className="font-bold">{errorMsg}</p>
                <button
                  onClick={() => handleSendMessage(messages[messages.length - 1].content)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 text-[10px] font-bold transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Message
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat input box */}
        <form
          id="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(chatInput);
          }}
          className="border-t-2 border-[#121212] p-3 bg-white flex gap-2 items-center"
        >
          <input
            type="text"
            id="chat-text-input"
            disabled={loading}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={loading ? "Synthesizing framework parameters..." : "Describe task or ask customized question..."}
            className="flex-1 bg-[#f0eee9] border border-[#121212]/30 focus:border-[#121212] focus:bg-white px-4 py-2.5 text-xs outline-none transition disabled:opacity-50 font-sans font-medium"
          />
          <button
            type="submit"
            id="btn-chat-submit"
            disabled={loading || !chatInput.trim()}
            className="w-10 h-10 flex items-center justify-center bg-[#121212] hover:bg-stone-800 text-white transition disabled:opacity-45 cursor-pointer border border-[#121212]"
          >
            <Send className="w-4 h-4 text-[#ea580c]" />
          </button>
        </form>
      </div>
    </div>
  );
}
