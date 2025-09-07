import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface TshirtDesign {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

interface AnimatedTshirtShowcaseProps {
  designs: TshirtDesign[];
  autoPlay?: boolean;
  interval?: number;
}

export default function AnimatedTshirtShowcase({ 
  designs, 
  autoPlay = true, 
  interval = 2000 
}: AnimatedTshirtShowcaseProps) {
  const [currentDesignIndex, setCurrentDesignIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate designs
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setCurrentDesignIndex((prev) => (prev + 1) % designs.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, interval, designs.length]);

  const nextDesign = () => {
    setCurrentDesignIndex((prev) => (prev + 1) % designs.length);
  };

  const prevDesign = () => {
    setCurrentDesignIndex((prev) => (prev - 1 + designs.length) % designs.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentDesign = designs[currentDesignIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
              {/* Main T-Shirt Display */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden tshirt-showcase showcase-element"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        {/* T-Shirt Base */}
        <div className="relative w-full h-[600px] bg-gradient-to-b from-gray-50 to-gray-100">
          {/* T-Shirt Silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-96">
              {/* T-Shirt Shape */}
              <div className="absolute inset-0 bg-white rounded-t-full shadow-lg border-2 border-gray-200"></div>
              
              {/* Neck */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white rounded-b-full border-2 border-gray-200"></div>
              
              {/* Sleeves */}
              <div className="absolute top-8 left-0 w-12 h-24 bg-white rounded-r-full border-2 border-gray-200"></div>
              <div className="absolute top-8 right-0 w-12 h-24 bg-white rounded-l-full border-2 border-gray-200"></div>
              
              {/* Dynamic Design on Chest */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 h-48">
                <div className="relative w-full h-full">
                  {/* Design Image */}
                  <img
                    key={currentDesign.id}
                    src={currentDesign.imageUrl}
                    alt={currentDesign.name}
                    className="w-full h-full object-contain transition-all duration-500 ease-in-out design-transition"
                    style={{
                      animation: isPlaying ? 'design-pulse 2s infinite' : 'none'
                    }}
                  />
                  
                  {/* Design Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">{currentDesign.name}</h3>
            <div className="flex flex-wrap gap-2">
              {currentDesign.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 px-3 py-1 rounded-full text-sm tag-animation showcase-element"
                  style={{ '--tag-index': index } as React.CSSProperties}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={togglePlayPause}
            className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors showcase-button"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={prevDesign}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors showcase-button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextDesign}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors showcase-button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            {designs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDesignIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentDesignIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Design Thumbnails */}
      <div className="mt-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {designs.map((design, index) => (
            <button
              key={design.id}
              onClick={() => setCurrentDesignIndex(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentDesignIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-110' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 