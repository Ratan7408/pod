import React from 'react';
import { useLocation } from 'wouter';
import { Palette, Monitor, Settings } from 'lucide-react';

export default function DesignHomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">T-Shirt Design Studio</h1>
          <p className="text-gray-300 text-lg">Choose your preferred design experience</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Option 1: Combined View (Original) */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-4">
              <Monitor className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Combined View</h2>
            </div>
            <p className="text-gray-300 mb-6">
              All tools and design canvas in one page. Perfect for users who prefer everything in a single interface.
            </p>
            <ul className="text-gray-400 mb-6 space-y-2">
              <li>• Tools and canvas side by side</li>
              <li>• Scrollable tool panel</li>
              <li>• Traditional layout</li>
            </ul>
            <button
              onClick={() => setLocation('/customize')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Use Combined View
            </button>
          </div>

          {/* Option 2: Separated View (New) */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Separated View</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Tools and design canvas on separate pages. Better for focused design work with fixed canvas area.
            </p>
            <ul className="text-gray-400 mb-6 space-y-2">
              <li>• Tools on separate page</li>
              <li>• Fixed, non-scrollable canvas</li>
              <li>• Modern layout</li>
            </ul>
            <div className="space-y-3">
              <button
                onClick={() => setLocation('/design-tools')}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Start with Tools
              </button>
              <button
                onClick={() => setLocation('/design-canvas')}
                className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                Start with Canvas
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            💡 <strong>Recommendation:</strong> Try the Separated View for a better design experience with fixed canvas area
          </p>
        </div>
      </div>
    </div>
  );
} 