
    const fs = require('fs');
    const content = fs.readFileSync('e:\Abhi\KPI app\preview\src\App.jsx', 'utf8');
    
    // Evaluate the arrays by creating a clean context
    const initialKpisMatch = content.match(/const initialKpis = ([\\s\\S]*?)^\s*\];/m);
    const initialProjectsMatch = content.match(/const initialProjects = ([\\s\\S]*?)^\s*\];/m);
    
    const initialKpis = eval(initialKpisMatch[0].replace('const initialKpis =', ''));
    const initialProjects = eval(initialProjectsMatch[0].replace('const initialProjects =', ''));
    
    let sql = '-- Seed Default KPIs\n';
    sql += 'INSERT INTO kpis (name, unit, target, direction, team, owner, kra, history, daily_actual, revised_alloc, custom_holidays, holidays_enabled, target_type, targets_list) VALUES\n';
    
    const kpiValues = initialKpis.map(k => {
      const name = k.name.replace(/'/g, "''");
      const unit = (k.unit || ' Nos').replace(/'/g, "''");
      const target = k.target || 0.0;
      const direction = (k.direction || 'higher').replace(/'/g, "''");
      const team = k.team.replace(/'/g, "''");
      const owner = k.owner.replace(/'/g, "''");
      const kra = (k.kra || '').replace(/'/g, "''");
      const history = JSON.stringify(k.history || []);
      const dailyActual = JSON.stringify(k.dailyActual || {});
      const revisedAlloc = JSON.stringify(k.revisedAlloc || {});
      const customHolidays = JSON.stringify(k.customHolidays || {});
      const holidaysEnabled = k.holidaysEnabled !== false;
      const targetType = (k.targetType || 'monthly').replace(/'/g, "''");
      const targetsList = JSON.stringify(k.targetsList || []);
      
      return `('${name}', '${unit}', ${target}, '${direction}', '${team}', '${owner}', '${kra}', '${history}', '${dailyActual}', '${revisedAlloc}', '${customHolidays}', ${holidaysEnabled}, '${targetType}', '${targetsList}')`;
    });
    
    sql += kpiValues.join(',\n') + ';\n\n';
    
    sql += '-- Seed Default Projects\n';
    sql += 'INSERT INTO projects (name, description, team, lead, stages, current_stage_idx) VALUES\n';
    
    const projValues = initialProjects.map(p => {
      const name = p.name.replace(/'/g, "''");
      const desc = (p.description || '').replace(/'/g, "''");
      const team = p.team.replace(/'/g, "''");
      const lead = p.lead.replace(/'/g, "''");
      const stages = JSON.stringify(p.stages || []);
      const idx = p.currentStageIdx || 0;
      
      return `('${name}', '${desc}', '${team}', '${lead}', '${stages}', ${idx})`;
    });
    
    sql += projValues.join(',\n') + ';\n';
    
    fs.writeFileSync('supabase_kpis_and_projects.sql', sql, 'utf8');
    console.log('SQL generated successfully!');
    