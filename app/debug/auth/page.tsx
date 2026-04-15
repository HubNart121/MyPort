'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { isLoggedIn } from '@/lib/auth';

export default function AuthDebugPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      try {
        const supabase = getSupabase();
        const { data: authData, error: authError } = await supabase
          .from('auth_config')
          .select('*')
          .eq('id', 1)
          .single();

        if (authError) throw authError;
        setData(authData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🔐 AUTH DIAGNOSTIC TOOL</h1>
      <hr />
      
      {loading && <p>CHECKING DATABASE...</p>}
      
      {error && (
        <div style={{ color: 'red', background: '#fee', padding: '20px', borderRadius: '8px' }}>
          <strong>ERROR:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
          <p><strong>Database Content (ID: 1):</strong></p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>👤 USERNAME: <code style={{ background: '#ffa', padding: '2px 6px' }}>{data.username}</code></li>
            <li>🔑 PASSWORD: <code style={{ background: '#ffa', padding: '2px 6px' }}>{data.password}</code></li>
            <li>📅 UPDATED AT: {data.updated_at}</li>
          </ul>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>สถานะ Login ปัจจุบันในเครื่องคุณ: {isLoggedIn() ? 'LOGGED_IN ✅' : 'NOT_LOGGED_IN ❌'}</p>
        <p>หมายเหตุ: หน้านี้มีไว้เพื่อ Debug เท่านั้น ควรลบออกเมื่อแก้ไขเสร็จ</p>
      </div>
    </div>
  );
}
