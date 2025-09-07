import React, { useState } from 'react';
import { Upload, Palette, Type, Move, Undo, Redo, Copy, Layers, Eye, EyeOff, RotateCw, RotateCcw, Trash2, Download } from 'lucide-react';
import { useLocation } from 'wouter';

// T-shirt colors with their corresponding image paths
const TSHIRT_COLORS = [
  { name: 'White', color: '#FFFFFF', folder: 'white' },
  { name: 'Black', color: '#000000', folder: 'black' },
  { name: 'Blue', color: '#0066CC', folder: 'blue' },
  { name: 'Camel', color: '#C19A6B', folder: 'camel' },
  { name: 'Lavender', color: '#E6E6FA', folder: 'lavender' },
  { name: 'Lime', color: '#32CD32', folder: 'lime' },
  { name: 'Pink', color: '#FFC0CB', folder: 'pink' },
  { name: 'Yellow', color: '#FFFF00', folder: 'yellow' }
];

const TSHIRT_PARTS = [
  { name: 'Front', image: '/tshirt-parts/front.png' },
  { name: 'Back', image: '/tshirt-parts/back.png' },
  { name: 'Left Sleeve', image: '/tshirt-parts/leftsleeve.png' },
  { name: 'Right Sleeve', image: '/tshirt-parts/rightsleeve.png' }
];

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#00CED1', '#32CD32', '#DC143C'
];

const CLIPARTS = [
  { name: 'Vintage Man', image: '/cliparts/vintage-man.png' },
  { name: 'Abstract Art', image: '/cliparts/abstract-art.png' },
  { name: 'Nature Scene', image: '/cliparts/nature-scene.png' },
  { name: 'Geometric Pattern', image: '/cliparts/geometric-pattern.png' },
  { name: 'Typography Design', image: '/cliparts/typography-design.png' },
  { name: 'Animal Silhouette', image: '/cliparts/animal-silhouette.png' },
  { name: 'Floral Pattern', image: '/cliparts/floral-pattern.png' },
  { name: 'Urban Style', image: '/cliparts/urban-style.png' }
];

const FONT_CATEGORIES = {
  'Sans Serif': [
    { name: 'Arial', family: 'Arial, sans-serif', preview: 'Aa' },
    { name: 'Helvetica', family: 'Helvetica, Arial, sans-serif', preview: 'Aa' },
    { name: 'Verdana', family: 'Verdana, sans-serif', preview: 'Aa' },
    { name: 'Trebuchet MS', family: 'Trebuchet MS, sans-serif', preview: 'Aa' },
    { name: 'Tahoma', family: 'Tahoma, sans-serif', preview: 'Aa' },
    { name: 'Century Gothic', family: 'Century Gothic, sans-serif', preview: 'Aa' },
    { name: 'Calibri', family: 'Calibri, sans-serif', preview: 'Aa' },
    { name: 'Open Sans', family: 'Open Sans, sans-serif', preview: 'Aa' }
  ],
  'Serif': [
    { name: 'Times New Roman', family: 'Times New Roman, serif', preview: 'Aa' },
    { name: 'Georgia', family: 'Georgia, serif', preview: 'Aa' },
    { name: 'Palatino', family: 'Palatino, serif', preview: 'Aa' },
    { name: 'Book Antiqua', family: 'Book Antiqua, serif', preview: 'Aa' },
    { name: 'Garamond', family: 'Garamond, serif', preview: 'Aa' }
  ],
  'Display': [
    { name: 'Impact', family: 'Impact, Arial Black, sans-serif', preview: 'Aa' },
    { name: 'Copperplate', family: 'Copperplate, fantasy', preview: 'Aa' },
    { name: 'Bebas Neue', family: 'Bebas Neue, cursive', preview: 'Aa' },
    { name: 'Anton', family: 'Anton, sans-serif', preview: 'Aa' },
    { name: 'Oswald', family: 'Oswald, sans-serif', preview: 'Aa' }
  ],
  'Script': [
    { name: 'Brush Script MT', family: 'Brush Script MT, cursive', preview: 'Aa' },
    { name: 'Lucida Handwriting', family: 'Lucida Handwriting, cursive', preview: 'Aa' },
    { name: 'Pacifico', family: 'Pacifico, cursive', preview: 'Aa' },
    { name: 'Dancing Script', family: 'Dancing Script, cursive', preview: 'Aa' },
    { name: 'Alex Brush', family: 'Alex Brush, cursive', preview: 'Aa' }
  ]
};

const FONTS = Object.entries(FONT_CATEGORIES).flatMap(([category, fonts]) => 
  fonts.map(font => ({ ...font, category }))
);

const TEXT_EXAMPLES = [
  { text: 'Bridge', font: 'Impact, Arial Black, sans-serif', size: 48, weight: 'bold', color: '#2563eb' },
  { text: 'Text Mask', font: 'Brush Script MT, cursive', size: 36, weight: 'normal', color: '#dc2626' },
  { text: 'Oswald', font: 'Oswald, sans-serif', size: 42, weight: 'bold', color: '#000000' },
  { text: 'Anton', font: 'Anton, sans-serif', size: 44, weight: 'normal', color: '#7c3aed' },
  { text: 'Pacifico', font: 'Pacifico, cursive', size: 32, weight: 'normal', color: '#059669' },
  { text: 'Quicksand', font: 'Arial, sans-serif', size: 28, weight: '600', color: '#ea580c' }
];

export default function DesignToolsPage() {
  const [, setLocation] = useLocation();
  
  // State for tools
  const [currentPart, setCurrentPart] = useState(0);
  const [currentTshirtColor, setCurrentTshirtColor] = useState(0);
  const [tool, setTool] = useState('move');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showDesignArea, setShowDesignArea] = useState(true);

  // Share on WhatsApp function
  const shareOnWhatsApp = () => {
    const phoneNumber = '+919266767693';
    const message = encodeURIComponent('Hi! I would like to order this custom t-shirt design. Can you help me with the pricing and delivery details?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Navigate to design canvas
  const openDesignCanvas = () => {
    setLocation('/design-canvas');
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="w-full max-w-4xl mx-auto bg-gray-800 shadow-lg overflow-y-auto border-r border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">T-Shirt Design Tools</h2>
            <button
              onClick={openDesignCanvas}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Design Canvas
            </button>
          </div>
          
          {/* T-shirt Color Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-200">T-Shirt Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {TSHIRT_COLORS.map((tshirtColor, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTshirtColor(index)}
                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center ${
                    currentTshirtColor === index 
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  title={tshirtColor.name}
                >
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300 mb-1"
                    style={{ backgroundColor: tshirtColor.color }}
                  />
                  <span className="text-xs text-gray-300">{tshirtColor.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selected: {TSHIRT_COLORS[currentTshirtColor].name} T-shirt
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-200">T-Shirt Part</h3>
            <div className="grid grid-cols-2 gap-2">
              {TSHIRT_PARTS.map((part, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPart(index)}
                  className={`p-3 text-sm rounded-lg border transition-all ${
                    currentPart === index 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200'
                  }`}
                >
                  {part.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Elements will only appear on the selected part
            </p>
          </div>

          {/* Tools */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-200">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'move', icon: Move, label: 'Select' },
                { id: 'text', icon: Type, label: 'Text' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setTool(id)}
                  className={`p-3 rounded-lg border transition-all flex flex-col items-center ${
                    tool === id 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                      : 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs mt-1">{label}</span>
                </button>
              ))}
            </div>
            
            {/* Action Button */}
            <div className="mt-4">
              <button
                onClick={shareOnWhatsApp}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
              >
                📱 Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Text Input and Settings - always at top if tool === 'text' */}
          {tool === 'text' && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-200">Text Settings</h3>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full p-3 border border-gray-600 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-200"
                />
                {/* Font Selection */}
                <div className="mb-3 relative">
                  <button
                    onClick={() => setShowFontPanel(!showFontPanel)}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-between text-gray-200"
                    style={{ fontFamily: selectedFont.family }}
                  >
                    <span>{selectedFont.name}</span>
                    <span className="text-gray-400">▼</span>
                  </button>
                  {showFontPanel && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowFontPanel(false)}
                      />
                      <div
                        className="absolute left-0 top-full z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-xl mt-1"
                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                      >
                        {Object.entries(FONT_CATEGORIES).map(([categoryName, categoryFonts]) => (
                          <div key={categoryName} className="mb-4">
                            <div className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide border-b border-gray-200 pb-1">
                              {categoryName}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {categoryFonts.map((font) => (
                                <button
                                  key={font.name}
                                  onClick={() => {
                                    setSelectedFont({ ...font, category: categoryName });
                                    setShowFontPanel(false);
                                  }}
                                  className={`p-3 text-center rounded-lg border-2 transition-all hover:border-blue-400 hover:bg-blue-50 ${
                                    selectedFont.name === font.name ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
                                  }`}
                                  style={{ fontFamily: font.family }}
                                >
                                  <div className="text-2xl font-medium mb-1">{font.preview}</div>
                                  <div className="text-xs text-gray-600">{font.name}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Font Style Options */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')}
                    className={`px-3 py-2 border rounded ${
                      fontWeight === 'bold' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200 border-gray-600'
                    }`}
                    style={{ fontWeight: 'bold' }}
                  >
                    B
                  </button>
                  <button
                    onClick={() => setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')}
                    className={`px-3 py-2 border rounded ${
                      fontStyle === 'italic' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200 border-gray-600'
                    }`}
                    style={{ fontStyle: 'italic' }}
                  >
                    I
                  </button>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Text Examples - immediately after Text Settings */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-200">Text Examples</h3>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {TEXT_EXAMPLES.map((example, index) => (
                    <button
                      key={index}
                      className="p-3 bg-gray-700 hover:bg-blue-600 border border-gray-600 hover:border-blue-400 rounded-lg transition-all text-center hover:shadow-sm"
                      style={{ 
                        fontFamily: example.font,
                        color: example.color,
                        fontSize: '14px',
                        fontWeight: example.weight === '600' ? '600' : example.weight
                      }}
                    >
                      {example.text}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Click any example to add it to the design area</p>
              </div>
            </>
          )}

          {/* Upload Image */}
          <div className="mb-6">
            <button
              className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Upload size={20} />
              Upload Image
            </button>
            <p className="text-xs text-gray-400 mt-2">Images will be auto-sized to fit the design area</p>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm font-medium"
            >
              <Palette size={16} />
              {showColorPicker ? 'Hide' : 'Show'} Text Colors
            </button>
            
            {showColorPicker && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="font-semibold mb-3 text-gray-200 text-sm">Text Color</h3>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Selected: <span style={{ color: selectedColor }}>■</span> {selectedColor}
                </p>
              </div>
            )}
          </div>

          {/* Cliparts */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-200">Cliparts</h3>
            <div className="grid grid-cols-2 gap-3">
              {CLIPARTS.map((clipart, index) => (
                <div
                  key={index}
                  className="relative bg-gray-700 hover:bg-blue-600 border border-gray-600 hover:border-blue-400 rounded-lg transition-all cursor-pointer hover:shadow-md group overflow-hidden transform hover:scale-105"
                  style={{ aspectRatio: '1', minHeight: '80px' }}
                  title={`Click to add ${clipart.name} to design area`}
                >
                  <img
                    src={clipart.image}
                    alt={clipart.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gray-600 text-gray-300 p-2">
                            <div class="text-center">
                              <div class="text-2xl mb-1">🎨</div>
                              <div class="text-xs">${clipart.name}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {clipart.name}
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Add
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              🎯 Click any clipart to add it to the center of your design area
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                className="flex-1 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2 transition-colors"
                title="Duplicate (Ctrl+D)"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
            
            <button
              onClick={() => setShowLayers(!showLayers)}
              className="w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2 transition-colors"
            >
              <Layers size={16} />
              {showLayers ? 'Hide' : 'Show'} Layers
            </button>
            
            <button
              onClick={() => setShowDesignArea(!showDesignArea)}
              className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
            >
              <Eye size={16} />
              {showDesignArea ? 'Hide' : 'Show'} Design Area
            </button>
            
            <button
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Download size={18} />
              Download Design
            </button>
          </div>

          {/* Layers Panel */}
          {showLayers && (
            <div className="mt-6 border-t border-gray-700 pt-6">
              <h3 className="font-semibold mb-3 text-gray-200">
                Layers for {TSHIRT_PARTS[currentPart].name} (0)
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <p className="text-gray-400 text-sm">No elements added yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 