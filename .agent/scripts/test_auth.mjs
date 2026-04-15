import { createClient } from '@supabase/supabase-js';

const url = 'https://zcyloyfwetigcntlatvp.supabase.co';
const key = 'sb_publishable_hFGF2MzpRVesH59BtiXhuw_vU7N_K1B';
const supabase = createClient(url, key);

async function checkAuth() {
  console.log('Checking auth_config table...');
  const { data, error } = await supabase.from('auth_config').select('*');
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Data:', data);
  }
}

checkAuth();
