"use client";
import { useState, useEffect } from 'react';

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Load username from storage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match!' });
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, // From localStorage
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Password updated successfully!' });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Security</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Change your password for <strong>@{username}</strong></p>

      {status.message && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: status.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: status.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${status.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={groupStyle}>
          <label style={labelStyle}>Current Password</label>
          <input 
            type="password" 
            required 
            style={inputStyle} 
            value={formData.currentPassword}
            onChange={e => setFormData({...formData, currentPassword: e.target.value})} 
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>New Password</label>
          <input 
            type="password" 
            required 
            style={inputStyle} 
            value={formData.newPassword}
            onChange={e => setFormData({...formData, newPassword: e.target.value})} 
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Confirm New Password</label>
          <input 
            type="password" 
            required 
            style={inputStyle} 
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...btnStyle,
            backgroundColor: loading ? '#93c5fd' : '#0070f3',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

const groupStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#4b5563' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px' };
const btnStyle = { padding: '12px', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };