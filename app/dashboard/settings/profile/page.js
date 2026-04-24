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
    if (res.ok) setMessage('Profile updated successfully!');
  };

  if (loading) return <p className="p-5">Loading profile...</p>;

  return (
    <div className="max-w-lg mx-auto p-5">
      <a href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm mb-4 block">← Back to Dashboard</a>

      <h1 className="text-2xl font-bold text-slate-800 mb-1">@{user.username}</h1>
      <p className="text-slate-500 text-sm mb-6">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>

      <div className="mt-6">
        <label className="block font-semibold text-slate-700 mb-2">Your Bio</label>
        <textarea
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
        />
        <button
          onClick={handleUpdate}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white border-none rounded-lg hover:bg-blue-700"
        >
          Save Profile
        </button>
        {message && <p className="text-green-600 mt-3">{message}</p>}
      </div>
    </div>
  );
}