process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://hdelynngavpavndjxyvk.supabase.co", "sb_publishable_pBdRfXy-i_E_W-rLS8pwBA_MOyCtbrr");

const { data, error } = await supabase.from("kpis").select("*").limit(1);
if (error) console.error(error.message);
else console.log("Columns:", Object.keys(data[0] || {}));
