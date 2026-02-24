"use client";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "AI Enthusiast & Developer",
  });
  const [isSaving, setIsSaving] = useState(false);

  // In a real app, you would fetch the user data from your DB here
  useEffect(() => {
    // const savedUser = fetch('/api/user/profile')...
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>Profile Settings</h1>
        <p style={{ color: '#6b7280' }}>Manage your public information and account details.</p>
      </header>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: '#0070f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px' }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <button type="button" style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer', fontWeight: '500' }}>
              Change Avatar
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <label style={labelStyle}>
            Full Name
            <input 
              type="text" 
              value={user.name} 
              onChange={(e) => setUser({...user, name: e.target.value})}
              style={inputStyle} 
            />
          </label>

          <label style={labelStyle}>
            Email Address
            <input 
              type="email" 
              value={user.email} 
              onChange={(e) => setUser({...user, email: e.target.value})}
              style={inputStyle} 
            />
          </label>

          <label style={labelStyle}>
            Bio
            <textarea 
              rows="4" 
              value={user.bio} 
              onChange={(e) => setUser({...user, bio: e.target.value})}
              style={{...inputStyle, resize: 'none'}} 
            />
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          style={{ 
            padding: '12px', 
            backgroundColor: isSaving ? '#93c5fd' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '600',
            fontSize: '16px' 
          }}
        >
          {isSaving ? "Saving Changes..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '500', color: '#374151', fontSize: '14px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '16px', outlineColor: '#0070f3' };