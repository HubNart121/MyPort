'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/stocks/new', label: 'Add Stock', icon: '+' },
  { href: '/history', label: 'Trading History', icon: '▤' },
  { href: '/files', label: 'จัดการไฟล์ (Files)', icon: '📂' },
  { href: '/info', label: 'คลังความรู้ (Inf.)', icon: 'ℹ' },
  { href: '/backup', label: 'Backup / Restore', icon: '⊡' },
];

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

      <div style={{ flex: 1 }} />
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <div>PORT_TRACK v1.0</div>
          <div>Powered by Supabase</div>
        </div>
      </div>
    </nav>
  );
}
