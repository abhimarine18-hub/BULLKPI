import re

with open('e:/Abhi/KPI app/preview/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update EMP_NAV
nav_replacement = '''const EMP_NAV = [
  { id: "home", icon: Home },
  { id: "dailyLog", icon: FileText },
  { id: "action", icon: ListTodo },'''
content = content.replace('''const EMP_NAV = [
  { id: "home", icon: Home },
  { id: "action", icon: ListTodo },''', nav_replacement)

# 2. Add DailyLogScreen component before CURRENT_EMPLOYEE
daily_log_screen = '''
function DailyLogScreen({ kpis, loggedInUser, onUpdateDailyActual }) {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const tStr = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];

  const relevantKpis = (kpis || []).filter(k => k.owner === loggedInUser?.name && k.targetType !== "monthly");

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-slate-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">Daily Log</h2>
        <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-3 py-1.5 rounded-full uppercase tracking-wider">{tStr}</span>
      </div>

      {relevantKpis.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-semibold">No daily KPIs assigned to you.</p>
        </div>
      ) : (
        relevantKpis.map(kpi => {
          const todayTarget = kpi.dailyAlloc?.[tStr] || 0;
          const currentActual = kpi.dailyActual?.[tStr] || "";

          // Calculate Carry Forward Balance
          let carryForward = 0;
          Object.keys(kpi.dailyAlloc || {}).forEach(dateKey => {
            // Check if dateKey is strictly before today
            if (dateKey < tStr) {
              const tgt = kpi.dailyAlloc[dateKey] || 0;
              const act = kpi.dailyActual?.[dateKey] || 0;
              // Floor shortfall at 0 per day. 
              // (Alternative: omit Math.max to let overachievement offset shortfall)
              const shortfall = Math.max(0, tgt - act);
              carryForward += shortfall;
            }
          });

          const effectiveTarget = todayTarget + carryForward;

          return (
            <div key={kpi.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-slate-800 text-sm leading-snug">{kpi.name}</h3>
                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">{kpi.unit}</span>
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Today's Target</span>
                  <span className="font-bold text-slate-700 text-lg">{todayTarget}</span>
                </div>
                <div className="flex-1 bg-orange-50/50 rounded-2xl p-3 border border-orange-100">
                  <span className="block text-[9px] text-orange-400 font-bold uppercase mb-1">Carry Forward</span>
                  <span className="font-bold text-orange-600 text-lg">+{carryForward}</span>
                </div>
              </div>

              <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-teal-600 font-bold uppercase mb-0.5">Effective Target</span>
                  <span className="text-2xl font-black text-teal-800">{effectiveTarget}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">Log Actual</span>
                  <div className="flex items-center justify-end">
                    <input 
                      type="number"
                      placeholder="0"
                      defaultValue={currentActual}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val !== currentActual) {
                          onUpdateDailyActual(kpi.id, tStr, val);
                        }
                      }}
                      className="w-20 text-right font-black text-lg text-emerald-700 bg-white border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-1 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const CURRENT_EMPLOYEE'''
content = content.replace('const CURRENT_EMPLOYEE', daily_log_screen)

# 3. Update EmployeeApp signature
emp_app_sig = 'function EmployeeApp({ kpis, setKpis, onLog, teams, projects, setProjects, handleCompleteAction, loggedInUser, onLogout, clientProjects, onUpdateClientProjectStage, onInitiateKpi, notifications, onMarkNotificationAsRead, individualTasks, onAddIndividualTask, onUpdateIndividualTaskStatus, onDeleteIndividualTask, onUpdateDailyActual }) {'
content = content.replace('function EmployeeApp({ kpis, setKpis, onLog, teams, projects, setProjects, handleCompleteAction, loggedInUser, onLogout, clientProjects, onUpdateClientProjectStage, onInitiateKpi, notifications, onMarkNotificationAsRead, individualTasks, onAddIndividualTask, onUpdateIndividualTaskStatus, onDeleteIndividualTask }) {', emp_app_sig)

# 4. Add dailyLog to screenMap
screen_map_repl = '''const screenMap = { 
    home: <HomeScreen />, 
    dailyLog: <DailyLogScreen kpis={kpis} loggedInUser={loggedInUser} onUpdateDailyActual={onUpdateDailyActual} />,
    mykpis: <MyKpisScreen />, '''
content = content.replace('''const screenMap = { 
    home: <HomeScreen />, 
    mykpis: <MyKpisScreen />, ''', screen_map_repl)

# 5. Add handleUpdateDailyActual before handleAddMember
update_func = '''async function handleUpdateDailyActual(kpiId, dStr, newValue) {
    const kpiToUpdate = kpis.find(k => k.id === kpiId);
    if (!kpiToUpdate) return;
    
    const parsedVal = parseFloat(newValue) || 0;
    const newDailyActual = { ...(kpiToUpdate.dailyActual || {}), [dStr]: parsedVal };
    
    setKpis(prev => prev.map(k => k.id === kpiId ? { ...k, dailyActual: newDailyActual } : k));
    
    try {
      const { error } = await supabase
        .from('kpis')
        .update({ daily_actual: newDailyActual })
        .eq('id', kpiId);
      if (error) throw error;
    } catch(err) {
      console.error("Error updating daily actual:", err);
    }
  }

  async function handleAddMember'''
content = content.replace('async function handleAddMember', update_func)

# 6. Pass onUpdateDailyActual to EmployeeApp instance
emp_app_instance_repl = '''<EmployeeApp 
            kpis={kpis} 
            setKpis={setKpis}
            onUpdateDailyActual={handleUpdateDailyActual}
            onLog={handleLog} '''
content = content.replace('''<EmployeeApp 
            kpis={kpis} 
            setKpis={setKpis}
            onLog={handleLog} ''', emp_app_instance_repl)

with open('e:/Abhi/KPI app/preview/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
