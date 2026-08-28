import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabase = createClient(
  "https://hdelynngavpavndjxyvk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZWx5bm5nYXZwYXZuZGp4eXZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYxMTAwMywiZXhwIjoyMTAyMTg3MDAzfQ.FU8bqfhSe29Q5Y8BkqBAlmawzjfhcfUt78z42iQZgMQ"
);

const tables = [
  "teams", "team_members", "kpis", "projects", "client_projects",
  "client_project_logs", "notifications", "holidays", "agent_leaves",
  "campaigns", "ad_performance", "content_requests", "monthly_focus_plans"
];

async function generateSchema() {
  console.log("Generating current schema documentation...");
  const schema = {};

  // Try RPC first
  let rpcSuccess = false;
  try {
    const { data, error } = await supabase.rpc("get_schema_columns");
    if (!error && data) {
      data.forEach(row => {
        if (tables.includes(row.table_name)) {
          if (!schema[row.table_name]) schema[row.table_name] = [];
          schema[row.table_name].push(`${row.column_name} (${row.data_type})`);
        }
      });
      rpcSuccess = true;
      console.log("Successfully fetched columns via database RPC.");
    }
  } catch (e) {
    // Ignore and fallback
  }

  // Fallback: Query 1 row from each table and inspect keys
  if (!rpcSuccess) {
    console.log("RPC unavailable. Falling back to table inspection...");
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1);
        if (error) {
          console.error(`Error inspecting table ${table}:`, error.message);
        } else {
          // If no rows, we can still list table but with empty columns or query structural fields
          const firstRow = data[0] || {};
          const cols = Object.keys(firstRow);
          if (cols.length > 0) {
            schema[table] = cols.map(c => `${c} (type_unknown)`);
          } else {
            schema[table] = ["-- no rows to inspect columns"];
          }
        }
      } catch (err) {
        console.error(`Failed to inspect table ${table}:`, err.message);
      }
    }
  }

  // Generate output file content
  let sqlContent = `-- Supabase Schema - Current State (Generated on ${new Date().toISOString()})\n\n`;
  for (const [table, cols] of Object.entries(schema)) {
    sqlContent += `-- Table: ${table}\n`;
    sqlContent += `CREATE TABLE IF NOT EXISTS ${table} (\n`;
    cols.forEach((col, idx) => {
      const isLast = idx === cols.length - 1;
      sqlContent += `    ${col}${isLast ? "" : ","}\n`;
    });
    sqlContent += `);\n\n`;
  }

  fs.writeFileSync("supabase_schema_current.sql", sqlContent);
  console.log("Schema documentation updated in supabase_schema_current.sql");
}

generateSchema();
