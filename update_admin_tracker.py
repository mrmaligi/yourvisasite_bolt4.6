import sys

with open('src/pages/admin/TrackerManagement.tsx', 'r') as f:
    content = f.read()

# Hunk 1
search_1 = """import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import type { TrackerEntry } from '../../types/database';"""

replace_1 = """import { DataTable, type Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { TrackerStatusBadge } from '../../components/tracker/TrackerStatusBadge';
import type { TrackerEntry } from '../../types/database';"""

if search_1 in content:
    content = content.replace(search_1, replace_1)
else:
    print("Hunk 1 not found")

# Hunk 2
search_2 = """  const columns: Column<TrackerEntry>[] = [
    { key: 'days', header: 'Days', render: (r) => <span className="font-mono font-medium">{r.processing_days}</span>, sortable: true },
    { key: 'outcome', header: 'Outcome', render: (r) => <Badge variant={r.outcome === 'approved' ? 'success' : r.outcome === 'refused' ? 'danger' : 'warning'}>{r.outcome}</Badge> },
    { key: 'role', header: 'Source', render: (r) => r.submitter_role ? <Badge variant={roleVariant[r.submitter_role]}>{r.submitter_role}</Badge> : <Badge>Anonymous</Badge> },
    { key: 'weight', header: 'Weight', render: (r) => r.weight.toString() },
    { key: 'date', header: 'Submitted', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => ("""

replace_2 = """  const columns: Column<TrackerEntry>[] = [
    { key: 'days', header: 'Days', render: (r) => <span className="font-mono font-medium">{r.processing_days}</span>, sortable: true },
    { key: 'outcome', header: 'Outcome', render: (r) => <TrackerStatusBadge status={r.outcome || 'pending'} /> },
    { key: 'role', header: 'Source', render: (r) => r.submitter_role ? <Badge variant={roleVariant[r.submitter_role]}>{r.submitter_role}</Badge> : <Badge>Anonymous</Badge> },
    { key: 'weight', header: 'Weight', render: (r) => r.weight.toString() },
    { key: 'date', header: 'Submitted', render: (r) => new Date(r.created_at).toLocaleDateString(), sortable: true },
    { key: 'actions', header: '', render: (r) => ("""

if search_2 in content:
    content = content.replace(search_2, replace_2)
else:
    print("Hunk 2 not found")

with open('src/pages/admin/TrackerManagement.tsx', 'w') as f:
    f.write(content)
