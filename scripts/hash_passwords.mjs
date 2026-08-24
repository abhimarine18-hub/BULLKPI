import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// CRITICAL: Use the service_role key to bypass RLS, NOT the anon key
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Fetching all team members...");
  const { data: members, error } = await supabase.from('team_members').select('*');
  
  if (error) {
    console.error("Error fetching members:", error);
    return;
  }
  
  console.log(`Found ${members.length} members. Hashing passwords...`);
  
  let updatedCount = 0;
  
  for (const member of members) {
    if (!member.password) continue;
    
    // Check if already hashed
    if (member.password.startsWith('$2') && member.password.length === 60) {
      console.log(`Skipping ${member.name}: Password already hashed.`);
      continue;
    }
    
    // Hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(member.password, salt);
    
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ password: hashedPassword })
      .eq('id', member.id);
      
    if (updateError) {
      console.error(`Failed to update ${member.name}:`, updateError);
    } else {
      updatedCount++;
      console.log(`Updated password for ${member.name}.`);
    }
  }
  
  console.log(`\nMigration complete. Successfully hashed ${updatedCount} passwords.`);
}

run();
