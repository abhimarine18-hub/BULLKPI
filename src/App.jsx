import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import {
  Target, FolderGit2, Menu, X, Coffee, LogOut, LayoutDashboard, Monitor, Smartphone, Search, Plus, Megaphone, ClipboardList
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

function CampaignModal({ campaign, isOpen, onClose, onSave, adPerformance = [] }) {
  const isEdit = !!campaign;
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    spend: "",
    reach: "",
    views: "",
    leads_generated: "",
    status: "planning"
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setFormData({
          name: campaign.name || "",
          start_date: campaign.start_date || "",
          end_date: campaign.end_date || "",
          spend: campaign.spend !== null && campaign.spend !== undefined ? String(campaign.spend) : "",
          reach: campaign.reach !== null && campaign.reach !== undefined ? String(campaign.reach) : "",
          views: campaign.views !== null && campaign.views !== undefined ? String(campaign.views) : "",
          leads_generated: campaign.leads_generated !== null && campaign.leads_generated !== undefined ? String(campaign.leads_generated) : "",
          status: campaign.status || "planning"
        });
      } else {
        setFormData({
          name: "",
          start_date: "",
          end_date: "",
          spend: "",
          reach: "",
          views: "",
          leads_generated: "",
          status: "planning"
        });
      }
    }
  }, [isOpen, campaign, isEdit]);

  const sortedAds = useMemo(() => {
    if (!campaign) return [];
    return adPerformance
      .filter(ad => ad.campaign_id === campaign.id)
      .map(ad => {
        const spend = parseFloat(ad.spend) || 0;
        const leads = parseInt(ad.leads, 10) || 0;
        const cpl = leads > 0 ? (spend / leads) : Infinity;
        return { ...ad, cpl };
      })
      .sort((a, b) => a.cpl - b.cpl);
  }, [adPerformance, campaign]);

  const summary = useMemo(() => {
    let totalSpend = 0;
    let totalLeads = 0;
    let totalReach = 0;
    sortedAds.forEach(ad => {
      totalSpend += parseFloat(ad.spend) || 0;
      totalLeads += parseInt(ad.leads, 10) || 0;
      totalReach += parseInt(ad.reach, 10) || 0;
    });
    const blendedCpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;
    return { totalSpend, totalLeads, totalReach, blendedCpl };
  }, [sortedAds]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: formData.name.trim(),
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      spend: formData.spend.trim() ? parseFloat(formData.spend) : null,
      reach: formData.reach.trim() ? parseInt(formData.reach, 10) : null,
      views: formData.views.trim() ? parseInt(formData.views, 10) : null,
      leads_generated: formData.leads_generated.trim() ? parseInt(formData.leads_generated, 10) : null,
      status: formData.status
    });
  };

  const spendVal = parseFloat(formData.spend) || 0;
  const leadsVal = parseInt(formData.leads_generated, 10) || 0;
  const costPerLead = spendVal && leadsVal ? (spendVal / leadsVal).toFixed(2) : null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className={`bg-white rounded-3xl shadow-xl w-full ${isEdit && sortedAds.length > 0 ? "max-w-2xl" : "max-w-md"} overflow-hidden border border-orange-100 flex flex-col`}>
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">{isEdit ? "Campaign details" : "New Campaign"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-650 overflow-y-auto max-h-[80vh]">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Campaign Name</label>
            <input required type="text" disabled={isEdit} value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold disabled:bg-slate-50 disabled:text-slate-550" />
          </div>

          {!isEdit ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Start Date</label>
                <input required type="date" value={formData.start_date} onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">End Date</label>
                <input required type="date" value={formData.end_date} onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-mono" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Spend (₹)</label>
                  <input type="number" step="any" value={formData.spend} onChange={e => setFormData(prev => ({ ...prev, spend: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Leads Generated</label>
                  <input type="number" value={formData.leads_generated} onChange={e => setFormData(prev => ({ ...prev, leads_generated: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
                </div>
              </div>

              {/* ROI line */}
              {costPerLead !== null && (
                <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 text-center text-teal-800 font-black tracking-wide text-[10px]">
                  Spend: ₹{new Intl.NumberFormat('en-IN').format(spendVal)} | Leads: {leadsVal} | Cost per Lead: ₹{costPerLead}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reach</label>
                  <input type="number" value={formData.reach} onChange={e => setFormData(prev => ({ ...prev, reach: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Views</label>
                  <input type="number" value={formData.views} onChange={e => setFormData(prev => ({ ...prev, views: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</label>
                <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                  <option value="planning">planning</option>
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>

              {sortedAds.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Ad Performance</h4>
                  
                  {/* Summary row */}
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-2.5 text-center text-slate-700 font-bold text-[9px] flex justify-around select-none">
                    <div>Total Spend: <span className="font-mono text-slate-900">₹{new Intl.NumberFormat('en-IN').format(summary.totalSpend)}</span></div>
                    <div>Total Leads: <span className="font-mono text-slate-900">{summary.totalLeads}</span></div>
                    <div>Blended CPL: <span className="font-mono text-teal-700 font-black">₹{summary.blendedCpl.toFixed(2)}</span></div>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-150 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                    <table className="w-full text-[9px] border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                          <th className="px-3 py-2">Ad Set</th>
                          <th className="px-3 py-2">Ad Name</th>
                          <th className="px-3 py-2 text-right">Spend</th>
                          <th className="px-3 py-2 text-right">Leads</th>
                          <th className="px-3 py-2 text-right">CPL</th>
                          <th className="px-3 py-2 text-right">Reach</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {sortedAds.map(ad => (
                          <tr key={ad.id} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2 max-w-[110px] truncate" title={ad.adset_name}>{ad.adset_name}</td>
                            <td className="px-3 py-2 max-w-[110px] truncate" title={ad.ad_name}>{ad.ad_name}</td>
                            <td className="px-3 py-2 text-right font-mono">₹{ad.spend ? new Intl.NumberFormat('en-IN').format(ad.spend) : "0"}</td>
                            <td className="px-3 py-2 text-right font-mono">{ad.leads}</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-teal-650">
                              {ad.cpl === Infinity ? "-" : `₹${ad.cpl.toFixed(2)}`}
                            </td>
                            <td className="px-3 py-2 text-right font-mono">{ad.reach ? new Intl.NumberFormat('en-IN').format(ad.reach) : "0"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Save</button>
        </div>
      </form>
    </div>
  );
}

function NewRequestModal({ isOpen, onClose, onSave, campaigns, prefilledDate }) {
  const [formData, setFormData] = useState({
    title: "",
    content_type: "testimonial_video",
    campaign: "",
    planned_post_date: "",
    brief: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        content_type: "testimonial_video",
        campaign: "",
        planned_post_date: prefilledDate || "",
        brief: ""
      });
    }
  }, [isOpen, prefilledDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: formData.title.trim(),
      content_type: formData.content_type,
      campaign: formData.campaign,
      planned_post_date: formData.planned_post_date,
      brief: formData.brief.trim()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-orange-100 flex flex-col">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">New Content Request</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-650">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Request Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Content Type</label>
              <select value={formData.content_type} onChange={e => setFormData(prev => ({ ...prev, content_type: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                <option value="testimonial_video">testimonial video</option>
                <option value="branding_video">branding video</option>
                <option value="poster">poster</option>
                <option value="campaign_poster">campaign poster</option>
                <option value="festival_poster">festival poster</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Campaign (Optional)</label>
              <select value={formData.campaign} onChange={e => setFormData(prev => ({ ...prev, campaign: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500">
                <option value="">None</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Planned Post Date</label>
            <input required type="date" value={formData.planned_post_date} onChange={e => setFormData(prev => ({ ...prev, planned_post_date: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-mono" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brief / Description</label>
            <textarea rows="4" value={formData.brief} onChange={e => setFormData(prev => ({ ...prev, brief: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold resize-none" placeholder="Provide request details..."></textarea>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Submit Request</button>
        </div>
      </form>
    </div>
  );
}

function PostLinkModal({ isOpen, onClose, onSave }) {
  const [link, setLink] = useState("");

  useEffect(() => {
    if (isOpen) setLink("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(link.trim());
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-orange-100 flex flex-col">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">Mark as Posted</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-3 text-xs font-semibold text-slate-650">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Post Link</label>
            <input required type="url" placeholder="https://instagram.com/... or https://youtube.com/..." value={link} onChange={e => setLink(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">Cancel</button>
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Confirm Posted</button>
        </div>
      </form>
    </div>
  );
}

function RequestDetailsModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  const statusColor = 
    request.status === "posted" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
    request.status === "ready" ? "bg-teal-50 text-teal-750 border-teal-100" :
    request.status === "in_progress" ? "bg-sky-50 text-sky-700 border-sky-100" :
    "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-orange-100 flex flex-col animate-in fade-in zoom-in duration-150">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-sm">Request Detail ({request.request_number})</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-650">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Title</span>
            <p className="text-slate-800 font-bold text-sm">{request.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Content Type</span>
              <p className="text-slate-800 capitalize">{request.content_type?.replace("_", " ")}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Team</span>
              <p className="text-slate-800">{request.assigned_team}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Planned Post Date</span>
              <p className="text-slate-800 font-mono">{request.planned_post_date || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Required By Date</span>
              <p className="text-slate-800 font-mono">{request.required_by_date || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Requested By</span>
              <p className="text-slate-800">{request.requested_by}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
              <div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                  {request.status || "pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Brief / Info</span>
            <p className="text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 font-medium whitespace-pre-wrap max-h-[150px] overflow-y-auto font-sans leading-relaxed">
              {request.brief || "No brief details provided."}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button type="button" onClick={onClose} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 font-bold rounded-xl text-xs shadow-sm transition-colors">Close</button>
        </div>
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
  const [screen, setScreen] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDashboardTeam, setActiveDashboardTeam] = useState("CRM and Coordinator");

  const [selectedKpi, setSelectedKpi] = useState(null);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState("all");

  const [campaigns, setCampaigns] = useState([]);
  const [adPerformance, setAdPerformance] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const [contentRequests, setContentRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRequestForPost, setSelectedRequestForPost] = useState(null);
  const [postLinkModalOpen, setPostLinkModalOpen] = useState(false);
  const [postLinkValue, setPostLinkValue] = useState("");
  const [requestFilterStatus, setRequestFilterStatus] = useState("all");
  const [requestFilterTeam, setRequestFilterTeam] = useState("all");

  const [calendarPrefilledDate, setCalendarPrefilledDate] = useState("");
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [activePopup, setActivePopup] = useState(null);
  const [showTestimonialSubmenu, setShowTestimonialSubmenu] = useState(false);

  const [membersMap, setMembersMap] = useState({});

  const fetchMemberDesignations = async () => {
    try {
      const { data, error } = await supabase.from("team_members").select("name, designation");
      if (error) {
        console.error("Error loading team member designations:", error.message);
      } else if (data) {
        const map = {};
        data.forEach(m => {
          if (m.name) {
            map[m.name] = m.designation || "";
          }
        });
        setMembersMap(map);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore session
  useEffect(() => {
    const cachedUser = localStorage.getItem("persistent_user");
    const cachedRole = localStorage.getItem("persistent_role");
    if (cachedUser) {
      const u = JSON.parse(cachedUser);
      setLoggedInUser(u);
      const isAdm = cachedRole === "admin";
      setRole(cachedRole || "employee");
      fetchMemberDesignations();
      if (isAdm) {
        supabase.from("kpis").select("*").then(({ data }) => { if (data) setKpis(data); });
        supabase.from("projects").select("*").then(({ data }) => { if (data) setProjects(data); });
        fetchCampaignsData();
        fetchAdPerformanceData();
        fetchContentRequestsData();
      } else {
        if (u.team) {
          setActiveDashboardTeam(u.team);
          fetchTeamData(u.team);
        }
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
      if (teamName === "Digital Marketing" || role === "admin") {
        await fetchCampaignsData();
        await fetchAdPerformanceData();
      }
      if (role === "admin" || ["Digital Marketing", "Video Production", "Graphic Designing"].includes(teamName)) {
        await fetchContentRequestsData();
      }
    } catch (err) {
      console.error("Error loading team data:", err);
    }
  }

  const parseCSV = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') {
          i++;
        }
        lines.push(row.map(cell => cell.trim()));
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row.map(cell => cell.trim()));
    }
    return lines;
  };

  const handleImportAdReport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert("CSV is empty or invalid.");
          return;
        }

        const headers = rows[0].map(h => h.toLowerCase().trim());
        
        const getIdx = (candidates) => {
          return headers.findIndex(h => candidates.some(c => h.includes(c) || c.includes(h)));
        };

        const campaignNameIdx = getIdx(["campaign name", "campaign_name", "campaign"]);
        const adsetNameIdx = getIdx(["ad set name", "ad_set_name", "adset name", "adset_name", "adset"]);
        const adNameIdx = getIdx(["ad name", "ad_name", "ad"]);
        const spendIdx = getIdx(["amount spent", "amount_spent", "spend", "spent"]);
        const reachIdx = getIdx(["reach"]);
        const leadsIdx = getIdx(["leads", "conversions", "leads_generated"]);

        if (campaignNameIdx === -1 || adsetNameIdx === -1 || adNameIdx === -1) {
          alert("Could not find required columns in CSV (Campaign Name, Ad Set Name, Ad Name).");
          return;
        }

        const parsedRecords = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < Math.max(campaignNameIdx, adsetNameIdx, adNameIdx) + 1) continue;

          const campName = row[campaignNameIdx] || "";
          if (!campName) continue;

          const adsetName = row[adsetNameIdx] || "";
          const adName = row[adNameIdx] || "";
          const spend = parseFloat((row[spendIdx] || "0").replace(/[^0-9.]/g, "")) || 0;
          const reach = parseInt((row[reachIdx] || "0").replace(/[^0-9]/g, ""), 10) || 0;
          const leads = parseInt((row[leadsIdx] || "0").replace(/[^0-9]/g, ""), 10) || 0;

          const matchedCampaign = campaigns.find(c => 
            c.name.toLowerCase().trim() === campName.toLowerCase().trim() ||
            c.name.toLowerCase().includes(campName.toLowerCase()) ||
            campName.toLowerCase().includes(c.name.toLowerCase())
          );

          parsedRecords.push({
            campaign_id: matchedCampaign ? matchedCampaign.id : null,
            campaign_name: campName,
            adset_name: adsetName,
            ad_name: adName,
            spend: spend,
            reach: reach,
            leads: leads
          });
        }

        if (parsedRecords.length === 0) {
          alert("No valid rows parsed from the CSV.");
          return;
        }

        const { error } = await supabase
          .from("ad_performance")
          .insert(parsedRecords);

        if (error) {
          throw error;
        }

        alert(`Successfully imported ${parsedRecords.length} ad performance records!`);
        await fetchAdPerformanceData();
      } catch (err) {
        console.error("Error importing ad report:", err);
        alert("Failed to import ad report: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const fetchCampaignsData = async () => {
    try {
      const { data, error } = await supabase.from("campaigns").select("*");
      if (error) {
        console.error("Error fetching campaigns from Supabase:", error.message);
      } else if (data) {
        setCampaigns(data);
      }
    } catch (err) {
      console.error("Error loading campaigns:", err);
    }
  };

  const fetchAdPerformanceData = async () => {
    try {
      const { data, error } = await supabase.from("ad_performance").select("*");
      if (error) {
        console.error("Error fetching ad performance from Supabase:", error.message);
      } else if (data) {
        setAdPerformance(data);
      }
    } catch (err) {
      console.error("Error loading ad performance:", err);
    }
  };

  const fetchContentRequestsData = async () => {
    try {
      const { data, error } = await supabase.from("content_requests").select("*");
      if (error) {
        console.error("Error fetching content requests from Supabase:", error.message);
      } else if (data) {
        setContentRequests(data);
      }
    } catch (err) {
      console.error("Error loading content requests:", err);
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const loginId = (loginForm.loginId || "").trim() || (document.getElementsByName("loginId")[0]?.value || "").trim();
    const password = (loginForm.password || "").trim() || (document.getElementsByName("password")[0]?.value || "").trim();

    if (!loginId || !password) {
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
        await fetchCampaignsData();
        await fetchAdPerformanceData();
        await fetchContentRequestsData();
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
          designation: match.designation,
          role: "employee"
        };
        setLoggedInUser(u);
        setRole("employee");
        localStorage.setItem("persistent_user", JSON.stringify(u));
        localStorage.setItem("persistent_role", "employee");
        await fetchMemberDesignations();

        if (data.token) {
          localStorage.setItem("auth_token", data.token);
        }

        if (match.team) {
          setActiveDashboardTeam(match.team);
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
    setCampaigns([]);
    setContentRequests([]);
    setTeamInfo(null);
    setMembersMap({});
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

  const handleSaveCampaign = async (payload) => {
    try {
      if (selectedCampaign) {
        // Update
        const { error } = await supabase
          .from("campaigns")
          .update({
            spend: payload.spend,
            reach: payload.reach,
            views: payload.views,
            leads_generated: payload.leads_generated,
            status: payload.status
          })
          .eq("id", selectedCampaign.id);

        if (error) {
          console.error("Error updating campaign:", error.message);
        } else {
          setCampaigns(prev => prev.map(c => c.id === selectedCampaign.id ? { ...c, ...payload } : c));
          setIsCampaignModalOpen(false);
          setSelectedCampaign(null);
        }
      } else {
        // Insert new campaign
        const newRecord = {
          name: payload.name,
          start_date: payload.start_date,
          end_date: payload.end_date,
          status: "planning",
          team: "Digital Marketing"
        };
        const { data, error } = await supabase
          .from("campaigns")
          .insert(newRecord)
          .select();

        if (error) {
          console.error("Error inserting campaign:", error.message);
        } else if (data && data[0]) {
          setCampaigns(prev => [...prev, data[0]]);
          setIsCampaignModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Error saving campaign:", err);
    }
  };

  const handleSaveContentRequest = async (payload) => {
    try {
      const currentYear = new Date().getFullYear();
      const prefix = `CR-${currentYear}-`;
      const sameYearRequests = contentRequests.filter(r => r.request_number && r.request_number.startsWith(prefix));
      let maxNum = 0;
      sameYearRequests.forEach(r => {
        const parts = r.request_number.split("-");
        if (parts.length === 3) {
          const num = parseInt(parts[2], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const newNum = String(maxNum + 1).padStart(4, "0");
      const requestNumber = `${prefix}${newNum}`;

      const plannedDate = new Date(payload.planned_post_date);
      plannedDate.setDate(plannedDate.getDate() - 5);
      const requiredByDate = plannedDate.toISOString().split("T")[0];

      const assignedTeam = payload.content_type.includes("video") ? "Video Production" : "Graphic Designing";

      const linkedKpi = getLinkedKpiForContentType(payload.content_type);

      const newRecord = {
        request_number: requestNumber,
        title: payload.title,
        content_type: payload.content_type,
        planned_post_date: payload.planned_post_date,
        required_by_date: requiredByDate,
        brief: payload.campaign ? `Campaign: ${payload.campaign}\n\nBrief: ${payload.brief}` : payload.brief,
        requested_by: loggedInUser.name,
        assigned_team: assignedTeam,
        status: "pending",
        linked_kpi_id: linkedKpi ? linkedKpi.id : null
      };

      const { data, error } = await supabase
        .from("content_requests")
        .insert(newRecord)
        .select();

      if (error) {
        console.error("Error inserting content request:", error.message);
        alert("Failed to insert content request: " + error.message);
      } else if (data && data[0]) {
        setContentRequests(prev => [...prev, data[0]]);
        setIsRequestModalOpen(false);
        setCalendarPrefilledDate("");
        
        try {
          await supabase.from("notifications").insert({
            type: "reminder",
            title: "New Content Request Scheduled",
            message: `A new content request (${requestNumber}) has been scheduled for team ${assignedTeam}.`,
            recipient: assignedTeam,
            status: "unread"
          });
        } catch (ne) {
          console.error("Failed to insert notification:", ne);
        }
      }
    } catch (err) {
      console.error("Error saving content request:", err);
    }
  };

  const handleAcceptContentRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from("content_requests")
        .update({ status: "in_progress" })
        .eq("id", requestId);

      if (error) {
        console.error("Error accepting request:", error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "in_progress" } : r));
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handlePostContentRequest = async (requestId, postLink) => {
    try {
      const req = contentRequests.find(r => r.id === requestId);
      if (!req) return;

      const updatedBrief = req.brief 
        ? `${req.brief}\n\nPost Link: ${postLink}` 
        : `Post Link: ${postLink}`;

      const { error } = await supabase
        .from("content_requests")
        .update({ status: "posted", brief: updatedBrief })
        .eq("id", requestId);

      if (error) {
        console.error("Error marking request as posted:", error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "posted", brief: updatedBrief } : r));
        setPostLinkModalOpen(false);
        setSelectedRequestForPost(null);
        setPostLinkValue("");
      }
    } catch (err) {
      console.error("Error marking request as posted:", err);
    }
  };

  const currentMonthKey = useMemo(() => {
    return new Date().toLocaleString("en-US", { month: "short" }); // e.g. "Aug"
  }, []);

  const filteredRequests = useMemo(() => {
    return contentRequests.filter(r => {
      const matchStatus = requestFilterStatus === "all" || r.status === requestFilterStatus;
      const matchTeam = requestFilterTeam === "all" || r.assigned_team === requestFilterTeam;
      return matchStatus && matchTeam;
    });
  }, [contentRequests, requestFilterStatus, requestFilterTeam]);

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  }, [currentYear, currentMonth]);

  const getLinkedKpiForContentType = (contentType) => {
    if (!contentType) return null;
    const normalized = contentType.toLowerCase().replace(/_/g, " ");

    const candidates = kpis.filter(k => 
      k.team === "Video Production" || 
      k.team === "Graphic Designing" || 
      k.team === "Digital Marketing"
    );

    if (normalized.includes("testimonial video")) {
      const langs = ["hindi", "tamil", "kannada", "telugu", "bengali", "gujarati", "malayalam", "odia", "marathi", "punjabi"];
      const matchedLang = langs.find(lang => normalized.includes(lang));
      if (matchedLang) {
        let match = candidates.find(k => {
          const nameLower = k.name.toLowerCase();
          return nameLower.includes("testimonial") && 
                 nameLower.includes("posted") &&
                 (nameLower.includes(matchedLang) || (matchedLang === "bengali" && nameLower.includes("benglali")));
        });
        if (!match) {
          match = candidates.find(k => {
            const nameLower = k.name.toLowerCase();
            return nameLower.includes("testimonial") && 
                   (nameLower.includes(matchedLang) || (matchedLang === "bengali" && nameLower.includes("benglali")));
          });
        }
        if (match) return match;
      }
    }

    if (normalized.includes("sm poster") || normalized.includes("campaign poster") || normalized.includes("festival poster") || normalized.includes("poster")) {
      const match = candidates.find(k => {
        const nameLower = k.name.toLowerCase();
        return nameLower.includes("poster") && !nameLower.includes("reach");
      });
      if (match) return match;
    }

    if (normalized.includes("branding video")) {
      const match = candidates.find(k => k.name.toLowerCase().includes("branding video"));
      if (match) return match;
    }

    if (normalized.includes("campaign video") || normalized.includes("video")) {
      const match = candidates.find(k => {
        const nameLower = k.name.toLowerCase();
        return nameLower.includes("video") && !nameLower.includes("view");
      });
      if (match) return match;
    }

    return null;
  };

  const capacityStats = useMemo(() => {
    const monthStr = `${new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "short" })} ${currentYear}`;
    
    const types = [
      { id: "sm_poster", label: "SM Poster", type: "sm_poster" },
      { id: "branding_video", label: "Branding Video", type: "branding_video" },
      { id: "festival_poster", label: "Festival Poster", type: "festival_poster" },
      { id: "campaign_poster", label: "Campaign Poster", type: "campaign_poster" },
      { id: "campaign_video", label: "Campaign Video", type: "campaign_video" },
      ...["Hindi", "Tamil", "Kannada", "Telugu", "Bengali", "Gujarati", "Malayalam", "Odia", "Marathi", "Punjabi"].map(lang => ({
        id: `testimonial_video_${lang.toLowerCase()}`,
        label: `${lang} Testimonial`,
        type: `testimonial_video_${lang.toLowerCase()}`
      }))
    ];

    const monthlyRequests = contentRequests.filter(r => {
      if (!r.planned_post_date) return false;
      const d = new Date(r.planned_post_date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    return types.map(t => {
      const linkedKpi = getLinkedKpiForContentType(t.type);
      const target = linkedKpi?.monthly_target?.[monthStr] ?? 0;
      
      const scheduled = monthlyRequests.filter(r => 
        (r.linked_kpi_id && linkedKpi && r.linked_kpi_id === linkedKpi.id) ||
        (r.content_type === t.type)
      ).length;

      const remaining = target - scheduled;

      return {
        ...t,
        target,
        scheduled,
        remaining,
        linkedKpi
      };
    });
  }, [currentYear, currentMonth, contentRequests, kpis]);

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

  const dashboardKpis = useMemo(() => {
    return kpis.filter(k => k.team === activeDashboardTeam);
  }, [kpis, activeDashboardTeam]);

  const dashboardProjects = useMemo(() => {
    return projects.filter(p => p.team === activeDashboardTeam);
  }, [projects, activeDashboardTeam]);

  const dashboardStats = useMemo(() => {
    let total = dashboardKpis.length;
    let onTrack = 0;
    let atRisk = 0;
    let offTrack = 0;
    dashboardKpis.forEach(k => {
      const targetVal = k.monthly_target?.[currentMonthKey] ?? 0;
      const actualVal = k.monthly_actual?.[currentMonthKey] ?? 0;
      if (targetVal === 0) {
        onTrack++;
      } else {
        if (actualVal >= targetVal) onTrack++;
        else if (actualVal >= 0.8 * targetVal) atRisk++;
        else offTrack++;
      }
    });
    return { total, onTrack, atRisk, offTrack };
  }, [dashboardKpis, currentMonthKey]);

  const personalKpis = useMemo(() => {
    return kpis.filter(k => k.do_person === loggedInUser?.name);
  }, [kpis, loggedInUser]);

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

          <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6 space-y-4 font-semibold text-xs text-slate-650">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Login ID</label>
              <input
                type="text"
                name="loginId"
                value={loginForm.loginId}
                onChange={e => setLoginForm(prev => ({ ...prev, loginId: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium text-slate-800"
                placeholder="Enter your Login ID or Employee ID"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                value={loginForm.password}
                onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-300 font-medium text-slate-800"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm text-xs disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1">
              Contact your admin if you have forgotten your login ID or password.
            </p>
          </form>
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
                onClick={() => { setScreen("dashboard"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  screen === "dashboard" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>My Dashboard</span>
              </button>

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

              {(role === "admin" || loggedInUser?.team === "Digital Marketing") && (
                <button
                  onClick={() => { setScreen("campaigns"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    screen === "campaigns" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                  }`}
                >
                  <Megaphone className="h-4 w-4" />
                  <span>Campaigns</span>
                </button>
              )}

              {(role === "admin" || ["Digital Marketing", "Video Production", "Graphic Designing"].includes(loggedInUser?.team)) && (
                <button
                  onClick={() => { setScreen("content_requests"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    screen === "content_requests" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                  }`}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span>Content Requests</span>
                </button>
              )}
            </nav>

            <div className="p-3 border-t border-orange-100 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-800 shrink-0">
                {loggedInUser.name ? loggedInUser.name.substring(0, 2).toUpperCase() : "US"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {loggedInUser.name}
                  {loggedInUser.designation && <span className="text-[9px] text-slate-450 font-semibold ml-1">· {loggedInUser.designation}</span>}
                </p>
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
              {(screen === "dashboard" || screen === "content_requests") && role === "admin" && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400">Team Switcher:</span>
                  <select
                    value={activeDashboardTeam}
                    onChange={(e) => setActiveDashboardTeam(e.target.value)}
                    className="border border-orange-200 rounded-xl px-3 py-1.5 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Graphic Designing">Graphic Designing</option>
                    <option value="Enquiry Management">Enquiry Management</option>
                    <option value="CRM and Coordinator">CRM and Coordinator</option>
                    <option value="Expo and Events">Expo and Events</option>
                  </select>
                </div>
              )}
            </div>

            {/* Screen Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50">
              
              {screen === "dashboard" && (
                <div className="space-y-6">
                  {/* Summary Stats Header */}
                  <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                          {activeDashboardTeam} Dashboard
                        </h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Summary performance for the current month</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Total KPIs</span>
                        <span className="text-xl font-black text-slate-800">{dashboardStats.total}</span>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-black text-emerald-600/80 uppercase tracking-wider block mb-1">On Track</span>
                        <span className="text-xl font-black text-emerald-700">{dashboardStats.onTrack}</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-black text-amber-600/80 uppercase tracking-wider block mb-1">At Risk</span>
                        <span className="text-xl font-black text-amber-700">{dashboardStats.atRisk}</span>
                      </div>
                      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-black text-rose-600/80 uppercase tracking-wider block mb-1">Off Track</span>
                        <span className="text-xl font-black text-rose-700">{dashboardStats.offTrack}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Dashboard Section for non-admin */}
                  {role !== "admin" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">My Personal Tasks & KPIs</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Personal KPIs */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-3">
                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">My KPIs ({personalKpis.length})</h4>
                          {personalKpis.length === 0 ? (
                            <p className="text-[11px] text-slate-400 font-bold py-4 text-center">No KPIs where you are marked as DO person.</p>
                          ) : (
                            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                              {personalKpis.map(k => {
                                const targetVal = k.monthly_target?.[currentMonthKey] ?? 0;
                                const actualVal = k.monthly_actual?.[currentMonthKey] ?? 0;
                                return (
                                  <div key={k.id} className="py-2.5 flex items-center justify-between gap-4 text-[11px]">
                                    <span className="font-bold text-slate-800 truncate">{k.name}</span>
                                    <div className="flex gap-4 shrink-0 font-mono font-bold">
                                      <div className="text-slate-500">TGT: {targetVal ? new Intl.NumberFormat('en-IN').format(targetVal) : "-"}</div>
                                      <div className="text-emerald-600">ACT: {actualVal ? new Intl.NumberFormat('en-IN').format(actualVal) : "-"}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Personal Project Stages */}
                        <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-3">
                          <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">My Project Tasks ({myProjectTasks.length})</h4>
                          {myProjectTasks.length === 0 ? (
                            <p className="text-[11px] text-slate-400 font-bold py-4 text-center">No active project stages where you are responsible.</p>
                          ) : (
                            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
                              {myProjectTasks.map(task => (
                                <div key={task.id} className="py-2.5 flex items-center justify-between gap-3 text-[11px]">
                                  <div className="min-w-0">
                                    <p className="font-black text-slate-850 truncate">{task.projectTitle}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">{task.name}</p>
                                  </div>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase shrink-0 tracking-wider ${
                                    task.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    task.status === "current" ? "bg-sky-50 text-sky-700 border-sky-100 animate-pulse" :
                                    "bg-slate-50 text-slate-500 border-slate-150"
                                  }`}>
                                    {task.status || "pending"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team Performance Segment */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">{activeDashboardTeam} KPIs & Projects</h3>
                    
                    {/* Team KPIs */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1">Team KPIs</h4>
                      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-[11px] border-collapse text-left">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                              <th className="px-4 py-2.5">Name</th>
                              <th className="px-4 py-2.5">Market</th>
                              <th className="px-4 py-2.5">Do</th>
                              <th className="px-4 py-2.5">Drive</th>
                              <th className="px-4 py-2.5">Monitor</th>
                              <th className="px-4 py-2.5 text-right">Target ({currentMonthKey})</th>
                              <th className="px-4 py-2.5 text-right">Actual ({currentMonthKey})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {dashboardKpis.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="px-4 py-6 text-center text-slate-400 font-semibold">No KPIs found for this team.</td>
                              </tr>
                            ) : (
                              dashboardKpis.map(k => {
                                const targetVal = k.monthly_target?.[currentMonthKey] ?? 0;
                                const actualVal = k.monthly_actual?.[currentMonthKey] ?? 0;
                                return (
                                  <tr
                                    key={k.id}
                                    onClick={() => { if (role === "admin") { setSelectedKpi(k); setIsKpiModalOpen(true); } }}
                                    className={`hover:bg-slate-50/40 transition-colors ${role === "admin" ? "cursor-pointer" : ""}`}
                                  >
                                    <td className="px-4 py-3 font-bold text-slate-850">{k.name}</td>
                                    <td className="px-4 py-3">{k.market || "-"}</td>
                                    <td className="px-4 py-3 font-mono">
                                      {k.do_person || "-"}
                                      {k.do_person && membersMap[k.do_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.do_person]}</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                      {k.drive_person || "-"}
                                      {k.drive_person && membersMap[k.drive_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.drive_person]}</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                      {k.monitor_person || "-"}
                                      {k.monitor_person && membersMap[k.monitor_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.monitor_person]}</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-600">
                                      {targetVal ? new Intl.NumberFormat('en-IN').format(targetVal) : "-"}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                                      {actualVal ? new Intl.NumberFormat('en-IN').format(actualVal) : "-"}
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Team Projects */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider pl-1">Team Projects</h4>
                      {dashboardProjects.length === 0 ? (
                        <div className="bg-white border border-slate-150 rounded-2xl p-6 text-center text-slate-400 font-semibold shadow-xs">
                          No projects found for this team.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {dashboardProjects.map(p => {
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
                                  <h5 className="font-black text-slate-800 text-sm">{p.title}</h5>
                                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                                    {p.status ? p.status.replace("_", " ") : "not started"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-bold">
                                  <div>Do: <span className="text-slate-800">{p.do_person || "-"}</span></div>
                                  <div>Drive: <span className="text-slate-800">{p.drive_person || "-"}</span></div>
                                </div>

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
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                                    <td className="px-4 py-3 font-mono">
                                      {k.do_person || "-"}
                                      {k.do_person && membersMap[k.do_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.do_person]}</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                      {k.drive_person || "-"}
                                      {k.drive_person && membersMap[k.drive_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.drive_person]}</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                      {k.monitor_person || "-"}
                                      {k.monitor_person && membersMap[k.monitor_person] && (
                                        <span className="text-[9px] text-slate-400 font-semibold font-sans ml-1">· {membersMap[k.monitor_person]}</span>
                                      )}
                                    </td>
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

              {screen === "campaigns" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2">
                    <div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Campaigns</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manage marketing campaigns, spend, and lead metrics</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <label className="cursor-pointer bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors border border-slate-200">
                        <span>Import Ad Report</span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleImportAdReport}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => { setSelectedCampaign(null); setIsCampaignModalOpen(true); }}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>New Campaign</span>
                      </button>
                    </div>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                      <span className="text-4xl">📣</span>
                      <h3 className="text-sm font-black text-slate-800 mt-3">No campaigns loaded</h3>
                      <p className="text-xs font-semibold text-slate-450 mt-1">Start by adding a new campaign using the button above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {campaigns.map((c) => {
                        const statusColor = 
                          c.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          c.status === "active" ? "bg-sky-50 text-sky-700 border-sky-100" :
                          "bg-amber-50 text-amber-700 border-amber-100";

                        const spendVal = parseFloat(c.spend) || 0;
                        const leadsVal = parseInt(c.leads_generated, 10) || 0;
                        const costPerLead = spendVal && leadsVal ? (spendVal / leadsVal).toFixed(2) : null;

                        return (
                          <div
                            key={c.id}
                            onClick={() => { setSelectedCampaign(c); setIsCampaignModalOpen(true); }}
                            className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs hover:border-orange-250 hover:shadow-md transition-all cursor-pointer space-y-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-black text-slate-800 text-sm truncate" title={c.name}>{c.name}</h4>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider shrink-0 ${statusColor}`}>
                                {c.status || "planning"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[10px] text-slate-500 font-bold border-b border-slate-50 pb-3">
                              <div>Spend: <span className="text-slate-800 font-mono">₹{c.spend ? new Intl.NumberFormat('en-IN').format(c.spend) : "-"}</span></div>
                              <div>Leads: <span className="text-slate-800 font-mono">{c.leads_generated !== null && c.leads_generated !== undefined ? c.leads_generated : "-"}</span></div>
                              <div>Reach: <span className="text-slate-800 font-mono">{c.reach ? new Intl.NumberFormat('en-IN').format(c.reach) : "-"}</span></div>
                              <div>Views: <span className="text-slate-800 font-mono">{c.views ? new Intl.NumberFormat('en-IN').format(c.views) : "-"}</span></div>
                            </div>

                            {/* Date range & ROI */}
                            <div className="space-y-1.5 pt-1 text-[10px]">
                              {costPerLead !== null && (
                                <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-2 text-center text-teal-850 font-black tracking-wide text-[9px]">
                                  Cost per Lead: ₹{costPerLead}
                                </div>
                              )}
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                {c.start_date || "-"} to {c.end_date || "-"}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {screen === "content_requests" && (
                <div className="space-y-4">
                  {((role !== "admin" && loggedInUser?.team === "Digital Marketing") || (role === "admin" && activeDashboardTeam === "Digital Marketing")) ? (
                    /* Calendar View with Floating Context Popup for Digital Marketing */
                    <div className="space-y-4 relative">
                      <div className="flex justify-between items-center pb-2">
                        <div>
                          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Content Planning Calendar</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Schedule and plan upcoming social posts & assets</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-white border border-slate-150 rounded-xl px-2 py-1 shadow-xs">
                            <button
                              onClick={() => {
                                if (currentMonth === 0) {
                                  setCurrentMonth(11);
                                  setCurrentYear(y => y - 1);
                                } else {
                                  setCurrentMonth(m => m - 1);
                                }
                              }}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 font-bold text-xs"
                            >
                              &larr;
                            </button>
                            <span className="text-xs font-black text-slate-800 px-2 select-none uppercase tracking-wide">
                              {new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <button
                              onClick={() => {
                                if (currentMonth === 11) {
                                  setCurrentMonth(0);
                                  setCurrentYear(y => y + 1);
                                } else {
                                  setCurrentMonth(m => m + 1);
                                }
                              }}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 font-bold text-xs"
                            >
                              &rarr;
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative animate-in fade-in duration-200">
                        {/* Calendar Grid */}
                        <div className="lg:col-span-3 bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between">
                          <div>
                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                              <div>Sun</div>
                              <div>Mon</div>
                              <div>Tue</div>
                              <div>Wed</div>
                              <div>Thu</div>
                              <div>Fri</div>
                              <div>Sat</div>
                            </div>

                            {/* Calendar Grid Cells */}
                            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                              {calendarDays.map((day, idx) => {
                                if (day === null) {
                                  return <div key={`empty-${idx}`} className="bg-slate-50/20 min-h-[90px]" />;
                                }

                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                const dayRequests = contentRequests.filter(r => r.planned_post_date === dateStr);

                                return (
                                  <div
                                    key={`day-${day}`}
                                    onClick={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setActivePopup({
                                        dateStr,
                                        x: rect.left + window.scrollX,
                                        y: rect.bottom + window.scrollY,
                                        step: "menu",
                                        selectedType: "",
                                        selectedLanguage: "",
                                        request: null
                                      });
                                    }}
                                    className="min-h-[90px] p-2 hover:bg-orange-50/20 transition-colors cursor-pointer flex flex-col items-stretch group"
                                  >
                                    <span className="text-[10px] font-black text-slate-400 group-hover:text-orange-500 transition-colors">
                                      {day}
                                    </span>

                                    <div className="mt-1 space-y-1 overflow-y-auto flex-1 max-h-[70px] pr-0.5">
                                      {dayRequests.map(r => {
                                        const isVideo = r.content_type?.includes("video");
                                        return (
                                          <div
                                            key={r.id}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const rect = e.currentTarget.getBoundingClientRect();
                                              setActivePopup({
                                                dateStr,
                                                x: rect.left + window.scrollX,
                                                y: rect.bottom + window.scrollY,
                                                step: "details",
                                                request: r
                                              });
                                            }}
                                            className={`text-[8px] font-black px-1.5 py-0.5 rounded-lg border truncate text-left cursor-pointer uppercase ${
                                              isVideo 
                                                ? "bg-sky-50 text-sky-700 border-sky-100 hover:border-sky-300" 
                                                : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300"
                                            }`}
                                            title={`${r.title} (${r.status || "pending"})`}
                                          >
                                            {r.title}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Capacity Summary Panel */}
                        <div className="lg:col-span-1 bg-white border border-slate-150 rounded-3xl p-4 shadow-xs space-y-3 flex flex-col justify-start">
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Monthly Capacity</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Target vs Scheduled posts</p>
                          </div>
                          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[520px] pr-1 space-y-2.5">
                            {capacityStats.map(stat => {
                              const isOver = stat.scheduled > stat.target;
                              return (
                                <div key={stat.id} className="pt-2 flex items-center justify-between text-[10px]">
                                  <div className="min-w-0 pr-2">
                                    <p className="font-bold text-slate-800 truncate" title={stat.label}>{stat.label}</p>
                                    <p className="text-[8px] text-slate-400 font-bold font-mono truncate" title={stat.linkedKpi ? stat.linkedKpi.name : "Untracked"}>
                                      {stat.linkedKpi ? stat.linkedKpi.name : "Untracked"}
                                    </p>
                                  </div>
                                  <div className="text-right font-bold text-slate-650 flex flex-col items-end shrink-0">
                                    <p className="font-mono text-slate-800">{stat.scheduled} / {stat.target}</p>
                                    {isOver ? (
                                      <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wider mt-0.5 animate-pulse">
                                        Additional
                                      </span>
                                    ) : (
                                      <span className="text-[7.5px] text-slate-400 uppercase tracking-wider font-semibold">
                                        {Math.max(0, stat.remaining)} left
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Floating Context Popup */}
                      {activePopup && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActivePopup(null)} />
                          <div
                            className="fixed z-50 bg-white border border-orange-100 rounded-2xl shadow-xl p-3 w-56 text-xs text-slate-700 font-semibold flex flex-col"
                            style={{
                              left: `${Math.min(activePopup.x, window.innerWidth - 240)}px`,
                              top: `${Math.min(activePopup.y, window.innerHeight - 380)}px`
                            }}
                          >
                            {activePopup.step === "menu" && (
                              <div className="space-y-1 relative">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-50 mb-1">
                                  Schedule: {activePopup.dateStr}
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => setActivePopup(prev => ({ ...prev, step: "form", selectedType: "sm_poster" }))}
                                  className="w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between"
                                >
                                  <span>SM Poster</span>
                                  <span className="text-[9px] text-slate-450">Poster</span>
                                </button>

                                <div
                                  className="relative"
                                  onMouseEnter={() => setShowTestimonialSubmenu(true)}
                                  onMouseLeave={() => setShowTestimonialSubmenu(false)}
                                >
                                  <button
                                    type="button"
                                    className={`w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between ${showTestimonialSubmenu ? "bg-orange-50" : ""}`}
                                  >
                                    <span>Testimonial Video</span>
                                    <span className="text-[9px] text-slate-450">&rarr;</span>
                                  </button>

                                  {showTestimonialSubmenu && (
                                    <div className="absolute left-full top-0 ml-1 bg-white border border-orange-150 rounded-2xl shadow-xl p-1.5 w-36 space-y-0.5 z-55 divide-y divide-slate-55">
                                      {["Hindi", "Tamil", "Kannada", "Telugu", "Bengali", "Gujarati", "Malayalam", "Odia", "Marathi", "Punjabi"].map(lang => (
                                        <button
                                          key={lang}
                                          type="button"
                                          onClick={() => {
                                            setActivePopup(prev => ({
                                              ...prev,
                                              step: "form",
                                              selectedType: `testimonial_video_${lang.toLowerCase()}`,
                                              selectedLanguage: lang
                                            }));
                                            setShowTestimonialSubmenu(false);
                                          }}
                                          className="w-full text-left px-2 py-1 hover:bg-orange-50 rounded-lg font-bold text-[10px] transition-colors"
                                        >
                                          {lang}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setActivePopup(prev => ({ ...prev, step: "form", selectedType: "branding_video" }))}
                                  className="w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between"
                                >
                                  <span>Branding Video</span>
                                  <span className="text-[9px] text-slate-455">Video</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setActivePopup(prev => ({ ...prev, step: "form", selectedType: "festival_poster" }))}
                                  className="w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between"
                                >
                                  <span>Festival Poster</span>
                                  <span className="text-[9px] text-slate-450">Poster</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setActivePopup(prev => ({ ...prev, step: "form", selectedType: "campaign_poster" }))}
                                  className="w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between"
                                >
                                  <span>Campaign Poster</span>
                                  <span className="text-[9px] text-slate-455">Poster</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setActivePopup(prev => ({ ...prev, step: "form", selectedType: "campaign_video" }))}
                                  className="w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between"
                                >
                                  <span>Campaign Video</span>
                                  <span className="text-[9px] text-slate-455">Video</span>
                                </button>
                              </div>
                            )}

                            {activePopup.step === "form" && (
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const titleInput = e.target.elements.title.value.trim();
                                  const campaignInput = e.target.elements.campaign.value;
                                  const briefInput = e.target.elements.brief.value.trim();
                                  
                                  await handleSaveContentRequest({
                                    title: titleInput,
                                    content_type: activePopup.selectedType,
                                    campaign: campaignInput,
                                    planned_post_date: activePopup.dateStr,
                                    brief: briefInput
                                  });
                                  setActivePopup(null);
                                }}
                                className="space-y-3"
                              >
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
                                  Schedule Form ({activePopup.dateStr})
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Title</label>
                                  <input
                                    required
                                    type="text"
                                    name="title"
                                    defaultValue={
                                      activePopup.selectedLanguage 
                                        ? `${activePopup.selectedLanguage} Testimonial Video`
                                        : activePopup.selectedType === "sm_poster" ? "SM Poster"
                                        : activePopup.selectedType === "branding_video" ? "Branding Video"
                                        : activePopup.selectedType === "festival_poster" ? "Festival Poster"
                                        : activePopup.selectedType === "campaign_poster" ? "Campaign Poster"
                                        : activePopup.selectedType === "campaign_video" ? "Campaign Video"
                                        : ""
                                    }
                                    className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Campaign (Optional)</label>
                                  <select
                                    name="campaign"
                                    className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500"
                                  >
                                    <option value="">None</option>
                                    {campaigns.map(c => (
                                      <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Brief</label>
                                  <textarea
                                    name="brief"
                                    rows="3"
                                    required
                                    className="w-full border border-orange-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-medium resize-none leading-normal"
                                    placeholder="Details..."
                                  />
                                </div>

                                {(() => {
                                  const selectedStat = capacityStats.find(s => s.type === activePopup.selectedType);
                                  return selectedStat ? (
                                    <div className="text-[9px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-100 select-none text-left mb-1.5 leading-tight">
                                      {selectedStat.scheduled >= selectedStat.target ? (
                                        <span className="text-orange-600">
                                          {selectedStat.label}: {selectedStat.scheduled}/{selectedStat.target} scheduled — this will be <span className="font-black uppercase tracking-wider bg-orange-55 px-1 rounded border border-orange-100 text-[8px] animate-pulse">Additional</span>
                                        </span>
                                      ) : (
                                        <span className="text-slate-650">
                                          {selectedStat.label}: {selectedStat.scheduled}/{selectedStat.target} scheduled, {selectedStat.remaining} remaining
                                        </span>
                                      )}
                                    </div>
                                  ) : null;
                                })()}

                                <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-50">
                                  <button
                                    type="button"
                                    onClick={() => setActivePopup(prev => ({ ...prev, step: "menu" }))}
                                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-lg font-bold text-[10px] transition-colors"
                                  >
                                    Back
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg font-bold text-[10px] transition-colors shadow-xs"
                                  >
                                    Schedule
                                  </button>
                                </div>
                              </form>
                            )}

                            {activePopup.step === "details" && activePopup.request && (
                              <div className="space-y-2 text-[10px]">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-1">
                                  <span className="text-[9px] font-bold text-slate-400 font-mono">
                                    {activePopup.request.request_number}
                                  </span>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full border font-black uppercase tracking-wider ${
                                    activePopup.request.status === "posted" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                    activePopup.request.status === "ready" ? "bg-teal-50 text-teal-750 border-teal-100" :
                                    activePopup.request.status === "in_progress" ? "bg-sky-50 text-sky-700 border-sky-100" :
                                    "bg-amber-50 text-amber-700 border-amber-100"
                                  }`}>
                                    {activePopup.request.status || "pending"}
                                  </span>
                                </div>

                                <div className="space-y-0.5 text-left">
                                  <p className="font-black text-slate-800 text-[11px] leading-tight">
                                    {activePopup.request.title}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider capitalize">
                                    {activePopup.request.content_type?.replace(/_/g, " ")}
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-500 font-bold pt-1 border-t border-slate-50">
                                  <div>Team: <span className="text-slate-800">{activePopup.request.assigned_team}</span></div>
                                  <div>Due: <span className="text-slate-800 font-mono">{activePopup.request.required_by_date || "-"}</span></div>
                                </div>

                                {activePopup.request.brief && (
                                  <div className="bg-slate-50 rounded-lg p-2 text-[9px] text-slate-650 font-medium text-left max-h-[80px] overflow-y-auto leading-normal whitespace-pre-wrap">
                                    {activePopup.request.brief}
                                  </div>
                                )}

                                <div className="flex justify-end pt-1.5 border-t border-slate-55">
                                  <button
                                    type="button"
                                    onClick={() => setActivePopup(null)}
                                    className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg font-bold text-[10px] transition-colors shadow-xs"
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    /* Existing List View for Video Production, Graphic Designing, and Admin */
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2">
                        <div>
                          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Content Requests Queue</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Manage assets requests, assignments, and publishing pipeline</p>
                        </div>
                        {role === "admin" && (
                          <button
                            onClick={() => {
                              setCalendarPrefilledDate("");
                              setIsRequestModalOpen(true);
                            }}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            <span>New Request</span>
                          </button>
                        )}
                      </div>

                      {/* Filter controls */}
                      <div className="flex flex-wrap gap-3 bg-white border border-slate-150 p-4 rounded-2xl shadow-xs text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase text-slate-400">Status:</span>
                          <select
                            value={requestFilterStatus}
                            onChange={e => setRequestFilterStatus(e.target.value)}
                            className="border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold bg-white text-slate-800 focus:outline-none"
                          >
                            <option value="all">All Statuses</option>
                            <option value="pending">pending</option>
                            <option value="in_progress">in progress</option>
                            <option value="ready">ready</option>
                            <option value="posted">posted</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase text-slate-400">Assigned Team:</span>
                          <select
                            value={requestFilterTeam}
                            onChange={e => setRequestFilterTeam(e.target.value)}
                            className="border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold bg-white text-slate-800 focus:outline-none"
                          >
                            <option value="all">All Teams</option>
                            <option value="Video Production">Video Production</option>
                            <option value="Graphic Designing">Graphic Designing</option>
                          </select>
                        </div>
                      </div>

                      {filteredRequests.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                          <span className="text-4xl">📋</span>
                          <h3 className="text-sm font-black text-slate-800 mt-3">No content requests found</h3>
                          <p className="text-xs font-semibold text-slate-450 mt-1">Try relaxing filters.</p>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                          <table className="w-full text-[11px] border-collapse text-left">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                                <th className="px-4 py-2.5">Req #</th>
                                <th className="px-4 py-2.5">Title</th>
                                <th className="px-4 py-2.5">Type</th>
                                <th className="px-4 py-2.5">Assigned Team</th>
                                <th className="px-4 py-2.5">Required By</th>
                                <th className="px-4 py-2.5">Requested By</th>
                                <th className="px-4 py-2.5">Status</th>
                                <th className="px-4 py-2.5 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {filteredRequests.map(r => {
                                const isOverdue = 
                                  r.required_by_date && 
                                  new Date(r.required_by_date) < new Date() && 
                                  (r.status === "pending" || r.status === "in_progress");

                                const statusColor = 
                                  r.status === "posted" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                  r.status === "ready" ? "bg-teal-50 text-teal-750 border-teal-100 animate-pulse" :
                                  r.status === "in_progress" ? "bg-sky-50 text-sky-700 border-sky-100" :
                                  "bg-amber-50 text-amber-700 border-amber-100";

                                const isAssignedToUserTeam = 
                                  role === "admin" || loggedInUser?.team === r.assigned_team;

                                return (
                                  <tr key={r.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800">{r.request_number}</td>
                                    <td className="px-4 py-3 max-w-[150px] truncate" title={r.title}>{r.title}</td>
                                    <td className="px-4 py-3 capitalize">{r.content_type?.replace("_", " ")}</td>
                                    <td className="px-4 py-3">{r.assigned_team}</td>
                                    <td className={`px-4 py-3 font-mono ${isOverdue ? "text-rose-600 font-bold bg-rose-50/50" : ""}`}>
                                      {r.required_by_date || "-"}
                                    </td>
                                    <td className="px-4 py-3">{r.requested_by}</td>
                                    <td className="px-4 py-3">
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                                        {r.status || "pending"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      {r.status === "pending" && isAssignedToUserTeam && (
                                        <button
                                          onClick={() => handleAcceptContentRequest(r.id)}
                                          className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors"
                                        >
                                          Accept
                                        </button>
                                      )}
                                      {r.status === "ready" && (role === "admin" || loggedInUser?.team === "Digital Marketing") && (
                                        <button
                                          onClick={() => { setSelectedRequestForPost(r); setPostLinkModalOpen(true); }}
                                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors"
                                        >
                                          Mark Posted
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
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

          <CampaignModal
            campaign={selectedCampaign}
            isOpen={isCampaignModalOpen}
            onClose={() => { setIsCampaignModalOpen(false); setSelectedCampaign(null); }}
            onSave={handleSaveCampaign}
            adPerformance={adPerformance}
          />

          <NewRequestModal
            isOpen={isRequestModalOpen}
            onClose={() => { setIsRequestModalOpen(false); setCalendarPrefilledDate(""); }}
            onSave={handleSaveContentRequest}
            campaigns={campaigns}
            prefilledDate={calendarPrefilledDate}
          />

          <PostLinkModal
            isOpen={postLinkModalOpen}
            onClose={() => { setPostLinkModalOpen(false); setSelectedRequestForPost(null); }}
            onSave={(link) => { if (selectedRequestForPost) handlePostContentRequest(selectedRequestForPost.id, link); }}
          />

          <RequestDetailsModal
            isOpen={isRequestDetailsModalOpen}
            onClose={() => { setIsRequestDetailsModalOpen(false); setSelectedRequestDetails(null); }}
            request={selectedRequestDetails}
          />
          
        </div>
      </div>
    </div>
  );
}
