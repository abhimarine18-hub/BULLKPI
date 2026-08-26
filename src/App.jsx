import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import {
  Target, FolderGit2, Menu, X, Coffee, LogOut, LayoutDashboard, Monitor, Smartphone, Search, Plus
} from "lucide-react";

export const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function KpiModal({ kpi, isOpen, onClose, onSave }) {
  const isEdit = !!kpi;
  const [formData, setFormData] = useState({
    name: "",
    team: "Digital Marketing",
    market: "Common",
    unit: "Nos",
    direction: "higher",
    cy_target: "",
    do_person: "",
    drive_person: "",
    monitor_person: "",
    checker: "",
    approver: "",
    monthly_target: {},
    monthly_actual: {}
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setFormData({
          name: kpi.name || "",
          team: kpi.team || "Digital Marketing",
          market: kpi.market || "Common",
          unit: kpi.unit || "Nos",
          direction: kpi.direction || "higher",
          cy_target: kpi.cy_target !== null ? String(kpi.cy_target) : "",
          do_person: kpi.do_person || "",
          drive_person: kpi.drive_person || "",
          monitor_person: kpi.monitor_person || "",
          checker: kpi.checker || "",
          approver: kpi.approver || "",
          monthly_target: kpi.monthly_target || {},
          monthly_actual: kpi.monthly_actual || {}
        });
      } else {
        setFormData({
          name: "",
          team: "Digital Marketing",
          market: "Common",
          unit: "Nos",
          direction: "higher",
          cy_target: "",
          do_person: "",
          drive_person: "",
          monitor_person: "",
          checker: "",
          approver: "",
          monthly_target: {},
          monthly_actual: {}
        });
      }
    }
  }, [isOpen, kpi, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      cy_target: formData.cy_target.trim() ? parseFloat(formData.cy_target) : null
    });
  };

  const handleMonthTargetChange = (m, val) => {
    setFormData(prev => ({
      ...prev,
      monthly_target: {
        ...prev.monthly_target,
        [m]: val.trim() ? parseFloat(val) : null
      }
    }));
  };

  const handleMonthActualChange = (m, val) => {
    setFormData(prev => ({
      ...prev,
      monthly_actual: {
        ...prev.monthly_actual,
        [m]: val.trim() ? parseFloat(val) : null
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-orange-100 flex flex-col">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-black text-slate-800 text-sm">{isEdit ? "Edit KPI details" : "Create new KPI"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-semibold text-slate-650 flex-1 overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">KPI Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Team</label>
              <select value={formData.team} onChange={e => setFormData(prev => ({ ...prev, team: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Video Production">Video Production</option>
                <option value="Graphic Designing">Graphic Designing</option>
                <option value="Enquiry Management">Enquiry Management</option>
                <option value="CRM and Coordinator">CRM and Coordinator</option>
                <option value="Expo and Events">Expo and Events</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Market</label>
              <select value={formData.market} onChange={e => setFormData(prev => ({ ...prev, market: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
                <option value="Common">Common</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unit (UOM)</label>
              <input required type="text" value={formData.unit} onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Direction</label>
              <select value={formData.direction} onChange={e => setFormData(prev => ({ ...prev, direction: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="higher">higher</option>
                <option value="lower">lower</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CY Target</label>
              <input type="number" step="any" value={formData.cy_target} onChange={e => setFormData(prev => ({ ...prev, cy_target: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Do Person</label>
              <input type="text" value={formData.do_person} onChange={e => setFormData(prev => ({ ...prev, do_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Drive Person</label>
              <input type="text" value={formData.drive_person} onChange={e => setFormData(prev => ({ ...prev, drive_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Monitor Person</label>
              <input type="text" value={formData.monitor_person} onChange={e => setFormData(prev => ({ ...prev, monitor_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Checker</label>
              <input type="text" value={formData.checker} onChange={e => setFormData(prev => ({ ...prev, checker: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Approver</label>
              <input type="text" value={formData.approver} onChange={e => setFormData(prev => ({ ...prev, approver: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>
          </div>

          <hr className="border-orange-100" />

          {/* Monthly Targets */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Monthly Targets</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {MONTHS_LIST.map(m => {
                const val = formData.monthly_target?.[m] ?? "";
                return (
                  <div key={m} className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider text-center">{m}</label>
                    <input type="number" step="any" value={val} onChange={e => handleMonthTargetChange(m, e.target.value)} className="w-full border border-orange-200 rounded-xl px-2 py-1.5 text-[11px] text-center font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800" />
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-orange-100" />

          {/* Monthly Actuals */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Monthly Actuals</h4>
              <span className="text-[9px] bg-amber-50 text-amber-700 font-black px-2 py-0.5 rounded-full border border-amber-100">Manual override (temporary)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {MONTHS_LIST.map(m => {
                const val = formData.monthly_actual?.[m] ?? "";
                return (
                  <div key={m} className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider text-center">{m}</label>
                    <input type="number" step="any" value={val} onChange={e => handleMonthActualChange(m, e.target.value)} className="w-full border border-orange-200 rounded-xl px-2 py-1.5 text-[11px] text-center font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 z-10 rounded-b-3xl">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

function ProjectModal({ project, isOpen, onClose, onSave, isAdmin, currentUser }) {
  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState({ name: "", responsible: "", support: "", target_date: "", status: "pending" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      const sorted = [...(project.stages || [])].sort((a, b) => a.stage_order - b.stage_order);
      setStages(sorted);
      setShowAddForm(false);
      setNewStage({ name: "", responsible: "", support: "", target_date: "", status: "pending" });
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleFieldChange = (index, field, value) => {
    setStages(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const handleStatusTransition = async (index, newStatus) => {
    let updated = stages.map((s, i) => i === index ? { ...s, status: newStatus } : s);
    
    // Auto transition logic: if setting to completed/done, set the next stage to 'current' if it exists and is 'pending'
    if (newStatus === "completed" && index < updated.length - 1) {
      if (updated[index + 1].status === "pending") {
        updated[index + 1].status = "current";
      }
    }

    setStages(updated);
    // Auto-save changes immediately for status transitions
    await onSave(project.id, updated);
  };

  const handleAddStageSubmit = () => {
    if (!newStage.name.trim()) return;
    const order = stages.length + 1;
    const added = {
      ...newStage,
      project_id: project.id,
      stage_order: order
    };
    setStages(prev => [...prev, added]);
    setShowAddForm(false);
    setNewStage({ name: "", responsible: "", support: "", target_date: "", status: "pending" });
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    await onSave(project.id, stages);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-orange-100 flex flex-col">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[9px] bg-teal-50 text-teal-700 font-black px-2 py-0.5 rounded-full border border-teal-100 uppercase tracking-wider block w-max mb-1">
              {project.team}
            </span>
            <h3 className="font-black text-slate-800 text-sm">{project.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs font-semibold text-slate-650 flex-1 overflow-y-auto">
          {project.objective && (
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Objective</span>
              <p className="text-slate-700 font-medium leading-relaxed">{project.objective}</p>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Project Stages</h4>
            
            <div className="space-y-3">
              {stages.map((stage, idx) => {
                const isResponsible = stage.responsible === currentUser?.name;
                const statusColor = 
                  stage.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  stage.status === "current" ? "bg-sky-50 text-sky-700 border-sky-100" :
                  "bg-slate-50 text-slate-500 border-slate-150";

                return (
                  <div key={stage.id || idx} className="border border-slate-150 rounded-2xl p-4 space-y-3 bg-white hover:border-orange-100 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                          {idx + 1}
                        </span>
                        <span>{stage.name}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                        {stage.status || "pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Responsible</label>
                        {isAdmin ? (
                          <input type="text" value={stage.responsible || ""} onChange={e => handleFieldChange(idx, "responsible", e.target.value)} className="w-full border border-orange-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-850 font-bold" />
                        ) : (
                          <p className="text-slate-800 font-bold bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">{stage.responsible || "-"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Support</label>
                        {isAdmin ? (
                          <input type="text" value={stage.support || ""} onChange={e => handleFieldChange(idx, "support", e.target.value)} className="w-full border border-orange-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-850 font-bold" />
                        ) : (
                          <p className="text-slate-800 font-bold bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">{stage.support || "-"}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Target Date</label>
                        {isAdmin ? (
                          <input type="date" value={stage.target_date || ""} onChange={e => handleFieldChange(idx, "target_date", e.target.value)} className="w-full border border-orange-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-850 font-mono" />
                        ) : (
                          <p className="text-slate-800 font-bold bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 font-mono">{stage.target_date || "-"}</p>
                        )}
                      </div>
                    </div>

                    {/* Non-admin / Employee Actions */}
                    {!isAdmin && isResponsible && (
                      <div className="flex justify-end pt-1">
                        {stage.status === "pending" && (
                          <button type="button" onClick={() => handleStatusTransition(idx, "current")} className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors">
                            Mark as Current
                          </button>
                        )}
                        {stage.status === "current" && (
                          <button type="button" onClick={() => handleStatusTransition(idx, "completed")} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] transition-colors">
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Admin Add Stage Form */}
            {isAdmin && (
              <div className="pt-2">
                {showAddForm ? (
                  <div className="border border-dashed border-orange-300 rounded-2xl p-4 bg-orange-50/20 space-y-3">
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Add New Stage</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <input type="text" placeholder="Stage Name" value={newStage.name} onChange={e => setNewStage(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <input type="text" placeholder="Responsible" value={newStage.responsible} onChange={e => setNewStage(prev => ({ ...prev, responsible: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <input type="text" placeholder="Support" value={newStage.support} onChange={e => setNewStage(prev => ({ ...prev, support: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs" />
                      </div>
                      <div>
                        <input type="date" value={newStage.target_date} onChange={e => setNewStage(prev => ({ ...prev, target_date: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs font-mono" />
                      </div>
                      <div>
                        <select value={newStage.status} onChange={e => setNewStage(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs bg-white font-bold text-slate-800">
                          <option value="pending">pending</option>
                          <option value="current">current</option>
                          <option value="completed">completed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowAddForm(false)} className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px]">Cancel</button>
                      <button type="button" onClick={handleAddStageSubmit} className="bg-teal-500 hover:bg-teal-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]">Add</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowAddForm(true)} className="w-full border border-dashed border-slate-300 hover:border-teal-500 hover:text-teal-600 rounded-2xl py-3 flex items-center justify-center gap-1.5 text-slate-500 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span className="text-xs font-bold">Add Stage</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2 sticky bottom-0 z-10 rounded-b-3xl">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">Cancel</button>
            <button onClick={handleSaveAll} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Save All Stages</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [role, setRole] = useState("employee");
  const [loginForm, setLoginForm] = useState({ loginId: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // App state
  const [kpis, setKpis] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [screen, setScreen] = useState("kpis");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedKpi, setSelectedKpi] = useState(null);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");

  // Restore session
  useEffect(() => {
    const cachedUser = localStorage.getItem("persistent_user");
    const cachedRole = localStorage.getItem("persistent_role");
    if (cachedUser) {
      const u = JSON.parse(cachedUser);
      setLoggedInUser(u);
      setRole(cachedRole || "employee");
      if (u.team) {
        fetchTeamData(u.team);
      }
    }
  }, []);

  async function fetchTeamData(teamName) {
    try {
      setTeamInfo({ name: teamName });

      // Fetch KPIs for this team
      const { data: kpisData, error: kpisError } = await supabase
        .from("kpis")
        .select("*")
        .eq("team", teamName);
      
      if (kpisError) {
        console.error("Error fetching KPIs from Supabase:", kpisError.message, kpisError.details);
      } else if (kpisData) {
        setKpis(kpisData);
      }

      // Fetch Projects for this team
      const { data: projsData, error: projsError } = await supabase
        .from("projects")
        .select("*")
        .eq("team", teamName);

      if (projsError) {
        console.error("Error fetching Projects from Supabase:", projsError.message, projsError.details);
      } else if (projsData && projsData.length > 0) {
        const projIds = projsData.map(p => p.id);
        // Fetch stages
        const { data: stagesData, error: stagesError } = await supabase
          .from("project_stages")
          .select("*")
          .in("project_id", projIds);
        
        if (stagesError) {
          console.error("Error fetching project stages from Supabase:", stagesError.message);
        }
        
        const mappedProjects = projsData.map(p => ({
          ...p,
          stages: (stagesData || []).filter(s => s.project_id === p.id)
        }));
        setProjects(mappedProjects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error loading team data:", err);
    }
  }

  const handleLogin = async () => {
    const { loginId, password } = loginForm;
    if (!loginId.trim() || !password.trim()) {
      setLoginError("Please enter your Login ID and Password.");
      return;
    }

    setLoading(true);
    setLoginError("");

    // Admin shortcut
    if (loginId.trim() === "admin" && password.trim() === "admin123") {
      const u = { name: "Admin", loginId: "admin", role: "admin" };
      setLoggedInUser(u);
      setRole("admin");
      localStorage.setItem("persistent_user", JSON.stringify(u));
      localStorage.setItem("persistent_role", "admin");
      setLoading(false);
      
      // Load all data for Admin
      try {
        const { data: kpisData } = await supabase.from("kpis").select("*");
        if (kpisData) setKpis(kpisData);
        const { data: projsData } = await supabase.from("projects").select("*");
        if (projsData) setProjects(projsData);
      } catch (e) {}
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("login", {
        body: { loginId: loginId.trim(), password: password.trim() }
      });

      if (error) throw error;

      if (data && data.success) {
        const match = data.user;
        const u = {
          id: match.id,
          name: match.name,
          loginId: match.login_id || match.employee_id,
          team: match.team,
          role: "employee"
        };
        setLoggedInUser(u);
        setRole("employee");
        localStorage.setItem("persistent_user", JSON.stringify(u));
        localStorage.setItem("persistent_role", "employee");

        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }

        if (match.team) {
          await fetchTeamData(match.team);
        }
      } else {
        setLoginError(data?.error || "Invalid Login ID or Password. Please try again.");
      }
    } catch (err) {
      setLoginError("Login failed: " + (err.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setLoginForm({ loginId: "", password: "" });
    setLoginError("");
    setKpis([]);
    setProjects([]);
    setTeamInfo(null);
    localStorage.removeItem("persistent_user");
    localStorage.removeItem("persistent_role");
    localStorage.removeItem("auth_token");
  };

  const handleSaveKpi = async (payload) => {
    try {
      if (selectedKpi) {
        // Update
        const { data, error } = await supabase
          .from("kpis")
          .update(payload)
          .eq("id", selectedKpi.id)
          .select();

        if (error) {
          console.error("Error updating KPI:", error.message);
          alert("Failed to update KPI: " + error.message);
        } else if (data && data.length > 0) {
          const updated = data[0];
          setKpis(prev => prev.map(k => k.id === updated.id ? updated : k));
          setIsKpiModalOpen(false);
          setSelectedKpi(null);
        }
      } else {
        // Create
        const { data, error } = await supabase
          .from("kpis")
          .insert(payload)
          .select();

        if (error) {
          console.error("Error creating KPI:", error.message);
          alert("Failed to create KPI: " + error.message);
        } else if (data && data.length > 0) {
          setKpis(prev => [...prev, data[0]]);
          setIsKpiModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleSaveProjectStages = async (projectId, updatedStages) => {
    try {
      const { data, error } = await supabase
        .from("project_stages")
        .upsert(updatedStages)
        .select();

      if (error) {
        console.error("Error saving project stages:", error.message);
        alert("Failed to save project stages: " + error.message);
      } else {
        setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            let newStatus = p.status;
            if (updatedStages.length > 0) {
              const allCompleted = updatedStages.every(s => s.status === "completed");
              const anyCurrentOrCompleted = updatedStages.some(s => s.status === "current" || s.status === "completed");
              if (allCompleted) newStatus = "completed";
              else if (anyCurrentOrCompleted) newStatus = "in_progress";
              else newStatus = "not_started";
            }
            
            if (newStatus !== p.status) {
              supabase.from("projects").update({ status: newStatus }).eq("id", projectId).then();
            }

            return {
              ...p,
              status: newStatus,
              stages: updatedStages
            };
          }
          return p;
        }));
        
        setSelectedProject(prev => {
          if (prev && prev.id === projectId) {
            let newStatus = prev.status;
            if (updatedStages.length > 0) {
              const allCompleted = updatedStages.every(s => s.status === "completed");
              const anyCurrentOrCompleted = updatedStages.some(s => s.status === "current" || s.status === "completed");
              if (allCompleted) newStatus = "completed";
              else if (anyCurrentOrCompleted) newStatus = "in_progress";
            }
            return { ...prev, status: newStatus, stages: updatedStages };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to save stages:", err);
    }
  };

  const currentMonthKey = useMemo(() => {
    return new Date().toLocaleString("en-US", { month: "short" }); // e.g. "Aug"
  }, []);

  // Group KPIs by team
  const groupedKpis = useMemo(() => {
    const groups = {};
    kpis.forEach(k => {
      const teamName = k.team || "Unassigned";
      if (!groups[teamName]) {
        groups[teamName] = [];
      }
      groups[teamName].push(k);
    });
    return groups;
  }, [kpis]);

  const groupedProjects = useMemo(() => {
    const groups = {};
    projects.forEach(p => {
      const teamName = p.team || "Unassigned";
      if (!groups[teamName]) {
        groups[teamName] = [];
      }
      groups[teamName].push(p);
    });
    return groups;
  }, [projects]);

  const myProjectTasks = useMemo(() => {
    const list = [];
    projects.forEach(p => {
      (p.stages || []).forEach(s => {
        if (s.responsible === loggedInUser?.name) {
          list.push({
            ...s,
            projectTitle: p.title,
            projectTeam: p.team,
            projectId: p.id,
            projectStages: p.stages
          });
        }
      });
    });
    return list.sort((a, b) => new Date(a.target_date || 0) - new Date(b.target_date || 0));
  }, [projects, loggedInUser]);

  if (!loggedInUser) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-black text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">PulseKPI</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 space-y-4 font-semibold text-xs text-slate-650">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Login ID</label>
              <input
                type="text"
                value={loginForm.loginId}
                onChange={e => setLoginForm(prev => ({ ...prev, loginId: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium text-slate-800"
                placeholder="Enter your Login ID or Employee ID"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium text-slate-800"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{loginError}</p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-xs disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1">
              Contact your admin if you have forgotten your login ID or password.
            </p>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4">BULL Machines · PulseKPI v2.0</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-orange-50 sm:p-4 flex flex-col overflow-hidden relative" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        <div className="flex bg-orange-50 rounded-2xl overflow-hidden border border-orange-100 flex-1 w-full h-full relative">
          
          {/* Sidebar Backdrop Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`bg-white border-r border-orange-100 flex flex-col h-full transition-all duration-300 shrink-0
            fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 shadow-lg md:shadow-none
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:w-48
          `}>
            <div className="h-16 flex items-center justify-between px-4 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-300 to-teal-300 flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">P</span>
                </div>
                <span className="font-bold text-slate-900 whitespace-nowrap">PulseKPI</span>
              </div>
              {mobileMenuOpen && (
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 md:hidden">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
              <button
                onClick={() => { setScreen("kpis"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  screen === "kpis" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <Target className="h-4 w-4" />
                <span>KPIs</span>
              </button>
              
              <button
                onClick={() => { setScreen("projects"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  screen === "projects" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <FolderGit2 className="h-4 w-4" />
                <span>Projects</span>
              </button>
            </nav>

            <div className="p-3 border-t border-orange-100 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-800 shrink-0">
                {loggedInUser.name ? loggedInUser.name.substring(0, 2).toUpperCase() : "US"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{loggedInUser.name}</p>
                <p className="text-[10px] text-slate-450 font-semibold truncate">{teamInfo ? teamInfo.name : "Admin View"}</p>
              </div>
              <button onClick={handleLogout} title="Logout" className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </aside>

          {/* Main Panel */}
          <main className="flex-1 min-w-0 overflow-y-auto flex flex-col bg-white">
            {/* Header */}
            <div className="h-16 border-b border-orange-100 flex items-center justify-between px-4 sm:px-8 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileMenuOpen(prev => !prev)}
                  className="p-1.5 rounded-lg border border-orange-100 hover:bg-orange-50 text-slate-500 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-sm sm:text-base font-black text-slate-800 capitalize">{screen}</h1>
              </div>
              {screen === "kpis" && role === "admin" && (
                <button
                  onClick={() => { setSelectedKpi(null); setIsKpiModalOpen(true); }}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add KPI</span>
                </button>
              )}
            </div>

            {/* Screen Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
              
              {screen === "kpis" && (
                <div className="space-y-6">
                  {Object.keys(groupedKpis).length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                      <span className="text-3xl">📊</span>
                      <p className="text-xs font-semibold text-slate-500 mt-2">No KPIs loaded for this team.</p>
                    </div>
                  ) : (
                    Object.entries(groupedKpis).map(([teamName, list]) => (
                      <div key={teamName} className="space-y-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">{teamName}</h3>
                        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                          <table className="w-full text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-150 text-left font-bold text-slate-500 uppercase tracking-wider select-none">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Market</th>
                                <th className="px-4 py-2">Do</th>
                                <th className="px-4 py-2">Drive</th>
                                <th className="px-4 py-2">Monitor</th>
                                <th className="px-4 py-2">CY Target</th>
                                <th className="px-4 py-2 text-right">Target ({currentMonthKey})</th>
                                <th className="px-4 py-2 text-right">Actual ({currentMonthKey})</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {list.map(k => {
                                const targetVal = k.monthly_target?.[currentMonthKey] ?? 0;
                                const actualVal = k.monthly_actual?.[currentMonthKey] ?? 0;
                                return (
                                  <tr
                                    key={k.id}
                                    onClick={() => { if (role === "admin") { setSelectedKpi(k); setIsKpiModalOpen(true); } }}
                                    className={`hover:bg-slate-50/40 transition-colors ${role === "admin" ? "cursor-pointer" : ""}`}
                                  >
                                    <td className="px-4 py-3 font-bold text-slate-800">{k.name}</td>
                                    <td className="px-4 py-3">{k.market || "-"}</td>
                                    <td className="px-4 py-3 font-mono">{k.do_person || "-"}</td>
                                    <td className="px-4 py-3 font-mono">{k.drive_person || "-"}</td>
                                    <td className="px-4 py-3 font-mono">{k.monitor_person || "-"}</td>
                                    <td className="px-4 py-3 font-mono font-bold text-slate-650">{k.cy_target ?? "-"}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">
                                      {targetVal ? new Intl.NumberFormat('en-IN').format(targetVal) : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                                      {actualVal ? new Intl.NumberFormat('en-IN').format(actualVal) : "-"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {screen === "projects" && (
                <div className="space-y-4">
                  {/* Filter Tabs */}
                  <div className="flex gap-2 border-b border-orange-100 pb-3">
                    <button
                      onClick={() => setProjectFilter("all")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        projectFilter === "all" ? "bg-orange-100 text-orange-700 font-black" : "text-slate-500 hover:bg-orange-50"
                      }`}
                    >
                      All Team Projects
                    </button>
                    <button
                      onClick={() => setProjectFilter("my_tasks")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        projectFilter === "my_tasks" ? "bg-orange-100 text-orange-700 font-black" : "text-slate-500 hover:bg-orange-50"
                      }`}
                    >
                      My Project Tasks ({myProjectTasks.length})
                    </button>
                  </div>

                  {projectFilter === "my_tasks" ? (
                    myProjectTasks.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                        <span className="text-3xl">📋</span>
                        <p className="text-xs font-semibold text-slate-500 mt-2">You have no active project tasks assigned.</p>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-[11px] border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                              <th className="px-4 py-2.5">Project</th>
                              <th className="px-4 py-2.5">Stage</th>
                              <th className="px-4 py-2.5">Support</th>
                              <th className="px-4 py-2.5">Target Date</th>
                              <th className="px-4 py-2.5">Status</th>
                              <th className="px-4 py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {myProjectTasks.map((task) => {
                              const statusColor = 
                                task.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                task.status === "current" ? "bg-sky-50 text-sky-700 border-sky-100" :
                                "bg-slate-50 text-slate-500 border-slate-150";

                              const handleTransition = async (newStatus) => {
                                const idx = (task.projectStages || []).findIndex(s => s.id === task.id);
                                if (idx !== -1) {
                                  let updated = [...(task.projectStages || [])].sort((a, b) => a.stage_order - b.stage_order);
                                  updated[idx] = { ...updated[idx], status: newStatus };
                                  if (newStatus === "completed" && idx < updated.length - 1) {
                                    if (updated[idx + 1].status === "pending") {
                                      updated[idx + 1].status = "current";
                                    }
                                  }
                                  await handleSaveProjectStages(task.projectId, updated);
                                }
                              };

                              return (
                                <tr key={task.id} className="hover:bg-slate-50/40 transition-colors">
                                  <td className="px-4 py-3 font-bold text-slate-800">{task.projectTitle}</td>
                                  <td className="px-4 py-3">{task.name}</td>
                                  <td className="px-4 py-3 font-mono">{task.support || "-"}</td>
                                  <td className="px-4 py-3 font-mono">{task.target_date || "-"}</td>
                                  <td className="px-4 py-3">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                                      {task.status || "pending"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {task.status === "pending" && (
                                      <button onClick={() => handleTransition("current")} className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors">
                                        Mark as Current
                                      </button>
                                    )}
                                    {task.status === "current" && (
                                      <button onClick={() => handleTransition("completed")} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors">
                                        Mark as Completed
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )
                  ) : (
                    Object.keys(groupedProjects).length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                        <span className="text-3xl">🚀</span>
                        <p className="text-xs font-semibold text-slate-500 mt-2">No projects loaded for this team.</p>
                      </div>
                    ) : (
                      Object.entries(groupedProjects).map(([teamName, list]) => (
                        <div key={teamName} className="space-y-3 pt-2">
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">{teamName}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {list.map(p => {
                              const sortedStages = [...(p.stages || [])].sort((a, b) => a.stage_order - b.stage_order);
                              
                              const statusColor = 
                                p.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                p.status === "in_progress" ? "bg-sky-50 text-sky-700 border-sky-100" :
                                "bg-slate-50 text-slate-500 border-slate-150";

                              return (
                                <div
                                  key={p.id}
                                  onClick={() => { setSelectedProject(p); setIsProjectModalOpen(true); }}
                                  className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs hover:border-orange-200 hover:shadow-md transition-all cursor-pointer space-y-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <h4 className="font-black text-slate-800 text-sm">{p.title}</h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                                      {p.status ? p.status.replace("_", " ") : "not started"}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold">
                                    <div>Do: <span className="text-slate-800">{p.do_person || "-"}</span></div>
                                    <div>Drive: <span className="text-slate-800">{p.drive_person || "-"}</span></div>
                                  </div>

                                  {/* Progress strip */}
                                  {sortedStages.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Progress Strip</div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {sortedStages.map(s => {
                                          const color = 
                                            s.status === "completed" ? "bg-emerald-500" :
                                            s.status === "current" ? "bg-sky-500 animate-pulse" :
                                            "bg-slate-350";
                                          return (
                                            <span
                                              key={s.id}
                                              title={`${s.name} (${s.status || "pending"})`}
                                              className={`h-2.5 px-2 rounded-full text-[8px] font-black text-white ${color} uppercase tracking-wider flex items-center justify-center`}
                                            >
                                              {s.name}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              )}

            </div>
          </main>
          
          <KpiModal
            kpi={selectedKpi}
            isOpen={isKpiModalOpen}
            onClose={() => { setIsKpiModalOpen(false); setSelectedKpi(null); }}
            onSave={handleSaveKpi}
          />

          <ProjectModal
            project={selectedProject}
            isOpen={isProjectModalOpen}
            onClose={() => { setIsProjectModalOpen(false); setSelectedProject(null); }}
            onSave={handleSaveProjectStages}
            isAdmin={role === "admin"}
            currentUser={loggedInUser}
          />
          
        </div>
      </div>
    </div>
  );
}
