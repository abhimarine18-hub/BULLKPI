const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

let target1 = \let targetDate = "";\\n          if (p.stages && p.stages.length > 0) {\;
let replace1 = \let targetDate = "";\\n          let projectStatus = "open";\\n          if (p.stages && p.stages.length > 0) {\;
app = app.replace(target1, replace1);

let target2 = \	argetDate = parsed.targetDate || targetDate;\\n            }\;
let replace2 = \	argetDate = parsed.targetDate || targetDate;\\n              projectStatus = parsed.status || "open";\\n            }\;
app = app.replace(target2, replace2);

let target3 = \	argetDate,\\n            team: p.team,\;
let replace3 = \	argetDate,\\n            status: projectStatus,\\n            team: p.team,\;
app = app.replace(target3, replace3);

let target4 = \	argetDate: newProject.targetDate\\n    });\;
let replace4 = \	argetDate: newProject.targetDate,\\n      status: newProject.status || "open"\\n    });\;
app = app.replace(target4, replace4);

const newDeleteLogic = \
  async function handleDeleteProject(id, force = false) {
    if (force) {
      if (window.confirm("Are you sure you want to PERMANENTLY delete this project? This action cannot be undone.")) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) console.error("Error deleting project from Supabase:", error);
      }
      return;
    }

    if (window.confirm("Are you sure you want to move this project to the bin? It will wait for admin approval to be permanently removed.")) {
      const proj = projects.find(p => p.id === id);
      if (!proj) return;
      const updatedProj = { ...proj, status: "bin" };
      
      const descriptionJson = JSON.stringify({
        resultAndImprovement: updatedProj.resultAndImprovement,
        linkedKpiIds: updatedProj.linkedKpiIds,
        memberNames: updatedProj.memberNames,
        targetDate: updatedProj.targetDate,
        status: "bin"
      });

      setProjects((prev) => prev.map((p) => p.id === id ? updatedProj : p));
      await supabase.from('projects').update({ description: descriptionJson }).eq('id', id);
    }
  }

  async function handleRestoreProject(id) {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    const updatedProj = { ...proj, status: "open" };
    
    const descriptionJson = JSON.stringify({
      resultAndImprovement: updatedProj.resultAndImprovement,
      linkedKpiIds: updatedProj.linkedKpiIds,
      memberNames: updatedProj.memberNames,
      targetDate: updatedProj.targetDate,
      status: "open"
    });

    setProjects((prev) => prev.map((p) => p.id === id ? updatedProj : p));
    await supabase.from('projects').update({ description: descriptionJson }).eq('id', id);
  }
\;
app = app.replace(/async function handleDeleteProject\\(id\\) \\{[\\s\\S]*?\\}\\n/, newDeleteLogic + '\\n');

app = app.replace('onDeleteKpi, onDeleteProject,\\nonUploadKpis', 'onDeleteKpi, onDeleteProject, onRestoreProject,\\nonUploadKpis');
app = app.replace('onDeleteProject={handleDeleteProject}\\n            onDeleteMember', 'onDeleteProject={handleDeleteProject}\\n            onRestoreProject={handleRestoreProject}\\n            onDeleteMember');

const target5 = \{screen === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Track initiatives, milestones, and linked KPI improvements.</p>
                <button onClick={() => setAddProjectOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                  <Plus className="h-4 w-4" /> New Project
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {projects.map((proj) => {\;

const replace5 = \{screen === "projects" && (() => {
            const openProjects = projects.filter(p => p.status !== "bin" && p.stages[p.currentStageIdx]?.status !== "completed");
            const completedProjects = projects.filter(p => p.status !== "bin" && p.stages.length > 0 && p.stages[p.currentStageIdx]?.status === "completed" && p.currentStageIdx === p.stages.length - 1);
            const binProjects = projects.filter(p => p.status === "bin");

            const activeList = projectTab === "open" ? openProjects : (projectTab === "completed" ? completedProjects : binProjects);

            return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">Track initiatives, milestones, and linked KPI improvements.</p>
                <button onClick={() => setAddProjectOpen(true)} className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm">
                  <Plus className="h-4 w-4" /> New Project
                </button>
              </div>

              {/* Project Tabs */}
              <div className="flex gap-6 border-b border-slate-200">
                <button 
                  onClick={() => setProjectTab("open")}
                  className={\\\pb-3 text-sm font-bold transition-colors relative \\\\\\}
                >
                  Open ({openProjects.length})
                  {projectTab === "open" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setProjectTab("completed")}
                  className={\\\pb-3 text-sm font-bold transition-colors relative \\\\\\}
                >
                  Completed ({completedProjects.length})
                  {projectTab === "completed" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setProjectTab("bin")}
                  className={\\\pb-3 text-sm font-bold transition-colors relative flex items-center gap-1.5 \\\\\\}
                >
                  <Trash2 className="h-4 w-4" /> Bin ({binProjects.length})
                  {projectTab === "bin" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 rounded-t-full" />}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {activeList.map((proj) => {\;
app = app.replace(target5, replace5);

const target6 = \<button
                                onClick={() => setEditingProject(proj)}
                                className="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg border border-slate-100 hover:bg-teal-50 transition-all"
                                title="Edit Project"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteProject(proj.id)}
                                className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                title="Delete Project"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>\;

const replace6 = \                              {projectTab === "bin" ? (
                                <>
                                  <button
                                    onClick={() => onRestoreProject(proj.id)}
                                    className="text-teal-600 hover:text-teal-800 p-1.5 rounded-lg border border-teal-100 hover:bg-teal-50 transition-all font-bold text-xs"
                                    title="Restore Project"
                                  >
                                    Restore
                                  </button>
                                  <button
                                    onClick={() => onDeleteProject(proj.id, true)}
                                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all font-bold text-xs"
                                    title="Permanently Delete by Admin"
                                  >
                                    Force Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingProject(proj)}
                                    className="text-slate-400 hover:text-teal-600 p-1.5 rounded-lg border border-slate-100 hover:bg-teal-50 transition-all"
                                    title="Edit Project"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteProject(proj.id)}
                                    className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-all"
                                    title="Move to Bin"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}\;

app = app.replace(target6, replace6);

const target7 = \                })}
              </div>
            </div>
          )}\;
const replace7 = \                })}
              </div>
            </div>
            );
          })()}\;
app = app.replace(target7, replace7);

const target8 = \unction AdminApp({ kpis, setKpis, onLog, teams, onAddMember, onAddVertical, onDeleteMember, onDeleteTeam, onAddKpi, projects, onAddProject, onUpdateProjectStage, onEditKpi, onDeleteKpi, onDeleteProject, onUploadKpis }) {\;
const replace8 = \unction AdminApp({ kpis, setKpis, onLog, teams, onAddMember, onAddVertical, onDeleteMember, onDeleteTeam, onAddKpi, projects, onAddProject, onUpdateProjectStage, onEditKpi, onDeleteKpi, onDeleteProject, onRestoreProject, onUploadKpis }) {\;
app = app.replace(target8, replace8);

const titleTarget = \<h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{proj.title}</h3>\;
const titleReplaceWith = \<h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "Poppins, sans-serif" }}>{proj.title}</h3>
                              {projectTab === "bin" && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                  Waiting for admin approval to remove
                                </span>
                              )}\;
app = app.replace(titleTarget, titleReplaceWith);

fs.writeFileSync('src/App.jsx', app);
