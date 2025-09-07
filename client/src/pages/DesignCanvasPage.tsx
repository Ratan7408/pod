import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';

const TSHIRT_PARTS = [
  { name: 'Front', image: '/tshirt-parts/front.png' },
  { name: 'Back', image: '/tshirt-parts/back.png' },
  { name: 'Left Sleeve', image: '/tshirt-parts/leftsleeve.png' },
  { name: 'Right Sleeve', image: '/tshirt-parts/rightsleeve.png' }
];

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

// Define design areas for each T-shirt part (in canvas coordinates)
const DESIGN_AREAS = {
  0: { x: 200, y: 200, width: 200, height: 280 }, // Front - center chest area
  1: { x: 200, y: 200, width: 200, height: 280 }, // Back - center back area
  2: { x: 300, y: 210, width: 50, height: 80 },   // Left Sleeve
  3: { x: 260, y: 220, width: 50, height: 80 }    // Right Sleeve
};

interface Element {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  shape?: 'rectangle' | 'circle';
  imageData?: HTMLImageElement;
  rotation?: number;
  visible?: boolean;
  tshirtPart?: number;
}

export default function DesignCanvasPage() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [currentPart, setCurrentPart] = useState(0);
  const [currentTshirtColor, setCurrentTshirtColor] = useState(0);
  const [tshirtImage, setTshirtImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showDesignArea, setShowDesignArea] = useState(true);

  // Load T-shirt image based on selected color and part
  useEffect(() => {
    const selectedColor = TSHIRT_COLORS[currentTshirtColor];
    const selectedPart = TSHIRT_PARTS[currentPart];
    
    const image = new Image();
    const imagePath = `/tshirt-colors/${selectedColor.folder}/${selectedPart.name.toLowerCase().replace(' ', '-')}.png`;
    image.src = imagePath;
    
    image.onload = () => {
      setTshirtImage(image);
      setFailed(false);
    };
    image.onerror = () => {
      const fallbackPath = `/tshirt-parts/${selectedPart.name.toLowerCase().replace(' ', '-')}.png`;
      const fallbackImage = new Image();
      fallbackImage.src = fallbackPath;
      
      fallbackImage.onload = () => {
        setTshirtImage(fallbackImage);
        setFailed(false);
      };
      fallbackImage.onerror = () => {
        setTshirtImage(null);
        setFailed(true);
      };
    };
  }, [currentPart, currentTshirtColor]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tshirtImage) return;
    
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw T-shirt
    const scale = Math.min(canvas.width / tshirtImage.naturalWidth, canvas.height / tshirtImage.naturalHeight) * 0.95;
    const x = (canvas.width - tshirtImage.naturalWidth * scale) / 2;
    const y = (canvas.height - tshirtImage.naturalHeight * scale) / 2;
    
    ctx.drawImage(tshirtImage, x, y, tshirtImage.naturalWidth * scale, tshirtImage.naturalHeight * scale);
    
    // Draw design area outline
    const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];
    if (area && showDesignArea) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(area.x, area.y, area.width, area.height);
      ctx.setLineDash([]);
      
      // Add area label
      ctx.fillStyle = '#3b82f6';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Design Area', area.x + area.width / 2, area.y - 10);
    }
    
    // Draw all visible elements for current T-shirt part
    elements
      .filter(el => el.visible !== false && el.tshirtPart === currentPart)
      .forEach((element) => {
        ctx.save();
        
        // Apply rotation if present
        if (element.rotation) {
          const centerX = element.x + (element.width || 50) / 2;
          const centerY = element.y + (element.height || 30) / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate((element.rotation * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
        }
        
        if (element.type === 'text') {
          const fontFamily = element.fontFamily || 'Arial, sans-serif';
          const weight = element.fontWeight || 'normal';
          const style = element.fontStyle || 'normal';
          ctx.font = `${style} ${weight} ${element.fontSize}px ${fontFamily}`;
          ctx.fillStyle = element.color || '#000000';
          ctx.textBaseline = 'top';
          ctx.fillText(element.text || '', element.x, element.y);
        } else if (element.type === 'shape') {
          ctx.fillStyle = element.color || '#000000';
          if (element.shape === 'rectangle') {
            ctx.fillRect(element.x, element.y, element.width || 50, element.height || 50);
          } else if (element.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(element.x + (element.width || 50)/2, element.y + (element.height || 50)/2, (element.width || 50)/2, 0, 2 * Math.PI);
            ctx.fill();
          }
        } else if (element.type === 'image' && element.imageData) {
          ctx.drawImage(element.imageData, element.x, element.y, element.width || 100, element.height || 100);
        }
        
        ctx.restore();
      });
  }, [tshirtImage, elements, currentPart, showDesignArea]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Navigate back to tools
  const openDesignTools = () => {
    setLocation('/design-tools');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {TSHIRT_COLORS[currentTshirtColor].name} T-shirt - {TSHIRT_PARTS[currentPart].name} View
        </h1>
        <button
          onClick={openDesignTools}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Design Tools
        </button>
      </div>

      {/* Fixed Canvas Area - No Scroll */}
      <div className="flex-1 flex justify-center items-center p-4" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gray-700 text-white p-4">
            <h3 className="font-semibold text-center">
              Design Canvas - Fixed View
            </h3>
          </div>
          
          {failed ? (
            <div className="w-96 h-96 flex items-center justify-center text-red-500 bg-gray-50">
              <div className="text-center">
                <p className="text-lg mb-2">T-shirt image not found</p>
                <p className="text-sm text-gray-500">Check if images exist in /tshirt-parts/ folder</p>
              </div>
            </div>
          ) : (
            <div className="p-2">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-200 rounded-lg shadow-inner"
                style={{ 
                  width: '600px', 
                  height: '700px', 
                  background: '#2d3748',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
          )}
          
          <div className="bg-gray-700 px-6 py-3 border-t border-gray-600">
            <div className="text-center text-gray-300 text-sm">
              Fixed Design Area • {elements.filter(el => el.tshirtPart === currentPart).length} element{elements.filter(el => el.tshirtPart === currentPart).length !== 1 ? 's' : ''} on {TSHIRT_PARTS[currentPart].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 