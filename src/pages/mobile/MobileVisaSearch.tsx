import React, { useState } from 'react';
import { MobileLayout } from '../../components/mobile/MobileLayout';
import { MobileCard } from '../../components/mobile/MobileCard';
import { MobileButton } from '../../components/mobile/MobileButton';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileInput } from '../../components/mobile/MobileInput';

export default function MobileVisaSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const visas = [
    { id: '189', title: 'Skilled Independent (189)', desc: 'For skilled workers who are not sponsored.' },
    { id: '190', title: 'Skilled Nominated (190)', desc: 'For skilled workers nominated by a state.' },
    { id: '482', title: 'Temporary Skill Shortage (482)', desc: 'Employer sponsored temporary visa.' },
    { id: '491', title: 'Skilled Work Regional (491)', desc: 'For skilled workers in regional Australia.' },
    { id: '820', title: 'Partner Visa (820/801)', desc: 'For partners of Australian citizens/residents.' },
  ];

  const filteredVisas = visas.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.id.includes(searchTerm)
  );

  return (
    <MobileLayout title="Find a Visa" showBack={false}>
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-2 -mt-2 pt-2">
        <MobileInput
          placeholder="Search visas (e.g. 189, Partner)"
          icon={<Search className="w-5 h-5" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-0 shadow-sm"
        />
      </div>

      <div className="space-y-4 mt-4">
        {filteredVisas.length > 0 ? (
          filteredVisas.map((visa) => (
            <MobileCard key={visa.id} title={visa.title} subtitle={`Subclass ${visa.id}`}>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{visa.desc}</p>
              <div className="flex gap-2">
                <MobileButton
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => navigate(`/mobile/visa-detail?id=${visa.id}`)}
                >
                  Details
                </MobileButton>
                <MobileButton
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/mobile/visa-assessment?id=${visa.id}`)}
                >
                  Check Eligibility
                </MobileButton>
              </div>
            </MobileCard>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No visas found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Floating Filter Button */}
      <button className="fixed bottom-20 right-4 w-12 h-12 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform">
        <Filter className="w-6 h-6" />
      </button>
    </MobileLayout>
  );
}
