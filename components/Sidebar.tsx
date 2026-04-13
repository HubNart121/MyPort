'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/stocks/new', label: 'Add Stock', icon: '+' },
  { href: '/history', label: 'Trading History', icon: '▤' },
  { href: '/files', label: 'จัดการไฟล์ (Files)', icon: '📂' },
  { href: '/info', label: 'คลังความรู้ (Inf.)', icon: 'ℹ' },
  { href: '/backup', label: 'Backup / Restore', icon: '⊡' },
];

export function SidebarWrapper() {
  const pathname = usePathname();
  if (pathname === '/login') return null;
  return <Sidebar />;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="sidebar">
      <div className="nav-logo">
        <div className="nav-logo-title">◈ PORT_TRACK</div>
        <div className="nav-logo-sub">Stock Portfolio Manager</div>
      </div>

      <div className="nav-section">
        <div className="nav-section-label">Menu</div>
        {navItems.map((item) => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="mono" style={{ fontSize: '12px', width: '14px', textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="nav-section" style={{ marginTop: 'auto' }}>
        <div className="nav-section-label">System</div>
        <Link 
          href="/settings" 
          className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}
        >
          <span className="mono" style={{ fontSize: '12px', width: '14px', textAlign: 'center' }}>⚙</span>
          Change User/Pass
        </Link>
        <button 
          onClick={() => {
            if (confirm('ต้องการออกจากระบบใช่หรือไม่?')) {
              logout();
            }
          }}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}
        >
          <span className="mono" style={{ fontSize: '12px', width: '14px', textAlign: 'center' }}>⎋</span>
          Logout
        </button>
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <div>PORT_TRACK v1.1</div>
          <div>Powered by Supabase</div>
        </div>
      </div>
    </nav>
  );
}
