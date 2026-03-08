import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// Sample success stories data
const successStories = [
  {
    id: 1,
    name: "Sarah & James",
    visa: "Partner Visa (820/801)",
    from: "UK",
    quote: "VisaBuild made the complex process so much clearer. We got our visa approved in just 8 months!",
    image: null
  },
  {
    id: 2,
    name: "Chen Family",
    visa: "Subclass 189 (Skilled Independent)",
    from: "China",
    quote: "The points calculator and document checklist were invaluable. Permanent residency achieved!",
    image: null
  },
  {
    id: 3,
    name: "Rahul Patel",
    visa: "Subclass 482 (Temporary Skill Shortage)",
    from: "India",
    quote: "Found a great employer sponsor through the platform. Now working in Sydney as an engineer.",
    image: null
  },
  {
    id: 4,
    name: "Emma Wilson",
    visa: "Student Visa (500)",
    from: "Canada",
    quote: "The application tracker kept me sane during the wait. Now studying at Melbourne Uni!",
    image: null
  },
  {
    id: 5,
    name: "The Nguyen Family",
    visa: "Business Innovation (188)",
    from: "Vietnam",
    quote: "From business plan to visa approval - VisaBuild guided us every step of the way.",
    image: null
  },
  {
    id: 6,
    name: "Michael O'Brien",
    visa: "Subclass 186 (Employer Nomination)",
    from: "Ireland",
    quote: "The lawyer matching feature connected me with an amazing migration agent. Highly recommend!",
    image: null
  }
];

export function SuccessStoriesPageV2() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Success Stories | VisaBuild</title>
        <meta name="description" content="Real visa success stories from our community." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header - SQUARE */}
        <div className="bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            
            <Badge variant="primary" className="mb-4 bg-blue-600">Inspiring Journeys</Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Real people, real visas, real success. Discover inspiring stories from applicants 
              who navigated the Australian immigration journey.
            </p>

            {user && (
              <Link to="/dashboard/referrals">
                <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100">
                  Share Your Story
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats - SQUARE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">10,000+</div>
              <div className="text-slate-600">Success Stories</div>
            </div>

            <div className="bg-white border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">180+</div>
              <div className="text-slate-600">Countries Represented</div>
            </div>

            <div className="bg-white border border-slate-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
              <div className="text-slate-600">Approval Rate</div>
            </div>
          </div>

          {/* Stories Grid - SQUARE */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white border border-slate-200 p-6 flex flex-col">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-blue-600" />
                </div>

                <blockquote className="text-slate-700 italic mb-6 flex-1">
                  "{story.quote}"
                </blockquote>

                <div className="border-t border-slate-200 pt-4">
                  <div className="font-semibold text-slate-900">{story.name}</div>
                  <div className="text-sm text-slate-500">{story.visa}</div>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    From {story.from}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* CTA - SQUARE */}
          <div className="mt-12 bg-blue-600 text-white p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Have a success story to share?</h2>
            <p className="text-blue-100 mb-6">Your journey could inspire thousands of others.</p>
            
            {user ? (
              <Link to="/dashboard/referrals">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Submit Your Story
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Join to Share
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
