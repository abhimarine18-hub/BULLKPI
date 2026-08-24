// HISTORICAL MIGRATION SCRIPT - Already applied against production.

import { supabase } from './src/supabaseClient.js'; async function add() { const {error} = await supabase.rpc('exec_sql', { sql: "ALTER TABLE kpis ADD COLUMN IF NOT EXISTS kpi_type TEXT DEFAULT 'activity', ADD COLUMN IF NOT EXISTS report_config JSONB DEFAULT '{}';" }); console.log('RPC result:', error); } add();
