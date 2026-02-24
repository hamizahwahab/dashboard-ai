"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Add this import

export default function LoginPage() {
  const router = useRouter(); // 2. Initialize router
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); // 3. Uncomment this to show errors

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 4. CHANGE THIS: Use form.username and form.password
        body: JSON.stringify({ 
          username: form.username, 
          password: form.password 
        }), 
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        // Ensure your API returns 'data.user.username'
        localStorage.setItem('username', data.user?.username || form.username);

        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
        
        router.push('/dashboard');
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Username" 
          value={form.username}
          required
          onChange={e => setForm({...form, username: e.target.value})} 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={form.password}
          required
          onChange={e => setForm({...form, password: e.target.value})} 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Enter Dashboard
        </button>
      </form>
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      <p style={{ marginTop: '20px' }}>
        Don&apos;t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}