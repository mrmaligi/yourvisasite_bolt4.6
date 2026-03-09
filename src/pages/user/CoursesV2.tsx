import { BookOpen, Video, FileText, CheckCircle, Clock, Play } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserCoursesV2() {
  const courses = [
    { id: 1, title: 'Partner Visa Masterclass', progress: 75, total: 12, completed: 9, type: 'video' },
    { id: 2, title: 'Document Preparation Guide', progress: 30, total: 8, completed: 2, type: 'document' },
    { id: 3, title: 'Interview Preparation', progress: 0, total: 5, completed: 0, type: 'video' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-slate-400">Continue your learning journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white border border-slate-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 flex items-center justify-center">
                  {course.type === 'video' ? <Video className="w-8 h-8 text-blue-600" /> : <FileText className="w-8 h-8 text-blue-600" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{course.title}</h3>
                  <p className="text-sm text-slate-500">{course.completed} of {course.total} lessons completed</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium text-slate-900">{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-full bg-blue-600" style={{ width: `${course.progress}%` }} />
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                {course.progress === 0 ? 'Start Course' : 'Continue'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
