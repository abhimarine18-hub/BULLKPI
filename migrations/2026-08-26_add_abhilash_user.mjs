import { supabase } from '../src/supabaseClient.js';
import bcrypt from 'bcryptjs';

async function run() {
  const password = "123";
  const name = "Abhilash";
  const loginId = "20592";
  const team = "CRM and Coordinator";

  console.log(`Hashing password "${password}"...`);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed password:", hashedPassword);

  // Check if member already exists by name
  const { data: existing, error: fetchError } = await supabase
    .from('team_members')
    .select('*')
    .eq('name', name);

  if (fetchError) {
    console.error("Error fetching existing member:", fetchError.message);
    return;
  }

  if (existing && existing.length > 0) {
    const rowId = existing[0].id;
    console.log(`Found existing member "${name}" (ID: ${rowId}). Updating details...`);
    const { error: updateError } = await supabase
      .from('team_members')
      .update({
        login_id: loginId,
        password_hash: hashedPassword,
        team: team
      })
      .eq('id', rowId);

    if (updateError) {
      console.error("Error updating member:", updateError.message);
    } else {
      console.log(`Successfully updated member "${name}" with login_id: "${loginId}"`);
    }
  } else {
    console.log(`Member "${name}" not found. Inserting new row...`);
    const { error: insertError } = await supabase
      .from('team_members')
      .insert({
        name,
        team,
        login_id: loginId,
        password_hash: hashedPassword
      });

    if (insertError) {
      console.error("Error inserting member:", insertError.message);
    } else {
      console.log(`Successfully inserted new member "${name}" with login_id: "${loginId}"`);
    }
  }

  // Verify
  const { data: verified, error: verifyError } = await supabase
    .from('team_members')
    .select('id, name, team, login_id, password_hash')
    .eq('name', name);

  if (verifyError) {
    console.error("Verification failed:", verifyError.message);
  } else {
    console.log("Verified database row:", verified);
  }
}

run();
