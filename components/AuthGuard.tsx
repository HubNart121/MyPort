'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = isLoggedIn();
    const isPublicPage = pathname === '/login' || pathname === '/debug/auth' || pathname === '/diag';

    if (!authStatus && !isPublicPage) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!mounted) return null;

  const isPublicPage = pathname === '/login' || pathname === '/debug/auth' || pathname === '/diag';
  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900" style={{ minHeight: '100vh' }}>
        <div className="mono animate-pulse" style={{ color: 'var(--amber)' }}>VERIFYING ACCESS...</div>
      </div>
    );
  }

  return <>{children}</>;
}
