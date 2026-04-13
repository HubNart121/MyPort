'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const authStatus = isLoggedIn();
    
    // If not at /login and not logged in, redirect to /login
    if (!authStatus && pathname !== '/login') {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Prevent hydration error by waiting for mount
  if (!mounted) return null;

  // If we are at /login, just show it
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not authorized yet, show nothing or a loader
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-vh-100 bg-page">
        <div className="mono amber animate-pulse">VERIFYING ACCESS...</div>
      </div>
    );
  }

  return <>{children}</>;
}
