import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState, useCallback } from "react";
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
    <section className="relative bg-cover bg-center min-h-screen h-screen flex items-center pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden">
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
      
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col md:flex-row items-center h-full">
          {/* Left text content */}
          <div className="w-full md:w-1/2 md:pl-12 lg:pl-24 text-center md:text-left flex flex-col justify-center">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-block relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_2px_3px_rgba(249,115,22,0.5)]">
                  Unleash Your Passion.
                </span>
                <div className="absolute -right-8 -top-7 text-yellow-400 animate-pulse-slow">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <br />
              <span className={`text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Wear Your Power.
              </span>
            </h1>
            <p className={`mt-6 text-lg text-gray-200 mx-auto md:mx-0 max-w-lg transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Transform your anime fandom into wearable art with our premium customized products featuring your favorite legendary characters and epic designs.
            </p>
            <div className={`mt-8 transition-all duration-1000 delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 inline-flex items-center px-8 py-4 rounded-full shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Link href="/customize">
                  Create Your Design
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* OPTIMIZED Right image container */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 items-center">
            <div
              className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              style={{ marginRight: '0.8cm' }}
            >
              <div className="bg-black/30 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10 shadow-2xl hover:shadow-lg hover:translate-y-[-2px] transition-all duration-500 ease-out max-w-[550px] w-full">
                
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
                        <div className="z-10 flex items-center justify-center bg-gray-800 rounded-lg p-8 text-white">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎨</div>
                            <div className="text-sm">Loading design...</div>
                          </div>
                        </div>
                      )}
                      <img
                        src={carouselImages[currentImageIndex]}
                        alt={`Anime themed product ${currentImageIndex + 1}`}
                        className={`z-10 ${imageLoadError ? 'hidden' : ''}`}
                        style={{ 
                          filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))',
                          width: '360px',
                          maxWidth: 'none',
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <button 
                    onClick={() => { nextImage(); handleUserInteraction(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  {/* Simplified indicator dots */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => { setCurrentImageIndex(index); handleUserInteraction(); }}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                          currentImageIndex === index ? "bg-white" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 md:mt-4 bg-gradient-to-r from-black/70 to-black/60 backdrop-blur-sm p-3 md:p-4 rounded-lg text-white">
                  <p className="font-bold text-base md:text-lg">Limited Edition Designs</p>
                  <p className="text-gray-300 mt-1 text-sm md:text-base">Premium quality prints on multiple products</p>
                  <div className="flex items-center mt-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 rounded-full border-2 border-white bg-gray-800"
                          style={{ 
                            backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`,
                            backgroundSize: 'cover',
                            transform: `translateX(${i * 5}px)` 
                          }}
                        />
                      ))}
                    </div>
                    <span className="ml-4 text-sm text-gray-300">250+ customers</span>
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