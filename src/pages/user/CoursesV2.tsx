import { BookOpen, Clock, CheckCircle, PlayCircle, Award } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserCoursesV2() {
  const courses = [
    { id: 1, title: 'Australian Visa Basics', progress: 75, totalLessons: 12, completedLessons: 9, duration: '2.5 hours', image: 'VB' },
    { id: 2, title: 'Partner Visa Masterclass', progress: 30, totalLessons: 20, completedLessons: 6, duration: '4 hours', image: 'PM' },
    { id: 3, title: 'Document Preparation Guide', progress: 0, totalLessons: 8, completedLessons: 0, duration: '1.5 hours', image: 'DP' },
  ];

  const completed = [
    { id: 4, title: 'Introduction to VisaBuild', completedDate: '2024-03-10', certificate: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-600">Continue learning and earning certificates</p>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">In Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white border border-slate-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{course.image}</span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-900 mb-1">{course.title}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4" /> {course.duration}</span>
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100">
                      <div className="h-2 bg-blue-600" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  
                  <Button variant="primary" className="w-full">Continue</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-4">Completed</h2>
          <div className="bg-white border border-slate-200">
            {completed.map((course) => (
              <div key={course.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{course.title}</p>
                    <p className="text-sm text-slate-500">Completed on {course.completedDate}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Award className="w-4 h-4 mr-1" />
                  Certificate
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
