import re

path = r"e:\Abhi\KPI app\preview\src\App.jsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Supabase import at the top of App.jsx below standard imports
content = content.replace(
    'import React, { useState, useMemo, useEffect } from "react";',
    'import React, { useState, useMemo, useEffect } from "react";\nimport { supabase } from "./supabaseClient";'
)

# Find App() block start and end
# Starting at 'export default function App() {'
app_start_pattern = "export default function App() {"
start_idx = content.find(app_start_pattern)

if start_idx == -1:
    print("Could not find App start index!")
    exit(1)

# Find the start of the return block of App
return_pattern = "  return ("
return_idx = content.find(return_pattern, start_idx)

if return_idx == -1:
    print("Could not find App return start!")
    exit(1)

# The new block of handlers and useEffect to place before 'return ('
new_app_hooks_and_handlers = """export default function App() {
  const [kpis, setKpis] = useState([]);
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);

  // Load from Supabase on mount, seed if empty
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Fetch Teams
        let { data: dbTeams, error: teamsError } = await supabase.from('teams').select('*');
        let { data: dbMembers, error: membersError } = await supabase.from('team_members').select('*');

        if (teamsError || membersError || !dbTeams || dbTeams.length === 0) {
          console.log("Supabase empty or error, seeding teams...");
          const seededTeams = [];
          for (const t of teamsData) {
            const { data: teamRow } = await supabase.from('teams').insert({
              name: t.name,
              description: t.description,
              lead: t.lead
            }).select().single();
            
            if (teamRow) {
              const membersToInsert = t.members.map(m => ({
                team_id: teamRow.id,
                name: m.name,
                employee_id: m.employeeId,
                designation: m.designation,
                experience: m.experience,
                reporting_manager: m.reportingManager,
                description: m.description
              }));
              const { data: memberRows } = await supabase.from('team_members').insert(membersToInsert).select();
              seededTeams.push({
                ...teamRow,
                members: memberRows.map(mr => ({
                  id: mr.id,
                  name: mr.name,
                  employeeId: mr.employee_id,
                  designation: mr.designation,
                  experience: mr.experience,
                  reportingManager: mr.reporting_manager,
                  description: mr.description
                }))
              });
            }
          }
          setTeams(seededTeams);
        } else {
          const loadedTeams = dbTeams.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            lead: t.lead,
            members: (dbMembers || []).filter(m => m.team_id === t.id).map(m => ({
              id: m.id,
              name: m.name,
              employeeId: m.employee_id,
              designation: m.designation,
              experience: m.experience,
              reportingManager: m.reporting_manager,
              description: m.description
            }))
          }));
          setTeams(loadedTeams);
        }

        // Fetch KPIs
        let { data: dbKpis, error: kpisError } = await supabase.from('kpis').select('*');
        if (kpisError || !dbKpis || dbKpis.length === 0) {
          console.log("Supabase empty or error, seeding KPIs...");
          const mappedInitialKpis = initialKpis.map(k => ({
            ...k,
            targetType: k.targetType || "monthly",
            targetsList: k.targetsList || [
              { id: "1", label: "CY Target", targetValue: k.target, targetDate: "2026-08-31" }
            ]
          }));

          const kpisToInsert = mappedInitialKpis.map(k => ({
            name: k.name,
            unit: k.unit,
            target: k.target,
            direction: k.direction,
            team: k.team,
            owner: k.owner,
            kra: k.kra,
            history: k.history || [],
            daily_actual: k.dailyActual || {},
            revised_alloc: k.revisedAlloc || {},
            custom_holidays: k.customHolidays || {},
            holidays_enabled: k.holidaysEnabled !== false,
            target_type: k.targetType,
            targets_list: k.targetsList
          }));

          const { data: kpiRows } = await supabase.from('kpis').insert(kpisToInsert).select();
          if (kpiRows) {
            setKpis(kpiRows.map(k => ({
              id: k.id,
              name: k.name,
              unit: k.unit,
              target: parseFloat(k.target),
              direction: k.direction,
              team: k.team,
              owner: k.owner,
              kra: k.kra,
              history: k.history || [],
              dailyActual: k.daily_actual || {},
              revisedAlloc: k.revised_alloc || {},
              customHolidays: k.custom_holidays || {},
              holidaysEnabled: k.holidays_enabled,
              targetType: k.target_type,
              targetsList: k.targets_list
            })));
          }
        } else {
          setKpis(dbKpis.map(k => ({
            id: k.id,
            name: k.name,
            unit: k.unit,
            target: parseFloat(k.target),
            direction: k.direction,
            team: k.team,
            owner: k.owner,
            kra: k.kra,
            history: k.history || [],
            dailyActual: k.daily_actual || {},
            revisedAlloc: k.revised_alloc || {},
            customHolidays: k.custom_holidays || {},
            holidaysEnabled: k.holidays_enabled,
            targetType: k.target_type,
            targetsList: k.targets_list
          })));
        }

        // Fetch Projects
        let { data: dbProjects, error: projectsError } = await supabase.from('projects').select('*');
        if (projectsError || !dbProjects || dbProjects.length === 0) {
          console.log("Supabase empty or error, seeding projects...");
          const projectsToInsert = initialProjects.map(p => ({
            name: p.name,
            description: p.description,
            team: p.team,
            lead: p.lead,
            stages: p.stages || [],
            current_stage_idx: p.currentStageIdx || 0
          }));
          const { data: projectRows } = await supabase.from('projects').insert(projectsToInsert).select();
          if (projectRows) {
            setProjects(projectRows.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              team: p.team,
              lead: p.lead,
              stages: p.stages || [],
              currentStageIdx: p.current_stage_idx
            })));
          }
        } else {
          setProjects(dbProjects.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            team: p.team,
            lead: p.lead,
            stages: p.stages || [],
            currentStageIdx: p.current_stage_idx
          })));
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleLog(kpiId, value) {
    let updatedHistory = [];
    setKpis((prev) => prev.map((k) => {
      if (k.id !== kpiId) return k;
      const nextIndex = k.history.length + 1;
      updatedHistory = [...k.history, { d: `W${nextIndex}`, v: value }];
      return { ...k, history: updatedHistory };
    }));
    await supabase.from('kpis').update({ history: updatedHistory }).eq('id', kpiId);
  }

  async function handleAddMember(teamId, member) {
    const { data: memberRow } = await supabase.from('team_members').insert({
      team_id: teamId,
      name: member.name,
      employee_id: member.employeeId,
      designation: member.designation,
      experience: member.experience,
      reporting_manager: member.reportingManager,
      description: member.description
    }).select().single();

    if (memberRow) {
      const formattedMember = {
        id: memberRow.id,
        name: memberRow.name,
        employeeId: memberRow.employee_id,
        designation: memberRow.designation,
        experience: memberRow.experience,
        reportingManager: memberRow.reporting_manager,
        description: memberRow.description
      };
      setTeams((prev) => prev.map((t) => t.id === teamId ? { ...t, members: [...t.members, formattedMember] } : t));
    }
  }

  async function handleAddVertical(newVertical) {
    const { data: teamRow } = await supabase.from('teams').insert({
      name: newVertical.name,
      description: newVertical.description,
      lead: newVertical.lead
    }).select().single();

    if (teamRow) {
      const formattedTeam = {
        id: teamRow.id,
        name: teamRow.name,
        description: teamRow.description,
        lead: teamRow.lead,
        members: []
      };
      setTeams((prev) => [...prev, formattedTeam]);
    }
  }

  async function handleAddKpi(newKpi) {
    const targetType = newKpi.targetType || "monthly";
    const targetsList = newKpi.targetsList || [
      { id: "1", label: "CY Target", targetValue: newKpi.target, targetDate: "2026-08-31" }
    ];

    const { data: kpiRow } = await supabase.from('kpis').insert({
      name: newKpi.name,
      unit: newKpi.unit,
      target: newKpi.target,
      direction: newKpi.direction,
      team: newKpi.team,
      owner: newKpi.owner,
      kra: newKpi.kra,
      history: newKpi.history || [],
      daily_actual: newKpi.dailyActual || {},
      revised_alloc: newKpi.revisedAlloc || {},
      custom_holidays: newKpi.customHolidays || {},
      holidays_enabled: newKpi.holidaysEnabled !== false,
      target_type: targetType,
      targets_list: targetsList
    }).select().single();

    if (kpiRow) {
      const formattedKpi = {
        id: kpiRow.id,
        name: kpiRow.name,
        unit: kpiRow.unit,
        target: parseFloat(kpiRow.target),
        direction: kpiRow.direction,
        team: kpiRow.team,
        owner: kpiRow.owner,
        kra: kpiRow.kra,
        history: kpiRow.history || [],
        dailyActual: kpiRow.daily_actual || {},
        revisedAlloc: kpiRow.revised_alloc || {},
        customHolidays: kpiRow.custom_holidays || {},
        holidaysEnabled: kpiRow.holidays_enabled,
        targetType: kpiRow.target_type,
        targetsList: kpiRow.targets_list
      };
      setKpis((prev) => [...prev, formattedKpi]);
    }
  }

  async function handleEditKpi(updatedKpi) {
    setKpis((prev) => prev.map((k) => k.id === updatedKpi.id ? updatedKpi : k));
    await supabase.from('kpis').update({
      name: updatedKpi.name,
      unit: updatedKpi.unit,
      target: updatedKpi.target,
      direction: updatedKpi.direction,
      team: updatedKpi.team,
      owner: updatedKpi.owner,
      kra: updatedKpi.kra,
      history: updatedKpi.history || [],
      daily_actual: updatedKpi.dailyActual || {},
      revised_alloc: updatedKpi.revisedAlloc || {},
      custom_holidays: updatedKpi.customHolidays || {},
      holidays_enabled: updatedKpi.holidaysEnabled !== false,
      target_type: updatedKpi.targetType,
      targets_list: updatedKpi.targetsList
    }).eq('id', updatedKpi.id);
  }

  async function handleAddProject(newProject) {
    const isNew = typeof newProject.id === "string" && newProject.id.startsWith("temp-");
    
    if (isNew) {
      const { data: projectRow } = await supabase.from('projects').insert({
        name: newProject.name,
        description: newProject.description,
        team: newProject.team,
        lead: newProject.lead,
        stages: newProject.stages || [],
        current_stage_idx: newProject.currentStageIdx || 0
      }).select().single();

      if (projectRow) {
        setProjects((prev) => [...prev.filter(p => p.id !== newProject.id), {
          id: projectRow.id,
          name: projectRow.name,
          description: projectRow.description,
          team: projectRow.team,
          lead: projectRow.lead,
          stages: projectRow.stages || [],
          currentStageIdx: projectRow.current_stage_idx
        }]);
      }
    } else {
      setProjects((prev) => prev.map(p => p.id === newProject.id ? newProject : p));
      await supabase.from('projects').upsert({
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        team: newProject.team,
        lead: newProject.lead,
        stages: newProject.stages || [],
        current_stage_idx: newProject.currentStageIdx || 0
      });
    }
  }

  async function handleUpdateProjectStage(projectId, stageIdx, status) {
    let updatedStages = [];
    setProjects((prev) => prev.map((proj) => {
      if (proj.id !== projectId) return proj;
      updatedStages = proj.stages.map((stage, idx) => {
        if (idx === stageIdx) return { ...stage, status };
        if (status === "current" && stage.status === "current") {
          return { ...stage, status: idx < stageIdx ? "completed" : "pending" };
        }
        return stage;
      });
      return { ...proj, stages: updatedStages, currentStageIdx: stageIdx };
    }));

    await supabase.from('projects').update({
      stages: updatedStages,
      current_stage_idx: stageIdx
    }).eq('id', projectId);
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-orange-50 flex items-center justify-center flex-col gap-3">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-teal-800">Syncing with Supabase...</p>
      </div>
    );
  }
"""

content = content[:start_idx] + new_app_hooks_and_handlers + content[return_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Supabase integrated successfully!")
