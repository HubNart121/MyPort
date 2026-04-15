'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
    // Whitelist diagnostic and login pages
    const isPublicPage = pathname === '/login' || pathname === '/debug/auth' || pathname === '/diag';

    // If not at public page and not logged in, redirect to /login
    if (!authStatus && !isPublicPage) {
      setAuthorized(false);
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // Prevent hydration error by waiting for mount
  if (!mounted) return null;

  // If we are at a public page, just show it
  const isPublicPage = pathname === '/login' || pathname === '/debug/auth' || pathname === '/diag';
  if (isPublicPage) {
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
