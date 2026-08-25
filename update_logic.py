import re

with open('e:/Abhi/KPI app/preview/src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''          // Calculate Carry Forward Balance
          let carryForward = 0;
          Object.keys(kpi.dailyAlloc || {}).forEach(dateKey => {
            // Check if dateKey is strictly before today
            if (dateKey < tStr) {'''

replacement = '''          // Calculate Carry Forward Balance
          let carryForward = 0;
          Object.keys(kpi.dailyAlloc || {}).forEach(dateKey => {
            // Check if dateKey is strictly before today AND in the current month
            if (dateKey < tStr && dateKey.substring(0, 7) === tStr.substring(0, 7)) {'''

content = content.replace(target, replacement)

with open('e:/Abhi/KPI app/preview/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated!")
