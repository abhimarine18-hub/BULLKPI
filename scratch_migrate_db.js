import { supabase } from './src/supabaseClient.js';
async function migrate() {
  const { data: kpis } = await supabase.from('kpis').select('*');
  if (!kpis) return console.log('No kpis');
  
  for (const kpi of kpis) {
    const migrateObj = (obj) => {
      if (!obj) return {};
      const newObj = {};
      for (const [key, val] of Object.entries(obj)) {
        if (['Jan', 'Feb', 'Mar'].includes(key)) {
          newObj[key + ' 2027'] = val;
        } else if (['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(key)) {
          newObj[key + ' 2026'] = val;
        } else {
          newObj[key] = val; // already migrated?
        }
      }
      return newObj;
    };
    
    const newAlloc = migrateObj(kpi.monthly_alloc);
    const newActual = migrateObj(kpi.monthly_actual);
    
    const { error } = await supabase.from('kpis').update({
      monthly_alloc: newAlloc,
      monthly_actual: newActual
    }).eq('id', kpi.id);
    
    if (error) console.error('Error updating kpi', kpi.id, error);
  }
  console.log('Migration complete');
}
migrate();
