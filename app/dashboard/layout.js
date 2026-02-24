"use client"; // We need this because we are using a button click/navigation
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  // const handleLogout = () => {
  //   // 1. Clear the authentication token
  //   localStorage.removeItem('token'); 
    
  //   // 2. Clear any other user data
  //   localStorage.removeItem('user');

  //   // 3. Redirect to the login page
  //   router.push('/login');
  // };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear the cookie by setting its expiry to the past
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#fff', 
        borderRight: '1px solid #e5e7eb', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between' // This pushes the logout to the bottom
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '30px' }}>MyAI SaaS</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/dashboard" style={navStyle}>🏠 Home</Link>
            <Link href="/dashboard/chat" style={navStyle}>💬 AI Chat</Link>
            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
            <Link href="/dashboard/settings/profile" style={navStyle}>👤 Profile</Link>
            <Link href="/dashboard/settings/security" style={navStyle}>🔒 Security</Link>
          </nav>
        </div>

        {/* Logout Section */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#fee2e2', // Light red background
              color: '#dc2626', // Dark red text
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#fecaca'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#fee2e2'}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px' }}>
        {children}
      </main>
    </div>
  );
}

const navStyle = {
  padding: '10px 15px',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#374151',
  fontWeight: '500',
};