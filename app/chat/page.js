"use client";
import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Create a reference for the bottom of the chat
  const messagesEndRef = useRef(null);

  // 2. This function scrolls the view to our "marker"
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 3. Every time the messages array grows, run the scroll function
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      
      const aiMsg = { role: 'ai', text: data.text };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>AI Assistant</h2>
      <a href="/dashboard">← Back to Dashboard</a>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        height: '400px',
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        marginTop: '10px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.role === 'user' ? '#0070f3' : '#e1e1e1',
              color: msg.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              wordBreak: 'break-word' // Keeps long text from breaking the layout
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <p style={{ fontSize: '12px', color: '#666' }}>AI is thinking...</p>}
        
        {/* 4. The Marker: The scroll will jump to this div */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px' }}
        />
        <button type="submit" disabled={isLoading} style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '0 4px 4px 0',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
}