import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import heroBgImage from "@assets/Viewport image.png";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Smart image loading - try PNG first, fallback to JPG if needed
  const carouselImages = [
    "/tshirts-new/9.png",   // Sukuna (PNG with transparent background)
    "/tshirts-new/10.png",  // Shanks (PNG with transparent background)
    "/tshirts-new/11.png",  // Frieza (PNG with transparent background)
    "/tshirts-new/12.png",  // Naruto (PNG with transparent background)
    "/tshirts-new/13.png",  // Additional (PNG with transparent background)
    "/tshirts-new/14.png",  // Additional (PNG with transparent background)
  ];
  
  // JPG fallbacks for when PNG fails
  const jpgFallbacks = [
    "/tshirts-new/9.jpg",
    "/tshirts-new/10.jpg", 
    "/tshirts-new/11.jpg",
    "/tshirts-new/12.jpg",
    "/tshirts-new/13.jpg",
    "/tshirts-new/14.jpg"
  ];
  
  const nextImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);
  
  const prevImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, [carouselImages.length]);
  
  // OPTIMIZED: Slower auto-rotation for better performance
  useEffect(() => {
    if (isUserInteracting) return;
    
    const timer = setInterval(() => {
      nextImage();
    }, 4000); // 4 seconds rotation
    
    return () => clearInterval(timer);
  }, [nextImage, isUserInteracting]);
  
  const handleUserInteraction = () => {
    setIsUserInteracting(true);
    setTimeout(() => setIsUserInteracting(false), 15000);
  };
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-cover bg-center min-h-screen flex items-start pt-20 md:pt-24 pb-8 md:pb-10 overflow-hidden">
      {/* OPTIMIZED Background - removed fixed attachment */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${heroBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      {/* Simplified gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/8 via-red-500/6 to-blue-500/8"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center pt-8 md:pt-12">
          {/* Left text content - positioned under navigation */}
          <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-16 text-center lg:text-left order-2 lg:order-1">
            <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_2px_3px_rgba(249,115,22,0.5)]">
                  Unleash Your Passion.
                </span>
                <div className="absolute -right-6 -top-5 text-yellow-400 animate-pulse-slow">
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
              <br />
              <span className={`text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Wear Your Power.
              </span>
            </h1>
            <p className={`mt-4 md:mt-6 text-base md:text-lg text-gray-200 mx-auto lg:mx-0 max-w-lg transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Transform your anime fandom into wearable art with our premium customized products featuring your favorite legendary characters and epic designs.
            </p>
            <div className={`mt-6 md:mt-8 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 inline-flex items-center px-6 md:px-8 py-3 md:py-4 rounded-full shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/customize">
                  Create Your Design
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* OPTIMIZED Right image container */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0 items-center order-1 lg:order-2">
            <div
              className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              style={{ marginRight: '0.5rem' }}
            >
              <div className="bg-black/30 backdrop-blur-md p-3 md:p-4 lg:p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-lg hover:translate-y-[-2px] transition-all duration-500 ease-out max-w-[400px] md:max-w-[500px] lg:max-w-[550px] w-full">
                
                {/* OPTIMIZED Image Carousel - Only show current image */}
                <div 
                  className="relative overflow-hidden rounded-3xl aspect-square group" 
                  style={{ boxShadow: '0 0 20px rgba(0,0,0,0.15)' }}
                  onMouseEnter={handleUserInteraction}
                  onTouchStart={handleUserInteraction}
                >
                  {/* Simplified background */}
                  <div className="absolute inset-0 bg-black/5 overflow-hidden rounded-3xl">
                    <div className="w-full h-full opacity-5 bg-gradient-to-br from-white/3 to-transparent"></div>
                  </div>
                  
                  {/* OPTIMIZED: Only render current image to prevent multiple loading */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-900/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {imageLoadError && (
                        <div className="z-10 flex items-center justify-center bg-gray-800 rounded-lg p-6 md:p-8 text-white">
                          <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2">🎨</div>
                            <div className="text-xs md:text-sm">Loading design...</div>
                          </div>
                        </div>
                      )}
                      <img
                        src={carouselImages[currentImageIndex]}
                        alt={`Anime themed product ${currentImageIndex + 1}`}
                        className={`z-10 ${imageLoadError ? 'hidden' : ''}`}
                        style={{ 
                          filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))',
                          width: '100%',
                          maxWidth: '320px',
                          height: 'auto',
                          transition: 'opacity 0.5s ease'
                        }}
                        loading="lazy"
                        onError={(e) => {
                          console.warn('Failed to load image:', carouselImages[currentImageIndex]);
                          setImageLoadError(true);
                          // Only fallback to JPG after multiple PNG failures
                          const img = e.target as HTMLImageElement;
                          const retryCount = parseInt(img.dataset.retryCount || '0');
                          
                          if (img.src.includes('.png') && retryCount < 2) {
                            // Retry PNG with a small delay
                            img.dataset.retryCount = (retryCount + 1).toString();
                            setTimeout(() => {
                              img.src = img.src; // Retry the same PNG
                            }, 1000);
                          } else if (img.src.includes('.png')) {
                            // After 2 PNG retries, try JPG
                            img.src = img.src.replace('.png', '.jpg');
                            img.dataset.retryCount = '0';
                          } else if (img.src.includes('.jpg')) {
                            // If JPG also fails, try a different JPG image
                            const randomIndex = Math.floor(Math.random() * jpgFallbacks.length);
                            img.src = jpgFallbacks[randomIndex];
                          }
                        }}
                        onLoad={() => setImageLoadError(false)}
                      />
                    </div>
                  </div>
                  
                  {/* Navigation arrows */}
                  <button 
                    onClick={() => { prevImage(); handleUserInteraction(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={14} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  
                  <button 
                    onClick={() => { nextImage(); handleUserInteraction(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={14} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  
                  {/* Simplified indicator dots */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => { setCurrentImageIndex(index); handleUserInteraction(); }}
                        className={`w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${
                          currentImageIndex === index ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-2 md:mt-3 lg:mt-4 bg-gradient-to-r from-black/70 to-black/60 backdrop-blur-sm p-2 md:p-3 lg:p-4 rounded-lg text-white">
                  <p className="font-bold text-sm md:text-base lg:text-lg">Limited Edition Designs</p>
                  <p className="text-gray-300 mt-1 text-xs md:text-sm lg:text-base">Premium quality prints on multiple products</p>
                  <div className="flex items-center mt-1 md:mt-2">
                    <div className="flex -space-x-1 md:-space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white bg-gray-800"
                          style={{ 
                            backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`,
                            backgroundSize: 'cover',
                            transform: `translateX(${i * 3}px)` 
                          }}
                        />
                      ))}
                    </div>
                    <span className="ml-2 md:ml-4 text-xs md:text-sm text-gray-300">250+ customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}