import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "./supabaseClient";
import {
  Target, FolderGit2, Menu, X, Coffee, LogOut, LayoutDashboard, Monitor, Smartphone, Search
} from "lucide-react";

export const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
                                  <tr key={k.id} className="hover:bg-slate-50/40 transition-colors">
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
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
                  <span className="text-4xl">🚀</span>
                  <h3 className="text-sm font-black text-slate-800 mt-3">Projects Management</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Coming soon in the new rebuild!</p>
                </div>
              )}

            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
