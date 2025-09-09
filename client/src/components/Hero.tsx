import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Anime Background with Characters */}
      <div className="absolute inset-0 z-0">
        {/* Main background with anime characters - using the Viewport image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/tshirts-new/Viewport image.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Overlay with anime-themed colors matching the reference */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-red-500/10 to-blue-500/8" />
        
        {/* Removed subtle T-shirt overlays for a cleaner hero background */}
        
        {/* Animated particles/effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-red-500/10 rounded-full blur-lg animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-2000" />
        </div>
      </div>

      <div className="container mx-auto px-8 lg:px-16 xl:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between min-h-[85vh] py-12 pt-20 gap-8 lg:gap-4">
          
          {/* Left Content - Main Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0 lg:pr-4">
            <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-1 sm:mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_2px_3px_rgba(249,115,22,0.5)]">
                  Unleash Your
                </span>
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_2px_3px_rgba(249,115,22,0.5)]">
                  Passion.
                </span>
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Wear Your
                </span>
              </div>
              <div>
                <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Power.
                </span>
              </div>
            </h1>
            
            <p className={`mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base text-gray-200 max-w-lg mx-auto lg:mx-0 transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Transform your anime fandom into wearable art with our premium customized products featuring your favorite legendary characters and epic designs.
            </p>
            
            <div className={`mt-5 sm:mt-6 md:mt-8 transition-all duration-1000 delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-0.5 transition-all duration-300 text-sm sm:text-base"
              >
                <Link href="/customize">
                  Create Your Design
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Featured Product Panel */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className={`relative transition-all duration-1000 delay-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              {/* Featured Product Panel - Matching reference styling */}
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-3 sm:p-5 shadow-2xl max-w-xs sm:max-w-sm w-full">
                
                {/* Product Image */}
                <div className="relative mb-2.5 sm:mb-3.5">
                  <div className="aspect-square bg-black rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="/tshirts-new/10.png"
                      alt="Featured Anime T-Shirt - Shanks Design"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/tshirts-new/10.jpg";
                      }}
                    />
                  </div>
                  
                  {/* Navigation Dots */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((dot, index) => (
                      <div
                        key={dot}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === 0 ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm sm:text-base mb-1">Limited Edition Designs</h3>
                  <p className="text-gray-300 text-[11px] sm:text-xs mb-2">Premium quality prints on multiple products</p>
                  
                  {/* Customer Testimonials */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex -space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white bg-gray-600"
                          style={{
                            backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
                            backgroundSize: 'cover',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-white text-[11px] sm:text-xs ml-2">+250+ customers</span>
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