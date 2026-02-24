"use client";
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Import the markdown component

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello 👋 I am your AI assistant. How can I help you today?' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(0);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else { setCanSend(true); }
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

      // --- ADVANCED TRY-CATCH FALLBACK ---
      if (!res.ok) {
        // Handle specific Quota Error (429)
        if (res.status === 429) {
          throw new Error("Quota exceeded. Please wait a moment before trying again.");
        }
        // Handle other server errors
        throw new Error(data.details || "The AI is having trouble connecting.");
      }

      setMessages((prev) => [...prev, { role: 'ai', text: data.text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      // Fallback message shown directly in the chat bubbles
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        text: `⚠️ **System Note:** ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
      setSecondsLeft(10); // 10-second cooldown to be extra safe with quota
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        {isOpen && (
          <div style={{
            width: '380px', height: '500px', backgroundColor: 'white',
            border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', marginBottom: '10px', overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ backgroundColor: '#0070f3', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Gemini AI Assistant</span>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            {/* Message Area */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: '15px' }}>
                  <div style={{
                    display: 'inline-block', padding: '2px 12px', borderRadius: '12px',
                    backgroundColor: msg.role === 'user' ? '#0070f3' : '#eee',
                    color: msg.role === 'user' ? 'white' : '#333', fontSize: '14px',
                    maxWidth: '85%', textAlign: 'left', wordBreak: 'break-word'
                  }}>
                    {/* --- MARKDOWN RENDERING --- */}
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && <p style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>Gemini is thinking...</p>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={sendMessage} style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={canSend ? "Type a message..." : `Wait ${secondsLeft}s...`}
                disabled={!canSend}
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
              />
              <button 
                type="submit" 
                disabled={!canSend || isLoading}
                style={{ 
                  padding: '8px 16px', backgroundColor: canSend ? '#0070f3' : '#ccc',
                  color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                }}
              >
                {secondsLeft > 0 ? secondsLeft : 'Send'}
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px', height: '60px', borderRadius: '30px',
            backgroundColor: '#0070f3', color: 'white', border: 'none', 
            fontSize: '28px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,112,243,0.4)'
          }}
        >
          {isOpen ? '↓' : '💬'}
        </button>
      </div>
    </div>
  );
}