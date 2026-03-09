import { Sparkles, Wand2, Palette, Type, Image } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function UserCustomizeV2() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Customize Experience</h1>
          <p className="text-slate-600">Personalize your VisaBuild dashboard</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Theme</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 border-2 border-blue-500 bg-slate-50">
                <div className="w-full h-12 bg-white border border-slate-200 mb-2" />
                <p className="text-sm font-medium">Light</p>
              </button>
              <button className="p-4 border border-slate-200">
                <div className="w-full h-12 bg-slate-800 mb-2" />
                <p className="text-sm font-medium">Dark</p>
              </button>
              <button className="p-4 border border-slate-200">
                <div className="w-full h-12 bg-gradient-to-r from-white to-slate-800 mb-2" />
                <p className="text-sm font-medium">Auto</p>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wand2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-900">Accent Color</h2>
            </div>

            <div className="flex gap-4">
              {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-pink-500'].map((color) => (
                <button key={color} className={`w-12 h-12 ${color} ${color === 'bg-blue-500' ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`} />
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Font Size</h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm">A</span>
              <input type="range" className="flex-1" />
              <span className="text-lg">A</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary">Save Preferences</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
