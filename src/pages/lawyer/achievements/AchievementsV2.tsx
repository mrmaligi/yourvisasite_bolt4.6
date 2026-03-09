import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Award, Plus, Trash2, Trophy, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface Achievement {
  id: string;
  title: string;
  year: string;
  issuer: string;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Best Immigration Lawyer', year: '2023', issuer: 'Legal Awards Australia' },
  { id: '2', title: 'Top Rated Solicitor', year: '2022', issuer: 'ThreeBestRated' },
  { id: '3', title: 'Excellence in Migration Law', year: '2021', issuer: 'Law Society' },
];

export function AchievementsV2() {
  const [achievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [showForm, setShowForm] = useState(false);

  const stats = {
    total: achievements.length,
    recent: achievements.filter(a => parseInt(a.year) >= 2022).length,
  };

  return (
    <>
      <Helmet>
        <title>Achievements | VisaBuild Lawyer</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
                <p className="text-slate-600">Showcase your professional awards</p>
              </div>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-sm text-slate-600">Total Awards</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stats.recent}</p>
                  <p className="text-sm text-slate-600">Recent (2022+)</p>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Achievement</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input type="text" placeholder="Title" className="px-3 py-2 border border-slate-200" />
                <input type="text" placeholder="Year" className="px-3 py-2 border border-slate-200" />
                <input type="text" placeholder="Issuer" className="px-3 py-2 border border-slate-200" />
              </div>
              <div className="flex gap-2">
                <Button variant="primary">Save</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{achievement.title}</h3>
                      <p className="text-slate-600">{achievement.issuer}</p>
                      <Badge variant="primary" className="mt-2">{achievement.year}</Badge>
                    </div>
                  </div>
                  
                  <Button variant="danger" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
