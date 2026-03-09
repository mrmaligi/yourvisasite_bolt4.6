import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function VideoCallV2() {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-white">J</span>
            </div>
            <div>
              <p className="font-medium text-white">Jane Smith</p>
              <p className="text-sm text-slate-400">Partner Visa Consultation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-600 text-white text-sm">00:15:32</span>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex gap-4 p-4">
          <div className="flex-1 bg-slate-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-slate-500">J</span>
              </div>
              <p className="text-slate-400">Jane Smith</p>
            </div>
          </div>
          
          <div className="w-48 bg-slate-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-700 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl text-slate-500">You</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => setMicOn(!micOn)}
              className={`p-4 ${micOn ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'}`}
            >
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            
            <button 
              onClick={() => setVideoOn(!videoOn)}
              className={`p-4 ${videoOn ? 'bg-slate-700 text-white' : 'bg-red-600 text-white'}`}
            >
              {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            
            <button className="p-4 bg-slate-700 text-white">
              <MessageSquare className="w-6 h-6" />
            </button>
            
            <button className="p-4 bg-red-600 text-white">
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
