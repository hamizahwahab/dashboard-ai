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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Login
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleLogin}>
              <div className="mt-6">
                  <div className="mt-1 flex rounded-md shadow-sm">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        value={form.username}
                        required
                        onChange={e => setForm({...form, username: e.target.value})} 
                        className="flex-1  border border-gray-300 form-input p-2 block w-full rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      />
                  </div>
              </div>

              <div className="mt-6">
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={form.password}
                      required
                      onChange={e => setForm({...form, password: e.target.value})} 
                      className="flex-1  border border-gray-300 form-input p-2 block w-full rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                </div>
              </div>

              <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                      Login
                    </button>
                </span>
              </div>
          
            </form>
            
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <p className="mt-2 text-center text-sm leading-5 text-gray-500 max-w">
              Don&apos;t have an account?
                <a href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150 ml-1">
                     Register here
                </a>
            </p>
  
        </div>
      </div>

    </div>
  );
}