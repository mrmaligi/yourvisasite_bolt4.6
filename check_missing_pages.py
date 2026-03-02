import re
import os

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Extract all imports that look like pages
# const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
pattern = re.compile(r"import\('(.+?)'\)")
matches = pattern.findall(content)

missing = []
for match in matches:
    # Resolve path relative to src/
    path = match.replace('./', 'src/') + '.tsx'
    if not os.path.exists(path):
        missing.append(path)

print(f"Found {len(matches)} page imports.")
print(f"Missing files: {len(missing)}")
for m in missing:
    print(m)
