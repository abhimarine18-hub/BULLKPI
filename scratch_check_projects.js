import { supabase } from './src/supabaseClient.js';
async function test() {
  const { data, error } = await supabase.from('team_members').select('*').limit(1);
  console.log('Member:', data);
  console.log('Error:', error);
}
test();
