"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, User, Settings, LogOut, Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear the cookie by setting its expiry to the past
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login');
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-brand-900 flex items-center justify-center text-white">
                <BrainCircuit />
              </div>
              <span className="dark:text-white text-lg font-extrabold text-slate-900 tracking-tight">AI Dashboard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 px-3 py-6">
            <SidebarItem 
                href="/dashboard" 
                icon={LayoutDashboard} 
                label="Dashboard" 
            />
            <SidebarItem 
                href="/dashboard/settings/profile" 
                icon={User} 
                label="Profile"  
            />
            <SidebarItem 
                href="/dashboard/settings/security" 
                icon={Settings} 
                label="Security"  
            />
          </nav>
        </div>

        

        {/* LogOut */}
        <div className="border-t border-slate-100 p-3 dark:border-dark-border">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Header/Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-md lg:px-8 dark:border-dark-border dark:bg-dark-bg/80">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-500 lg:hidden border rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
              <Menu size={20} />
            </button>
          </div>

        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}


function SidebarItem({ icon: Icon, label, href = "#", active = false }) {
  return (
    <a 
      href={href} 
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        active 
        ? "bg-brand-50 text-brand-900 dark:bg-brand-900/20 dark:text-brand-100" 
        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
      }`}
    >
      <Icon size={20} strokeWidth={1.5} />
      {label}
    </a>
  );
}