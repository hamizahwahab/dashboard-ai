"use client";
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Sparkles, Loader2, ChevronDown, Calendar } from 'lucide-react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello 👋 I am your **Infinity AI** assistant. How can I help you today?' }
  ]);
  const [userName, setUserName] = useState("Guest");
  const [isLoading, setIsLoading] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const messagesEndRef = useRef(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Retrieve username from localStorage on mount
  useEffect(() => {
    // Check if code is running in the browser
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('username'); // Use the key you saved during login
      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSend(true);
    }
  }, [secondsLeft]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !canSend) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setCanSend(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) throw new Error("Quota exceeded. Please wait.");
        throw new Error(data.details || "Connection error.");
      }

      setMessages((prev) => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        text: `⚠️ **System:** ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
      setSecondsLeft(5); // Cooldown
    }
  };

  return (
    <div>
        

        <div className="w-full relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-card">
          {/* Decorative Background Glow */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-900/10 blur-2xl" />

          {/* Main Container: Changed to flex-col with gap-6 for vertical spacing */}
          <div className="relative flex flex-col gap-6">
            
            {/* Top Part: Greeting */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back, <span className="text-brand-900 dark:text-brand-400">{userName}</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your dashboard is updated with the latest activity.
              </p>
            </div>

            {/* Bottom Part: Date Display (Now takes full width or auto based on content) */}
            <div className="flex w-fit items-center gap-3 rounded-xl bg-slate-50 px-4 py-2 dark:bg-dark-bg border border-slate-100 dark:border-dark-border">
              <Calendar size={18} className="text-slate-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Today</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
              <div className="mb-4 flex h-130 52w-95 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all animate-in slide-in-from-bottom-4 dark:border-dark-border dark:bg-dark-card">
                
                {/* Header */}
                <div className="flex items-center justify-between bg-brand-900 px-4 py-3 text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                      <Sparkles size={16} />
                    </div>
                    <span className="text-sm font-bold tracking-tight">Infinity AI</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="rounded-lg p-1 transition-colors hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-4 dark:bg-dark-bg/50">
                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-brand-900 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 dark:bg-dark-card dark:text-slate-200 border border-slate-100 dark:border-dark-border rounded-tl-none'
                        }`}>
                          {/* Apply the .prose-ai class here */}
                          <div className={msg.role === 'ai' ? 'prose-ai' : ''}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                      <Loader2 size={14} className="animate-spin text-brand-900" />
                      AI is thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <form onSubmit={sendMessage} className="border-t border-slate-100 bg-white p-3 dark:border-dark-border dark:bg-dark-card">
                  <div className="relative flex items-center gap-2">
                    <input 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)} 
                      placeholder={canSend ? "Ask me anything..." : `Wait ${secondsLeft}s...`}
                      disabled={!canSend}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm outline-none transition-all focus:border-brand-900 focus:ring-2 focus:ring-brand-900/10 dark:border-dark-border dark:bg-dark-bg dark:text-white disabled:opacity-50"
                    />
                    <button 
                      type="submit" 
                      disabled={!canSend || isLoading || !input.trim()}
                      className="absolute right-1.5 rounded-lg bg-brand-900 p-1.5 text-white transition-all hover:bg-brand-800 disabled:bg-slate-300 dark:disabled:bg-slate-700"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  {secondsLeft > 0 && (
                    <p className="mt-1 text-[10px] text-center text-slate-400 font-medium">
                      Cooldown active: {secondsLeft}s
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-all active:scale-95 ${
                isOpen ? 'bg-slate-800 rotate-0' : 'bg-brand-900 hover:shadow-brand-900/30'
              }`}
            >
              {isOpen ? <ChevronDown size={24} /> : <MessageCircle size={24} />}
            </button>
          </div>
    </div>
    
  );
}