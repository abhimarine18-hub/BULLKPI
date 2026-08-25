import re

with open('e:/Abhi/KPI app/preview/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_screen_pattern = r"function DailyLogScreen\(\{ kpis, loggedInUser, onUpdateDailyActual \}\) \{.*?(?=const CURRENT_EMPLOYEE)"
# We will use re.sub with DOTALL
match = re.search(old_screen_pattern, content, flags=re.DOTALL)
if match:
    old_screen = match.group(0)
    
new_screen = '''function DailyLogCard({ kpi, tStr, onUpdateDailyActual }) {
  const todayTarget = kpi.dailyAlloc?.[tStr] || 0;
  
  // See if there's already a value logged
  const savedActual = kpi.dailyActual?.[tStr];
  const hasSavedActual = savedActual !== undefined && savedActual !== null && savedActual !== "";

  // State for the component
  const [isEditing, setIsEditing] = useState(!hasSavedActual);
  const [inputValue, setInputValue] = useState("");

  // Calculate Carry Forward Balance
  let carryForward = 0;
  Object.keys(kpi.dailyAlloc || {}).forEach(dateKey => {
    // Check if dateKey is strictly before today AND in the current month
    if (dateKey < tStr && dateKey.substring(0, 7) === tStr.substring(0, 7)) {
      const tgt = kpi.dailyAlloc[dateKey] || 0;
      const act = kpi.dailyActual?.[dateKey] || 0;
      // Floor shortfall at 0 per day before summing
      const shortfall = Math.max(0, tgt - act);
      carryForward += shortfall;
    }
  });

  const effectiveTarget = todayTarget + carryForward;

  const handleSubmit = () => {
    if (inputValue === "") return;
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      onUpdateDailyActual(kpi.id, tStr, val);
      setIsEditing(false);
      setInputValue(""); // clear temporary input
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm leading-snug">{kpi.name}</h3>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">{tStr}</p>
        </div>
      </div>
      
      <div className="space-y-1.5 px-1">
        <p className="text-xs font-semibold text-slate-600">
          Target: <span className="text-slate-800">{todayTarget} {kpi.unit}</span>
        </p>
        <p className="text-xs font-semibold text-orange-600">
          Carry Forward Balance: +{carryForward} {kpi.unit}
        </p>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-teal-800 mb-4">
          Today's Effective Target: {effectiveTarget} {kpi.unit}
        </p>
        
        {!isEditing ? (
          <div className="flex items-center justify-between bg-white border border-emerald-200 p-3 rounded-xl shadow-sm">
            <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> 
              Logged: {savedActual} / effective target {effectiveTarget}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Enter Today's Achievement</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  placeholder="Enter value achieved today"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 text-sm font-semibold text-slate-800 bg-white border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-xl px-4 py-2.5 outline-none transition-all shadow-inner"
                />
                <span className="text-xs font-bold text-slate-400 shrink-0">{kpi.unit}</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={inputValue === ""}
              className={w-full font-bold py-2.5 rounded-xl transition-all }
            >
              Submit
            </button>
            {hasSavedActual && (
              <div className="text-center">
                <button onClick={() => { setIsEditing(false); setInputValue(""); }} className="text-xs font-bold text-slate-500 hover:underline">Cancel Edit</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DailyLogScreen({ kpis, loggedInUser, onUpdateDailyActual }) {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  const tStr = (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];

  const relevantKpis = (kpis || []).filter(k => k.owner === loggedInUser?.name && k.targetType !== "monthly");

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-slate-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">Daily Log</h2>
      </div>

      {relevantKpis.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-semibold">No daily KPIs assigned to you.</p>
        </div>
      ) : (
        relevantKpis.map(kpi => (
          <DailyLogCard 
            key={kpi.id} 
            kpi={kpi} 
            tStr={tStr} 
            onUpdateDailyActual={onUpdateDailyActual} 
          />
        ))
      )}
    </div>
  );
}

'''
    
    content = content.replace(old_screen, new_screen)
    
    with open('e:/Abhi/KPI app/preview/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Regex didn't match!")
