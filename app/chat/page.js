"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth');
    }
  }, [router]);

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const aiMsg = { role: 'ai', text: data.text };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-5 p-4 font-sans">
      <h2 className="text-2xl font-bold text-slate-800 mb-3">AI Assistant</h2>
      <a href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm">← Back to Dashboard</a>

      <div className="border border-slate-300 rounded-lg h-96 overflow-y-auto p-4 bg-slate-50 mt-3">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2.5 rounded-xl break-words ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <p className="text-xs text-slate-500 italic">AI is thinking...</p>}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2.5 border border-slate-300 rounded-l-lg focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-blue-600 text-white border-none rounded-r-lg hover:bg-blue-700 disabled:bg-slate-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}