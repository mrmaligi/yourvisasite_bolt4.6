import { useState } from 'react';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, User, MapPin, Briefcase, GraduationCap, Globe } from 'lucide-react';

export function ExampleApplication() {
  const [activeSection, setActiveSection] = useState<string | null>('personal');

  const sections = [
    {
      id: 'personal',
      title: 'Part A - Personal Details',
      icon: User,
      data: [
        { label: 'Family Name', value: 'SMITH' },
        { label: 'Given Names', value: 'John David' },
        { label: 'Sex', value: 'Male' },
        { label: 'Date of Birth', value: '15 Jan 1990' },
        { label: 'Country of Birth', value: 'United Kingdom' },
        { label: 'Passport Number', value: '123456789' },
        { label: 'Date of Issue', value: '01 Feb 2020' },
        { label: 'Date of Expiry', value: '01 Feb 2030' },
      ]
    },
    {
      id: 'contact',
      title: 'Part B - Contact Details',
      icon: MapPin,
      data: [
        { label: 'Residential Address', value: '123 High St, London, SW1A 1AA, UK' },
        { label: 'Phone (Mobile)', value: '+44 7700 900000' },
        { label: 'Email Address', value: 'john.smith@example.com' },
      ]
    },
    {
      id: 'migration',
      title: 'Part C - Migration History',
      icon: Globe,
      data: [
        { label: 'Have you visited Australia before?', value: 'Yes' },
        { label: 'Last Visa Held', value: 'Student (500)' },
        { label: 'Arrival Date', value: '10 Mar 2018' },
        { label: 'Departure Date', value: '10 Mar 2019' },
      ]
    },
    {
      id: 'employment',
      title: 'Part D - Employment History',
      icon: Briefcase,
      data: [
        { label: 'Current Occupation', value: 'Software Engineer (261313)' },
        { label: 'Employer', value: 'Tech Corp Ltd' },
        { label: 'Start Date', value: '01 Mar 2018' },
        { label: 'End Date', value: 'Current' },
        { label: 'Duties', value: 'Designing and developing software applications...' },
      ]
    },
    {
      id: 'education',
      title: 'Part E - Education',
      icon: GraduationCap,
      data: [
        { label: 'Qualification', value: 'Bachelor of Science (Computer Science)' },
        { label: 'Institution', value: 'University of London' },
        { label: 'Completion Date', value: '01 Jul 2012' },
      ]
    }
  ];

  return (
    <div className="space-y-6 mt-12 pt-12 border-t border-neutral-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Complete Example Application</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Reference this full example to understand how all sections fit together.
          </p>
        </div>
        <Badge variant="primary">Sample Data</Badge>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Card key={section.id} className="overflow-hidden border-neutral-200">
              <button
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isActive ? 'bg-primary-50' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-semibold ${isActive ? 'text-primary-900' : 'text-neutral-900'}`}>
                    {section.title}
                  </h3>
                </div>
                {isActive ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
              </button>

              {isActive && (
                <CardBody className="bg-white border-t border-neutral-100 pt-4">
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {section.data.map((field, i) => (
                      <div key={i} className="pb-2 border-b border-neutral-50 last:border-0">
                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                          {field.label}
                        </p>
                        <p className="font-mono text-sm text-neutral-900 bg-neutral-50 px-2 py-1 rounded border border-neutral-100 inline-block w-full">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
