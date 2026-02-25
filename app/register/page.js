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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Create Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleRegister}>
              <div className="mt-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                      type="text" 
                      placeholder="Username" 
                      required
                      onChange={e => setFormData({...formData, username: e.target.value})} 
                      className="flex-1  border border-gray-300 form-input p-2 block w-full rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                </div>
              </div>

              <div className="mt-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      required
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="flex-1  border border-gray-300 form-input p-2 block w-full rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                      Register
                    </button>
                </span>
              </div>

            </form>

            {message && <p>{message}</p>}

            <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
              Already have an account?
                <a href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150 ml-1">
                     Login here
                </a>
            </p>

        </div>
      </div>
      
    </div>
  );
}