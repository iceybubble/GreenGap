import pandas as pd
import json

# Sample data
data = [
    {"date": "2026-02-01", "baseline_kwh": 450, "actual_kwh": 375, "efficiency_improvement": 0.30},
    {"date": "2026-02-02", "baseline_kwh": 445, "actual_kwh": 370, "efficiency_improvement": 0.30},
    {"date": "2026-02-03", "baseline_kwh": 440, "actual_kwh": 368, "efficiency_improvement": 0.30},
    {"date": "2026-02-04", "baseline_kwh": 435, "actual_kwh": 365, "efficiency_improvement": 0.30},
    {"date": "2026-02-05", "baseline_kwh": 440, "actual_kwh": 372, "efficiency_improvement": 0.30},
    {"date": "2026-02-06", "baseline_kwh": 445, "actual_kwh": 378, "efficiency_improvement": 0.30},
    {"date": "2026-02-07", "baseline_kwh": 450, "actual_kwh": 380, "efficiency_improvement": 0.30},
    {"date": "2026-02-08", "baseline_kwh": 448, "actual_kwh": 376, "efficiency_improvement": 0.30},
    {"date": "2026-02-09", "baseline_kwh": 446, "actual_kwh": 374, "efficiency_improvement": 0.30},
    {"date": "2026-02-10", "baseline_kwh": 444, "actual_kwh": 372, "efficiency_improvement": 0.30},
    {"date": "2026-02-11", "baseline_kwh": 442, "actual_kwh": 370, "efficiency_improvement": 0.30},
    {"date": "2026-02-12", "baseline_kwh": 440, "actual_kwh": 368, "efficiency_improvement": 0.30},
    {"date": "2026-02-13", "baseline_kwh": 438, "actual_kwh": 366, "efficiency_improvement": 0.30},
    {"date": "2026-02-14", "baseline_kwh": 436, "actual_kwh": 364, "efficiency_improvement": 0.30},
]

df = pd.DataFrame(data)

# 1. CSV
df.to_csv('sample_data.csv', index=False)
print(" Created sample_data.csv")

# 2. Excel
df.to_excel('sample_energy_data.xlsx', index=False, sheet_name='Energy Data')
print(" Created sample_energy_data.xlsx")

# 3. JSON
with open('sample_energy_data.json', 'w') as f:
    json.dump(data, f, indent=2)
print(" Created sample_energy_data.json")

print("\n All sample files created successfully!")
print("   - sample_data.csv")
print("   - sample_energy_data.xlsx")
print("   - sample_energy_data.json")