process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://hdelynngavpavndjxyvk.supabase.co", "sb_publishable_pBdRfXy-i_E_W-rLS8pwBA_MOyCtbrr");

const mapping = {
  "Apr": "2026-04",
  "May": "2026-05",
  "Jun": "2026-06",
  "Jul": "2026-07",
  "Aug": "2026-08",
  "Sep": "2026-09",
  "Oct": "2026-10",
  "Nov": "2026-11",
  "Dec": "2026-12",
  "Jan": "2027-01",
  "Feb": "2027-02",
  "Mar": "2027-03"
};

const mapObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  const newObj = {};
  for (const [k, v] of Object.entries(obj)) {
    const matchedKey = Object.keys(mapping).find(mk => mk.toLowerCase() === k.toLowerCase());
    if (matchedKey) {
      newObj[mapping[matchedKey]] = v;
    } else {
      newObj[k] = v;
    }
  }
  return newObj;
};

try {
  console.log("Fetching KPIs...");
  const { data: kpis, error } = await supabase.from("kpis").select("id, name, monthly_target, monthly_actual");
  if (error) {
    console.error("Fetch error:", error.message);
  } else {
    console.log(`Loaded ${kpis.length} KPIs. Starting updates...`);
    const updates = kpis.map(k => {
      const newTarget = mapObject(k.monthly_target);
      const newActual = mapObject(k.monthly_actual);
      return supabase
        .from("kpis")
        .update({
          monthly_target: newTarget,
          monthly_actual: newActual
        })
        .eq("id", k.id)
        .then(({ error: uErr }) => {
          if (uErr) {
            console.error(`ID ${k.id} failed:`, uErr.message);
          } else {
            console.log(`ID ${k.id} (${k.name}) done`);
          }
        });
    });
    
    await Promise.all(updates);
    console.log("All updates completed.");
  }
} catch (e) {
  console.error("Unexpected error:", e);
}
