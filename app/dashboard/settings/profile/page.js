"use client";
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({ username: '', bio: '', createdAt: '' });
  const [newBio, setNewBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem('username');
      const res = await fetch(`/api/user/profile?username=${username}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setNewBio(data.bio || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, bio: newBio }),
    });
    if (res.ok) setMessage("Profile updated successfully!");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '600px', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>@{user.username}</h1>
      <p style={{ color: '#666' }}>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      
      <div style={{ marginTop: '30px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Your Bio</label>
        <textarea 
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Tell us about yourself..."
          style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleUpdate}
          style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Save Profile
        </button>
        {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
}