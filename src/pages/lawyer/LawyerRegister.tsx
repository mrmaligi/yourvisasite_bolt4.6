import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { BUCKETS, uploadFile, validateFile } from '../../lib/storage';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { useToast } from '../../components/ui/Toast';

export function LawyerRegister() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [barNumber, setBarNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [practiceAreas, setPracticeAreas] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    try {
      if (validateFile(file)) {
        setVerificationFile(file);
      }
    } catch (error) {
      toast('error', error instanceof Error ? error.message : 'Invalid file');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast('error', 'You must be logged in to register as a lawyer');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      let verificationUrl = '';
      if (verificationFile) {
        const path = `${user.id}/${Date.now()}_${verificationFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        await uploadFile({
          bucket: BUCKETS.LAWYER_CREDENTIALS,
          path,
          file: verificationFile,
          onProgress: (progress) => setUploadProgress(progress),
        });
        verificationUrl = path;
      }

      const { error: updateError } = await supabase.from('profiles').update({
        bar_number: barNumber,
        jurisdiction,
        practice_areas: practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        years_experience: parseInt(yearsExperience) || 0,
        bio: bio || null,
        hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
        verification_document_url: verificationUrl || null,
        role: 'lawyer',
        verification_status: 'pending',
      }).eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Create lawyer_profiles record
      const { error: lawyerProfileError } = await supabase.from('lawyer_profiles').insert({
        user_id: user.id,
        bar_number: barNumber,
        jurisdiction,
        practice_areas: practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        years_experience: parseInt(yearsExperience) || 0,
        bio: bio || null,
        hourly_rate_cents: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
        credentials_url: verificationUrl || null,
        verification_status: 'pending',
        is_verified: false,
        is_available: true,
      });

      if (lawyerProfileError) {
        console.warn('Could not create lawyer_profile:', lawyerProfileError);
        // Don't throw - profile update was successful
      }

      // Create notification for admins
      try {
        // Get all admin IDs
        const { data: admins } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin');
        
        if (admins && admins.length > 0) {
          const notifications = admins.map(admin => ({
            user_id: admin.id,
            title: 'New Lawyer Registration',
            body: `${user.email || 'A new lawyer'} has submitted a registration and requires approval.`,
            type: 'lawyer_registration',
            link: '/admin/lawyers',
          }));
          
          await supabase.from('notifications').insert(notifications);
        }
      } catch (notifError) {
        console.warn('Could not send admin notifications:', notifError);
      }

      await refreshProfile();
      toast('success', 'Registration submitted successfully!');
      navigate('/lawyer/pending');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Scale className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Join as a Lawyer</h1>
        <p className="text-neutral-500 mb-8">
          To register as a lawyer, you first need to create a VisaBuild account.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/login')} className="w-full">
            Log In
          </Button>
          <Button variant="secondary" onClick={() => navigate('/register')} className="w-full">
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Scale className="w-7 h-7 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Register as a Lawyer</h1>
        <p className="text-neutral-500 mt-2">Join VisaBuild as a verified immigration professional.</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-neutral-900">Step 1: Professional Details</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Bar Number" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} />
            <Input label="Jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} />
            <Input label="Practice Areas" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} helperText="Comma-separated" />
            <Input label="Years of Experience" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
            <Input label="Hourly Rate ($/hr)" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
            <Textarea label="Professional Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!barNumber || !jurisdiction || !hourlyRate}>Next</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-neutral-900">Step 2: Verification Document</h2></CardHeader>
          <CardBody className="space-y-4">
            <p className="text-sm text-neutral-500">Upload proof of legal practice (bar license, professional ID).</p>
            <FileUpload onFileSelect={handleFileSelect} />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!verificationFile}>Next</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-neutral-900">Step 3: Review & Submit</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-neutral-700">Bar Number:</span> {barNumber}</p>
              <p><span className="font-medium text-neutral-700">Jurisdiction:</span> {jurisdiction}</p>
              <p><span className="font-medium text-neutral-700">Practice Areas:</span> {practiceAreas}</p>
              <p><span className="font-medium text-neutral-700">Experience:</span> {yearsExperience} years</p>
              <p><span className="font-medium text-neutral-700">Hourly Rate:</span> ${hourlyRate}/hr</p>
              <p><span className="font-medium text-neutral-700">Document:</span> {verificationFile?.name}</p>
            </div>

            {submitting && uploadProgress > 0 && uploadProgress < 100 && (
               <div className="space-y-1">
                 <div className="flex justify-between text-xs text-neutral-500">
                   <span>Uploading document...</span>
                   <span>{Math.round(uploadProgress)}%</span>
                 </div>
                 <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                   <div
                     className="bg-primary-600 h-full rounded-full transition-all duration-300 ease-out"
                     style={{ width: `${uploadProgress}%` }}
                   />
                 </div>
               </div>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(2)} disabled={submitting}>Back</Button>
              <Button loading={submitting} onClick={handleSubmit}>Submit Registration</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
