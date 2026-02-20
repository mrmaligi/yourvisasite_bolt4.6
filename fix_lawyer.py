import sys

with open('src/pages/lawyer/LawyerTracker.tsx', 'r') as f:
    content = f.read()

# Fix unused variable
search_1 = "const [trackerRes, visasRes] = await Promise.all(["
replace_1 = "const [trackerRes] = await Promise.all(["

if search_1 in content:
    content = content.replace(search_1, replace_1)
else:
    print("Unused var fix not applied")

# Fix denied -> refused in local interface
search_2 = "outcome: 'approved' | 'denied' | 'pending';"
replace_2 = "outcome: 'approved' | 'refused' | 'withdrawn' | 'pending';"

if search_2 in content:
    content = content.replace(search_2, replace_2)
else:
    # If not found, maybe I should check where it is defined.
    # Actually, I should just import TrackerEntry from types.
    pass

# But wait, I have a local interface. Let's try to update it.
search_interface = """interface TrackerEntry {
  id: string;
  visa_id: string;
  visa_name: string | null;
  outcome: 'approved' | 'denied' | 'pending';
  processing_days: number | null;
  application_date: string;
  decision_date: string | null;
  created_at: string;
}"""

replace_interface = """import type { TrackerEntry as DBTrackerEntry } from '../../types/database';

interface TrackerEntry extends Omit<DBTrackerEntry, 'visa_id' | 'submitted_by' | 'submitter_role' | 'weight' | 'status'> {
  visa_id: string;
  visa_name: string | null;
}"""
# This is getting complicated. I'll just patch the "denied" string in the interface definition.

if search_2 in content:
    # already applied
    pass
else:
    # Try simpler replacement
    content = content.replace("outcome: 'approved' | 'denied' | 'pending';", "outcome: 'approved' | 'refused' | 'pending';")

# Also need to cast the data correctly when setting entries.
# In fetchData:
# setEntries(enriched as TrackerEntry[]);
# This cast should work if the types match.

with open('src/pages/lawyer/LawyerTracker.tsx', 'w') as f:
    f.write(content)
