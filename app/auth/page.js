"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.user?.username || form.username);
          document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
          router.push('/dashboard');
        } else {
          setError('Success! Switching to login...');
          setTimeout(() => { setIsLogin(true); setError(''); }, 2000);
        }
      } else {
        setError(data.message || data.error || "Action failed");
      }
    } catch (err) {
      console.log('Error:', err);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // h-screen locks the height to the viewport. overflow-hidden prevents scrolling on PC.
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 p-4 md:p-10 overflow-hidden">
      
      {/* Main Container: h-full on md ensures it stays within the parent height */}
      <div className="w-full max-w-5xl h-full max-h-[700px] flex flex-col md:flex-row bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white">
        
        {/* LEFT SIDE: Branding */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md mb-6">
              <Sparkles size={20} />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Nova AI</h1>
            <p className="text-blue-100 text-sm max-w-xs opacity-90">
              The next generation of digital intelligence.
            </p>
          </div>

          <div className="relative z-10 hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">Systems Active / 2026</p>
          </div>
        </div>

        {/* RIGHT SIDE: Form Container */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 max-md:mt-10">
              {isLogin ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-slate-400 text-xs mb-6 font-medium">
              {isLogin ? "Enter credentials to sign in." : "Create your account journey."}
            </p>

            {error && (
              <div className={`mb-4 rounded-xl p-3 text-[11px] font-bold border animate-in fade-in zoom-in-95 ${
                error.includes('Success') 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                : 'bg-rose-50 border-rose-100 text-rose-600'
              }`}>
                {error}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleAction}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    required
                    onChange={e => setForm({...form, username: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-400" size={16} />
                  <input 
                    type="password" 
                    required
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 rounded-xl outline-none focus:bg-white focus:border-blue-600 transition-all text-sm"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] text-sm mt-2"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                  <><span>{isLogin ? 'Sign In' : 'Register'}</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                {isLogin ? "Need an account? " : "Already registered? "}
                <span className="text-blue-600 underline underline-offset-4 decoration-2">
                  {isLogin ? "Sign up" : "Log in"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}