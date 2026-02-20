import sys

with open('src/pages/public/Tracker.tsx', 'r') as f:
    content = f.read()

# Hunk 1: Imports and removal of VisualBar
search_1 = """import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Search, TrendingUp, Filter, BarChart3, AlertCircle, Pencil } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TrackerCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { TrackerSubmitForm } from './TrackerSubmitForm';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import type { TrackerStats, VisaCategory, TrackerEntry } from '../../types/database';

interface VisaInfo {
  subclass: string;
  name: string;
  category: VisaCategory;
}

interface TrackerData extends TrackerStats {
  visas: VisaInfo;
}

interface PendingEntry extends TrackerEntry {
  visas: Pick<VisaInfo, 'subclass' | 'name'>;
}

function getSpeedBadge(days: number) {
  if (days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS) return { label: 'Fast', variant: 'success' as const };
  if (days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

function VisualBar({ p25, median, p75, avg }: { p25: number; median: number; p75: number; avg: number }) {
  // Determine scale. A reasonable max is 1.5x the p75 or 2x the average, ensuring it fits.
  // We'll use a local max for each bar to show distribution shape clearly, or a fixed max?
  // Fixed max is better for comparison but hard with varying scales (10 days vs 500 days).
  // Let's use a "relative" bar where the width represents 0 to Max(p75 * 1.2, avg * 1.2).
  const maxVal = Math.max(p75 * 1.2, avg * 1.2, 1); // Avoid div by 0

  const getPct = (val: number) => Math.min((val / maxVal) * 100, 100);

  const left = getPct(p25);
  const width = getPct(p75) - left;
  const medianPos = getPct(median);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-neutral-400 mb-1">
        <span>0d</span>
        <span>{Math.round(maxVal)}d+</span>
      </div>
      <div className="relative h-6 bg-neutral-100 rounded-full overflow-hidden w-full">
        {/* Range Bar (p25 to p75) */}
        <div
          className="absolute h-full bg-primary-200/50 border-x border-primary-300"
          style={{ left: `${left}%`, width: `${width}%` }}
          title={`Typical range: ${Math.round(p25)} - ${Math.round(p75)} days`}
        />

        {/* Median Marker */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary-600 z-10"
          style={{ left: `${medianPos}%` }}
          title={`Median: ${Math.round(median)} days`}
        />

        {/* Labels for p25 and p75 if space permits (optional, maybe too cluttered) */}
      </div>
      <div className="flex justify-between text-xs text-neutral-500 mt-1">
         <span style={{ paddingLeft: `${Math.max(0, left - 5)}%` }}>{Math.round(p25)}</span>
         <span style={{ paddingLeft: `${Math.max(0, medianPos - left - 5)}%`, fontWeight: 'bold' }}>{Math.round(median)}</span>
         <span style={{ paddingRight: `${Math.max(0, 100 - (left + width) - 5)}%` }}>{Math.round(p75)}</span>
      </div>
    </div>
  );
}

export function Tracker() {"""

replace_1 = """import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Search, TrendingUp, Filter, BarChart3, AlertCircle, Pencil } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { TrackerCardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { TrackerWizard } from '../../components/tracker/TrackerWizard';
import { TrackerCharts } from '../../components/tracker/TrackerCharts';
import { TrackerStatusBadge } from '../../components/tracker/TrackerStatusBadge';
import { TRACKER_THRESHOLDS } from '../../lib/constants';
import type { TrackerStats, VisaCategory, TrackerEntry } from '../../types/database';

interface VisaInfo {
  subclass: string;
  name: string;
  category: VisaCategory;
}

interface TrackerData extends TrackerStats {
  visas: VisaInfo;
}

interface PendingEntry extends TrackerEntry {
  visas: Pick<VisaInfo, 'subclass' | 'name'>;
}

function getSpeedBadge(days: number) {
  if (days <= TRACKER_THRESHOLDS.FAST_MAX_DAYS) return { label: 'Fast', variant: 'success' as const };
  if (days <= TRACKER_THRESHOLDS.MODERATE_MAX_DAYS) return { label: 'Moderate', variant: 'warning' as const };
  return { label: 'Slow', variant: 'danger' as const };
}

export function Tracker() {"""

# Hunk 2: Pending entries use TrackerStatusBadge
search_2 = """            {pendingEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-primary-500">
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="default">{entry.visas.subclass}</Badge>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-4">{entry.visas.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-neutral-500">Applied: {new Date(entry.application_date).toLocaleDateString()}</p>
                    <p className="text-xs text-neutral-400">Waiting for {Math.floor((Date.now() - new Date(entry.application_date).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => {
                        setEditingEntry(entry);
                        setShowSubmitModal(true);
                    }}
                  >
                    <Pencil className="w-3 h-3 mr-2" />
                    Update Status
                  </Button>
                </CardBody>
              </Card>
            ))}"""

replace_2 = """            {pendingEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-primary-500 overflow-hidden">
                <CardBody>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="default">{entry.visas.subclass}</Badge>
                    <TrackerStatusBadge status={entry.outcome || 'pending'} />
                  </div>
                  <h3 className="font-bold text-neutral-900 mb-4 truncate" title={entry.visas.name}>{entry.visas.name}</h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-neutral-500">Applied: {new Date(entry.application_date).toLocaleDateString()}</p>
                    <p className="text-xs text-neutral-400">Waiting for {Math.floor((Date.now() - new Date(entry.application_date).getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full justify-center"
                    onClick={() => {
                        setEditingEntry(entry);
                        setShowSubmitModal(true);
                    }}
                  >
                    <Pencil className="w-3 h-3 mr-2" />
                    Update Status
                  </Button>
                </CardBody>
              </Card>
            ))}"""

# Hunk 3: VisualBar -> TrackerCharts and Modal -> TrackerWizard
search_3 = """                  <div className="flex-1 min-h-[60px] flex items-end">
                     <VisualBar
                       p25={stat.p25_days || 0}
                       median={stat.median_days || 0}
                       p75={stat.p75_days || 0}
                       avg={stat.weighted_avg_days || 0}
                     />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-500 text-center">
        <p>Disclaimer: Processing times are based on community-reported data and may not reflect current Department of Home Affairs processing times.</p>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
        }}
        title={editingEntry ? "Update Application" : "Submit Processing Time"}
        size="lg"
      >
        <TrackerSubmitForm
          onSuccess={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
            fetchStats();
            if (user) fetchPendingEntries();
          }}
          initialEntry={editingEntry}
        />
      </Modal>"""

replace_3 = """                  <div className="flex-1 min-h-[60px] flex items-end">
                     <TrackerCharts
                       p25={stat.p25_days || 0}
                       median={stat.median_days || 0}
                       p75={stat.p75_days || 0}
                       avg={stat.weighted_avg_days || 0}
                     />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12 p-4 bg-neutral-50 rounded-xl text-sm text-neutral-500 text-center">
        <p>Disclaimer: Processing times are based on community-reported data and may not reflect current Department of Home Affairs processing times.</p>
      </div>

      <Modal
        isOpen={showSubmitModal}
        onClose={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
        }}
        title={editingEntry ? "Update Application" : "Submit Processing Time"}
        size="lg"
      >
        <TrackerWizard
          onSuccess={() => {
            setShowSubmitModal(false);
            setEditingEntry(undefined);
            fetchStats();
            if (user) fetchPendingEntries();
          }}
          initialEntry={editingEntry}
        />
      </Modal>"""

if search_1 in content:
    content = content.replace(search_1, replace_1)
else:
    print("Hunk 1 not found")

if search_2 in content:
    content = content.replace(search_2, replace_2)
else:
    print("Hunk 2 not found")

if search_3 in content:
    content = content.replace(search_3, replace_3)
else:
    print("Hunk 3 not found")

with open('src/pages/public/Tracker.tsx', 'w') as f:
    f.write(content)
