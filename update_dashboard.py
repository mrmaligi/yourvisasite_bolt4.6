import sys

with open('src/pages/user/UserDashboard.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_search = """import {
  LayoutDashboard, """
imports_replace = """import { TrackerTimeline } from '../../components/tracker/TrackerTimeline';
import {
  LayoutDashboard, """

if imports_search in content:
    content = content.replace(imports_search, imports_replace)

# Add state
state_search = """  const [recentActivity, setRecentActivity] = useState<any[]>([]);"""
state_replace = """  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);"""

if state_search in content:
    content = content.replace(state_search, state_replace)

# Add fetch call
effect_search = """    if (user) {
      fetchUserStats();
    }"""
effect_replace = """    if (user) {
      fetchUserStats();
      fetchMyApplications();
    }"""

if effect_search in content:
    content = content.replace(effect_search, effect_replace)

# Add fetch function
fetch_search = """  const fetchUserStats = async () => {
    // Get counts
    const [{ count: saved }, { count: my }, { count: docs }, { count: consultations }] = await Promise.all([
      supabase.from('saved_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_documents').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id).gte('scheduled_at', new Date().toISOString()),
    ]);

    setStats({
      savedVisas: saved || 0,
      myVisas: my || 0,
      documents: docs || 0,
      upcomingConsultations: consultations || 0,
    });
  };"""

fetch_replace = """  const fetchUserStats = async () => {
    // Get counts
    const [{ count: saved }, { count: my }, { count: docs }, { count: consultations }] = await Promise.all([
      supabase.from('saved_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_visas').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('user_documents').select('id', { count: 'exact' }).eq('user_id', user?.id),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('user_id', user?.id).gte('scheduled_at', new Date().toISOString()),
    ]);

    setStats({
      savedVisas: saved || 0,
      myVisas: my || 0,
      documents: docs || 0,
      upcomingConsultations: consultations || 0,
    });
  };

  const fetchMyApplications = async () => {
    const { data } = await supabase
      .from('tracker_entries')
      .select('*, visas(name, subclass)')
      .eq('submitted_by', user!.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setMyApplications(data || []);
  };"""

if fetch_search in content:
    content = content.replace(fetch_search, fetch_replace)

# Add UI section
ui_search = """          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">"""

ui_replace = """          {/* My Applications Tracker */}
          {myApplications.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">My Application Journey</h2>
              <div className="grid gap-6">
                {myApplications.map((app: any) => (
                  <Card key={app.id}>
                    <CardBody>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{app.visas.subclass} - {app.visas.name}</h3>
                          <p className="text-sm text-neutral-500">Applied on {new Date(app.application_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">In Progress</p>
                          <p className="text-xs text-neutral-500">{Math.floor((Date.now() - new Date(app.application_date).getTime()) / (1000 * 60 * 60 * 24))} days elapsed</p>
                        </div>
                      </div>

                      <TrackerTimeline
                        steps={[
                          { id: '1', label: 'Received', status: 'completed', date: new Date(app.application_date).toLocaleDateString() },
                          { id: '2', label: 'Processing', status: 'current', description: 'Your application is being assessed by the Department.' },
                          { id: '3', label: 'Final Decision', status: 'upcoming' }
                        ]}
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">"""

if ui_search in content:
    content = content.replace(ui_search, ui_replace)

with open('src/pages/user/UserDashboard.tsx', 'w') as f:
    f.write(content)
