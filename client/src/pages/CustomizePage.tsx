//jai sheree ram
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Upload, Palette, Type, Square, Circle, Move, RotateCw, Trash2, Download, Plus, Minus, Undo, Redo, Copy, Layers, Eye, EyeOff, RotateCcw } from 'lucide-react';

const TSHIRT_PARTS = [
  { name: 'Front', image: '/tshirt-parts/front.png' },
  { name: 'Back', image: '/tshirt-parts/back.png' },
  { name: 'Left Sleeve', image: '/tshirt-parts/leftsleeve.png' },
  { name: 'Right Sleeve', image: '/tshirt-parts/rightsleeve.png' }
];

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

// Define design areas for each T-shirt part (in canvas coordinates)
const DESIGN_AREAS = {
  0: { x: 200, y: 200, width: 200, height: 280 }, // Front - center chest area (moved up)
  1: { x: 200, y: 200, width: 200, height: 280 }, // Back - center back area (moved up)
  2: { x: 300, y: 210, width: 50, height: 80 },   // Left Sleeve - moved slightly down
  3: { x: 260, y: 220, width: 50, height: 80 }    // Right Sleeve - positioned correctly
};

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

export default function TShirtCustomizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [currentPart, setCurrentPart] = useState(0);
  const [currentTshirtColor, setCurrentTshirtColor] = useState(0); // Index of selected color
  const [tshirtImage, setTshirtImage] = useState<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  
  // Editing state
  const [tool, setTool] = useState('move');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [editingTextValue, setEditingTextValue] = useState('');
  
  // Canvas elements and history
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  
  // Undo/Redo system
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // UI state
  const [showLayers, setShowLayers] = useState(false);
  const [showDesignArea, setShowDesignArea] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Save to history
  const saveToHistory = useCallback((newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      setSelectedElement(null);
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      setSelectedElement(null);
    }
  };

  // Load T-shirt image based on selected color and part
  useEffect(() => {
    const selectedColor = TSHIRT_COLORS[currentTshirtColor];
    const selectedPart = TSHIRT_PARTS[currentPart];
    
    const image = new Image();
    // Create path: /tshirt-colors/{color}/{part}.png
    const imagePath = `/tshirt-colors/${selectedColor.folder}/${selectedPart.name.toLowerCase().replace(' ', '-')}.png`;
    image.src = imagePath;
    
    image.onload = () => {
      setTshirtImage(image);
      setFailed(false);
    };
    image.onerror = () => {
      // Fallback to white color if specific color doesn't exist
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

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add to cart function
  const addToCart = () => {
    // You can implement your cart logic here
    alert('Item added to cart! 🛒');
  };

  // Share on WhatsApp function
  const shareOnWhatsApp = () => {
    const phoneNumber = '+919266767693';
    const message = encodeURIComponent('Hi! I would like to order this custom t-shirt design. Can you help me with the pricing and delivery details?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Check if coordinates are within design area
  const isWithinDesignArea = (x: number, y: number, width: number, height: number, tshirtPart: number) => {
    const area = DESIGN_AREAS[tshirtPart as keyof typeof DESIGN_AREAS];
    if (!area) return false;
    
    return (
      x >= area.x &&
      y >= area.y &&
      x + width <= area.x + area.width &&
      y + height <= area.y + area.height
    );
  };

  // Check if click is within design area
  const isClickWithinDesignArea = (x: number, y: number) => {
    const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];
    if (!area) return false;
    
    return (
      x >= area.x &&
      y >= area.y &&
      x <= area.x + area.width &&
      y <= area.y + area.height
    );
  };

  // Update text content
  const updateTextContent = (elementId: string, newText: string) => {
    const newElements = elements.map(el => {
      if (el.id === elementId && el.type === 'text') {
        // Update text and recalculate width
        const newWidth = newText.length * (el.fontSize || 24) * 0.6;
        return { ...el, text: newText, width: newWidth };
      }
      return el;
    });
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Start editing text
  const startEditingText = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element && element.type === 'text') {
      setEditingText(elementId);
      setEditingTextValue(element.text || '');
    }
  };

  // Finish editing text
  const finishEditingText = () => {
    if (editingText && editingTextValue.trim()) {
      updateTextContent(editingText, editingTextValue.trim());
    }
    setEditingText(null);
    setEditingTextValue('');
  };

  // Constrain element to design area (except text elements)
  const constrainToDesignArea = (element: Element) => {
    // NEVER constrain text elements - let them be placed anywhere
    if (element.type === 'text') {
      return element;
    }
    const area = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
    if (!area) return element;
    const width = element.width || 100;
    const height = element.height || 30;
    let x = Math.max(area.x, Math.min(element.x, area.x + area.width - width));
    let y = Math.max(area.y, Math.min(element.y, area.y + area.height - height));
    return { ...element, x, y };
  };

  // Constrain resize to design area
  const constrainResizeToDesignArea = (element: Element, newWidth: number, newHeight: number) => {
    if (element.type === 'text') {
      return { width: newWidth, height: newHeight };
    }
    const area = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
    if (!area) return { width: newWidth, height: newHeight };
    
    // Ensure the element doesn't exceed design area bounds
    const maxWidth = area.width;
    const maxHeight = area.height;
    const constrainedWidth = Math.min(newWidth, maxWidth);
    const constrainedHeight = Math.min(newHeight, maxHeight);
    
    // Ensure minimum size
    const minSize = 20;
    const finalWidth = Math.max(constrainedWidth, minSize);
    const finalHeight = Math.max(constrainedHeight, minSize);
    
    return { width: finalWidth, height: finalHeight };
  };

  const addTextExample = (example: typeof TEXT_EXAMPLES[0]) => {
    // Place text freely without any constraints
    const canvas = canvasRef.current;
    if (!canvas) return;
    const newElement: Element = {
      id: generateId(),
      type: 'text',
      text: example.text,
      x: 100, // Fixed starting position
      y: 150, // Fixed starting position  
      color: example.color,
      fontSize: example.size,
      fontFamily: example.font,
      fontWeight: example.weight,
      fontStyle: 'normal',
      width: example.text.length * example.size * 0.6,
      height: example.size,
      rotation: 0,
      visible: true,
      tshirtPart: currentPart
    };
    // Add directly without any constraint function calls
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement.id);
    setTool('move'); // Switch to move tool
    setShowDesignArea(false); // Don't show design area for predefined text
  };

  const addClipart = (clipartPath: string) => {
    const img = new window.Image();
    img.onload = () => {
      const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];
      
      // Calculate optimal initial size based on design area
      const maxWidth = area.width * 0.6; // 60% of design area width
      const maxHeight = area.height * 0.6; // 60% of design area height
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      
      // Calculate size maintaining aspect ratio
      let width, height;
      if (aspectRatio > 1) {
        // Landscape image
        width = Math.min(maxWidth, maxHeight * aspectRatio);
        height = width / aspectRatio;
      } else {
        // Portrait image
        height = Math.min(maxHeight, maxWidth / aspectRatio);
        width = height * aspectRatio;
      }
      
      // Ensure minimum size
      const minSize = 40;
      if (width < minSize) {
        width = minSize;
        height = minSize / aspectRatio;
      }
      if (height < minSize) {
        height = minSize;
        width = minSize * aspectRatio;
      }
      
      // Center the clipart in the design area
      const x = area.x + (area.width - width) / 2;
      const y = area.y + (area.height - height) / 2;
      
      const newElement: Element = {
        id: generateId(),
        type: 'image',
        imageData: img,
        x: x,
        y: y,
        width: width,
        height: height,
        rotation: 0,
        visible: true,
        tshirtPart: currentPart
      };
      
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElement(newElement.id);
      setTool('move'); // Auto-switch to move tool
      setShowDesignArea(true); // Ensure design area is visible
    };
    img.onerror = () => {
      console.error('Failed to load clipart:', clipartPath);
    };
    img.src = clipartPath;
  };

  // Improved resize detection with better handle sizes
  const getResizeDirection = (x: number, y: number, element: Element) => {
    const handleSize = 20; // Increased handle size for better touch
    const width = element.width || 100;
    const height = element.height || 30;
    const ex = element.x;
    const ey = element.y;

    // Corner handles - larger detection area
    if (x >= ex - handleSize && x <= ex + handleSize && y >= ey - handleSize && y <= ey + handleSize) return 'nw';
    if (x >= ex + width - handleSize && x <= ex + width + handleSize && y >= ey - handleSize && y <= ey + handleSize) return 'ne';
    if (x >= ex - handleSize && x <= ex + handleSize && y >= ey + height - handleSize && y <= ey + height + handleSize) return 'sw';
    if (x >= ex + width - handleSize && x <= ex + width + handleSize && y >= ey + height - handleSize && y <= ey + height + handleSize) return 'se';

    // Edge handles - larger detection area
    if (x >= ex - handleSize && x <= ex + width + handleSize && y >= ey - handleSize && y <= ey + handleSize) return 'n';
    if (x >= ex - handleSize && x <= ex + width + handleSize && y >= ey + height - handleSize && y <= ey + height + handleSize) return 's';
    if (x >= ex - handleSize && x <= ex + handleSize && y >= ey - handleSize && y <= ey + height + handleSize) return 'w';
    if (x >= ex + width - handleSize && x <= ex + width + handleSize && y >= ey - handleSize && y <= ey + height + handleSize) return 'e';

    return null;
  };

  // Check if cursor is over rotation handle with larger detection area
  const isOverRotationHandle = (x: number, y: number, element: Element) => {
    const centerX = element.x + (element.width || 100) / 2;
    const centerY = element.y - 35; // Slightly higher for better touch
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= 15; // Larger detection radius
  };

  // Maintain aspect ratio during resizing for images
  const maintainAspectRatio = (element: Element, newWidth: number, newHeight: number, direction: string) => {
    if (element.type !== 'image' || !element.imageData) {
      return { width: newWidth, height: newHeight };
    }
    
    const aspectRatio = element.imageData.naturalWidth / element.imageData.naturalHeight;
    const originalWidth = element.width || 100;
    const originalHeight = element.height || 100;
    
    // Determine which dimension to use as reference based on resize direction
    let referenceWidth = newWidth;
    let referenceHeight = newHeight;
    
    if (direction.includes('n') || direction.includes('s')) {
      // Vertical resize - use height as reference
      referenceHeight = newHeight;
      referenceWidth = referenceHeight * aspectRatio;
    } else if (direction.includes('e') || direction.includes('w')) {
      // Horizontal resize - use width as reference
      referenceWidth = newWidth;
      referenceHeight = referenceWidth / aspectRatio;
    } else {
      // Corner resize - use the dimension that changed more
      const widthChange = Math.abs(newWidth - originalWidth);
      const heightChange = Math.abs(newHeight - originalHeight);
      
      if (widthChange > heightChange) {
        referenceWidth = newWidth;
        referenceHeight = referenceWidth / aspectRatio;
      } else {
        referenceHeight = newHeight;
        referenceWidth = referenceHeight * aspectRatio;
      }
    }
    
    return { width: referenceWidth, height: referenceHeight };
  };

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tshirtImage) return;
    
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw background - remove extra white space
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2d3748'; // Dark gray background instead of white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw T-shirt with better zoom and positioning
    const scale = Math.min(canvas.width / tshirtImage.naturalWidth, canvas.height / tshirtImage.naturalHeight) * 0.95; // Increased scale from 0.8 to 0.95
    const x = (canvas.width - tshirtImage.naturalWidth * scale) / 2;
    const y = (canvas.height - tshirtImage.naturalHeight * scale) / 2;
    
        ctx.drawImage(tshirtImage, x, y, tshirtImage.naturalWidth * scale, tshirtImage.naturalHeight * scale);
    
    // Draw design area outline
    const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];
    if (area) {
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
          const fontFamily = element.fontFamily || selectedFont.family;
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
        
        // Draw selection controls
        if (selectedElement === element.id) {
          const width = element.width || 100;
          const height = element.height || 30;
          
          // Selection outline with improved visibility
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(element.x - 3, element.y - 3, width + 6, height + 6);
          ctx.setLineDash([]);
          
          // Resize handles - larger and more visible
          ctx.fillStyle = '#3b82f6';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          
          const handleSize = 16; // Larger handles for better touch
          const handles = [
            { x: element.x - handleSize/2, y: element.y - handleSize/2 }, // nw
            { x: element.x + width/2 - handleSize/2, y: element.y - handleSize/2 }, // n
            { x: element.x + width - handleSize/2, y: element.y - handleSize/2 }, // ne
            { x: element.x + width - handleSize/2, y: element.y + height/2 - handleSize/2 }, // e
            { x: element.x + width - handleSize/2, y: element.y + height - handleSize/2 }, // se
            { x: element.x + width/2 - handleSize/2, y: element.y + height - handleSize/2 }, // s
            { x: element.x - handleSize/2, y: element.y + height - handleSize/2 }, // sw
            { x: element.x - handleSize/2, y: element.y + height/2 - handleSize/2 }, // w
          ];

          handles.forEach((handle, index) => {
            // Add different colors for corner vs edge handles
            if (index < 4) {
              // Corner handles - blue
              ctx.fillStyle = '#3b82f6';
            } else {
              // Edge handles - lighter blue
              ctx.fillStyle = '#60a5fa';
            }
            
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
            ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
            
            // Add small dots in center for better visibility
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(handle.x + handleSize/2, handle.y + handleSize/2, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
          
          // Rotation handle with improved visibility
          const rotationX = element.x + width / 2 - 10;
          const rotationY = element.y - 40; // Higher position for better access
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(rotationX + 10, rotationY + 10, 12, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          
          // Rotation icon with better visibility
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(rotationX + 10, rotationY + 10, 6, 0, 1.5 * Math.PI);
          ctx.stroke();
          // Arrow
          ctx.beginPath();
          ctx.moveTo(rotationX + 16, rotationY + 4);
          ctx.lineTo(rotationX + 14, rotationY + 2);
          ctx.moveTo(rotationX + 16, rotationY + 4);
          ctx.lineTo(rotationX + 14, rotationY + 6);
          ctx.stroke();
          
          // Add aspect ratio indicator for images
          if (element.type === 'image' && element.imageData) {
            ctx.fillStyle = '#059669';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Aspect Locked', element.x + width/2, element.y - 5);
          }
        }
      });
  }, [tshirtImage, elements, selectedElement, currentPart]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle canvas mouse down
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];

    // Show design area when using design tools (except text) or clicking within area
    if ((tool !== 'move' && tool !== 'text') || (isClickWithinDesignArea(x, y) && tool !== 'text')) {
      setShowDesignArea(true);
    } else {
      setShowDesignArea(false);
    }

    if (tool === 'text' && text.trim()) {
      // For text, allow placement anywhere on canvas (no design area constraint)
      const textWidth = text.length * fontSize * 0.6;
      const textHeight = fontSize;
      // Allow text placement anywhere on canvas
      let textX = Math.max(10, Math.min(x, canvas.width - textWidth - 10));
      let textY = Math.max(10, Math.min(y, canvas.height - textHeight - 10));
      
      const newElement: Element = {
        id: generateId(),
        type: 'text',
        text: text,
        x: textX,
        y: textY,
        color: selectedColor,
        fontSize: fontSize,
        fontFamily: selectedFont.family,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        width: textWidth,
        height: textHeight,
        rotation: 0,
        visible: true,
        tshirtPart: currentPart
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setText('');
      setSelectedElement(newElement.id); // Auto-select the new text
      setTool('move'); // Switch to move tool for easy editing
      setShowDesignArea(false); // Don't show design area for text
    } else if (tool === 'move') {
      // Check for rotation handle first
      if (selectedElement) {
        const element = elements.find(el => el.id === selectedElement);
        if (element && isOverRotationHandle(x, y, element)) {
          setIsRotating(true);
          setDragStart({x, y});
          return;
        }
      }
      // Check for resize handles
      if (selectedElement) {
        const element = elements.find(el => el.id === selectedElement);
        if (element) {
          const direction = getResizeDirection(x, y, element);
          if (direction) {
            setResizeDirection(direction);
            setIsResizing(true);
            setIsDragging(false);
            setDragStart({x, y});
            return;
          }
        }
      }
      // Select element and prepare for dragging
      let found = false;
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (
          element.visible !== false &&
          element.tshirtPart === currentPart &&
          x >= element.x && x <= element.x + (element.width || 100) &&
          y >= element.y && y <= element.y + (element.height || 30)
        ) {
          setSelectedElement(element.id);
          setDragStart({x: x - element.x, y: y - element.y});
          setIsDragging(true);
          setIsResizing(false);
          setIsRotating(false);
          setResizeDirection(null);
          // Only show design area for non-text elements
          if (element.type !== 'text') {
            if (!isClickWithinDesignArea(x, y)) {
              setShowDesignArea(false);
            } else {
              setShowDesignArea(true);
            }
          } else {
            setShowDesignArea(false);
          }
          found = true;
          break;
        }
      }
      if (!found) {
        setSelectedElement(null);
        setIsDragging(false);
        setIsResizing(false);
        setIsRotating(false);
        setResizeDirection(null);
      }
    }
  };

  // Handle mouse move for dragging/resizing/rotating
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'move' || selectedElement === null || !dragStart) return;
    if (!isDragging && !isResizing && !isRotating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (isRotating) {
      // Handle rotation with improved precision
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        const centerX = element.x + (element.width || 100) / 2;
        const centerY = element.y + (element.height || 30) / 2;
        const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 90;
        
        const newElements = elements.map(el => 
          el.id === selectedElement ? { ...el, rotation: angle } : el
        );
        setElements(newElements);
      }
    } else if (isResizing && resizeDirection) {
      // Handle resizing with aspect ratio maintenance
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      const newElements = elements.map((element) => {
        if (element.id === selectedElement) {
          const newElement = { ...element };
          const minSize = 20;
          
          // Calculate new dimensions based on resize direction
          let newWidth = element.width || 100;
          let newHeight = element.height || 30;
          let newX = element.x;
          let newY = element.y;
          
          switch (resizeDirection) {
            case 'nw':
              newWidth = Math.max(minSize, (element.width || 100) - deltaX);
              newHeight = Math.max(minSize, (element.height || 30) - deltaY);
              newX = element.x + deltaX;
              newY = element.y + deltaY;
              break;
            case 'n':
              newHeight = Math.max(minSize, (element.height || 30) - deltaY);
              newY = element.y + deltaY;
              break;
            case 'ne':
              newWidth = Math.max(minSize, (element.width || 100) + deltaX);
              newHeight = Math.max(minSize, (element.height || 30) - deltaY);
              newY = element.y + deltaY;
              break;
            case 'e':
              newWidth = Math.max(minSize, (element.width || 100) + deltaX);
              break;
            case 'se':
              newWidth = Math.max(minSize, (element.width || 100) + deltaX);
              newHeight = Math.max(minSize, (element.height || 30) + deltaY);
              break;
            case 's':
              newHeight = Math.max(minSize, (element.height || 30) + deltaY);
              break;
            case 'sw':
              newWidth = Math.max(minSize, (element.width || 100) - deltaX);
              newHeight = Math.max(minSize, (element.height || 30) + deltaY);
              newX = element.x + deltaX;
              break;
            case 'w':
              newWidth = Math.max(minSize, (element.width || 100) - deltaX);
              newX = element.x + deltaX;
              break;
          }
          
          // Maintain aspect ratio for images
          if (element.type === 'image' && element.imageData) {
            const aspectRatioResult = maintainAspectRatio(element, newWidth, newHeight, resizeDirection);
            newWidth = aspectRatioResult.width;
            newHeight = aspectRatioResult.height;
            
            // Adjust position for corner resizing to maintain aspect ratio
            if (resizeDirection.includes('w')) {
              newX = element.x + (element.width || 100) - newWidth;
            }
            if (resizeDirection.includes('n')) {
              newY = element.y + (element.height || 30) - newHeight;
            }
          }
          
          // For text elements, adjust font size proportionally
          if (element.type === 'text' && element.fontSize) {
            const originalWidth = element.width || 100;
            const scaleFactor = newWidth / originalWidth;
            newElement.fontSize = Math.max(8, Math.round(element.fontSize * scaleFactor));
          }
          
          // Constrain resize to design area
          const constrainedSize = constrainResizeToDesignArea(element, newWidth, newHeight);
          newWidth = constrainedSize.width;
          newHeight = constrainedSize.height;
          
          // Update element properties
          newElement.width = newWidth;
          newElement.height = newHeight;
          newElement.x = newX;
          newElement.y = newY;
          
          // Only constrain non-text elements to design area
          if (element.type !== 'text') {
            return constrainToDesignArea(newElement);
          }
          return newElement;
        }
        return element;
      });
      setElements(newElements);
      setDragStart({x, y});
    } else {
      // Handle dragging with improved precision
      const newElements = elements.map((element) => {
        if (element.id === selectedElement) {
          const newX = x - dragStart.x;
          const newY = y - dragStart.y;
          
          // Separate handling for text vs other elements
          if (element.type === 'text') {
            const textWidth = element.width || 100;
            const textHeight = element.height || 30;
            // Keep text within canvas bounds only (not design area)
            const constrainedX = Math.max(5, Math.min(newX, canvas.width - textWidth - 5));
            const constrainedY = Math.max(5, Math.min(newY, canvas.height - textHeight - 5));
            return {
              ...element,
              x: constrainedX,
              y: constrainedY
            };
          } else {
            // Images and shapes use design area constraints
            const newElement = { ...element, x: newX, y: newY };
            return constrainToDesignArea(newElement);
          }
        }
        return element;
      });
      setElements(newElements);
    }
    
    // Update cursor based on what we're hovering over
    if (selectedElement && !isResizing && !isRotating) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        if (isOverRotationHandle(x, y, element)) {
          canvas.style.cursor = 'grab';
        } else {
          const direction = getResizeDirection(x, y, element);
          if (direction) {
            const cursors: { [key: string]: string } = {
              'nw': 'nw-resize', 'n': 'n-resize', 'ne': 'ne-resize',
              'e': 'e-resize', 'se': 'se-resize', 's': 's-resize',
              'sw': 'sw-resize', 'w': 'w-resize'
            };
            canvas.style.cursor = cursors[direction] || 'default';
          } else {
            canvas.style.cursor = 'move';
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (dragStart && selectedElement && (isDragging || isResizing || isRotating)) {
      saveToHistory(elements);
    }
    setDragStart(null);
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeDirection(null);
  };

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const area = DESIGN_AREAS[currentPart as keyof typeof DESIGN_AREAS];
        
        // Calculate optimal size based on design area
        const maxWidth = area.width * 0.7; // 70% of design area width
        const maxHeight = area.height * 0.7; // 70% of design area height
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        // Calculate size maintaining aspect ratio
        let width, height;
        if (aspectRatio > 1) {
          // Landscape image
          width = Math.min(maxWidth, maxHeight * aspectRatio);
          height = width / aspectRatio;
        } else {
          // Portrait image
          height = Math.min(maxHeight, maxWidth / aspectRatio);
          width = height * aspectRatio;
        }
        
        // Ensure minimum size
        const minSize = 50;
        if (width < minSize) {
          width = minSize;
          height = minSize / aspectRatio;
        }
        if (height < minSize) {
          height = minSize;
          width = minSize * aspectRatio;
        }

        const newElement: Element = {
          id: generateId(),
          type: 'image',
          imageData: img,
          x: area.x + (area.width - width) / 2,
          y: area.y + (area.height - height) / 2,
          width: width,
          height: height,
          rotation: 0,
          visible: true,
          tshirtPart: currentPart
        };
        
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
        setSelectedElement(newElement.id);
        setTool('move'); // Auto-switch to move tool
        setShowDesignArea(true); // Ensure design area is visible
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Delete selected element
  const deleteSelected = () => {
    if (selectedElement !== null) {
      const newElements = elements.filter((el) => el.id !== selectedElement);
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedElement(null);
    }
  };

  // Duplicate selected element
  const duplicateSelected = () => {
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        let newElement: Element;
        if (element.type === 'text') {
          // For text, duplicate with offset and NO constraints
          newElement = { 
            ...element, 
            id: generateId(), 
            x: element.x + 20, 
            y: element.y + 20,
            tshirtPart: currentPart
          };
        } else {
          // For non-text elements, apply design area constraint
          newElement = constrainToDesignArea({ 
            ...element, 
            id: generateId(), 
            x: element.x + 20, 
            y: element.y + 20,
            tshirtPart: currentPart
          });
        }
        const newElements = [...elements, newElement];
        setElements(newElements);
        saveToHistory(newElements);
        setSelectedElement(newElement.id);
      }
    }
  };

  // Rotate selected element
  const rotateSelected = (degrees: number) => {
    if (selectedElement) {
      const newElements = elements.map(el => 
        el.id === selectedElement 
          ? { ...el, rotation: (el.rotation || 0) + degrees }
          : el
      );
      setElements(newElements);
      saveToHistory(newElements);
    }
  };

  // Toggle element visibility
  const toggleVisibility = (elementId: string) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, visible: !el.visible } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Bring element to front/back
  const moveElementLayer = (elementId: string, direction: 'front' | 'back') => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return;

    const newElements = [...elements];
    const [element] = newElements.splice(elementIndex, 1);
    
    if (direction === 'front') {
      newElements.push(element);
    } else {
      newElements.unshift(element);
    }
    
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Download canvas
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `tshirt-${TSHIRT_PARTS[currentPart].name.toLowerCase().replace(' ', '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'z' && e.shiftKey || e.key === 'y') {
          e.preventDefault();
          redo();
        } else if (e.key === 'd') {
          e.preventDefault();
          duplicateSelected();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      } else if (e.key === 'r' && selectedElement) {
        rotateSelected(15);
      } else if (e.key === 'R' && selectedElement) {
        rotateSelected(-15);
      } else if (selectedElement) {
        // NEW: Arrow key positioning for fine control
        const element = elements.find(el => el.id === selectedElement);
        if (element) {
          const moveAmount = e.shiftKey ? 10 : 1; // Shift = larger movement
          let newX = element.x;
          let newY = element.y;
          
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              newY -= moveAmount;
              break;
            case 'ArrowDown':
              e.preventDefault();
              newY += moveAmount;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              newX -= moveAmount;
              break;
            case 'ArrowRight':
              e.preventDefault();
              newX += moveAmount;
              break;
            case 'Home':
              e.preventDefault();
              // Center the element in design area
              const area = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
              if (area) {
                newX = area.x + (area.width - (element.width || 100)) / 2;
                newY = area.y + (area.height - (element.height || 30)) / 2;
              }
              break;
            case 'End':
              e.preventDefault();
              // Snap to design area edges
              const designArea = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
              if (designArea) {
                newX = designArea.x + designArea.width - (element.width || 100);
                newY = designArea.y + designArea.height - (element.height || 30);
              }
              break;
            case 'PageUp':
              e.preventDefault();
              // Move to top of design area
              const topArea = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
              if (topArea) {
                newX = topArea.x + (topArea.width - (element.width || 100)) / 2;
                newY = topArea.y;
              }
              break;
            case 'PageDown':
              e.preventDefault();
              // Move to bottom of design area
              const bottomArea = DESIGN_AREAS[element.tshirtPart as keyof typeof DESIGN_AREAS];
              if (bottomArea) {
                newX = bottomArea.x + (bottomArea.width - (element.width || 100)) / 2;
                newY = bottomArea.y + bottomArea.height - (element.height || 30);
              }
              break;
          }
          
          // Apply constraints if needed
          let updatedElement = { ...element, x: newX, y: newY };
          if (element.type !== 'text') {
            updatedElement = constrainToDesignArea(updatedElement);
          }
          
          const newElements = elements.map(el => 
            el.id === selectedElement ? updatedElement : el
          );
          setElements(newElements);
          saveToHistory(newElements);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, selectedElement, elements, history]);

  // Clear selection when changing T-shirt parts
  useEffect(() => {
    setSelectedElement(null);
    setIsResizing(false);
    setIsRotating(false);
    setResizeDirection(null);
    setShowDesignArea(true); // Show design area when switching parts
  }, [currentPart]);

  // Show design area when switching tools
  useEffect(() => {
    if (tool !== 'move') {
      setShowDesignArea(true);
    }
  }, [tool]);

  // When switching selectedElement, only show design area if the selected element is not text
  useEffect(() => {
    const selectedEl = elements.find(el => el.id === selectedElement);
    if (selectedEl && selectedEl.type !== 'text') {
      setShowDesignArea(true);
    } else {
      setShowDesignArea(false);
    }
  }, [selectedElement, elements]);

  return (
    <div className="flex bg-gray-900" style={{ height: 'calc(100vh - 64px)', marginTop: '64px', overflow: 'hidden' }}>
      {/* Left Sidebar - Tools */}
      <div className="w-80 bg-gray-800 shadow-lg overflow-y-auto border-r border-gray-700">
        <div className="p-6">
          {/* Modern Toolbar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Design Studio</h2>
                  <p className="text-xs text-blue-100">Custom T-Shirt Creator</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={undo}
                  disabled={historyIndex === 0}
                  className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex === history.length - 1}
                  className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="bg-gray-700 rounded-lg p-3 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={downloadCanvas}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Download size={14} />
                Save
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
              >
                📱 Share
              </button>
            </div>
          </div>
          
          {/* T-shirt Color Selector */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              T-Shirt Color
            </h3>
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

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              T-Shirt Part
            </h3>
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
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Design Tools
            </h3>
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
                className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium transform hover:scale-105"
              >
                📱 Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Text Input and Settings - always at top if tool === 'text' */}
          {tool === 'text' && (
            <>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  Text Settings
                </h3>
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
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Text Examples
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {TEXT_EXAMPLES.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => addTextExample(example)}
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
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Upload Image
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium transform hover:scale-105"
            >
              <Upload size={20} />
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-2">Images will be auto-sized to fit the design area</p>
          </div>

          {/* Color Picker */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Text Colors
            </h3>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-sm font-medium transform hover:scale-105"
            >
              <Palette size={16} />
              {showColorPicker ? 'Hide' : 'Show'} Color Palette
            </button>
            
            {showColorPicker && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <h3 className="font-semibold mb-3 text-gray-200 text-sm">Text Color</h3>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
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
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
              Cliparts & Graphics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {CLIPARTS.map((clipart, index) => (
                <div
                  key={index}
                  onClick={() => addClipart(clipart.image)}
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
          <div className="bg-gray-700 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold mb-3 text-gray-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Actions & Tools
            </h3>
            <div className="flex gap-2">
              <button
                onClick={duplicateSelected}
                disabled={selectedElement === null}
                className="flex-1 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
              onClick={downloadCanvas}
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
                Layers for {TSHIRT_PARTS[currentPart].name} ({elements.filter(el => el.tshirtPart === currentPart).length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {elements
                  .filter(el => el.tshirtPart === currentPart)
                  .map((element, index) => (
                  <div
                    key={element.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      selectedElement === element.id ? 'border-blue-500 bg-blue-900' : 'border-gray-600 bg-gray-700'
                    }`}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <span className="text-sm truncate flex-1 cursor-pointer text-gray-200">
                      {element.type === 'text' ? element.text || 'Text' : 
                       element.type === 'shape' ? element.shape : 'Image'} #{index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(element.id);
                      }}
                      className="p-1 hover:bg-gray-600 rounded text-gray-300"
                    >
                      {element.visible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex justify-center items-center" style={{ height: '100%' }}>
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" style={{ maxWidth: '90%', maxHeight: '90%' }}>
          <div className="bg-gray-700 text-white p-4">
            <h3 className="font-semibold text-center">
              {TSHIRT_COLORS[currentTshirtColor].name} T-shirt - {TSHIRT_PARTS[currentPart].name} View
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
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="border-2 border-gray-200 rounded-lg shadow-inner cursor-crosshair"
                  style={{ 
                    width: '500px', 
                    height: '600px', 
                    background: '#2d3748',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
            </div>
          )}
          
          <div className="bg-gray-700 px-6 py-3 border-t border-gray-600">
            <div className="text-center text-gray-300 text-sm">
              Use tools to customize • {elements.filter(el => el.tshirtPart === currentPart).length} element{elements.filter(el => el.tshirtPart === currentPart).length !== 1 ? 's' : ''} on {TSHIRT_PARTS[currentPart].name}
            </div>
            {selectedElement && (
              <div className="text-center text-gray-300 text-xs mt-1">
                💡 Press R to rotate 15°, Shift+R to rotate -15°, Del to delete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}