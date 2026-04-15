import { getSupabase } from './supabase';

const AUTH_KEY = 'port_track_auth_session';

export async function verifyCredentials(user: string, pass: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('auth_config')
    .select('username, password')
    .eq('id', 1)
    .single();

  if (error || !data) return false;

  const isValid = data.username === user && data.password === pass;
  
  if (isValid) {
    // Save to localStorage for persistence
    localStorage.setItem(AUTH_KEY, 'true');
  }
  
  return isValid;
}

export function isLoggedIn() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = '/login';
}

export async function updateCredentials(user: string, pass: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('auth_config')
    .upsert({ 
      id: 1,
      username: user, 
      password: pass,
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) {
    console.error('Update Credentials Error:', error);
    return false;
  }

  // Double check if data was actually returned/updated
  return data && data.length > 0;
}
