import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  Target, FolderGit2, Menu, X, Coffee, LogOut, LayoutDashboard, Monitor, Smartphone, Search, Plus, Megaphone, ClipboardList, BookOpen, Calendar, CheckSquare
} from "lucide-react";


export const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const FY_KEYS = [
  "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12",
  "2027-01", "2027-02", "2027-03"
];

export const formatKeyToLabel = (key) => {
  if (!key || !key.includes("-")) return key;
  const [year, month] = key.split("-");
  const monthNames = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun",
    "07": "Jul", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };
  return `${monthNames[month]} ${year}`;
};

export const getKpiActual = (kpi, monthKey, allKpis = []) => {
  if (!kpi) return 0;
  if (kpi.kpi_type === "report") {
    const config = kpi.report_config;
    if (config && config.sourceType === "kpiIds" && Array.isArray(config.kpiIds)) {
      const sourceKpis = allKpis.filter(sk => config.kpiIds.includes(sk.id));
      if (sourceKpis.length === 0) return 0;
      
      const values = sourceKpis.map(sk => {
        if (sk.id === kpi.id) return 0;
        return getKpiActual(sk, monthKey, allKpis);
      });
      
      if (config.method === "average") {
        const sum = values.reduce((acc, v) => acc + v, 0);
        return sum / values.length;
      } else {
        return values.reduce((acc, v) => acc + v, 0);
      }
    }
    return 0;
  }
  return kpi.monthly_actual?.[monthKey] ?? 0;
};

export const getMonthlyTarget = (kpi, monthKey) => {
  if (!kpi) return 0;
  const rev = kpi.monthly_target_revised?.[monthKey];
  if (rev !== undefined && rev !== null && rev !== "") {
    return parseFloat(rev) || 0;
  }
  return parseFloat(kpi.monthly_target?.[monthKey]) || 0;
};

function KpiModal({ kpi, isOpen, onClose, onSave, membersMap = {}, holidays = [], agentLeaves = [], kpis = [] }) {
  // ── All useState hooks (must be declared unconditionally, before any early return) ──
  const [previewMonthKey, setPreviewMonthKey] = useState(() => {
    const d = new Date();
    const currentK = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return FY_KEYS.includes(currentK) ? currentK : "2026-08";
  });
  const [kpiType, setKpiType] = useState("activity");
  const [computationMethod, setComputationMethod] = useState("sum");
  const [selectedSourceKpiIds, setSelectedSourceKpiIds] = useState([]);
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");

  const isEdit = !!kpi;
  const [formData, setFormData] = useState({
    name: "",
    team: "Digital Marketing",
    market: "Common",
    unit: "Nos",
    direction: "higher",
    cy_target: "",
    daily_target: "",
    has_daily_target: false,
    do_person: "",
    drive_person: "",
    monitor_person: "",
    checker: "",
    approver: "",
    ai_checking_enabled: false,
    monthly_target: {},
    monthly_actual: {}
  });

  // Annual Target Split state — declared here (before useEffect) to respect Rules of Hooks
  const [splitMethod, setSplitMethod] = useState("manual");
  const [annualSplitInput, setAnnualSplitInput] = useState("");
  const [quarterlyInputs, setQuarterlyInputs] = useState({ Q1: "", Q2: "", Q3: "", Q4: "" });

  // ── Single useEffect to reset all form + split state on open ──
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
          daily_target: kpi.daily_target !== null && kpi.daily_target !== undefined ? String(kpi.daily_target) : "",
          has_daily_target: kpi.has_daily_target || false,
          do_person: kpi.do_person || "",
          drive_person: kpi.drive_person || "",
          monitor_person: kpi.monitor_person || "",
          checker: kpi.checker || "",
          approver: kpi.approver || "",
          ai_checking_enabled: kpi.ai_checking_enabled || false,
          monthly_target: kpi.monthly_target || {},
          monthly_actual: kpi.monthly_actual || {}
        });
        setKpiType(kpi.kpi_type || "activity");
        setComputationMethod(kpi.report_config?.method || "sum");
        setSelectedSourceKpiIds(kpi.report_config?.kpiIds || []);
      } else {
        setFormData({
          name: "",
          team: "Digital Marketing",
          market: "Common",
          unit: "Nos",
          direction: "higher",
          cy_target: "",
          daily_target: "",
          has_daily_target: false,
          do_person: "",
          drive_person: "",
          monitor_person: "",
          checker: "",
          approver: "",
          ai_checking_enabled: false,
          monthly_target: {},
          monthly_actual: {}
        });
        setKpiType("activity");
        setComputationMethod("sum");
        setSelectedSourceKpiIds([]);
      }
      setSourceSearchQuery("");
      // Reset split controls
      setSplitMethod("manual");
      setAnnualSplitInput(isEdit && kpi?.cy_target != null ? String(kpi.cy_target) : "");
      setQuarterlyInputs({ Q1: "", Q2: "", Q3: "", Q4: "" });
    }
  }, [isOpen, kpi, isEdit]);

  // ── Early return AFTER all hooks ──
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      cy_target: formData.cy_target.trim() ? parseFloat(formData.cy_target) : null,
      daily_target: formData.daily_target.trim() ? parseFloat(formData.daily_target) : null,
      has_daily_target: formData.has_daily_target,
      kpi_type: kpiType,
      report_config: kpiType === "report" ? { sourceType: "kpiIds", method: computationMethod, kpiIds: selectedSourceKpiIds } : null
    });
  };

  const handleApplySplit = () => {
    let computed = {};
    if (splitMethod === "even") {
      const annual = parseFloat(annualSplitInput);
      if (!annual || isNaN(annual)) { alert("Please enter a valid Annual Target first."); return; }
      const perMonth = Math.round((annual / 12) * 100) / 100;
      FY_KEYS.forEach(mKey => { computed[mKey] = perMonth; });
    } else if (splitMethod === "quarterly") {
      const qVals = [
        parseFloat(quarterlyInputs.Q1) || 0,
        parseFloat(quarterlyInputs.Q2) || 0,
        parseFloat(quarterlyInputs.Q3) || 0,
        parseFloat(quarterlyInputs.Q4) || 0,
      ];
      if (qVals.every(v => v === 0)) { alert("Please enter at least one quarterly figure."); return; }
      FY_KEYS.forEach((mKey, idx) => {
        const qIdx = Math.floor(idx / 3);
        computed[mKey] = Math.round((qVals[qIdx] / 3) * 100) / 100;
      });
    } else {
      return;
    }
    setFormData(prev => ({ ...prev, monthly_target: { ...prev.monthly_target, ...computed } }));
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex flex-col">
      <form onSubmit={handleSubmit} className="bg-white w-full h-full overflow-y-auto flex flex-col">
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-black text-slate-800 text-sm">{isEdit ? "Edit KPI details" : "Create new KPI"}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-650 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs font-semibold text-slate-650 flex-1 overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-1 sm:col-span-2 md:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">KPI Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
            </div>

            <div className="space-y-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">KPI Type</label>
              <select value={kpiType} onChange={e => setKpiType(e.target.value)} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="activity">Manual Entry</option>
                <option value="report">Computed (Aggregate of other KPIs)</option>
              </select>
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
              <select value={formData.unit} onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                {["Nos", "percentage", "hours", "days", "weeks", "months", "runs", "INR", "USD", "others"].map(uom => (
                  <option key={uom} value={uom}>{uom}</option>
                ))}
              </select>
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

            {kpiType === "activity" && (
              <>
                <div className="flex items-center gap-2 sm:col-span-2 md:col-span-3 lg:col-span-5 py-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 select-none">
                  <input
                    type="checkbox"
                    id="enable_daily_target"
                    checked={formData.has_daily_target}
                    onChange={e => setFormData(prev => ({ ...prev, has_daily_target: e.target.checked }))}
                    className="w-4 h-4 text-teal-600 border-orange-200 rounded focus:ring-teal-500 accent-teal-600 cursor-pointer"
                  />
                  <label htmlFor="enable_daily_target" className="text-[10px] font-black text-slate-700 uppercase tracking-wider cursor-pointer">
                    Enable Daily Target (Paced)
                  </label>
                </div>

                {formData.has_daily_target ? (
                  <div className="space-y-1 sm:col-span-2 md:col-span-3 lg:col-span-5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Daily Target (per working day)</label>
                    <input type="number" step="any" value={formData.daily_target} onChange={e => setFormData(prev => ({ ...prev, daily_target: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-semibold" />
                    <span className="text-[9.5px] text-slate-400 font-medium block mt-0.5">Excludes Sundays, holidays, and agent leave automatically.</span>
                  </div>
                ) : (
                  <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-xl p-3 text-center text-slate-455 font-semibold text-[10px] sm:col-span-2 md:col-span-3 lg:col-span-5 select-none">
                    ℹ️ This KPI is tracked monthly only — must be completed by month end.
                  </div>
                )}
              </>
            )}

            {kpiType === "report" && (
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-5 bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Computation Setup</h4>
                    <p className="text-[9.5px] text-slate-400 font-semibold uppercase mt-0.5">Define aggregate inputs for this computed KPI</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                    <span>Method:</span>
                    <select
                      value={computationMethod}
                      onChange={e => setComputationMethod(e.target.value)}
                      className="border border-orange-200 rounded-lg px-2.5 py-1 text-[10.5px] font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="sum">Sum</option>
                      <option value="average">Average</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Source KPIs Checklist</label>
                    <span className="text-[9.5px] bg-teal-50 text-teal-700 font-black px-2 py-0.5 rounded-full border border-teal-100">
                      {selectedSourceKpiIds.length} Selected
                    </span>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search KPIs..."
                    value={sourceSearchQuery}
                    onChange={e => setSourceSearchQuery(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-850 bg-white"
                  />

                  <div className="border border-slate-200 rounded-xl p-2.5 bg-white max-h-48 overflow-y-auto space-y-1.5">
                    {(() => {
                      const filtered = kpis.filter(otherK => {
                        if (isEdit && otherK.id === kpi.id) return false;
                        if (otherK.kpi_type === "report") return false;
                        if (sourceSearchQuery.trim()) {
                          return otherK.name.toLowerCase().includes(sourceSearchQuery.toLowerCase()) ||
                            (otherK.team && otherK.team.toLowerCase().includes(sourceSearchQuery.toLowerCase()));
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return <p className="text-[10.5px] text-slate-400 font-bold text-center py-4">No matching manual entry KPIs found.</p>;
                      }

                      return filtered.map(otherK => {
                        const isChecked = selectedSourceKpiIds.includes(otherK.id);
                        return (
                          <label key={otherK.id} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none text-[10.5px]">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedSourceKpiIds(prev => [...prev, otherK.id]);
                                } else {
                                  setSelectedSourceKpiIds(prev => prev.filter(id => id !== otherK.id));
                                }
                              }}
                              className="mt-0.5 w-3.5 h-3.5 text-teal-600 border-orange-200 rounded focus:ring-teal-500 accent-teal-600 cursor-pointer"
                            />
                            <div className="flex-1 text-left">
                              <span className="font-bold text-slate-800 block leading-tight">{otherK.name}</span>
                              <span className="text-[8.5px] text-slate-450 font-black uppercase tracking-wider mt-0.5 block">
                                {otherK.team || "No Team"} · {otherK.do_person || "Unassigned"}
                              </span>
                            </div>
                          </label>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Do Person</label>
              <select value={formData.do_person} onChange={e => setFormData(prev => ({ ...prev, do_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="">Select Person...</option>
                {Object.keys(membersMap).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Drive Person</label>
              <select value={formData.drive_person} onChange={e => setFormData(prev => ({ ...prev, drive_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="">Select Person...</option>
                {Object.keys(membersMap).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Monitor Person</label>
              <select value={formData.monitor_person} onChange={e => setFormData(prev => ({ ...prev, monitor_person: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="">Select Person...</option>
                {Object.keys(membersMap).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Checker</label>
              <select value={formData.checker} onChange={e => setFormData(prev => ({ ...prev, checker: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="">Select Person...</option>
                {Object.keys(membersMap).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Approver</label>
              <select value={formData.approver} onChange={e => setFormData(prev => ({ ...prev, approver: e.target.value }))} className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 font-bold bg-white">
                <option value="">Select Person...</option>
                {Object.keys(membersMap).sort().map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Checkbox for AI Checking Enabled */}
            <div className="flex items-center gap-2 sm:col-span-2 md:col-span-3 lg:col-span-5 py-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 mt-1 select-none">
              <input
                type="checkbox"
                id="ai_checking"
                checked={formData.ai_checking_enabled}
                onChange={e => setFormData(prev => ({ ...prev, ai_checking_enabled: e.target.checked }))}
                className="w-4 h-4 text-teal-600 border-orange-200 rounded focus:ring-teal-500 accent-teal-600 cursor-pointer"
              />
              <label htmlFor="ai_checking" className="text-[10px] font-black text-slate-700 uppercase tracking-wider cursor-pointer">
                AI Checking Enabled
              </label>
            </div>
          </div>

          <hr className="border-orange-100" />

          {/* Monthly Targets — Annual Target Setting */}
          <div className="space-y-3">
            {/* Header row with split controls */}
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Monthly Targets</h4>
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Split Method:</label>
                <select
                  value={splitMethod}
                  onChange={e => setSplitMethod(e.target.value)}
                  className="border border-orange-200 rounded-lg px-2.5 py-1 text-[10.5px] font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="manual">Manual (enter each month)</option>
                  <option value="even">Even Split (annual ÷ 12)</option>
                  <option value="quarterly">Quarterly Ramp (Q1/Q2/Q3/Q4)</option>
                </select>
              </div>
            </div>

            {/* Even Split inputs */}
            {splitMethod === "even" && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-teal-700 uppercase tracking-wider block">Annual Target</label>
                  <input
                    type="number" step="any"
                    value={annualSplitInput}
                    onChange={e => {
                      setAnnualSplitInput(e.target.value);
                      setFormData(prev => ({ ...prev, cy_target: e.target.value }));
                    }}
                    placeholder="e.g. 1200"
                    className="border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 w-40 bg-white"
                  />
                </div>
                {annualSplitInput && !isNaN(parseFloat(annualSplitInput)) && (
                  <div className="text-[9.5px] font-bold text-teal-700 bg-teal-100 rounded-xl px-3 py-1.5 self-end">
                    = {Math.round((parseFloat(annualSplitInput) / 12) * 100) / 100} / month
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleApplySplit}
                  className="ml-auto bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-wider transition-colors"
                >
                  Apply Split →
                </button>
              </div>
            )}

            {/* Quarterly Ramp inputs */}
            {splitMethod === "quarterly" && (
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: "Q1", label: "Q1 (Apr–Jun)" },
                    { key: "Q2", label: "Q2 (Jul–Sep)" },
                    { key: "Q3", label: "Q3 (Oct–Dec)" },
                    { key: "Q4", label: "Q4 (Jan–Mar)" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[9px] font-black text-violet-700 uppercase tracking-wider block">{label}</label>
                      <div className="space-y-0.5">
                        <input
                          type="number" step="any"
                          value={quarterlyInputs[key]}
                          onChange={e => setQuarterlyInputs(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder="Quarterly total"
                          className="border border-violet-200 rounded-xl px-2 py-1.5 text-[11px] font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 w-full bg-white"
                        />
                        {quarterlyInputs[key] && !isNaN(parseFloat(quarterlyInputs[key])) && (
                          <span className="text-[9px] text-violet-600 font-bold block text-center">
                            ≈ {Math.round((parseFloat(quarterlyInputs[key]) / 3) * 100) / 100}/mo
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {Object.values(quarterlyInputs).some(v => v && !isNaN(parseFloat(v))) && (
                    <span className="text-[9.5px] font-bold text-violet-700">
                      Annual total: {Object.values(quarterlyInputs).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      // Also sync cy_target to the sum of all 4 quarters
                      const total = Object.values(quarterlyInputs).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
                      if (total > 0) setFormData(prev => ({ ...prev, cy_target: String(total) }));
                      handleApplySplit();
                    }}
                    className="ml-auto bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-wider transition-colors"
                  >
                    Apply Quarterly Ramp →
                  </button>
                </div>
              </div>
            )}

            {/* 12-month editable grid — always shown */}
            {splitMethod !== "manual" && (
              <p className="text-[9px] text-slate-400 font-semibold">
                ↓ Fine-tune individual months below after applying the split
              </p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {FY_KEYS.map(mKey => {
                const val = formData.monthly_target?.[mKey] ?? "";
                const originalVal = isEdit ? (kpi?.monthly_target?.[mKey] ?? null) : null;
                const revisedVal = isEdit ? (kpi?.monthly_target_revised?.[mKey] ?? null) : null;
                const hasRevision = revisedVal !== undefined && revisedVal !== null && revisedVal !== "";
                return (
                  <div key={mKey} className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider text-center">{formatKeyToLabel(mKey)}</label>
                    {hasRevision && (
                      <div className="flex flex-col items-center gap-0.5 mb-1">
                        <span className="text-[9px] text-slate-400 line-through font-mono">{originalVal}</span>
                        <span className="text-[9px] font-black text-orange-600 font-mono">{revisedVal}</span>
                        <span className="text-[8px] bg-orange-50 text-orange-600 border border-orange-200 px-1 rounded font-black uppercase tracking-wide">Revised</span>
                      </div>
                    )}
                    <input type="number" step="any" value={val} onChange={e => handleMonthTargetChange(mKey, e.target.value)} className={`w-full border rounded-xl px-2 py-1.5 text-[11px] text-center font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 ${hasRevision ? "border-orange-300 bg-orange-50/40" : "border-orange-200"}`} />
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {FY_KEYS.map(mKey => {
                const val = formData.monthly_actual?.[mKey] ?? "";
                return (
                  <div key={mKey} className="space-y-0.5">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider text-center">{formatKeyToLabel(mKey)}</label>
                    <input type="number" step="any" value={val} onChange={e => handleMonthActualChange(mKey, e.target.value)} className="w-full border border-orange-200 rounded-xl px-2 py-1.5 text-[11px] text-center font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800" />
                  </div>
                );
              })}
            </div>
          </div>

          {formData.has_daily_target && (
            <>
              <hr className="border-orange-100" />

              {/* Daily Target Preview */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider block">Daily Target Preview</h4>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Live rollup calculation based on working days</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                    <span>Month:</span>
                    <select
                      value={previewMonthKey}
                      onChange={e => setPreviewMonthKey(e.target.value)}
                      className="border border-orange-200 rounded-lg px-2 py-1 text-[10px] font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      {FY_KEYS.map(mKey => (
                        <option key={mKey} value={mKey}>{formatKeyToLabel(mKey)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  if (!previewMonthKey.includes("-")) return null;
                  const [yearStr, monthStr] = previewMonthKey.split("-");
                  const year = parseInt(yearStr);
                  const month = parseInt(monthStr) - 1; // 0-indexed month
                  
                  const firstDayIndex = new Date(year, month, 1).getDay();
                  const totalDays = new Date(year, month + 1, 0).getDate();
                  
                  const dailyTarget = parseFloat(formData.daily_target) || 0;
                  const enteredMonthlyTarget = parseFloat(formData.monthly_target?.[previewMonthKey]) || 0;
                  
                  let workingDaysCount = 0;
                  const daysInfo = [];
                  
                  for (let d = 1; d <= totalDays; d++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                    const dateObj = new Date(year, month, d);
                    const isSunday = dateObj.getDay() === 0;
                    
                    const matchingHoliday = holidays.find(h => 
                      h.holiday_date === dateStr && 
                      (h.applies_to === "all" || h.applies_to === formData.team)
                    );
                    
                    const hasLeave = agentLeaves.some(l => 
                      l.leave_date === dateStr && 
                      l.agent_name === formData.do_person
                    );
                    
                    const isOff = isSunday || !!matchingHoliday || hasLeave;
                    const reason = isSunday ? "Sun" : (matchingHoliday ? "Holiday" : "Leave");
                    
                    if (!isOff) {
                      workingDaysCount++;
                    }
                    
                    daysInfo.push({ day: d, isOff, reason });
                  }
                  
                  const effectiveMonthlyTotal = workingDaysCount * dailyTarget;
                  const hasMismatch = enteredMonthlyTarget > 0 && Math.abs(effectiveMonthlyTotal - enteredMonthlyTarget) > 0.01;
                  
                  return (
                    <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      <div className="flex flex-wrap justify-between items-center gap-2 text-[10px] font-bold text-slate-600">
                        <div>
                          <span>Working days: <strong className="text-slate-800">{workingDaysCount}</strong></span>
                          <span className="mx-2 text-slate-300">|</span>
                          <span>Daily: <strong className="text-slate-800">{dailyTarget}</strong></span>
                          <span className="mx-2 text-slate-300">|</span>
                          <span>Effective Total: <strong className="text-teal-650">{effectiveMonthlyTotal}</strong></span>
                        </div>
                        {hasMismatch && (
                          <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-lg border border-amber-100 flex items-center gap-1 select-none animate-pulse">
                            ⚠️ Mismatch (Entered monthly target: {enteredMonthlyTarget})
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-black text-slate-400 uppercase tracking-wider mt-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                          <div key={d}>{d}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1.5 mt-1 select-none">
                        {Array.from({ length: firstDayIndex }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="aspect-square bg-slate-100/30 rounded-lg" />
                        ))}
                        {daysInfo.map(info => (
                          <div
                            key={info.day}
                            className={`aspect-square rounded-lg flex flex-col justify-between p-1.5 border text-center transition-colors
                              ${info.isOff 
                                ? "bg-slate-100 border-slate-200 text-slate-400" 
                                : "bg-white border-slate-100 hover:bg-teal-50/20 text-slate-700"}`}
                          >
                            <span className={`text-[9px] font-bold ${info.isOff ? "line-through text-slate-300" : ""}`}>{info.day}</span>
                            <span className={`text-[8.5px] font-black uppercase mt-0.5 truncate block
                              ${info.isOff ? "text-[7.5px] text-slate-400 font-semibold" : "text-teal-650"}`}
                            >
                              {info.isOff ? info.reason : dailyTarget || "-"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
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

  // Connection & Health check states
  const [connectionChecking, setConnectionChecking] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState("");
  const [fetchErrors, setFetchErrors] = useState([]);

  // App state
  const [kpis, setKpis] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [screen, setScreen] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDashboardTeam, setActiveDashboardTeam] = useState("");
  const [activeDashboardPerson, setActiveDashboardPerson] = useState("");

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
  const [driveLinks, setDriveLinks] = useState({});
  const [approvedByNames, setApprovedByNames] = useState({});
  const [requestFilterStatus, setRequestFilterStatus] = useState("all");
  const [requestFilterTeam, setRequestFilterTeam] = useState("all");
  const [contentRequestsError, setContentRequestsError] = useState("");
  const [todayLogs, setTodayLogs] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});

  // Monthly Focus/Shoot Plan feature states
  const [monthlyFocusPlans, setMonthlyFocusPlans] = useState([]);
  const [shootPlanStateEdits, setShootPlanStateEdits] = useState({});
  const [logInputs, setLogInputs] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [agentLeaves, setAgentLeaves] = useState([]);

  // Team Tasks
  const [teamTasks, setTeamTasks] = useState([]);
  const [isRaiseTaskOpen, setIsRaiseTaskOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ title: "", description: "", assigned_to: "", due_date: "" });

  const [selectedHolidayDate, setSelectedHolidayDate] = useState("");
  const [holidayName, setHolidayName] = useState("");
  const [holidayAppliesTo, setHolidayAppliesTo] = useState("all");

  const [leaveAgentName, setLeaveAgentName] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const handleAddHoliday = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!selectedHolidayDate || !holidayName.trim()) return;
    try {
      const { data, error } = await supabase.from("holidays").insert({
        holiday_date: selectedHolidayDate,
        name: holidayName.trim(),
        applies_to: holidayAppliesTo
      }).select();
      if (error) {
        alert("Error adding holiday: " + error.message);
      } else {
        setHolidays(prev => [...prev, ...data]);
        setSelectedHolidayDate("");
        setHolidayName("");
        setHolidayAppliesTo("all");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!confirm("Are you sure you want to remove this holiday?")) return;
    try {
      const { error } = await supabase.from("holidays").delete().eq("id", id);
      if (error) {
        alert("Error deleting holiday: " + error.message);
      } else {
        setHolidays(prev => prev.filter(h => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTeamLead = async (teamId, newLeadName) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({ lead_name: newLeadName.trim() })
        .eq("id", teamId);
      
      if (error) {
        alert("Error saving team lead: " + error.message);
      } else {
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, lead_name: newLeadName.trim() } : t));
        alert("Team lead saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred: " + err.message);
    }
  };

  const handleTeamChange = (teamName) => {
    setActiveDashboardTeam(teamName);
    setActiveDashboardPerson("");
  };

  const handleMarkLeave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!leaveAgentName || !leaveDate) return;
    try {
      const { data, error } = await supabase.from("agent_leaves").insert({
        agent_name: leaveAgentName,
        leave_date: leaveDate,
        reason: leaveReason.trim() || null
      }).select();
      if (error) {
        alert("Error marking leave: " + error.message);
      } else {
        setAgentLeaves(prev => [...prev, ...data]);
        setLeaveDate("");
        setLeaveReason("");
        setLeaveModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLeave = async (id) => {
    if (!confirm("Are you sure you want to remove this leave?")) return;
    try {
      const { error } = await supabase.from("agent_leaves").delete().eq("id", id);
      if (error) {
        alert("Error deleting leave: " + error.message);
      } else {
        setAgentLeaves(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchError = (tableName, error) => {
    if (error) {
      setFetchErrors(prev => {
        if (prev.some(e => e.table === tableName && e.message === error.message)) {
          return prev;
        }
        return [...prev, { table: tableName, message: error.message }];
      });
    }
  };

  const clearFetchError = (tableName) => {
    setFetchErrors(prev => prev.filter(e => e.table !== tableName));
  };

  const fetchHolidaysData = async () => {
    try {
      const { data, error } = await supabase.from("holidays").select("*");
      if (error) {
        console.error("Error loading holidays:", error.message);
        handleFetchError("holidays", error);
      } else if (data) {
        setHolidays(data);
        clearFetchError("holidays");
      }
    } catch (e) {
      console.error(e);
      handleFetchError("holidays", e);
    }
  };

  const fetchAgentLeavesData = async () => {
    try {
      const { data, error } = await supabase.from("agent_leaves").select("*");
      if (error) {
        console.error("Error loading agent leaves:", error.message);
        handleFetchError("agent_leaves", error);
      } else if (data) {
        setAgentLeaves(data);
        clearFetchError("agent_leaves");
      }
    } catch (e) {
      console.error(e);
      handleFetchError("agent_leaves", e);
    }
  };

  const handleLogWork = async (kpi, amountStr) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }
    
    try {
      const d = new Date();
      const currentMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      
      if (kpi.checker || kpi.approver) {
        // Approval flow
        const entry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          kpi_id: kpi.id,
          kpi_name: kpi.name,
          amount: amount,
          submitted_by: loggedInUser?.name || "Unknown",
          submitted_at: new Date().toISOString(),
          month_key: currentMonthKey,
          status: kpi.checker ? "pending_checker" : "pending_approver",
          checker: kpi.checker || null,
          approver: kpi.approver || null
        };
        
        const updatedHistory = [...(kpi.history || []), entry];
        
        const { data, error } = await supabase
          .from("kpis")
          .update({ history: updatedHistory })
          .eq("id", kpi.id)
          .select();
          
        if (error) {
          console.error("Error submitting log for review:", error.message);
          alert("Failed to submit log: " + error.message);
        } else {
          // Update local state
          setKpis(prev => prev.map(k => k.id === kpi.id ? { ...k, history: updatedHistory } : k));
          
          // Clear input
          setLogInputs(prev => ({ ...prev, [kpi.id]: "" }));
          
          // Set success message
          setSubmitStatus(prev => ({
            ...prev,
            [kpi.id]: `Submitted ${amount} for review/approval.`
          }));
        }
      } else {
        // Direct logging flow
        const currentActuals = kpi.monthly_actual || {};
        const oldVal = parseFloat(currentActuals[currentMonthKey]) || 0;
        const newVal = oldVal + amount;
        
        const updatedActuals = {
          ...currentActuals,
          [currentMonthKey]: newVal
        };
        
        const { data, error } = await supabase
          .from("kpis")
          .update({ monthly_actual: updatedActuals })
          .eq("id", kpi.id)
          .select();
          
        if (error) {
          console.error("Error logging work:", error.message);
          alert("Failed to save to database: " + error.message);
        } else {
          // Update local state
          setKpis(prev => prev.map(k => k.id === kpi.id ? { ...k, monthly_actual: updatedActuals } : k));
          
          // Update today's logs for feedback
          setTodayLogs(prev => ({
            ...prev,
            [kpi.id]: [...(prev[kpi.id] || []), amount]
          }));
          
          // Set success message
          const targetVal = getMonthlyTarget(kpi, currentMonthKey);
          setSubmitStatus(prev => ({
            ...prev,
            [kpi.id]: `Added ${amount} — month total now ${newVal}/${targetVal}.`
          }));
          
          // Clear input
          setLogInputs(prev => ({ ...prev, [kpi.id]: "" }));
        }
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred: " + err.message);
    }
  };

  const [calendarPrefilledDate, setCalendarPrefilledDate] = useState("");
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [activePopup, setActivePopup] = useState(null);
  const [showTestimonialSubmenu, setShowTestimonialSubmenu] = useState(false);
  const testimonialSubmenuTimeoutRef = useRef(null);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("same_date");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  const [membersMap, setMembersMap] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from("teams").select("id, name, lead_name");
      if (error) {
        console.error("Error loading teams:", error.message);
        handleFetchError("teams", error);
      } else if (data) {
        const order = [
          "Digital Marketing",
          "Video Production",
          "Graphic Designing",
          "Enquiry Management",
          "CRM and Coordinator",
          "Expo and Events"
        ];
        const sorted = data.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
        setTeams(sorted);
        clearFetchError("teams");
      }
    } catch (e) {
      console.error(e);
      handleFetchError("teams", e);
    }
  };

  const fetchMemberDesignations = async () => {
    try {
      const { data, error } = await supabase.from("team_members").select("name, designation, team, sub_team");
      if (error) {
        console.error("Error loading team member designations:", error.message);
        handleFetchError("team_members", error);
      } else if (data) {
        const map = {};
        data.forEach(m => {
          if (m.name) {
            map[m.name] = m.designation || "";
          }
        });
        setMembersMap(map);
        setTeamMembers(data);
        clearFetchError("team_members");
      }
      fetchTeams();
    } catch (e) {
      console.error(e);
      handleFetchError("team_members", e);
    }
  };

  // Startup Health Check
  useEffect(() => {
    const runHealthCheck = async () => {
      try {
        setConnectionChecking(true);
        const [kCount, pCount, tmCount, crCount] = await Promise.all([
          supabase.from("kpis").select("*", { count: "exact", head: true }),
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("team_members").select("*", { count: "exact", head: true }),
          supabase.from("content_requests").select("*", { count: "exact", head: true })
        ]);

        const failed = [];
        if (kCount.error) failed.push(`kpis: ${kCount.error.message}`);
        if (pCount.error) failed.push(`projects: ${pCount.error.message}`);
        if (tmCount.error) failed.push(`team_members: ${tmCount.error.message}`);
        if (crCount.error) failed.push(`content_requests: ${crCount.error.message}`);

        if (failed.length > 0) {
          setConnectionError(true);
          setConnectionErrorMessage(failed.join(" | "));
        } else {
          setConnectionError(false);
          setConnectionErrorMessage("");
        }
      } catch (err) {
        setConnectionError(true);
        setConnectionErrorMessage(err.message || String(err));
      } finally {
        setConnectionChecking(false);
      }
    };

    runHealthCheck();
  }, []);

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
      fetchHolidaysData();
      fetchAgentLeavesData();
      fetchMonthlyFocusPlans();
      if (isAdm) {
        supabase.from("kpis").select("*").then(({ data, error }) => {
          if (error) handleFetchError("kpis", error);
          else if (data) {
            setKpis(data);
            clearFetchError("kpis");
          }
        });
        supabase.from("projects").select("*").then(({ data, error }) => {
          if (error) handleFetchError("projects", error);
          else if (data) {
            setProjects(data);
            clearFetchError("projects");
          }
        });
        fetchCampaignsData();
        fetchAdPerformanceData();
        fetchContentRequestsData();
        // Fetch all team tasks for admin — filtered in UI by activeDashboardTeam
        supabase.from("team_tasks").select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
          if (!error && data) setTeamTasks(data);
        });
      } else {
        if (u.team) {
          setActiveDashboardTeam(u.team);
          fetchTeamData(u.team);
          fetchTeamTasks(u.team);
        }
      }
    }
  }, []);

  async function fetchTeamData(teamName) {
    try {
      setTeamInfo({ name: teamName });

      // Fetch KPIs for this team
      let kpisQuery = supabase.from("kpis").select("*").eq("team", teamName);
      const { data: kpisData, error: kpisError } = await kpisQuery;

      if (kpisError) {
        console.error("Error fetching KPIs from Supabase:", kpisError.message);
        handleFetchError("kpis", kpisError);
      } else if (kpisData) {
        clearFetchError("kpis");
        if (teamName === "Digital Marketing") {
          // Also load Video Production + Graphic Designing KPIs for capacity panel
          const { data: prodKpisData, error: prodKpisError } = await supabase
            .from("kpis")
            .select("*")
            .in("team", ["Video Production", "Graphic Designing"]);
          
          if (prodKpisError) {
            handleFetchError("kpis", prodKpisError);
          } else {
            setKpis([...kpisData, ...(prodKpisData || [])]);
          }
        } else {
          setKpis(kpisData);
        }
      }

      // Fetch Projects for this team
      const { data: projsData, error: projsError } = await supabase
        .from("projects")
        .select("*")
        .eq("team", teamName);

      if (projsError) {
        console.error("Error fetching Projects from Supabase:", projsError.message);
        handleFetchError("projects", projsError);
      } else if (projsData) {
        clearFetchError("projects");
        if (projsData.length > 0) {
          const projIds = projsData.map(p => p.id);
          // Fetch stages
          const { data: stagesData, error: stagesError } = await supabase
            .from("project_stages")
            .select("*")
            .in("project_id", projIds);
          
          if (stagesError) {
            console.error("Error fetching project stages from Supabase:", stagesError.message);
            handleFetchError("project_stages", stagesError);
          } else {
            clearFetchError("project_stages");
            const mappedProjects = projsData.map(p => ({
              ...p,
              stages: (stagesData || []).filter(s => s.project_id === p.id)
            }));
            setProjects(mappedProjects);
          }
        } else {
          setProjects([]);
        }
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
      handleFetchError("team_data", err);
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
        handleFetchError("campaigns", error);
      } else if (data) {
        setCampaigns(data);
        clearFetchError("campaigns");
      }
    } catch (err) {
      console.error("Error loading campaigns:", err);
      handleFetchError("campaigns", err);
    }
  };

  const fetchAdPerformanceData = async () => {
    try {
      const { data, error } = await supabase.from("ad_performance").select("*");
      if (error) {
        console.error("Error fetching ad performance from Supabase:", error.message);
        handleFetchError("ad_performance", error);
      } else if (data) {
        setAdPerformance(data);
        clearFetchError("ad_performance");
      }
    } catch (err) {
      console.error("Error loading ad performance:", err);
      handleFetchError("ad_performance", err);
    }
  };

  const fetchContentRequestsData = async () => {
    try {
      setContentRequestsError("");
      const { data, error } = await supabase.from("content_requests").select("*");
      if (error) {
        console.error("Error fetching content requests from Supabase:", error.message);
        setContentRequestsError(error.message);
        handleFetchError("content_requests", error);
      } else if (data) {
        setContentRequests(data);
        generateUpcomingRecurrences(data);
        clearFetchError("content_requests");
      }
    } catch (err) {
      console.error("Error loading content requests:", err);
      setContentRequestsError(err.message || String(err));
      handleFetchError("content_requests", err);
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
        await fetchHolidaysData();
        await fetchAgentLeavesData();
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
        await fetchHolidaysData();
        await fetchAgentLeavesData();
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
        // Revision logic
        const monthlyTarget = { ...(selectedKpi.monthly_target || {}) };
        const monthlyTargetRevised = { ...(selectedKpi.monthly_target_revised || {}) };
        const revisedTargetLog = [...(selectedKpi.revised_target_log || [])];

        const allMonths = Array.from(new Set([
          ...Object.keys(selectedKpi.monthly_target || {}),
          ...Object.keys(payload.monthly_target || {})
        ]));

        allMonths.forEach(month => {
          const oldVal = selectedKpi.monthly_target?.[month];
          const newVal = payload.monthly_target?.[month];
          
          if (newVal !== oldVal) {
            const hasOriginal = oldVal !== undefined && oldVal !== null && oldVal !== "";
            if (hasOriginal) {
              const currentRevVal = selectedKpi.monthly_target_revised?.[month];
              const previousTarget = currentRevVal !== undefined && currentRevVal !== null && currentRevVal !== "" ? currentRevVal : oldVal;

              if (newVal !== currentRevVal) {
                monthlyTargetRevised[month] = newVal;
                revisedTargetLog.push({
                  month,
                  old_value: previousTarget,
                  new_value: newVal,
                  changed_by: loggedInUser?.name || "Admin",
                  changed_at: new Date().toISOString()
                });
              }
            } else {
              monthlyTarget[month] = newVal;
            }
          }
        });

        payload.monthly_target = monthlyTarget;
        payload.monthly_target_revised = monthlyTargetRevised;
        payload.revised_target_log = revisedTargetLog;

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
        linked_kpi_id: linkedKpi ? linkedKpi.id : null,
        is_recurring: payload.is_recurring || false,
        recurrence_type: payload.recurrence_type || null,
        recurrence_end_date: payload.recurrence_end_date || null,
        recurrence_parent_id: payload.recurrence_parent_id || null
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

  // Helper: compute the next planned_post_date for a recurring row
  const getNextRecurringDate = (parentDateStr, recType) => {
    const parent = new Date(parentDateStr);
    // Move to next calendar month, same year or wrapping
    const nextMonth = parent.getMonth() + 1;
    const nextYear = nextMonth > 11 ? parent.getFullYear() + 1 : parent.getFullYear();
    const adjMonth = nextMonth > 11 ? 0 : nextMonth;

    if (recType === "same_date") {
      // Same day-of-month next month (capped at last day of that month)
      const lastDay = new Date(nextYear, adjMonth + 1, 0).getDate();
      const day = Math.min(parent.getDate(), lastDay);
      return `${nextYear}-${String(adjMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } else {
      // same_weekday: e.g. "2nd Wednesday"
      const targetWeekday = parent.getDay(); // 0=Sun…6=Sat
      const weekOfMonth = Math.ceil(parent.getDate() / 7); // 1-based week
      // Find the nth occurrence of that weekday in the next month
      let count = 0;
      const daysInNextMonth = new Date(nextYear, adjMonth + 1, 0).getDate();
      for (let d = 1; d <= daysInNextMonth; d++) {
        const wd = new Date(nextYear, adjMonth, d).getDay();
        if (wd === targetWeekday) {
          count++;
          if (count === weekOfMonth) {
            return `${nextYear}-${String(adjMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          }
        }
      }
      // If that nth weekday doesn't exist (e.g. 5th Monday), use last occurrence
      let lastOccurrence = null;
      for (let d = 1; d <= daysInNextMonth; d++) {
        if (new Date(nextYear, adjMonth, d).getDay() === targetWeekday) {
          lastOccurrence = d;
        }
      }
      return `${nextYear}-${String(adjMonth + 1).padStart(2, "0")}-${String(lastOccurrence).padStart(2, "0")}`;
    }
  };

  const generateUpcomingRecurrences = async (requestsList) => {
    try {
      const parents = requestsList.filter(r => r.is_recurring && !r.recurrence_parent_id);
      if (parents.length === 0) return;

      const toInsert = [];
      for (const parent of parents) {
        const nextDate = getNextRecurringDate(parent.planned_post_date, parent.recurrence_type || "same_date");

        // Check end date
        if (parent.recurrence_end_date && nextDate > parent.recurrence_end_date) continue;

        // Check if a child already exists for that month
        const nextD = new Date(nextDate);
        const alreadyExists = requestsList.some(r =>
          r.recurrence_parent_id === parent.id &&
          r.planned_post_date &&
          new Date(r.planned_post_date).getFullYear() === nextD.getFullYear() &&
          new Date(r.planned_post_date).getMonth() === nextD.getMonth()
        );
        if (alreadyExists) continue;

        // Build required_by_date
        const rbDate = new Date(nextDate);
        rbDate.setDate(rbDate.getDate() - 5);
        const requiredByDate = rbDate.toISOString().split("T")[0];

        // Auto-increment request number
        const currentYear = new Date().getFullYear();
        const prefix = `CR-${currentYear}-`;
        const allCR = [...requestsList, ...toInsert];
        const sameYear = allCR.filter(r => r.request_number && r.request_number.startsWith(prefix));
        let maxNum = 0;
        sameYear.forEach(r => {
          const parts = r.request_number.split("-");
          if (parts.length === 3) { const n = parseInt(parts[2], 10); if (n > maxNum) maxNum = n; }
        });
        const requestNumber = `${prefix}${String(maxNum + 1).padStart(4, "0")}`;

        toInsert.push({
          request_number: requestNumber,
          title: parent.title,
          content_type: parent.content_type,
          planned_post_date: nextDate,
          required_by_date: requiredByDate,
          brief: parent.brief,
          requested_by: parent.requested_by,
          assigned_team: parent.assigned_team,
          status: "pending",
          linked_kpi_id: parent.linked_kpi_id,
          is_recurring: true,
          recurrence_type: parent.recurrence_type,
          recurrence_end_date: parent.recurrence_end_date,
          recurrence_parent_id: parent.id
        });
      }

      if (toInsert.length === 0) return;

      const { data, error } = await supabase.from("content_requests").insert(toInsert).select();
      if (error) {
        console.error("Error generating recurring recurrences:", error.message);
      } else if (data && data.length > 0) {
        setContentRequests(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error("generateUpcomingRecurrences error:", err);
    }
  };

  const handleCancelFutureRecurrences = async (parentId) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("content_requests")
        .update({ recurrence_end_date: today })
        .eq("id", parentId);
      if (error) throw error;
      setContentRequests(prev =>
        prev.map(r => r.id === parentId ? { ...r, recurrence_end_date: today } : r)
      );
      // Close detail popup after cancelling
      setActivePopup(null);
    } catch (err) {
      console.error("Error cancelling future recurrences:", err);
    }
  };

  const handleAcceptContentRequest = async (requestId) => {
    try {
      const now = new Date().toISOString();
      const userName = loggedInUser.name;
      const { error } = await supabase
        .from("content_requests")
        .update({
          status: "in_progress",
          accepted_by: userName,
          accepted_at: now
        })
        .eq("id", requestId);

      if (error) {
        console.error("Error accepting request:", error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? {
          ...r,
          status: "in_progress",
          accepted_by: userName,
          accepted_at: now
        } : r));
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleSubmitForApproval = async (requestId, driveLink) => {
    try {
      if (!driveLink || !driveLink.trim()) {
        alert("Google Drive Link is required.");
        return;
      }
      const { error } = await supabase
        .from("content_requests")
        .update({
          status: "in_review",
          drive_link: driveLink.trim()
        })
        .eq("id", requestId);

      if (error) {
        console.error("Error submitting for approval:", error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? {
          ...r,
          status: "in_review",
          drive_link: driveLink.trim()
        } : r));
      }
    } catch (err) {
      console.error("Error submitting for approval:", err);
    }
  };

  const handleApproveContentRequest = async (requestId, approvedBy) => {
    try {
      if (!approvedBy || !approvedBy.trim()) {
        alert("Approved by field is required.");
        return;
      }
      const now = new Date().toISOString();
      const req = contentRequests.find(r => r.id === requestId);
      if (!req) return;

      const { error } = await supabase
        .from("content_requests")
        .update({
          status: "ready",
          approved_by: approvedBy.trim(),
          approved_at: now
        })
        .eq("id", requestId);

      if (error) {
        console.error("Error approving request:", error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? {
          ...r,
          status: "ready",
          approved_by: approvedBy.trim(),
          approved_at: now
        } : r));

        // Insert notification to DM person who requested it
        try {
          await supabase.from("notifications").insert({
            type: "reminder",
            title: "Content Request Ready",
            message: `Your content request "${req.title}" is ready! Link: ${req.drive_link || ""}`,
            recipient: req.requested_by,
            status: "unread"
          });
        } catch (ne) {
          console.error("Failed to insert approval notification:", ne);
        }
      }
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleRejectContentRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from("content_requests")
        .update({
          status: "in_progress",
          approved_by: null,
          approved_at: null
        })
        .eq("id", requestId);

      if (error) {
        console.error("Error rejecting request:", error.message);
        alert("Failed to reject request: " + error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? {
          ...r,
          status: "in_progress",
          approved_by: null,
          approved_at: null
        } : r));
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const handleKpiApproval = async (item, action) => {
    const k = item.kpi;
    const entryId = item.id;
    
    try {
      let nextStatus = "approved";
      if (action === "reject") {
        nextStatus = "rejected";
      } else {
        if (item.status === "pending_checker" && k.approver) {
          nextStatus = "pending_approver";
        }
      }

      // Update history entry in the array
      const updatedHistory = (k.history || []).map(entry => {
        if (entry.id === entryId) {
          return { ...entry, status: nextStatus };
        }
        return entry;
      });

      const updatePayload = { history: updatedHistory };

      // If approved, update monthly_actual
      if (action === "approve" && nextStatus === "approved") {
        const currentActuals = k.monthly_actual || {};
        const oldVal = parseFloat(currentActuals[item.month_key]) || 0;
        const newVal = oldVal + parseFloat(item.amount);
        updatePayload.monthly_actual = {
          ...currentActuals,
          [item.month_key]: newVal
        };
      }

      const { error } = await supabase
        .from("kpis")
        .update(updatePayload)
        .eq("id", k.id);

      if (error) {
        console.error("Error updating KPI approval:", error.message);
        alert("Failed to update approval: " + error.message);
      } else {
        // Update local state
        setKpis(prev => prev.map(pk => {
          if (pk.id === k.id) {
            const updatedKpi = { ...pk, history: updatedHistory };
            if (updatePayload.monthly_actual) {
              updatedKpi.monthly_actual = updatePayload.monthly_actual;
            }
            return updatedKpi;
          }
          return pk;
        }));
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred: " + err.message);
    }
  };

  const fetchMonthlyFocusPlans = async () => {
    try {
      const { data, error } = await supabase.from("monthly_focus_plans").select("*");
      if (error) {
        handleFetchError("monthly_focus_plans", error);
      } else if (data) {
        setMonthlyFocusPlans(data);
        clearFetchError("monthly_focus_plans");
      }
    } catch (err) {
      console.error(err);
      handleFetchError("monthly_focus_plans", err);
    }
  };

  const fetchTeamTasks = async (teamName) => {
    if (!teamName) return;
    try {
      const { data, error } = await supabase
        .from("team_tasks")
        .select("*")
        .eq("team", teamName)
        .order("created_at", { ascending: false });
      if (error) handleFetchError("team_tasks", error);
      else if (data) { setTeamTasks(data); clearFetchError("team_tasks"); }
    } catch (err) { console.error(err); }
  };

  const handleRaiseTask = async (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;
    const team = activeDashboardTeam || loggedInUser?.team;
    const payload = {
      team,
      title: newTaskForm.title.trim(),
      description: newTaskForm.description.trim() || null,
      assigned_to: newTaskForm.assigned_to || null,
      due_date: newTaskForm.due_date || null,
      raised_by: loggedInUser?.name || "Admin",
      status: "open",
    };
    const { data, error } = await supabase.from("team_tasks").insert(payload).select();
    if (error) { alert("Failed to raise task: " + error.message); return; }
    if (data) setTeamTasks(prev => [data[0], ...prev]);
    setIsRaiseTaskOpen(false);
    setNewTaskForm({ title: "", description: "", assigned_to: "", due_date: "" });
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const { data, error } = await supabase
      .from("team_tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .select();
    if (error) { alert("Failed to update task: " + error.message); return; }
    if (data) setTeamTasks(prev => prev.map(t => t.id === taskId ? data[0] : t));
  };

  const getNextMonthInfo = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const nextMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const nextMonthName = MONTHS_LIST[d.getMonth()] + " " + d.getFullYear();
    return { key: nextMonthKey, name: nextMonthName };
  };

  const handleSaveShootPlan = async (personName, stateVal, langVal) => {
    if (!stateVal || !stateVal.trim()) {
      alert("Please select or enter a state.");
      return;
    }
    if (!langVal || !langVal.trim()) {
      alert("Please select a language.");
      return;
    }
    const nextMo = getNextMonthInfo();
    try {
      const { error } = await supabase
        .from("monthly_focus_plans")
        .upsert({
          person_name: personName,
          team: "Video Production",
          month_key: nextMo.key,
          state: stateVal.trim(),
          language: langVal.trim(),
          assigned_by: loggedInUser?.name || "Lead",
          assigned_at: new Date().toISOString()
        }, { onConflict: "person_name,month_key" });

      if (error) {
        console.error("Error saving shoot plan:", error.message);
        alert("Failed to save plan: " + error.message);
      } else {
        alert(`Shoot plan saved for ${personName}!`);
        fetchMonthlyFocusPlans();
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred: " + err.message);
    }
  };

  const handleUpdateDriveLink = async (requestId) => {
    const currentLink = contentRequests.find(r => r.id === requestId)?.drive_link || "";
    const newLink = prompt("Enter new Google Drive Link:", currentLink);
    if (newLink === null) return;

    try {
      const { error } = await supabase
        .from("content_requests")
        .update({ drive_link: newLink.trim() })
        .eq("id", requestId);

      if (error) {
        console.error("Error updating drive link:", error.message);
        alert("Failed to update link: " + error.message);
      } else {
        setContentRequests(prev => prev.map(r => r.id === requestId ? { ...r, drive_link: newLink.trim() } : r));
      }
    } catch (e) {
      console.error(e);
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
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const filteredRequests = useMemo(() => {
    let list = contentRequests;
    if (role === "admin") {
      if (!activeDashboardTeam) return [];
      list = list.filter(r => r.assigned_team === activeDashboardTeam);
      if (activeDashboardPerson) {
        list = list.filter(r => r.accepted_by === activeDashboardPerson || r.requested_by === activeDashboardPerson);
      }
    } else {
      list = list.filter(r => r.assigned_team === loggedInUser?.team);
    }
    return list.filter(r => {
      const matchStatus = requestFilterStatus === "all" || r.status === requestFilterStatus;
      const matchTeam = requestFilterTeam === "all" || r.assigned_team === requestFilterTeam;
      return matchStatus && matchTeam;
    });
  }, [contentRequests, requestFilterStatus, requestFilterTeam, activeDashboardTeam, activeDashboardPerson, role, loggedInUser]);

  const approvalsQueue = useMemo(() => {
    const list = [];
    if (!loggedInUser) return list;

    // 1. KPI history entries
    kpis.forEach(k => {
      if (Array.isArray(k.history)) {
        k.history.forEach(entry => {
          if (entry.status === "pending_checker" && entry.checker === loggedInUser.name) {
            list.push({
              type: "kpi",
              id: entry.id,
              kpi_id: k.id,
              title: k.name,
              submitted_by: entry.submitted_by,
              submitted_at: entry.submitted_at,
              amount: entry.amount,
              month_key: entry.month_key,
              status: entry.status,
              entry: entry,
              kpi: k
            });
          } else if (entry.status === "pending_approver" && entry.approver === loggedInUser.name) {
            list.push({
              type: "kpi",
              id: entry.id,
              kpi_id: k.id,
              title: k.name,
              submitted_by: entry.submitted_by,
              submitted_at: entry.submitted_at,
              amount: entry.amount,
              month_key: entry.month_key,
              status: entry.status,
              entry: entry,
              kpi: k
            });
          }
        });
      }
    });

    // 2. Content Requests
    contentRequests.forEach(r => {
      if (r.status === "in_review" && (role === "admin" || loggedInUser.team === r.assigned_team)) {
        list.push({
          type: "content_request",
          id: r.id,
          title: r.title,
          submitted_by: r.accepted_by || r.requested_by,
          submitted_at: r.accepted_at || r.created_at,
          status: r.status,
          request: r
        });
      }
    });

    return list;
  }, [kpis, contentRequests, loggedInUser, role]);

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

    // Only look in production teams — never Digital Marketing — since we track production capacity
    const candidates = kpis.filter(k =>
      k.team === "Video Production" ||
      k.team === "Graphic Designing"
    );

    // Helper: does a KPI name contain a "created/produced" keyword (not "posted")?
    const isCreatedKpi = (nameLower) =>
      (nameLower.includes("created") || nameLower.includes("produced") || nameLower.includes("done")) &&
      !nameLower.includes("posted");

    if (normalized.includes("testimonial video")) {
      const langAliases = {
        hindi:     ["hindi"],
        tamil:     ["tamil"],
        kannada:   ["kannada"],
        telugu:    ["telugu"],
        bengali:   ["bengali", "benglali"],
        gujarati:  ["gujarati"],
        malayalam: ["malayalam"],
        odia:      ["odia"],
        marathi:   ["marathi", "marati"],
        punjabi:   ["punjabi"],
      };
      const matchedLang = Object.keys(langAliases).find(lang => normalized.includes(lang));
      if (matchedLang) {
        const aliases = langAliases[matchedLang];
        // First try: "testimonial" + "created/produced" + language alias
        let match = candidates.find(k => {
          const n = k.name.toLowerCase();
          return n.includes("testimonial") && isCreatedKpi(n) && aliases.some(a => n.includes(a));
        });
        // Fallback: any "testimonial" + language (catches edge cases)
        if (!match) {
          match = candidates.find(k => {
            const n = k.name.toLowerCase();
            return n.includes("testimonial") && aliases.some(a => n.includes(a));
          });
        }
        if (match) return match;
      }
    }

    if (normalized.includes("branding video")) {
      // e.g. "No of branding video done by Internal team"
      const match = candidates.find(k => {
        const n = k.name.toLowerCase();
        return n.includes("branding video") && isCreatedKpi(n);
      });
      if (match) return match;
    }

    if (normalized.includes("campaign video") || normalized.includes("campaign poster") || normalized.includes("sm poster") || normalized.includes("festival poster")) {
      // Fall back to generic poster/video "created" KPIs for types without a dedicated KPI
      if (normalized.includes("video")) {
        const match = candidates.find(k => {
          const n = k.name.toLowerCase();
          return n.includes("video") && isCreatedKpi(n) && !n.includes("testimonial");
        });
        if (match) return match;
      }
      if (normalized.includes("poster")) {
        const match = candidates.find(k => {
          const n = k.name.toLowerCase();
          return n.includes("poster") && isCreatedKpi(n) && !n.includes("reach") && !n.includes("posted");
        });
        if (match) return match;
      }
    }

    // Generic poster fallback (sm_poster alone)
    if (normalized.includes("poster")) {
      const match = candidates.find(k => {
        const n = k.name.toLowerCase();
        return n.includes("poster") && isCreatedKpi(n) && !n.includes("reach");
      });
      if (match) return match;
    }

    return null;
  };

  const capacityStats = useMemo(() => {
    const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`; // e.g. "2026-08"
    
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
      const target = linkedKpi ? getMonthlyTarget(linkedKpi, monthKey) : 0;
      
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
  const filteredGroupedKpis = useMemo(() => {
    let list = kpis;
    if (role === "admin") {
      if (!activeDashboardTeam) return {};
      list = list.filter(k => k.team === activeDashboardTeam);
      if (activeDashboardPerson) {
        list = list.filter(k => k.do_person === activeDashboardPerson);
      }
    }
    const groups = {};
    list.forEach(k => {
      const teamName = k.team || "Unassigned";
      if (!groups[teamName]) {
        groups[teamName] = [];
      }
      groups[teamName].push(k);
    });
    return groups;
  }, [kpis, activeDashboardTeam, activeDashboardPerson, role]);

  const filteredGroupedProjects = useMemo(() => {
    let list = projects;
    if (role === "admin") {
      if (!activeDashboardTeam) return {};
      list = list.filter(p => p.team === activeDashboardTeam);
      if (activeDashboardPerson) {
        list = list.filter(p => p.do_person === activeDashboardPerson);
      }
    } else {
      list = list.filter(p => p.team === loggedInUser?.team);
    }
    const groups = {};
    list.forEach(p => {
      const teamName = p.team || "Unassigned";
      if (!groups[teamName]) {
        groups[teamName] = [];
      }
      groups[teamName].push(p);
    });
    return groups;
  }, [projects, activeDashboardTeam, activeDashboardPerson, role, loggedInUser]);

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
    let list = kpis.filter(k => k.team === activeDashboardTeam);
    if (activeDashboardPerson) {
      list = list.filter(k => k.do_person === activeDashboardPerson);
    }
    return list;
  }, [kpis, activeDashboardTeam, activeDashboardPerson]);

  const dashboardProjects = useMemo(() => {
    let list = projects.filter(p => p.team === activeDashboardTeam);
    if (activeDashboardPerson) {
      list = list.filter(p => p.do_person === activeDashboardPerson);
    }
    return list;
  }, [projects, activeDashboardTeam, activeDashboardPerson]);

  const filteredCampaigns = useMemo(() => {
    if (role === "admin") {
      if (!activeDashboardTeam) return [];
      return campaigns.filter(c => c.team === activeDashboardTeam);
    } else {
      return campaigns.filter(c => c.team === loggedInUser?.team);
    }
  }, [campaigns, activeDashboardTeam, role, loggedInUser]);

  const dashboardStats = useMemo(() => {
    let total = dashboardKpis.length;
    let onTrack = 0;
    let atRisk = 0;
    let offTrack = 0;
    dashboardKpis.forEach(k => {
      const targetVal = getMonthlyTarget(k, currentMonthKey);
      const actualVal = getKpiActual(k, currentMonthKey, kpis);
      if (targetVal === 0) {
        onTrack++;
      } else {
        if (actualVal >= targetVal) onTrack++;
        else if (actualVal >= 0.8 * targetVal) atRisk++;
        else offTrack++;
      }
    });
    return { total, onTrack, atRisk, offTrack };
  }, [dashboardKpis, currentMonthKey, kpis]);

  const personalKpis = useMemo(() => {
    return kpis.filter(k => k.do_person === loggedInUser?.name);
  }, [kpis, loggedInUser]);

  const currentMonthLabel = useMemo(() => {
    const d = new Date();
    return `${MONTHS_LIST[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  const userCurrentFocusPlan = useMemo(() => {
    if (!loggedInUser) return null;
    const d = new Date();
    const currentMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return monthlyFocusPlans.find(p => p.person_name === loggedInUser.name && p.month_key === currentMonthKey);
  }, [monthlyFocusPlans, loggedInUser]);

  const isNearMonthEnd = useMemo(() => {
    const d = new Date();
    const today = d.getDate();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return (lastDay - today) < 5;
  }, []);

  const isNextMonthPlanIncomplete = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const nextMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const vpShooters = teamMembers.filter(m => m.team === "Video Production");
    const nextMonthPlans = monthlyFocusPlans.filter(p => p.month_key === nextMonthKey);
    return vpShooters.some(s => !nextMonthPlans.some(p => p.person_name === s.name));
  }, [teamMembers, monthlyFocusPlans]);

  if (connectionChecking) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center gap-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Running Database Health Check...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="h-screen w-screen bg-rose-50 flex items-center justify-center p-4" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
        <div className="w-full max-w-lg bg-white border border-rose-100 rounded-3xl p-8 shadow-xl text-center space-y-5">
          <span className="text-5xl">⚡</span>
          <h1 className="text-xl font-black text-rose-900 uppercase tracking-wider">Database Connection Issue</h1>
          <p className="text-xs font-semibold text-slate-500 mt-2">
            The application is unable to reach the Supabase backend tables. Please verify your internet connection or wake up your database project.
          </p>
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-left">
            <span className="text-[9px] uppercase font-black tracking-wider text-rose-500 block mb-1">Error Diagnostic Info:</span>
            <code className="text-xs font-bold font-mono text-rose-800 break-all select-all">
              {connectionErrorMessage}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
      {fetchErrors.length > 0 && (
        <div className="bg-rose-600 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl mb-2 flex flex-col gap-1.5 z-50 shadow-md shrink-0 border border-rose-700">
          {fetchErrors.map((err, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">⚠️ <span><strong>Table query failed:</strong> <code className="bg-rose-750 px-1 py-0.5 rounded font-mono font-black">{err.table}</code> - {err.message}</span></span>
              <button
                onClick={() => clearFetchError(err.table)}
                className="bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-lg transition-colors border border-rose-850"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
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
                onClick={() => { setScreen("daily_log"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  screen === "daily_log" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Daily Log</span>
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

              <button
                onClick={() => { setScreen("approvals"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  screen === "approvals" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="h-4 w-4" />
                  <span>Approvals</span>
                </div>
                {approvalsQueue.length > 0 && (
                  <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded-full text-[9px] min-w-[18px] text-center">
                    {approvalsQueue.length}
                  </span>
                )}
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

              {role === "admin" && (
                <>
                  <button
                    onClick={() => { setScreen("holidays"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      screen === "holidays" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Holidays</span>
                  </button>

                  <button
                    onClick={() => { setScreen("manage_teams"); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      screen === "manage_teams" ? "bg-orange-100 text-orange-700 font-bold" : "text-slate-500 hover:bg-orange-50"
                    }`}
                  >
                    <Menu className="h-4 w-4" />
                    <span>Manage Teams</span>
                  </button>
                </>
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
              {role === "admin" && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black uppercase text-slate-400">Team:</span>
                    <select
                      value={activeDashboardTeam}
                      onChange={(e) => handleTeamChange(e.target.value)}
                      className="border border-orange-200 rounded-xl px-2.5 py-1.5 text-[11px] font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">Select Team...</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.name}>{t.name} — {t.lead_name || "No Lead"}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black uppercase text-slate-400">Person:</span>
                    <select
                      value={activeDashboardPerson}
                      onChange={(e) => setActiveDashboardPerson(e.target.value)}
                      disabled={!activeDashboardTeam}
                      className="border border-orange-200 rounded-xl px-2.5 py-1.5 text-[11px] font-bold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                    >
                      <option value="">All KPIs</option>
                      {teamMembers
                        .filter(m => m.team === activeDashboardTeam)
                        .map(m => (
                          <option key={m.name} value={m.name}>{m.name}</option>
                        ))
                      }
                    </select>
                  </div>
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

                  {/* Team Members Section */}
                  {(() => {
                    const leadName = teams.find(t => t.name === activeDashboardTeam)?.lead_name;
                    const members = teamMembers.filter(m => m.team === activeDashboardTeam && m.name !== leadName);
                    
                    // Group members by sub_team
                    const flatMembers = [];
                    const groupedMembers = {};
                    
                    members.forEach(m => {
                      if (m.sub_team && m.sub_team.trim()) {
                        const subName = m.sub_team.trim();
                        if (!groupedMembers[subName]) {
                          groupedMembers[subName] = [];
                        }
                        groupedMembers[subName].push(m);
                      } else {
                        flatMembers.push(m);
                      }
                    });
                    
                    return (
                      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <div>
                            <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Team Vertical</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Directory & assignment roster</p>
                          </div>
                          {leadName && (
                            <div className="bg-orange-50 border border-orange-150 text-orange-850 text-[10.5px] font-black px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 self-start select-none shadow-xs">
                              <span>👑</span>
                              <span>Led by <strong className="font-extrabold text-orange-950">{leadName}</strong></span>
                            </div>
                          )}
                        </div>

                        {members.length === 0 ? (
                          <p className="text-[10.5px] text-slate-455 font-bold italic py-1">No other team members assigned to this vertical.</p>
                        ) : (
                          <div className="space-y-4">
                            {/* Flat Members (no sub_team) */}
                            {flatMembers.length > 0 && (
                              <div className="space-y-1.5">
                                {Object.keys(groupedMembers).length > 0 && (
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">General Members</span>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {flatMembers.map(m => (
                                    <div key={m.name} className="bg-slate-50 border border-slate-150 rounded-2xl px-3 py-1.5 flex flex-col justify-start text-left shadow-2xs">
                                      <span className="text-[11px] font-bold text-slate-850">{m.name}</span>
                                      {m.designation && (
                                        <span className="text-[8.5px] text-slate-400 font-bold mt-0.5">{m.designation}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Grouped Members (with sub_team) */}
                            {Object.entries(groupedMembers).map(([subTeamName, subMembers]) => (
                              <div key={subTeamName} className="space-y-2 pt-2 first:pt-0 border-t border-slate-50 first:border-0">
                                <span className="text-[9.5px] font-black text-teal-650 uppercase tracking-wider block">📂 {subTeamName} ({subMembers.length})</span>
                                <div className="flex flex-wrap gap-2">
                                  {subMembers.map(m => (
                                    <div key={m.name} className="bg-slate-50 border border-slate-150 rounded-2xl px-3 py-1.5 flex flex-col justify-start text-left shadow-2xs">
                                      <span className="text-[11px] font-bold text-slate-850">{m.name}</span>
                                      {m.designation && (
                                        <span className="text-[8.5px] text-slate-400 font-bold mt-0.5">{m.designation}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {activeDashboardTeam === "Video Production" && (
                    <div className="space-y-4">
                      {/* Month-end warning reminder */}
                      {isNearMonthEnd && isNextMonthPlanIncomplete && (
                        <div className="bg-orange-50 border border-orange-200 text-orange-850 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-2xs select-none">
                          <span>⚠️</span>
                          <span><strong>Reminder:</strong> Next month's shoot plan not yet assigned.</span>
                        </div>
                      )}

                      {/* Shoot Plan Editor (only visible to lead or admin) */}
                      {(() => {
                        const leadName = teams.find(t => t.name === "Video Production")?.lead_name;
                        const isLead = loggedInUser?.name === leadName;
                        const hasEditAccess = role === "admin" || isLead;

                        const nextMo = getNextMonthInfo();
                        const vpShooters = teamMembers.filter(m => m.team === "Video Production");
                        const nextMonthPlans = monthlyFocusPlans.filter(p => p.month_key === nextMo.key);

                        const statesList = [
                          "Maharashtra", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", 
                          "Kerala", "Gujarat", "West Bengal", "Uttar Pradesh", "Bihar", "Rajasthan", "Delhi"
                        ];
                        const languagesList = [
                          "Hindi", "Tamil", "Kannada", "Telugu", "Bengali", "Gujarati", "Malayalam", 
                          "Odia", "Marathi", "Punjabi"
                        ];

                        if (!hasEditAccess) {
                          // For normal team members/shooters, display a read-only list of current month assignments
                          const d = new Date();
                          const currentMonthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
                          const currentPlans = monthlyFocusPlans.filter(p => p.month_key === currentMonthKey);

                          return (
                            <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                                <div>
                                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">🎯 Team Shoot Focus Plans</h3>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Declared monthly focus assignments for {currentMonthLabel}</p>
                                </div>
                              </div>
                              {currentPlans.length === 0 ? (
                                <p className="text-[10.5px] text-slate-450 font-bold italic py-1">No monthly shoot assignments set for this month.</p>
                              ) : (
                                <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                                  <table className="w-full text-[11px] border-collapse text-left">
                                    <thead>
                                      <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                                        <th className="px-4 py-2">Shooter</th>
                                        <th className="px-4 py-2">State Target</th>
                                        <th className="px-4 py-2">Language</th>
                                        <th className="px-4 py-2">Assigned By</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                      {currentPlans.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                                          <td className="px-4 py-2.5 font-bold text-slate-800">{p.person_name}</td>
                                          <td className="px-4 py-2.5">{p.state}</td>
                                          <td className="px-4 py-2.5 font-mono text-orange-700">{p.language}</td>
                                          <td className="px-4 py-2.5 text-[10px] text-slate-400">{p.assigned_by}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Lead / Admin layout: Editable table for the NEXT month
                        return (
                          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div>
                                <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">🎯 Assign Shoot Plans ({nextMo.name})</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Assign target state and language focus for the upcoming month</p>
                              </div>
                            </div>
                            {vpShooters.length === 0 ? (
                              <p className="text-[10.5px] text-slate-450 font-bold italic py-1">No shooters found in Video Production vertical roster.</p>
                            ) : (
                              <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                                <table className="w-full text-[11px] border-collapse text-left">
                                  <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                                      <th className="px-4 py-2">Shooter</th>
                                      <th className="px-4 py-2">State Target</th>
                                      <th className="px-4 py-2">Language</th>
                                      <th className="px-4 py-2 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                    {vpShooters.map(s => {
                                      const currentAssigned = nextMonthPlans.find(p => p.person_name === s.name);
                                      const stateVal = shootPlanStateEdits[`${s.name}-state`] ?? currentAssigned?.state ?? "";
                                      const langVal = shootPlanStateEdits[`${s.name}-lang`] ?? currentAssigned?.language ?? "";

                                      return (
                                        <tr key={s.name} className="hover:bg-slate-50/40 transition-colors">
                                          <td className="px-4 py-2.5 font-bold text-slate-800">{s.name}</td>
                                          <td className="px-4 py-2.5">
                                            <select
                                              value={stateVal}
                                              onChange={e => setShootPlanStateEdits(prev => ({ ...prev, [`${s.name}-state`]: e.target.value }))}
                                              className="border border-slate-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                              <option value="">Select State</option>
                                              {statesList.map(st => (
                                                <option key={st} value={st}>{st}</option>
                                              ))}
                                            </select>
                                          </td>
                                          <td className="px-4 py-2.5">
                                            <select
                                              value={langVal}
                                              onChange={e => setShootPlanStateEdits(prev => ({ ...prev, [`${s.name}-lang`]: e.target.value }))}
                                              className="border border-slate-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                              <option value="">Select Language</option>
                                              {languagesList.map(lg => (
                                                <option key={lg} value={lg}>{lg}</option>
                                              ))}
                                            </select>
                                          </td>
                                          <td className="px-4 py-2.5 text-right">
                                            <button
                                              onClick={() => handleSaveShootPlan(s.name, stateVal, langVal)}
                                              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                            >
                                              Save Plan
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Team Progress Section */}
                      {(() => {
                        const leadName = teams.find(t => t.name === "Video Production")?.lead_name;
                        const isLead = loggedInUser?.name === leadName;
                        const hasAccess = role === "admin" || isLead;
                        if (!hasAccess) return null;

                        const reportKpis = kpis.filter(k => 
                          k.team === "Video Production" && 
                          k.kpi_type === "report" && 
                          k.name.toLowerCase().includes("videos done by")
                        );

                        if (reportKpis.length === 0) return null;

                        const d = new Date();
                        const currentYear = d.getFullYear();
                        const elapsedMonths = [];
                        for (let m = 0; m <= d.getMonth(); m++) {
                          elapsedMonths.push(`${currentYear}-${String(m + 1).padStart(2, "0")}`);
                        }
                        const currentMonthIndex = d.getMonth();

                        const rows = reportKpis.map(rk => {
                          const shooterName = rk.name.replace(/Videos done by\s+/i, "").trim();
                          const shooterKpis = kpis.filter(k => 
                            k.team === "Video Production" && 
                            k.do_person === shooterName && 
                            k.kpi_type !== "report"
                          );
                          const annualTarget = shooterKpis.reduce((sum, k) => sum + (k.cy_target ?? 0), 0);
                          const doneSoFar = elapsedMonths.reduce((sum, monthKey) => {
                            return sum + getKpiActual(rk, monthKey, kpis);
                          }, 0);

                          const balance = annualTarget - doneSoFar;
                          const percent = annualTarget > 0 ? Math.min(100, Math.round((doneSoFar / annualTarget) * 100)) : 0;

                          const expectedPace = (annualTarget / 12) * (currentMonthIndex + 1);
                          let paceColor = "bg-emerald-500";
                          let paceText = "On Track";
                          let paceTextColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
                          if (annualTarget > 0) {
                            if (doneSoFar < 0.8 * expectedPace) {
                              paceColor = "bg-rose-500";
                              paceText = "Behind";
                              paceTextColor = "text-rose-700 bg-rose-50 border-rose-100 animate-pulse";
                            } else if (doneSoFar < 0.95 * expectedPace) {
                              paceColor = "bg-amber-500";
                              paceText = "At Risk";
                              paceTextColor = "text-amber-700 bg-amber-50 border-amber-100";
                            }
                          }

                          return {
                            name: shooterName,
                            annualTarget,
                            doneSoFar,
                            balance,
                            percent,
                            paceText,
                            paceColor,
                            paceTextColor
                          };
                        });

                        rows.sort((a, b) => b.balance - a.balance);

                        return (
                          <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div>
                                <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">📊 Team Progress (YTD)</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Year-to-date performance vs annual shooter targets</p>
                              </div>
                            </div>
                            <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-2xs">
                              <table className="w-full text-[11px] border-collapse text-left">
                                <thead>
                                  <tr className="bg-slate-50/80 border-b border-slate-150 font-bold text-slate-500 uppercase tracking-wider select-none">
                                    <th className="px-4 py-2">Shooter</th>
                                    <th className="px-4 py-2 text-right">Annual Target</th>
                                    <th className="px-4 py-2 text-right">Done YTD</th>
                                    <th className="px-4 py-2 text-right">Balance Remaining</th>
                                    <th className="px-4 py-2">Pace Status</th>
                                    <th className="px-4 py-2">Progress</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                  {rows.map(r => (
                                    <tr key={r.name} className="hover:bg-slate-50/40 transition-colors">
                                      <td className="px-4 py-2.5 font-bold text-slate-800">{r.name}</td>
                                      <td className="px-4 py-2.5 text-right font-mono">{r.annualTarget}</td>
                                      <td className="px-4 py-2.5 text-right font-mono text-teal-650">{r.doneSoFar}</td>
                                      <td className="px-4 py-2.5 text-right font-mono text-slate-500">{r.balance}</td>
                                      <td className="px-4 py-2.5">
                                        <span className={`text-[8.5px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${r.paceTextColor}`}>
                                          {r.paceText}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 min-w-[120px]">
                                        <div className="flex items-center gap-2">
                                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-150">
                                            <div className={`h-full ${r.paceColor} rounded-full transition-all`} style={{ width: `${r.percent}%` }} />
                                          </div>
                                          <span className="font-mono text-[10px] text-slate-400 shrink-0 font-bold">{r.percent}%</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

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
                                const targetVal = getMonthlyTarget(k, currentMonthKey);
                                const actualVal = getKpiActual(k, currentMonthKey, kpis);
                                return (
                                  <div key={k.id} className="py-2.5 flex items-center justify-between gap-4 text-[11px]">
                                    <span className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                                      {k.name}
                                      {k.kpi_type === "report" && (
                                        <span className="bg-teal-50 text-teal-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-teal-100 uppercase tracking-wider select-none shrink-0">
                                          Σ Computed
                                        </span>
                                      )}
                                    </span>
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
                              <th className="px-4 py-2.5 text-right">Target ({formatKeyToLabel(currentMonthKey)})</th>
                              <th className="px-4 py-2.5 text-right">Actual ({formatKeyToLabel(currentMonthKey)})</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {dashboardKpis.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="px-4 py-6 text-center text-slate-400 font-semibold">No KPIs found for this team.</td>
                              </tr>
                            ) : (
                              dashboardKpis.map(k => {
                                const targetVal = getMonthlyTarget(k, currentMonthKey);
                                const actualVal = getKpiActual(k, currentMonthKey, kpis);
                                return (
                                  <tr
                                    key={k.id}
                                    onClick={() => { if (role === "admin") { setSelectedKpi(k); setIsKpiModalOpen(true); } }}
                                    className={`hover:bg-slate-50/40 transition-colors ${role === "admin" ? "cursor-pointer" : ""}`}
                                  >
                                    <td className="px-4 py-3 font-bold text-slate-850 flex items-center gap-1.5">
                                      <span>{k.name}</span>
                                      {k.kpi_type === "report" && (
                                        <span className="bg-teal-50 text-teal-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-teal-100 uppercase tracking-wider select-none shrink-0">
                                          Σ Computed
                                        </span>
                                      )}
                                    </td>
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
                                      {(() => {
                                        const origT = k.monthly_target?.[currentMonthKey];
                                        const revT = k.monthly_target_revised?.[currentMonthKey];
                                        const hasRev = revT !== undefined && revT !== null && revT !== "";
                                        if (hasRev) return (
                                          <span className="flex items-center justify-end gap-1.5">
                                            <span className="text-slate-400 text-[10px] line-through">{new Intl.NumberFormat('en-IN').format(origT)}</span>
                                            <span className="text-orange-600 font-black">{new Intl.NumberFormat('en-IN').format(revT)}</span>
                                            <span className="text-[7px] bg-orange-50 text-orange-500 border border-orange-200 px-1 rounded font-black uppercase">R</span>
                                          </span>
                                        );
                                        return targetVal ? new Intl.NumberFormat('en-IN').format(targetVal) : "-";
                                      })()}
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

                  {/* ─── Team Tasks ─── */}
                  {(() => {
                    const taskTeam = activeDashboardTeam || loggedInUser?.team;
                    if (!taskTeam) return null;
                    const teamLeadName = teams.find(t => t.name === taskTeam)?.lead_name;
                    const visibleTasks = teamTasks.filter(t => t.team === taskTeam);
                    const taskMembers = teamMembers.filter(m => m.team === taskTeam);
                    const today = new Date().toISOString().split("T")[0];
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                            ✅ Team Tasks <span className="text-slate-400 font-semibold normal-case">({visibleTasks.length})</span>
                          </h3>
                          <button onClick={() => { setIsRaiseTaskOpen(v => !v); setNewTaskForm({ title: "", description: "", assigned_to: "", due_date: "" }); }} className="bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-1">
                            <span className="text-sm leading-none">+</span> Raise Task
                          </button>
                        </div>
                        {isRaiseTaskOpen && (
                          <form onSubmit={handleRaiseTask} className="bg-teal-50 border border-teal-100 rounded-2xl p-4 space-y-3">
                            <h4 className="text-[10px] font-black text-teal-800 uppercase tracking-wider">New Task</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-black text-teal-700 uppercase tracking-wider block">Title *</label>
                                <input required type="text" value={newTaskForm.title} onChange={e => setNewTaskForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Update client report" className="w-full border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 bg-white" />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-black text-teal-700 uppercase tracking-wider block">Description</label>
                                <textarea rows={2} value={newTaskForm.description} onChange={e => setNewTaskForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional details..." className="w-full border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 bg-white resize-none" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-teal-700 uppercase tracking-wider block">Assign To</label>
                                <select value={newTaskForm.assigned_to} onChange={e => setNewTaskForm(p => ({ ...p, assigned_to: e.target.value }))} className="w-full border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800">
                                  <option value="">— Unassigned —</option>
                                  {taskMembers.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-teal-700 uppercase tracking-wider block">Due Date</label>
                                <input type="date" value={newTaskForm.due_date} onChange={e => setNewTaskForm(p => ({ ...p, due_date: e.target.value }))} className="w-full border border-teal-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-teal-500 focus:outline-none text-slate-800 bg-white" />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button type="button" onClick={() => setIsRaiseTaskOpen(false)} className="text-[10px] font-black text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 bg-white">Cancel</button>
                              <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-wider transition-colors">Save Task</button>
                            </div>
                          </form>
                        )}
                        {visibleTasks.length === 0 ? (
                          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-[11px] font-semibold">No tasks yet — raise one above.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {visibleTasks.map(task => {
                              const isOverdue = task.due_date && task.due_date < today && task.status !== "done";
                              const canUpdate = role === "admin" || loggedInUser?.name === teamLeadName || loggedInUser?.name === task.assigned_to;
                              const sc = { open: "bg-slate-100 text-slate-600 border-slate-200", in_progress: "bg-amber-50 text-amber-700 border-amber-200", done: "bg-emerald-50 text-emerald-700 border-emerald-200" };
                              return (
                                <div key={task.id} className={`bg-white border rounded-2xl p-4 space-y-2 shadow-xs ${isOverdue ? "border-rose-300 bg-rose-50/30" : "border-slate-150"} ${task.status === "done" ? "opacity-60" : ""}`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-[11px] font-black text-slate-800 leading-snug flex-1 ${task.status === "done" ? "line-through text-slate-500" : ""}`}>{task.title}</p>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${sc[task.status] || sc.open}`}>{task.status?.replace("_", " ")}</span>
                                  </div>
                                  {task.description && <p className="text-[10px] text-slate-500 font-semibold leading-snug">{task.description}</p>}
                                  <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-wide flex-wrap">
                                    {task.assigned_to && <span>→ {task.assigned_to}</span>}
                                    {task.due_date && <span className={isOverdue ? "text-rose-600 font-black" : ""}>{isOverdue ? "⚠ " : ""}Due {task.due_date}</span>}
                                    <span>by {task.raised_by}</span>
                                  </div>
                                  {canUpdate && task.status !== "done" && (
                                    <div className="flex gap-1.5 pt-1">
                                      {task.status === "open" && <button onClick={() => handleUpdateTaskStatus(task.id, "in_progress")} className="text-[9px] font-black px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg uppercase tracking-wide">Start</button>}
                                      <button onClick={() => handleUpdateTaskStatus(task.id, "done")} className="text-[9px] font-black px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg uppercase tracking-wide">Mark Done ✓</button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {screen === "kpis" && (
                <div className="space-y-6">
                  {role === "admin" ? (
                    !activeDashboardTeam ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                        <span className="text-4xl">📊</span>
                        <h3 className="text-sm font-black text-slate-800 mt-3">Select a team to view its data</h3>
                        <p className="text-xs font-semibold text-slate-450 mt-1">Please select a team from the header dropdown to filter and view KPIs.</p>
                      </div>
                    ) : Object.keys(filteredGroupedKpis).length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                        <span className="text-3xl">📊</span>
                        <p className="text-xs font-semibold text-slate-500 mt-2">No KPIs loaded for this team.</p>
                      </div>
                    ) : (
                      Object.entries(filteredGroupedKpis).map(([teamName, list]) => (
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
                                  <th className="px-4 py-2 text-right">Target ({formatKeyToLabel(currentMonthKey)})</th>
                                  <th className="px-4 py-2 text-right">Actual ({formatKeyToLabel(currentMonthKey)})</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                {list.map(k => {
                                  const targetVal = getMonthlyTarget(k, currentMonthKey);
                                  const actualVal = getKpiActual(k, currentMonthKey, kpis);
                                  return (
                                    <tr
                                      key={k.id}
                                      onClick={() => { setSelectedKpi(k); setIsKpiModalOpen(true); }}
                                      className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                                    >
                                      <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-1.5">
                                        <span>{k.name}</span>
                                        {k.kpi_type === "report" && (
                                          <span className="bg-teal-50 text-teal-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-teal-100 uppercase tracking-wider select-none shrink-0">
                                            Σ Computed
                                          </span>
                                        )}
                                      </td>
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
                    )
                  ) : (() => {
                    const myKpis = kpis.filter(k => k.do_person === loggedInUser?.name);
                    const driveKpis = kpis.filter(k => k.drive_person === loggedInUser?.name && k.do_person !== loggedInUser?.name);
                    const monitorKpis = kpis.filter(k => k.monitor_person === loggedInUser?.name && k.do_person !== loggedInUser?.name && k.drive_person !== loggedInUser?.name);

                    const renderKpiTable = (list) => {
                      return (
                        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
                          <table className="w-full text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-slate-50/80 border-b border-slate-150 text-left font-bold text-slate-500 uppercase tracking-wider select-none">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Market</th>
                                <th className="px-4 py-2">CY Target</th>
                                <th className="px-4 py-2 text-right">Target ({formatKeyToLabel(currentMonthKey)})</th>
                                <th className="px-4 py-2 text-right">Actual ({formatKeyToLabel(currentMonthKey)})</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {list.map(k => {
                                const targetVal = getMonthlyTarget(k, currentMonthKey);
                                const actualVal = getKpiActual(k, currentMonthKey, kpis);
                                return (
                                  <tr key={k.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800 flex items-center gap-1.5">
                                      <span>{k.name}</span>
                                      {k.kpi_type === "report" && (
                                        <span className="bg-teal-50 text-teal-700 text-[8px] font-black px-1.5 py-0.5 rounded border border-teal-100 uppercase tracking-wider select-none shrink-0">
                                          Σ Computed
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">{k.market || "-"}</td>
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
                      );
                    };

                    if (myKpis.length === 0 && driveKpis.length === 0 && monitorKpis.length === 0) {
                      return (
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                          <span className="text-3xl">📊</span>
                          <p className="text-xs font-semibold text-slate-500 mt-2">No KPIs loaded.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-6">
                        {myKpis.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">My KPIs</h3>
                            {renderKpiTable(myKpis)}
                          </div>
                        )}
                        {driveKpis.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">Team I Drive</h3>
                            {renderKpiTable(driveKpis)}
                          </div>
                        )}
                        {monitorKpis.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">Team I Monitor</h3>
                            {renderKpiTable(monitorKpis)}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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
                    role === "admin" && !activeDashboardTeam ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                        <span className="text-4xl">🚀</span>
                        <h3 className="text-sm font-black text-slate-800 mt-3">Select a team to view its data</h3>
                        <p className="text-xs font-semibold text-slate-450 mt-1">Please select a team from the header dropdown to filter and view projects.</p>
                      </div>
                    ) : Object.keys(filteredGroupedProjects).length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                        <span className="text-3xl">🚀</span>
                        <p className="text-xs font-semibold text-slate-500 mt-2">No projects loaded for this team.</p>
                      </div>
                    ) : (
                      Object.entries(filteredGroupedProjects).map(([teamName, list]) => (
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

                   {role === "admin" && !activeDashboardTeam ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                      <span className="text-4xl">📣</span>
                      <h3 className="text-sm font-black text-slate-800 mt-3">Select a team to view its data</h3>
                      <p className="text-xs font-semibold text-slate-450 mt-1">Please select a team from the header dropdown to filter and view campaigns.</p>
                    </div>
                  ) : filteredCampaigns.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                      <span className="text-4xl">📣</span>
                      <h3 className="text-sm font-black text-slate-800 mt-3">No campaigns loaded</h3>
                      <p className="text-xs font-semibold text-slate-450 mt-1">Start by adding a new campaign using the button above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCampaigns.map((c) => {
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
                                            {r.is_recurring && "🔁 "}{r.title}
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
                              top: `${Math.min(activePopup.y, window.innerHeight - (activePopup.step === "form" ? (recurringEnabled ? 540 : 420) : 380))}px`
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
                                  onMouseEnter={() => {
                                    if (testimonialSubmenuTimeoutRef.current) clearTimeout(testimonialSubmenuTimeoutRef.current);
                                    setShowTestimonialSubmenu(true);
                                  }}
                                  onMouseLeave={() => {
                                    if (testimonialSubmenuTimeoutRef.current) clearTimeout(testimonialSubmenuTimeoutRef.current);
                                    testimonialSubmenuTimeoutRef.current = setTimeout(() => {
                                      setShowTestimonialSubmenu(false);
                                    }, 1500);
                                  }}
                                >
                                  <button
                                    type="button"
                                    className={`w-full text-left px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors font-bold flex items-center justify-between ${showTestimonialSubmenu ? "bg-orange-50 text-orange-700 font-black" : "text-slate-700"}`}
                                  >
                                    <span>Testimonial Video</span>
                                    <span className="text-[9.5px] font-black">&rarr;</span>
                                  </button>

                                  <div 
                                    className={`absolute left-full top-0 ml-2 bg-white border border-orange-100 rounded-3xl shadow-xl p-3 w-40 space-y-0.5 z-55 transition-all duration-300 ease-in-out origin-top-left
                                      ${showTestimonialSubmenu ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"}
                                    `}
                                    onMouseEnter={() => {
                                      if (testimonialSubmenuTimeoutRef.current) clearTimeout(testimonialSubmenuTimeoutRef.current);
                                      setShowTestimonialSubmenu(true);
                                    }}
                                    onMouseLeave={() => {
                                      if (testimonialSubmenuTimeoutRef.current) clearTimeout(testimonialSubmenuTimeoutRef.current);
                                      testimonialSubmenuTimeoutRef.current = setTimeout(() => {
                                        setShowTestimonialSubmenu(false);
                                      }, 1500);
                                    }}
                                  >
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
                                        className="w-full text-left px-2 py-1 hover:bg-orange-50 rounded-lg font-bold text-[10px] text-slate-700 transition-colors"
                                      >
                                        {lang}
                                      </button>
                                    ))}
                                  </div>
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
                                  
                                  const isRec = recurringEnabled;
                                  const recType = recurrenceType;
                                  const recEndDate = recurrenceEndDate ? recurrenceEndDate : null;

                                  await handleSaveContentRequest({
                                    title: titleInput,
                                    content_type: activePopup.selectedType,
                                    campaign: campaignInput,
                                    planned_post_date: activePopup.dateStr,
                                    brief: briefInput,
                                    is_recurring: isRec,
                                    recurrence_type: isRec ? recType : null,
                                    recurrence_end_date: isRec ? recEndDate : null
                                  });
                                  setActivePopup(null);
                                  // Reset local states
                                  setRecurringEnabled(false);
                                  setRecurrenceType("same_date");
                                  setRecurrenceEndDate("");
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

                                {/* Recurring Toggle & Options */}
                                <div className="space-y-2 border-t border-slate-50 pt-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[9px] font-bold text-slate-550 uppercase tracking-wider block">Repeat monthly?</label>
                                    <select
                                      value={recurringEnabled ? "yes" : "no"}
                                      onChange={(e) => setRecurringEnabled(e.target.value === "yes")}
                                      className="border border-orange-200 rounded px-1 py-0.5 text-[10px] bg-white font-bold text-slate-850 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    >
                                      <option value="no">No</option>
                                      <option value="yes">Yes</option>
                                    </select>
                                  </div>

                                  {recurringEnabled && (
                                    <div className="space-y-2 pl-1 border-l-2 border-teal-500">
                                      <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Repeat on</label>
                                        <div className="space-y-1 text-[10px] font-medium text-slate-800">
                                          <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                              type="radio"
                                              name="recurrence_type"
                                              value="same_date"
                                              checked={recurrenceType === "same_date"}
                                              onChange={() => setRecurrenceType("same_date")}
                                              className="accent-teal-600"
                                            />
                                            <span>Same date each month (e.g. the {new Date(activePopup.dateStr).getDate()})</span>
                                          </label>
                                          <label className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                              type="radio"
                                              name="recurrence_type"
                                              value="same_weekday"
                                              checked={recurrenceType === "same_weekday"}
                                              onChange={() => setRecurrenceType("same_weekday")}
                                              className="accent-teal-600"
                                            />
                                            <span>
                                              Same weekday (e.g. {(() => {
                                                const d = new Date(activePopup.dateStr);
                                                const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                                const wNum = Math.ceil(d.getDate() / 7);
                                                const ord = ["", "1st", "2nd", "3rd", "4th", "5th"][wNum] || `${wNum}th`;
                                                return `${ord} ${weekdays[d.getDay()]}`;
                                              })()})
                                            </span>
                                          </label>
                                        </div>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Repeat until (Optional)</label>
                                        <input
                                          type="date"
                                          value={recurrenceEndDate}
                                          onChange={(e) => setRecurrenceEndDate(e.target.value)}
                                          className="border border-orange-200 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-850 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                      </div>
                                    </div>
                                  )}
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
                                    onClick={() => {
                                      setActivePopup(prev => ({ ...prev, step: "menu" }));
                                      setRecurringEnabled(false);
                                      setRecurrenceType("same_date");
                                      setRecurrenceEndDate("");
                                    }}
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

                                {activePopup.request.is_recurring && (
                                  <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-2 text-[9px] text-teal-850 font-bold text-left space-y-1">
                                    <div>🔁 Part of a recurring series ({activePopup.request.recurrence_type === "same_weekday" ? "Same weekday" : "Same date each month"})</div>
                                    {!activePopup.request.recurrence_parent_id ? (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelFutureRecurrences(activePopup.request.id)}
                                        className="text-[9px] font-black text-rose-600 hover:text-rose-700 underline block"
                                      >
                                        Cancel future occurrences
                                      </button>
                                    ) : (
                                      <div className="text-[8px] text-slate-400 font-normal">Child recurrence (manage from parent series)</div>
                                    )}
                                  </div>
                                )}

                                <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-55">
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

                      {/* Error banner if fetching failed */}
                      {contentRequestsError && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs px-4 py-3 rounded-2xl font-bold flex flex-col gap-1 shadow-xs animate-shake">
                          <div className="flex items-center gap-1.5 text-rose-900">
                            <span className="text-base">⚠️</span>
                            <span>Failed to fetch content requests from database:</span>
                          </div>
                          <p className="font-mono text-[10px] bg-rose-100/50 p-2 rounded-lg border border-rose-150 whitespace-pre-wrap">{contentRequestsError}</p>
                          <button 
                            onClick={fetchContentRequestsData} 
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3 py-1 rounded-xl text-[10px] w-fit mt-1 self-end transition-colors shadow-xs"
                          >
                            Retry Connection
                          </button>
                        </div>
                      )}

                      {/* Filter controls */}
                      <div className="flex flex-wrap justify-between items-center gap-3 bg-white border border-slate-150 p-4 rounded-2xl shadow-xs text-xs font-bold text-slate-600">
                        <div className="flex flex-wrap gap-3">
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

                        <button
                          onClick={fetchContentRequestsData}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-3.5 py-1.5 rounded-xl text-[11px] transition-colors border border-slate-200 flex items-center gap-1.5 shadow-xs"
                          title="Refresh Queue"
                        >
                          🔄 Refresh
                        </button>
                      </div>

                       {role === "admin" && !activeDashboardTeam ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                          <span className="text-4xl">📅</span>
                          <h3 className="text-sm font-black text-slate-800 mt-3">Select a team to view its data</h3>
                          <p className="text-xs font-semibold text-slate-450 mt-1">Please select a team from the header dropdown to filter and view content requests.</p>
                        </div>
                      ) : filteredRequests.length === 0 ? (
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
                                <th className="px-4 py-2.5">Work taken by</th>
                                <th className="px-4 py-2.5">Target date</th>
                                <th className="px-4 py-2.5">Required by</th>
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
                                  r.status === "posted" ? "bg-emerald-800 text-white border-emerald-900 font-bold" :
                                  r.status === "ready" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                  r.status === "in_review" ? "bg-amber-55 text-amber-800 border-amber-200" :
                                  r.status === "in_progress" ? "bg-sky-50 text-sky-700 border-sky-100" :
                                  "bg-slate-50 text-slate-700 border-slate-200";

                                const isAssignedToUserTeam = 
                                  role === "admin" || loggedInUser?.team === r.assigned_team;

                                const fmtDate = (isoStr) => {
                                  if (!isoStr) return "";
                                  const d = new Date(isoStr);
                                  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                };

                                const fmtDateTime = (isoStr) => {
                                  if (!isoStr) return "";
                                  const d = new Date(isoStr);
                                  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                                };

                                return (
                                  <tr key={r.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-4 py-3 font-bold text-slate-800">{r.request_number}</td>
                                    <td className="px-4 py-3 max-w-[150px] truncate" title={r.title}>{r.title}</td>
                                    <td className="px-4 py-3 text-slate-500 font-medium">
                                      {r.accepted_by ? (
                                        <div className="flex flex-col text-left">
                                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 inline-block w-fit">
                                            {r.accepted_by}
                                          </span>
                                          {r.accepted_at && (
                                            <span className="text-[8px] text-slate-400 font-mono mt-0.5 pl-1">
                                              taken: {fmtDateTime(r.accepted_at)}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-slate-400 italic">Unassigned</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 font-mono">
                                      {r.planned_post_date || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-800">
                                      {r.requested_by || "-"}
                                    </td>
                                    <td className="px-4 py-3 text-left">
                                      <div className="flex flex-col items-start gap-0.5">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-wider ${statusColor}`}>
                                          {r.status || "pending"}
                                        </span>
                                        {/* Pending: Show created_at if exists */}
                                        {(!r.status || r.status === "pending") && r.created_at && (
                                          <span className="text-[8px] text-slate-400 font-mono pl-1" title="Created date/time">
                                            cr: {new Date(r.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        )}
                                        {/* In Progress: Show accepted_at */}
                                        {r.status === "in_progress" && r.accepted_at && (
                                          <span className="text-[8px] text-slate-400 font-mono pl-1" title="Accepted date/time">
                                            ac: {new Date(r.accepted_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        )}
                                        {/* In Review: Show accepted_at */}
                                        {r.status === "in_review" && r.accepted_at && (
                                          <span className="text-[8px] text-slate-400 font-mono pl-1" title="Accepted date/time">
                                            ac: {new Date(r.accepted_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                          </span>
                                        )}
                                        {/* Ready: Show approved_by and approved_at */}
                                        {r.status === "ready" && (
                                          <div className="flex flex-col text-left pl-1">
                                            {r.approved_by && (
                                              <span className="text-[8.5px] font-bold text-slate-700">
                                                By: {r.approved_by}
                                              </span>
                                            )}
                                            {r.approved_at && (
                                              <span className="text-[8px] text-slate-400 font-mono">
                                                ap: {new Date(r.approved_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        {/* Posted: Show approved_by and approved_at */}
                                        {r.status === "posted" && (
                                          <div className="flex flex-col text-left pl-1">
                                            {r.approved_by && (
                                              <span className="text-[8.5px] font-bold text-slate-400">
                                                By: {r.approved_by}
                                              </span>
                                            )}
                                            {r.approved_at && (
                                              <span className="text-[8px] text-slate-400 font-mono">
                                                ap: {new Date(r.approved_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex justify-end items-center gap-2">
                                        {/* Always show Google Drive Link button if it exists */}
                                        {r.drive_link && (
                                          <div className="flex items-center gap-1">
                                            <a
                                              href={r.drive_link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold px-2 py-1 rounded-lg text-[9px] border border-sky-100 transition-colors flex items-center gap-1"
                                            >
                                              <span>🔗 Link</span>
                                            </a>
                                            {role === "admin" && (
                                              <button
                                                onClick={() => handleUpdateDriveLink(r.id)}
                                                className="text-slate-400 hover:text-slate-600 text-[10px] p-0.5"
                                                title="Edit Drive Link"
                                              >
                                                ✏️
                                              </button>
                                            )}
                                          </div>
                                        )}

                                        {/* Accept: Pending state */}
                                        {(!r.status || r.status === "pending") && isAssignedToUserTeam && (
                                          <button
                                            onClick={() => handleAcceptContentRequest(r.id)}
                                            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors"
                                          >
                                            Accept
                                          </button>
                                        )}

                                        {/* Submit for Approval: In Progress state */}
                                        {r.status === "in_progress" && isAssignedToUserTeam && r.accepted_by === loggedInUser.name && (
                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="text"
                                              placeholder="Drive Link"
                                              value={driveLinks[r.id] || ""}
                                              onChange={(e) => setDriveLinks(prev => ({ ...prev, [r.id]: e.target.value }))}
                                              className="border border-orange-200 rounded px-1.5 py-0.5 text-[10px] w-24 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                            <button
                                              onClick={() => handleSubmitForApproval(r.id, driveLinks[r.id])}
                                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2 py-1 rounded-lg text-[10px] transition-colors whitespace-nowrap"
                                            >
                                              Submit Review
                                            </button>
                                          </div>
                                        )}

                                        {/* Approve: In Review state */}
                                        {r.status === "in_review" && isAssignedToUserTeam && (
                                          <div className="flex items-center gap-1.5">
                                            <input
                                              type="text"
                                              placeholder="Approved By"
                                              value={approvedByNames[r.id] || ""}
                                              onChange={(e) => setApprovedByNames(prev => ({ ...prev, [r.id]: e.target.value }))}
                                              className="border border-orange-200 rounded px-1.5 py-0.5 text-[10px] w-24 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                            <button
                                              onClick={() => handleApproveContentRequest(r.id, approvedByNames[r.id])}
                                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded-lg text-[10px] transition-colors"
                                            >
                                              Approve
                                            </button>
                                          </div>
                                        )}

                                        {/* Mark Posted: Ready state */}
                                        {r.status === "ready" && (role === "admin" || loggedInUser?.team === "Digital Marketing") && (
                                          <button
                                            onClick={() => { setSelectedRequestForPost(r); setPostLinkModalOpen(true); }}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition-colors"
                                          >
                                            Mark Posted
                                          </button>
                                        )}
                                      </div>
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

              {screen === "daily_log" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Daily Log</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Log today's achievements against your assigned KPI activities</p>
                    </div>
                    <button
                      onClick={() => {
                        setLeaveAgentName(role === "admin" ? "" : loggedInUser?.name || "");
                        setLeaveDate(new Date().toISOString().split("T")[0]);
                        setLeaveReason("");
                        setLeaveModalOpen(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      🌴 Mark Leave
                    </button>
                  </div>

                  {loggedInUser?.team === "Video Production" && (
                    userCurrentFocusPlan ? (
                      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-3 flex items-center justify-between text-xs text-teal-800 font-bold mb-2">
                        <span className="flex items-center gap-1.5">🎯 This month's assignment: <span className="font-extrabold text-teal-900 bg-white border border-teal-200 px-2 py-0.5 rounded-lg ml-1">{userCurrentFocusPlan.state} — {userCurrentFocusPlan.language}</span> <span className="text-[10px] text-slate-400 font-bold ml-2">assigned by {userCurrentFocusPlan.assigned_by}</span></span>
                      </div>
                    ) : (
                      <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-3 text-xs text-orange-850 font-bold mb-2">
                        ⚠️ No shoot plan assigned yet — contact your lead
                      </div>
                    )
                  )}

                  {(() => {
                    const currentMonthNum = new Date().getMonth();
                    const currentYearNum = new Date().getFullYear();
                    const monthLeaves = agentLeaves.filter(l => {
                      const d = new Date(l.leave_date);
                      const matchesAgent = role === "admin" || l.agent_name === loggedInUser?.name;
                      return d.getFullYear() === currentYearNum && d.getMonth() === currentMonthNum && matchesAgent;
                    });
                    if (monthLeaves.length > 0) {
                      return (
                        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-3 flex flex-wrap items-center gap-2 text-xs font-bold text-orange-800">
                          <span className="text-[9px] uppercase tracking-wider text-orange-500 block">Marked Leaves this month:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {monthLeaves.map(l => (
                              <span key={l.id} className="bg-white border border-orange-200 px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-1">
                                <span>📅 {l.agent_name}: {l.leave_date}</span>
                                <button onClick={() => handleDeleteLeave(l.id)} className="text-red-500 hover:text-red-700 ml-1 font-black text-xs">×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* ─── My Tasks (Daily Log View) ─── */}
                  {(() => {
                    if (!loggedInUser?.name) return null;
                    const myOpenTasks = teamTasks.filter(t => t.assigned_to === loggedInUser.name && t.status !== "done");
                    if (myOpenTasks.length === 0) return null;
                    const today = new Date().toISOString().split("T")[0];

                    return (
                      <div className="bg-orange-50/30 border border-orange-100 rounded-3xl p-5 space-y-3">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          📋 My Pending Tasks ({myOpenTasks.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {myOpenTasks.map(task => {
                            const isOverdue = task.due_date && task.due_date < today;
                            const sc = {
                              open: "bg-slate-100 text-slate-600 border-slate-200",
                              in_progress: "bg-amber-50 text-amber-700 border-amber-200",
                            };

                            return (
                              <div key={task.id} className={`bg-white border rounded-2xl p-4 space-y-2 shadow-2xs hover:shadow-xs transition-shadow ${isOverdue ? "border-rose-350 bg-rose-50/20" : "border-slate-150"}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-[11px] font-black text-slate-850 leading-snug flex-1">{task.title}</p>
                                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${sc[task.status] || sc.open}`}>
                                    {task.status?.replace("_", " ")}
                                  </span>
                                </div>
                                {task.description && <p className="text-[10px] text-slate-500 font-semibold leading-snug">{task.description}</p>}
                                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-450 uppercase tracking-wide flex-wrap">
                                  {task.due_date && (
                                    <span className={isOverdue ? "text-rose-600 font-black" : ""}>
                                      {isOverdue ? "⚠ " : ""}Due {task.due_date}
                                    </span>
                                  )}
                                  <span>by {task.raised_by}</span>
                                </div>
                                <div className="flex gap-1.5 pt-1">
                                  {task.status === "open" && (
                                    <button onClick={() => handleUpdateTaskStatus(task.id, "in_progress")} className="text-[9px] font-black px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg uppercase tracking-wide transition-colors">
                                      Start
                                    </button>
                                  )}
                                  <button onClick={() => handleUpdateTaskStatus(task.id, "done")} className="text-[9px] font-black px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg uppercase tracking-wide transition-colors">
                                    Done ✓
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {(() => {
                    if (role === "admin" && !activeDashboardTeam) {
                      return (
                        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                          <span className="text-4xl">📝</span>
                          <h3 className="text-sm font-black text-slate-800 mt-3">Select a team to view its data</h3>
                          <p className="text-xs font-semibold text-slate-450 mt-1">Please select a team from the header dropdown to filter and view the Daily Log.</p>
                        </div>
                      );
                    }

                    const d = new Date();
                    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

                    const renderKpiGrid = (list, isReadOnly = false) => {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {list.map(k => {
                            const monthTarget = getMonthlyTarget(k, monthKey);
                            const monthActual = getKpiActual(k, monthKey, kpis);
                            const progressPercent = monthTarget > 0 ? Math.min(100, Math.round((monthActual / monthTarget) * 100)) : 0;
                            const logs = todayLogs[k.id] || [];

                            const localTodayStr = (() => {
                              const dObj = new Date();
                              const y = dObj.getFullYear();
                              const m = String(dObj.getMonth() + 1).padStart(2, "0");
                              const dy = String(dObj.getDate()).padStart(2, "0");
                              return `${y}-${m}-${dy}`;
                            })();
                            const isSunday = new Date().getDay() === 0;
                            const matchingHoliday = holidays.find(h => 
                              h.holiday_date === localTodayStr && 
                              (h.applies_to === "all" || h.applies_to === k.team)
                            );
                            const hasLeave = agentLeaves.some(l => 
                              l.leave_date === localTodayStr && 
                              l.agent_name === k.do_person
                            );
                            const isOffToday = isSunday || !!matchingHoliday || hasLeave;
                            const offReason = isSunday ? "Sunday" : (matchingHoliday ? `Holiday: ${matchingHoliday.name}` : "On Leave");

                            return (
                              <div key={k.id} className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                                <div>
                                  <h3 className="text-xs font-black text-slate-800 leading-snug">{k.name}</h3>
                                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider mt-0.5">UOM: {k.unit || "Nos"} | Team: {k.team || "-"}</p>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100 text-[10px] font-bold text-slate-600">
                                    <div>
                                      {k.has_daily_target ? (
                                        isOffToday ? (
                                          <>
                                            <span className="text-orange-500 block uppercase tracking-wider text-[8px] mb-0.5">Today's Target</span>
                                            <span className="text-orange-700 text-xs font-black">Off today — no target</span>
                                          </>
                                        ) : (
                                          <>
                                            <span className="text-orange-500 block uppercase tracking-wider text-[8px] mb-0.5">Today's Target</span>
                                            <span className="text-orange-700 text-xs font-black">{k.daily_target ?? "Not set"}</span>
                                          </>
                                        )
                                      ) : (
                                        <>
                                          <span className="text-slate-400 block uppercase tracking-wider text-[8px] mb-0.5">This Month's Target</span>
                                          {(() => {
                                            const origTarget = k.monthly_target?.[monthKey];
                                            const revTarget = k.monthly_target_revised?.[monthKey];
                                            const hasRev = revTarget !== undefined && revTarget !== null && revTarget !== "";
                                            return hasRev ? (
                                              <span className="flex items-center gap-1.5 flex-wrap">
                                                <span className="text-slate-400 text-[10px] font-mono line-through">{origTarget}</span>
                                                <span className="text-orange-600 text-xs font-black font-mono">{revTarget}</span>
                                                <span className="text-[7px] bg-orange-50 text-orange-500 border border-orange-200 px-1 py-0.5 rounded font-black uppercase tracking-wide">Revised</span>
                                              </span>
                                            ) : (
                                              <span className="text-slate-800 text-xs font-black">{monthTarget || "—"}</span>
                                            );
                                          })()}
                                        </>
                                      )}
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block uppercase tracking-wider text-[8px] mb-0.5">{k.has_daily_target ? "Month Actual" : "This Month's Actual"}</span>
                                      <span className="text-slate-800 text-xs font-black">{monthActual}</span>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  {(!k.has_daily_target || (!isOffToday && (k.daily_target === null || k.daily_target === undefined))) && (
                                    <div className="mt-3 space-y-1">
                                      <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                                        <span>Month Progress</span>
                                        <span className="text-slate-700">{progressPercent}%</span>
                                      </div>
                                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-350"
                                          style={{ width: `${progressPercent}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {!isReadOnly && (
                                  <div className="space-y-3 pt-2 border-t border-slate-50">
                                    {k.has_daily_target && isOffToday ? (
                                      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center text-xs font-black text-orange-700 uppercase tracking-wider select-none">
                                        🌴 Off Today ({offReason})
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                            {k.has_daily_target ? "Enter today's achievement" : "Enter progress to add"}
                                          </label>
                                          <input
                                            type="number"
                                            step="any"
                                            placeholder="0"
                                            value={logInputs[k.id] || ""}
                                            onChange={e => setLogInputs(prev => ({ ...prev, [k.id]: e.target.value }))}
                                            className="w-full border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                                          />
                                        </div>
                                        <button
                                          onClick={() => handleLogWork(k, logInputs[k.id] || "")}
                                          className="bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors self-end h-[34px] flex items-center justify-center"
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    )}

                                    {submitStatus[k.id] && (
                                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] py-1.5 px-3 rounded-lg font-bold flex items-center gap-1">
                                        <span>✅</span>
                                        <span>{submitStatus[k.id]}</span>
                                      </div>
                                    )}

                                    {logs.length > 0 && (
                                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-[9.5px] font-bold text-slate-600">
                                        <span className="text-[8px] uppercase text-slate-400 block mb-1">Today's Submissions:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {logs.map((log, idx) => (
                                            <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-800 font-mono">
                                              +{log}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    };

                    if (role === "admin") {
                      const myKpis = kpis.filter(k => {
                        if (k.kpi_type && k.kpi_type !== "activity") return false;
                        if (k.team !== activeDashboardTeam) return false;
                        if (activeDashboardPerson && k.do_person !== activeDashboardPerson) return false;
                        return true;
                      });

                      if (myKpis.length === 0) {
                        return (
                          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                            <span className="text-4xl">📝</span>
                            <h3 className="text-sm font-black text-slate-800 mt-3">No activity KPIs assigned</h3>
                            <p className="text-xs font-semibold text-slate-450 mt-1">No activity KPIs exist for the selected team/member.</p>
                          </div>
                        );
                      }

                      return renderKpiGrid(myKpis, false);
                    } else {
                      const myKpis = kpis.filter(k => k.do_person === loggedInUser?.name && (!k.kpi_type || k.kpi_type === "activity"));
                      const driveKpis = kpis.filter(k => k.drive_person === loggedInUser?.name && k.do_person !== loggedInUser?.name && (!k.kpi_type || k.kpi_type === "activity"));
                      const monitorKpis = kpis.filter(k => k.monitor_person === loggedInUser?.name && k.do_person !== loggedInUser?.name && k.drive_person !== loggedInUser?.name && (!k.kpi_type || k.kpi_type === "activity"));

                      if (myKpis.length === 0 && driveKpis.length === 0 && monitorKpis.length === 0) {
                        return (
                          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                            <span className="text-4xl">📝</span>
                            <h3 className="text-sm font-black text-slate-800 mt-3">No activity KPIs assigned</h3>
                            <p className="text-xs font-semibold text-slate-450 mt-1">You do not have any KPIs assigned to log, drive, or monitor.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-8">
                          {myKpis.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">My KPIs</h3>
                              {renderKpiGrid(myKpis, false)}
                            </div>
                          )}
                          {driveKpis.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">Team I Drive</h3>
                              {renderKpiGrid(driveKpis, true)}
                            </div>
                          )}
                          {monitorKpis.length > 0 && (
                            <div className="space-y-3">
                              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider pl-1">Team I Monitor</h3>
                              {renderKpiGrid(monitorKpis, true)}
                            </div>
                          )}
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {screen === "approvals" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Approvals Queue</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Review and action pending approvals assigned to you</p>
                  </div>

                  {approvalsQueue.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                      <span className="text-4xl">✅</span>
                      <h3 className="text-sm font-black text-slate-800 mt-3">All caught up!</h3>
                      <p className="text-xs font-semibold text-slate-450 mt-1">No pending approvals or reviews for you at this time.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvalsQueue.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                item.type === "kpi" ? "bg-orange-100 text-orange-700" : "bg-sky-100 text-sky-700"
                              }`}>
                                {item.type === "kpi" ? "KPI Submission" : "Content Review"}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                {new Date(item.submitted_at).toLocaleDateString()}
                              </span>
                            </div>

                            <h3 className="text-xs font-black text-slate-800 mt-2 leading-snug">
                              {item.title}
                            </h3>

                            {item.type === "kpi" ? (
                              <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] font-bold text-slate-600 space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Submitted By:</span>
                                  <span className="text-slate-800">{item.submitted_by}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Amount:</span>
                                  <span className="text-slate-800 font-mono">+{item.amount} ({item.kpi.unit || "Nos"})</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Month:</span>
                                  <span className="text-slate-800 font-mono">{item.month_key}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Role:</span>
                                  <span className="text-orange-600 uppercase text-[9px] font-black">
                                    {item.status === "pending_checker" ? "Checker" : "Approver"}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] font-bold text-slate-600 space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Assigned Team:</span>
                                  <span className="text-slate-800">{item.request.assigned_team}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400 uppercase text-[8px]">Submitted By:</span>
                                  <span className="text-slate-800">{item.submitted_by || "Unassigned"}</span>
                                </div>
                                {item.request.drive_link && (
                                  <div className="mt-2 pt-2 border-t border-slate-200">
                                    <a
                                      href={item.request.drive_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-black px-2.5 py-1 rounded-xl text-[9px] border border-sky-100 transition-colors inline-flex items-center gap-1.5"
                                    >
                                      <span>🔗 View Drive Deliverable</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-slate-50">
                            {item.type === "kpi" ? (
                              <>
                                <button
                                  onClick={() => handleKpiApproval(item, "reject")}
                                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs py-2 rounded-xl transition-colors border border-rose-100"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleKpiApproval(item, "approve")}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2 rounded-xl transition-colors shadow-xs"
                                >
                                  Approve
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleRejectContentRequest(item.id)}
                                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs py-2 rounded-xl transition-colors border border-rose-100"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleApproveContentRequest(item.id, loggedInUser.name)}
                                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2 rounded-xl transition-colors shadow-xs"
                                >
                                  Approve
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

                     {screen === "holidays" && role === "admin" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Holidays Management</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Define company-wide or team-specific holidays to auto-adjust daily targets</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-orange-100 shadow-xs text-xs font-bold text-slate-800">
                      <button onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(y => y - 1);
                        } else {
                          setCurrentMonth(m => m - 1);
                        }
                      }} className="hover:bg-slate-100 p-1 rounded">◀</button>
                      <span>{MONTHS_LIST[currentMonth]} {currentYear}</span>
                      <button onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(y => y + 1);
                        } else {
                          setCurrentMonth(m => m + 1);
                        }
                      }} className="hover:bg-slate-100 p-1 rounded">▶</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar grid */}
                    <div className="lg:col-span-2 bg-white border border-orange-100 rounded-3xl p-5 shadow-xs">
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                          <div key={d} className="py-1">{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {(() => {
                          const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
                          const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
                          const cells = [];
                          for (let i = 0; i < firstDayIndex; i++) {
                            cells.push(<div key={`empty-${i}`} className="aspect-square bg-slate-50/50 rounded-xl" />);
                          }
                          for (let day = 1; day <= totalDays; day++) {
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayHolidays = holidays.filter(h => h.holiday_date === dateStr);
                            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
                            
                            cells.push(
                              <button
                                key={day}
                                onClick={() => {
                                  setSelectedHolidayDate(dateStr);
                                  setHolidayName("");
                                }}
                                className={`aspect-square p-2 rounded-xl flex flex-col justify-between items-start text-[11px] font-bold transition-all relative border
                                  ${dayHolidays.length > 0 ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-white hover:bg-orange-50/30 border-slate-100 text-slate-700"}
                                  ${isToday ? "ring-2 ring-teal-500" : ""}
                                `}
                              >
                                <span>{day}</span>
                                {dayHolidays.map(h => (
                                  <span key={h.id} className="text-[7.5px] bg-orange-200 px-1 rounded block w-full truncate text-left" title={`${h.name} (${h.applies_to === "all" ? "All" : h.applies_to})`}>
                                    {h.name}
                                  </span>
                                ))}
                              </button>
                            );
                          }
                          return cells;
                        })()}
                      </div>
                    </div>

                    {/* Sidebar action panel */}
                    <div className="space-y-4">
                      {selectedHolidayDate ? (
                        <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs space-y-4">
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Add Holiday</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{selectedHolidayDate}</p>
                          </div>
                          
                          <form onSubmit={handleAddHoliday} className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Holiday Name</label>
                              <input
                                type="text"
                                value={holidayName}
                                onChange={e => setHolidayName(e.target.value)}
                                placeholder="e.g. Independence Day"
                                required
                                className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Applies To</label>
                              <select
                                value={holidayAppliesTo}
                                onChange={e => setHolidayAppliesTo(e.target.value)}
                                className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              >
                                <option value="all">All Teams</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="Video Production">Video Production</option>
                                <option value="Graphic Designing">Graphic Designing</option>
                                <option value="Enquiry Management">Enquiry Management</option>
                                <option value="CRM and Coordinator">CRM and Coordinator</option>
                                <option value="Expo and Events">Expo and Events</option>
                              </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setSelectedHolidayDate("")}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-colors"
                              >
                                Add Holiday
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-6 text-center text-slate-400 font-semibold text-xs">
                          Click a calendar date to mark it as a holiday.
                        </div>
                      )}

                      {/* List of holidays in current month */}
                      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-xs">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Holiday List</h3>
                        {holidays.length === 0 ? (
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center py-4">No holidays saved.</p>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {holidays
                              .filter(h => {
                                const d = new Date(h.holiday_date);
                                return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
                              })
                              .sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))
                              .map(h => (
                                <div key={h.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs font-bold text-slate-700">
                                  <div>
                                    <p className="text-slate-800">{h.name}</p>
                                    <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">{h.holiday_date} • {h.applies_to === "all" ? "All Teams" : h.applies_to}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteHoliday(h.id)}
                                    className="text-red-500 hover:text-red-650 font-extrabold text-[10px] p-1 rounded hover:bg-red-50"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {screen === "manage_teams" && role === "admin" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Manage Teams & Leads</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Update vertical department heads and managers dynamically</p>
                  </div>

                  <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-xs max-w-2xl space-y-4">
                    <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-2.5">Active Verticals</h3>
                    
                    <div className="divide-y divide-slate-100">
                      {teams.map(t => {
                        return (
                          <div key={t.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-slate-800 block">{t.name}</span>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ID: {t.id}</span>
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              <input
                                type="text"
                                defaultValue={t.lead_name || ""}
                                id={`lead_input_${t.id}`}
                                placeholder="Lead Name..."
                                className="border border-orange-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white w-full sm:w-60"
                              />
                              <button
                                onClick={() => {
                                  const val = document.getElementById(`lead_input_${t.id}`).value;
                                  handleSaveTeamLead(t.id, val);
                                }}
                                className="bg-teal-500 hover:bg-teal-650 text-white font-bold text-[10.5px] px-4 py-2 rounded-xl shrink-0 transition-colors shadow-xs"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
          
          <KpiModal
            kpi={selectedKpi}
            isOpen={isKpiModalOpen}
            onClose={() => { setIsKpiModalOpen(false); setSelectedKpi(null); }}
            onSave={handleSaveKpi}
            membersMap={membersMap}
            holidays={holidays}
            agentLeaves={agentLeaves}
            kpis={kpis}
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

          {leaveModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl border border-orange-100 shadow-xl w-full max-w-sm overflow-hidden font-semibold text-xs text-slate-755">
                <div className="bg-orange-50/55 px-6 py-4 border-b border-orange-100/50 flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">🌴 Mark Leave</h3>
                  <button onClick={() => setLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-extrabold text-base">×</button>
                </div>
                <form onSubmit={handleMarkLeave} className="p-6 space-y-4">
                  {role === "admin" ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Agent Name</label>
                      <select
                        value={leaveAgentName}
                        onChange={e => setLeaveAgentName(e.target.value)}
                        required
                        className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="">Select Agent...</option>
                        {Object.keys(membersMap).sort().map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Agent Name</label>
                      <input
                        type="text"
                        value={leaveAgentName}
                        disabled
                        className="w-full border border-orange-100 bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-500 font-semibold"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Leave Date</label>
                    <input
                      type="date"
                      value={leaveDate}
                      onChange={e => setLeaveDate(e.target.value)}
                      required
                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reason (Optional)</label>
                    <input
                      type="text"
                      value={leaveReason}
                      onChange={e => setLeaveReason(e.target.value)}
                      placeholder="e.g. Sick Leave / Personal Work"
                      className="w-full border border-orange-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setLeaveModalOpen(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-teal-500 hover:bg-teal-650 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition-colors"
                    >
                      Mark Leave
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
