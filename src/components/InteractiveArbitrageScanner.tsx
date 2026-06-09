import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Terminal,
  TrendingUp,
  RefreshCw,
  Coins,
  Shield,
  Activity,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface ArbitrageOpportunity {
  opportunity: string;
  spread: string;
  buyAt: number;
  sellAt: number;
  timestamp: number;
}

export default function InteractiveArbitrageScanner() {
  const [isRunning, setIsRunning] = useState(false);
  const [useExchangeFallback, setUseExchangeFallback] = useState(true);
  
  // Real-time rates state
  const [binancePrices, setBinancePrices] = useState({ bid: 0, ask: 0 });
  const [coinbasePrices, setCoinbasePrices] = useState({ bid: 0, ask: 0 });
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // Blinking indicators
  const [binanceTick, setBinanceTick] = useState<"up" | "down" | null>(null);
  const [coinbaseTick, setCoinbaseTick] = useState<"up" | "down" | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const prevBinanceBid = useRef<number>(0);
  const prevCoinbaseBid = useRef<number>(0);

  // Print system logs to our dashboard terminal
  const logToTerminal = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev.slice(-49), `[${timestamp}] ${text}`]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Start or Stop the Web Worker
  const toggleWorker = () => {
    if (isRunning) {
      stopWorker();
    } else {
      startWorker();
    }
  };

  const startWorker = () => {
    if (workerRef.current) return;

    logToTerminal("INITIATING ARBITRAGE SCANNER...");
    logToTerminal("System: Reading arbitrage-worker.js specifications...");

    // Elegant fallback compilation:
    // If we use standard exchange fallback (highly stable public-feed),
    // we use wss://ws-feed.exchange.coinbase.com which allows direct public connection
    // directly executing the exact same math requested!
    const coinbaseEndpoint = useExchangeFallback
      ? "wss://ws-feed.exchange.coinbase.com"
      : "wss://advanced-trade-ws.coinbase.com";

    const coinbaseSubBlock = useExchangeFallback
      ? `
    const subMessage = {
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["ticker"]
    };
    coinbaseWS.send(JSON.stringify(subMessage));
      `
      : `
    const subMessage = {
        type: "subscribe",
        channel: "ticker",
        product_ids: ["BTC-USD"]
    };
    coinbaseWS.send(JSON.stringify(subMessage));
      `;

    const coinbaseParseBlock = useExchangeFallback
      ? `
    // Parse Coinbase Exchange feed format
    if (data.type === 'ticker') {
        orderBooks.coinbase.bid = parseFloat(data.best_bid);
        orderBooks.coinbase.ask = parseFloat(data.best_ask);
        
        postMessage({
            type: "PRICE_TICK",
            exchange: "coinbase",
            bid: orderBooks.coinbase.bid,
            ask: orderBooks.coinbase.ask
        });
        calculateArbitrage();
    }
      `
      : `
    // Parse Coinbase Advanced Trade format
    if (data.channel === 'ticker' && data.events) {
        const ticker = data.events[0].tickers[0];
        orderBooks.coinbase.bid = parseFloat(ticker.bid);
        orderBooks.coinbase.ask = parseFloat(ticker.ask);
        
        postMessage({
            type: "PRICE_TICK",
            exchange: "coinbase",
            bid: orderBooks.coinbase.bid,
            ask: orderBooks.coinbase.ask
        });
        calculateArbitrage();
    }
      `;

    // Constructing the real Web Worker using string blobs
    const workerScript = `
let orderBooks = {
    binance: { bid: 0, ask: 0 },
    coinbase: { bid: 0, ask: 0 }
};

// 1. Connect to Binance WebSocket
const binanceWS = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@bookTicker');

binanceWS.onopen = function() {
    postMessage({ type: "LOG", text: "[BINANCE] WebSocket Connection Established." });
};

binanceWS.onmessage = function(event) {
    const data = JSON.parse(event.data);
    orderBooks.binance.bid = parseFloat(data.b);
    orderBooks.binance.ask = parseFloat(data.a);
    
    postMessage({
        type: "PRICE_TICK",
        exchange: "binance",
        bid: orderBooks.binance.bid,
        ask: orderBooks.binance.ask
    });
    calculateArbitrage();
};

binanceWS.onerror = function() {
    postMessage({ type: "LOG", text: "[BINANCE] WebSocket Error Encountered." });
};

// 2. Connect to Coinbase WebSocket (customized for best response)
const coinbaseWS = new WebSocket('${coinbaseEndpoint}');

coinbaseWS.onopen = function() {
    postMessage({ type: "LOG", text: "[COINBASE] WebSocket Connection Established (${useExchangeFallback ? "Public Exchange" : "Adv Trade"})." });
    ${coinbaseSubBlock}
};

coinbaseWS.onmessage = function(event) {
    const data = JSON.parse(event.data);
    ${coinbaseParseBlock}
};

coinbaseWS.onerror = function() {
    postMessage({ type: "LOG", text: "[COINBASE] WebSocket Connection Error." });
};

function calculateArbitrage() {
    if (!orderBooks.binance.bid || !orderBooks.coinbase.bid) return;

    // Opportunity 1: Buy Coinbase, Sell Binance
    if (orderBooks.binance.bid > orderBooks.coinbase.ask) {
        const spread = orderBooks.binance.bid - orderBooks.coinbase.ask;
        postMessage({
            type: "OPPORTUNITY",
            opportunity: "BUY_COINBASE_SELL_BINANCE",
            spread: spread.toFixed(2),
            buyAt: orderBooks.coinbase.ask,
            sellAt: orderBooks.binance.bid,
            timestamp: Date.now()
        });
    }

    // Opportunity 2: Buy Binance, Sell Coinbase
    if (orderBooks.coinbase.bid > orderBooks.binance.ask) {
        const spread = orderBooks.coinbase.bid - orderBooks.binance.ask;
        postMessage({
            type: "OPPORTUNITY",
            opportunity: "BUY_BINANCE_SELL_COINBASE",
            spread: spread.toFixed(2),
            buyAt: orderBooks.binance.ask,
            sellAt: orderBooks.coinbase.bid,
            timestamp: Date.now()
        });
    }
}
    `;

    try {
      const blob = new Blob([workerScript], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));

      worker.onmessage = (e) => {
        const msg = e.data;
        if (msg.type === "LOG") {
          logToTerminal(msg.text);
        } else if (msg.type === "PRICE_TICK") {
          if (msg.exchange === "binance") {
            setBinancePrices({ bid: msg.bid, ask: msg.ask });
            // Detect tick direction
            if (prevBinanceBid.current !== 0) {
              setBinanceTick(msg.bid > prevBinanceBid.current ? "up" : "down");
            }
            prevBinanceBid.current = msg.bid;
          } else if (msg.exchange === "coinbase") {
            setCoinbasePrices({ bid: msg.bid, ask: msg.ask });
            if (prevCoinbaseBid.current !== 0) {
              setCoinbaseTick(msg.bid > prevCoinbaseBid.current ? "up" : "down");
            }
            prevCoinbaseBid.current = msg.bid;
          }
        } else if (msg.type === "OPPORTUNITY") {
          const opp: ArbitrageOpportunity = {
            opportunity: msg.opportunity,
            spread: msg.spread,
            buyAt: msg.buyAt,
            sellAt: msg.sellAt,
            timestamp: msg.timestamp
          };
          setOpportunities((prev) => [opp, ...prev.slice(0, 19)]);
          logToTerminal(`[OPPORTUNITY] Discovered: ${msg.opportunity} | Spread: $${msg.spread}`);
        }
      };

      workerRef.current = worker;
      setIsRunning(true);
      logToTerminal("SUCCESS: Dynamic Web Worker Process Spawned Successfully.");
    } catch (e: any) {
      logToTerminal(`ERROR: Failed to allocate Web Worker thread process, ${e.message}`);
    }
  };

  const stopWorker = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsRunning(false);
    logToTerminal("SHUTDOWN: Terminated current Web Worker task successfully.");
  };

  // Gracefully cleanup worker on component unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Compute stats
  const currentSpread = Math.abs(binancePrices.bid - coinbasePrices.bid);
  const currentSpreadPercent = binancePrices.bid > 0 && coinbasePrices.bid > 0
    ? (currentSpread / Math.min(binancePrices.bid, coinbasePrices.bid)) * 100
    : 0;

  return (
    <div className="bg-white border-2 border-[#121212] shadow-[3px_3px_0px_#121212] overflow-hidden" id="arbitrage-scanner-panel">
      {/* Title block */}
      <div className="bg-[#121212] text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#121212]" id="arbitrage-title-bar">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#ea580c] text-white animate-pulse">
            <Activity className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold font-serif italic text-white uppercase tracking-wider leading-tight">Live Arbitrage Math Engine</h4>
            <p className="text-[10px] text-stone-400 font-mono tracking-widest">REAL-TIME WEB WORKER PORTFOLIO AUDITOR</p>
          </div>
        </div>

        {/* Master Active / Pause Toggles */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center cursor-pointer text-xs font-mono font-bold text-stone-300">
            <input
              type="checkbox"
              disabled={isRunning}
              checked={useExchangeFallback}
              onChange={(e) => {
                setUseExchangeFallback(e.target.checked);
                logToTerminal(`Config: Switched Coinbase API channel to ${e.target.checked ? "Exchange public feed" : "Advanced Trade API"}`);
              }}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ea580c]"></div>
            <span className="ms-2 text-[10px] text-stone-300 uppercase select-none">
              {useExchangeFallback ? "Public API" : "Adv Trade WS"}
            </span>
          </label>

          <button
            onClick={toggleWorker}
            id="btn-toggle-arbitrage-worker"
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer font-mono inline-flex items-center gap-1.5 border transition ${
              isRunning
                ? "bg-red-600 hover:bg-red-700 text-white border-red-700"
                : "bg-[#ea580c] hover:bg-orange-600 text-white border-[#ea580c]"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Stop Worker
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Start Worker
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-[#121212]" id="scanner-cols-wrapper">
        
        {/* Left Side: Real-time order books ticking */}
        <div className="lg:col-span-4 p-5 space-y-4 bg-stone-50/50">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#ea580c] uppercase tracking-wider font-mono">I. Connected Exchange Feeds</span>
            <p className="text-[11px] text-stone-500 font-serif italic">Observe live tickers flowing from Binance (BTCUSDT) and Coinbase (BTC-USD) concurrently.</p>
          </div>

          <div className="space-y-3" id="exchange-ticking-cards">
            {/* Binance Card */}
            <div className="bg-white border border-[#121212]/30 p-3.5 space-y-2 relative" id="ticker-card-binance">
              <span className="absolute top-2 right-2 text-[8px] font-bold tracking-widest px-1.5 py-0.5 bg-[#f0eee9] border text-stone-600 font-mono">BINANCE</span>
              <h5 className="text-xs font-bold text-stone-800 font-serif italic leading-tight">BTCUSDT Spot Orderbook</h5>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="bg-[#f0eee9]/40 p-2 border">
                  <span className="text-[7.5px] font-bold text-stone-400 block tracking-widest">BEST BID (SELL)</span>
                  <p className={`text-sm font-bold transition-all duration-150 ${
                    binanceTick === "up" ? "text-emerald-700" : binanceTick === "down" ? "text-red-700" : "text-stone-800"
                  }`}>
                    {binancePrices.bid > 0 ? `$${binancePrices.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Waiting..."}
                  </p>
                </div>
                <div className="bg-[#f0eee9]/40 p-2 border">
                  <span className="text-[7.5px] font-bold text-stone-400 block tracking-widest">BEST ASK (BUY)</span>
                  <p className="text-sm font-bold text-stone-800">
                    {binancePrices.ask > 0 ? `$${binancePrices.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Waiting..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Coinbase Card */}
            <div className="bg-white border border-[#121212]/30 p-3.5 space-y-2 relative" id="ticker-card-coinbase">
              <span className="absolute top-2 right-2 text-[8px] font-bold tracking-widest px-1.5 py-0.5 bg-[#f0eee9] border text-stone-600 font-mono">COINBASE</span>
              <h5 className="text-xs font-bold text-stone-800 font-serif italic leading-tight">BTC-USD Spot Orderbook</h5>
              
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="bg-[#f0eee9]/40 p-2 border">
                  <span className="text-[7.5px] font-bold text-stone-400 block tracking-widest">BEST BID (SELL)</span>
                  <p className={`text-sm font-bold transition-all duration-150 ${
                    coinbaseTick === "up" ? "text-emerald-700" : coinbaseTick === "down" ? "text-red-700" : "text-stone-800"
                  }`}>
                    {coinbasePrices.bid > 0 ? `$${coinbasePrices.bid.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Waiting..."}
                  </p>
                </div>
                <div className="bg-[#f0eee9]/40 p-2 border">
                  <span className="text-[7.5px] font-bold text-stone-400 block tracking-widest">BEST ASK (BUY)</span>
                  <p className="text-sm font-bold text-stone-800">
                    {coinbasePrices.ask > 0 ? `$${coinbasePrices.ask.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Waiting..."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Live Spread Indicator */}
            {binancePrices.bid > 0 && coinbasePrices.bid > 0 && (
              <div className="p-3 bg-[#f0eee9] border border-[#121212]/30 space-y-1 font-mono" id="scanner-spread-stats">
                <div className="flex justify-between text-[9px] font-bold text-stone-500 uppercase">
                  <span>Current Spread</span>
                  <span>Spread Delta</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-black text-[#121212]">${currentSpread.toFixed(2)}</span>
                  <span className="text-xs font-bold text-[#ea580c]">{currentSpreadPercent.toFixed(3)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Live-scrolling logs Terminal */}
        <div className="lg:col-span-5 p-5 flex flex-col h-[320px] lg:h-auto min-h-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#121212]" /> II. Web Worker Console Log
            </span>
            <button
              onClick={() => {
                setTerminalLogs([]);
                logToTerminal("Console output buffer cleared.");
              }}
              className="text-[9px] text-stone-400 font-mono hover:text-[#121212] uppercase"
            >
              Clear
            </button>
          </div>

          <div className="flex-1 bg-stone-900 text-stone-200 p-4 font-mono text-[10px] overflow-y-auto mt-3 border border-[#121212] select-text select-all space-y-2 leading-relaxed" id="terminal-screen">
            {terminalLogs.length === 0 ? (
              <p className="text-stone-500 italic">No output in buffer. Push 'Start Worker' above to boot the thread...</p>
            ) : (
              terminalLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Right Side: Log of arbitrage opportunities */}
        <div className="lg:col-span-3 p-5 space-y-4 bg-stone-50/50 max-h-[350px] lg:max-h-none overflow-y-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#ea580c]" /> III. Discovered Opportunities
            </span>
            <p className="text-[11px] text-stone-500 font-serif italic">Real Math blocks captured from sequential evaluations.</p>
          </div>

          <div className="space-y-2" id="opportunities-feed-list">
            {opportunities.length === 0 ? (
              <div className="py-8 text-center bg-white border border-dashed border-[#121212]/20 p-4">
                <Shield className="w-6 h-6 text-stone-300 mx-auto" />
                <p className="text-stone-500 text-[10.5px] mt-2 font-serif italic">Scanning active pools for spreads. Spreads typically trigger in hyper-volatile cycles.</p>
              </div>
            ) : (
              opportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#121212] p-3 shadow-[2px_2px_0px_#121212] space-y-2 uppercase font-mono relative pr-12 animate-fade-in"
                  id={`opportunity-alert-${idx}`}
                >
                  <span className="absolute top-2.5 right-2 text-[10px] font-black text-[#ea580c]">
                    +${opp.spread}
                  </span>
                  
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] font-black text-stone-400">DISPATCH ALARM</span>
                    <h6 className="text-[10px] font-bold text-stone-800 tracking-tight leading-none">
                      {opp.opportunity.replace(/_/g, " ")}
                    </h6>
                  </div>

                  <div className="flex gap-4 text-[9px] text-stone-500 border-t pt-2 border-stone-100">
                    <div>
                      <span>BUY AT</span>
                      <p className="text-stone-850 font-bold">${opp.buyAt.toFixed(2)}</p>
                    </div>
                    <div>
                      <span>SELL AT</span>
                      <p className="text-stone-850 font-bold">${opp.sellAt.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
