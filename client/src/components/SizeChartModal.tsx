import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Ruler, Info } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  productName?: string;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  productName = "Product"
}) => {
  const [activeTab, setActiveTab] = useState<'size-chart' | 'measure'>('size-chart');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      // Scroll the modal content to top
      const modalContent = document.querySelector('.size-chart-modal-content');
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Also scroll the page to top if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  // Function to handle tab switching with scroll to top
  const handleTabSwitch = (tab: 'size-chart' | 'measure') => {
    setActiveTab(tab);
    // Scroll modal content to top when switching tabs
    setTimeout(() => {
      const modalContent = document.querySelector('.size-chart-modal-content');
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden relative top-0 left-0 right-0 bottom-0 m-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-gray-900">Size Chart</h2>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleTabSwitch('size-chart')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'size-chart'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Size Chart
              </button>
              <button
                onClick={() => handleTabSwitch('measure')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'measure'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                How to measure
              </button>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Units:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setUnit('in')}
                className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                  unit === 'in'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                in
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                  unit === 'cm'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                cm
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto size-chart-modal-content" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {activeTab === 'size-chart' ? (
            /* Size Chart Tab */
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Info className="w-4 h-4" />
                  <span className="font-medium text-sm">Size Guide for {productName}</span>
                </div>
                <p className="text-blue-700 text-xs mt-1">
                  Find your perfect fit using the measurements below. All measurements are in {unitLabel}.
                </p>
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Size</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Brand</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Chest</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Length</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Shoulder</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-3 py-2 font-medium text-gray-900">{row.size}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{row.brandSize}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{convertUnit(row.chest, 'in')}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{convertUnit(row.length, 'in')}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{convertUnit(row.shoulder, 'in')}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{convertUnit(row.sleeve, 'in')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Garment Measurements in {unitLabel}
              </p>
            </div>
          ) : (
            /* How to Measure Tab */
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-800">
                  <Ruler className="w-4 h-4" />
                  <span className="font-medium text-sm">How to measure yourself</span>
                </div>
                <p className="text-green-700 text-xs mt-1">
                  Follow these steps to get accurate measurements for the perfect fit.
                </p>
              </div>

              {/* Measurement Diagram */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-xl p-4 max-w-2xl mx-auto">
                  {/* T-Shirt Diagram with your uploaded image */}
                  <div className="relative w-full max-w-xl mx-auto">
                    <img 
                      src={`${window.location.origin}/assets/size-chart-guide.png`}
                      alt="How to measure T-shirt diagram"
                      className="w-full h-auto rounded-lg shadow-lg"
                      style={{ maxWidth: '100%', height: 'auto' }}
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
                <div className="grid md:grid-cols-2 gap-4 mt-4 text-left max-w-3xl mx-auto text-sm">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Upper Body Measurements</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Chest</p>
                          <p className="text-xs text-gray-600">Measure around the fullest part of your chest</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Length</p>
                          <p className="text-xs text-gray-600">Measure from shoulder to desired length</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Shoulder</p>
                          <p className="text-xs text-gray-600">Measure across back shoulder to shoulder</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Sleeve Measurements</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Sleeve Length</p>
                          <p className="text-xs text-gray-600">Measure from shoulder to sleeve end</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">Collar</p>
                          <p className="text-xs text-gray-600">Measure around your neck</p>
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
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            <span className="font-medium">Need help?</span> Contact our support team
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onAddToWishlist}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm"
            >
              <Heart className="w-4 h-4" />
              <span>WISHLIST</span>
            </button>
            <button
              onClick={onAddToCart}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center space-x-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO BAG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal; 