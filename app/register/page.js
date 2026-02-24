"use client";
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
  e.preventDefault();
  setMessage("Registering...");

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    // Check if the response actually has content before parsing
    const text = await res.text(); 
    const data = text ? JSON.parse(text) : {};

    if (res.ok) {
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      setMessage(data.error || "Registration failed");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setMessage("Connection error. Is your server running?");
  }
};

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <h1>Create Account</h1>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Username" 
          required
          onChange={e => setFormData({...formData, username: e.target.value})} 
        /><br/><br/>
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={e => setFormData({...formData, password: e.target.value})} 
        /><br/><br/>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}