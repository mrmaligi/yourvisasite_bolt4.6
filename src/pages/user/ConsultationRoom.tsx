import { useParams, Link } from 'react-router-dom';
import { Video, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ConsultationRoom() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl aspect-video relative flex flex-col items-center justify-center">
        <Video className="w-24 h-24 text-neutral-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Consultation Room</h2>
        <p className="text-neutral-400 mb-8">Waiting for connection...</p>
        <p className="text-xs text-neutral-600 absolute bottom-4">Session ID: {id}</p>
      </div>
      <div className="mt-8 flex gap-4">
        <Link to="/dashboard/consultations">
            <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Leave Room
            </Button>
        </Link>
      </div>
    </div>
  );
}
