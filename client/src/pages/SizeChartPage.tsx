import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Ruler, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface SizeChartPageProps {
  productName?: string;
}

const SizeChartPage: React.FC<SizeChartPageProps> = ({
  productName = "Product"
}) => {
  const [activeTab, setActiveTab] = useState<'size-chart' | 'measure'>('size-chart');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sizeData = [
    { size: 'XS', brandSize: '30', chest: '30.0', length: '17.0', shoulder: '13.0', sleeve: '6.5' },
    { size: 'S', brandSize: '32', chest: '32.0', length: '18.0', shoulder: '14.0', sleeve: '6.5' },
    { size: 'M', brandSize: '34', chest: '34.0', length: '19.0', shoulder: '14.5', sleeve: '6.8' },
    { size: 'L', brandSize: '36', chest: '36.0', length: '20.0', shoulder: '15.0', sleeve: '7.0' },
    { size: 'XL', brandSize: '38', chest: '38.0', length: '21.0', shoulder: '15.5', sleeve: '7.2' },
    { size: 'XXL', brandSize: '40', chest: '40.0', length: '22.0', shoulder: '16.0', sleeve: '7.5' },
  ];

  const convertUnit = (value: string, fromUnit: 'in' | 'cm') => {
    const numValue = parseFloat(value);
    if (fromUnit === 'in' && unit === 'cm') {
      return (numValue * 2.54).toFixed(1);
    } else if (fromUnit === 'cm' && unit === 'in') {
      return (numValue / 2.54).toFixed(1);
    }
    return value;
  };

  const unitLabel = unit === 'in' ? 'inches' : 'cm';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{ paddingTop: '4rem' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Back Button */}
            <Link href="/products">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Products</span>
              </button>
            </Link>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">Size Chart</h1>

            {/* Unit Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Units:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    unit === 'in'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  in
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    unit === 'cm'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  cm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('size-chart')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'size-chart'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Size Chart
            </button>
            <button
              onClick={() => setActiveTab('measure')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'measure'
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How to measure
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'size-chart' ? (
            /* Size Chart Tab */
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Info className="w-5 h-5" />
                  <span className="font-medium">Size Guide for {productName}</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Find your perfect fit using the measurements below. All measurements are in {unitLabel}.
                </p>
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Brand Size</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Chest ({unit})</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Front Length ({unit})</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Across Shoulder ({unit})</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Sleeve Length ({unit})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{row.size}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{row.brandSize}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(row.chest, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(row.length, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(row.shoulder, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(row.sleeve, 'in')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-gray-500 text-center">
                * Garment Measurements in {unitLabel}
              </p>
            </div>
          ) : (
            /* How to Measure Tab */
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <Ruler className="w-5 h-5" />
                  <span className="font-medium">How to measure yourself</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Follow these steps to get accurate measurements for the perfect fit.
                </p>
              </div>

              {/* Measurement Diagram */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-2xl p-6 max-w-2xl mx-auto">
                  {/* T-Shirt Diagram with your uploaded image */}
                  <div className="relative w-full max-w-lg mx-auto">
                    <img 
                      src={`${window.location.origin}/assets/size-chart-guide.png`}
                      alt="How to measure T-shirt diagram"
                      className="w-full h-auto rounded-lg shadow-lg"
                      style={{ maxWidth: '400px', height: 'auto' }}
                      onError={(e) => {
                        console.error('Failed to load image from primary path:', e);
                        // Try fallback path
                        const target = e.target as HTMLImageElement;
                        target.src = '/size-chart-guide.png';
                        target.onerror = () => {
                          console.error('Failed to load image from fallback path');
                          target.style.display = 'none';
                        };
                      }}
                    />
                  </div>
                </div>

                {/* Measurement Instructions */}
                <div className="grid md:grid-cols-2 gap-6 mt-8 text-left max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Upper Body Measurements</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Chest</p>
                          <p className="text-sm text-gray-600">Measure around the fullest part of your chest, keeping the tape horizontal</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Length</p>
                          <p className="text-sm text-gray-600">Measure from the highest point of your shoulder to desired length</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Shoulder</p>
                          <p className="text-sm text-gray-600">Measure across the back from shoulder seam to shoulder seam</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Sleeve Measurements</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Sleeve Length</p>
                          <p className="text-sm text-gray-600">Measure from shoulder seam to desired sleeve length</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800">Collar</p>
                          <p className="text-sm text-gray-600">Measure around your neck where the collar would sit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center mt-8 space-x-4">
          <Link href="/products">
            <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </button>
          </Link>
          <Link href="/cart">
            <button className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SizeChartPage; 