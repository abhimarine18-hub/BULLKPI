import { supabase } from './src/supabaseClient.js'; async function clear() { await supabase.from('kpis').update({kpi_type: 'activity', report_config: {}}).eq('id', 67); } clear();
