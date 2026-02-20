import sys

with open('src/components/tracker/TrackerCharts.tsx', 'r') as f:
    content = f.read()

search = "formatter={(value: number) => [`${value} days`, 'Processing Time']}"
replace = "formatter={(value: any) => [`${value} days`, 'Processing Time']}"

if search in content:
    content = content.replace(search, replace)
else:
    print("Chart fix not applied")

with open('src/components/tracker/TrackerCharts.tsx', 'w') as f:
    f.write(content)
