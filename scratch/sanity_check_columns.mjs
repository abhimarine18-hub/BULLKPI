import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  "https://hdelynngavpavndjxyvk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZWx5bm5nYXZwYXZuZGp4eXZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYxMTAwMywiZXhwIjoyMTAyMTg3MDAzfQ.FU8bqfhSe29Q5Y8BkqBAlmawzjfhcfUt78z42iQZgMQ"
);

const tables = [
  "teams", "team_members", "kpis", "projects", "holidays", "agent_leaves",
  "campaigns", "ad_performance", "content_requests", "monthly_focus_plans"
];

async function checkColumns() {
  console.log("Starting code-to-schema sanity checks...");
  
  // 1. Fetch current live database column list
  const schema = {};
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (!error && data) {
        schema[table] = Object.keys(data[0] || {});
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Read App.jsx content
  const appContent = fs.readFileSync("src/App.jsx", "utf8");

  // 3. Scan for potential columns referenced in select()
  // Pattern: .from("table").select("col1, col2, ...")
  let mismatches = 0;
  const selectRegex = /\.from\s*\(\s*["']([^"']+)["']\s*\)\s*\.\s*select\s*\(\s*["']([^"']+)["']/g;
  let match;
  while ((match = selectRegex.exec(appContent)) !== null) {
    const table = match[1];
    const columnsStr = match[2];
    if (columnsStr === "*") continue;

    const colsReferenced = columnsStr.split(",").map(c => c.trim().split(" ")[0].split(":")[0]); // handles aliases or basic formats
    const liveCols = schema[table];

    if (liveCols) {
      colsReferenced.forEach(col => {
        if (col && !liveCols.includes(col)) {
          console.warn(`⚠️ Warning: Column "${col}" referenced on table "${table}" was not found in live database schema!`);
          mismatches++;
        }
      });
    }
  }

  if (mismatches === 0) {
    console.log("✅ Code validation completed. No column mismatches detected!");
  } else {
    console.log(`❌ Validation finished with ${mismatches} mismatch warnings.`);
  }
}

checkColumns();
