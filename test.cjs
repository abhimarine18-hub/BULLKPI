const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://hdelynngavpavndjxyvk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pBdRfXy-i_E_W-rLS8pwBA_MOyCtbrr";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('projects').select('*').eq('type', 'kpi');
  if (error) {
    console.error(error);
    return;
  }
  
  const hKpi = data.find(k => k.name.includes("Hindi - Testimonials"));
  if (hKpi) {
    console.log('KPI Name:', hKpi.name);
    console.log('reportConfig:', hKpi.description?.reportConfig);
    console.log('ID:', hKpi.id);
  } else {
    console.log('Not found by name. Printing all names:', data.map(k => k.name).join(', '));
  }
  
  const hKpi2 = data.find(k => k.name.includes("Hindi Testimonial"));
  if (hKpi2) {
    console.log('KPI 2 Name:', hKpi2.name);
    console.log('ID:', hKpi2.id);
  }
}

check();
