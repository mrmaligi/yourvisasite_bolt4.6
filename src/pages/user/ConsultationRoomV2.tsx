import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ConsultationRoomV2() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">J</span>
                  </div>
                  <p className="text-white">Jane Smith</p>
                </div>
              </div>
              <div className="bg-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-white">You</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-center gap-4">
            <button className="w-12 h-12 bg-slate-700 flex items-center justify-center hover:bg-slate-600">
              <Mic className="w-6 h-6 text-white" />
            </button>
            <button className="w-12 h-12 bg-slate-700 flex items-center justify-center hover:bg-slate-600">
              <Video className="w-6 h-6 text-white" />
            </button>
            <button className="w-12 h-12 bg-red-600 flex items-center justify-center hover:bg-red-700">
              <Phone className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Chat</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-slate-100 p-3">
                <p className="text-sm text-slate-700">Hello! Ready to discuss your visa application?</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 border border-slate-200" />
              <Button variant="primary" size="sm">Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
