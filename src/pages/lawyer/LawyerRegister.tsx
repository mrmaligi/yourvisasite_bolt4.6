import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Input, Textarea } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
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
  const [bio, setBio] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast('error', 'You must be logged in to register as a lawyer');
      return;
    }

    setSubmitting(true);

    try {
      let verificationUrl = '';
      if (verificationFile) {
        const path = `${user.id}/${Date.now()}_${verificationFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('lawyer-verification')
          .upload(path, verificationFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        verificationUrl = path;
      }

      const { error: insertError } = await supabase.schema('lawyer').from('profiles').insert({
        profile_id: user.id,
        bar_number: barNumber,
        jurisdiction,
        practice_areas: practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        years_experience: parseInt(yearsExperience) || 0,
        bio: bio || null,
        verification_document_url: verificationUrl || null,
      });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('You have already submitted a lawyer registration');
        }
        throw new Error(insertError.message);
      }

      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevate-role`;
        const session = await supabase.auth.getSession();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.id, role: 'lawyer' }),
        });

        if (!response.ok) {
          console.error('Failed to elevate role:', await response.text());
        }
      } catch (roleError) {
        console.error('Role elevation error:', roleError);
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
          <CardContent className="space-y-4">
            <Input label="Bar Number" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} />
            <Input label="Jurisdiction" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} />
            <Input label="Practice Areas" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} helperText="Comma-separated" />
            <Input label="Years of Experience" type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
            <Textarea label="Professional Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!barNumber || !jurisdiction}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-neutral-900">Step 2: Verification Document</h2></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-neutral-500">Upload proof of legal practice (bar license, professional ID).</p>
            <FileUpload onFileSelect={(f) => setVerificationFile(f)} />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!verificationFile}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><h2 className="font-semibold text-neutral-900">Step 3: Review & Submit</h2></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <p><span className="font-medium text-neutral-700">Bar Number:</span> {barNumber}</p>
              <p><span className="font-medium text-neutral-700">Jurisdiction:</span> {jurisdiction}</p>
              <p><span className="font-medium text-neutral-700">Practice Areas:</span> {practiceAreas}</p>
              <p><span className="font-medium text-neutral-700">Experience:</span> {yearsExperience} years</p>
              <p><span className="font-medium text-neutral-700">Document:</span> {verificationFile?.name}</p>
            </div>
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button loading={submitting} onClick={handleSubmit}>Submit Registration</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
