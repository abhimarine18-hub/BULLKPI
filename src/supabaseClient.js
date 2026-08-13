import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hdelynngavpavndjxyvk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pBdRfXy-i_E_W-rLS8pwBA_MOyCtbrr";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
