import { useState, useEffect, useCallback, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

type ProductCategory = {
  id: string;
  title: string;
  description: string;
  frontImageUrl: string;
  backImageUrl: string;
  type?: 'tshirt' | 'other';
  price: string;
  rating: number;
  reviews: number;
};

const productCategories: ProductCategory[] = [
  {
    id: "regular",
    title: "Regular T-Shirts",
    description: "Premium cotton tees with anime designs",
    frontImageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    backImageUrl: "https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    type: 'tshirt',
    price: "₹599",
    rating: 4.8,
    reviews: 234
  },
  {
    id: "oversized",
    title: "Oversized T-Shirts",
    description: "Relaxed fit tees for maximum comfort",
    frontImageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    backImageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    type: 'tshirt',
    price: "₹699",
    rating: 4.9,
    reviews: 189
  },
  {
    id: "polo",
    title: "Polo T-Shirts",
    description: "Elegant polos with embroidered designs",
    frontImageUrl: "https://images.unsplash.com/photo-1589831377283-33cb1cc6bd5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    backImageUrl: "https://images.unsplash.com/photo-1588117305388-c2631a279f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    type: 'tshirt',
    price: "₹799",
    rating: 4.7,
    reviews: 156
  },
  {
    id: "phone-covers",
    title: "Phone Covers",
    description: "Durable cases with anime artwork",
    frontImageUrl: "https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    backImageUrl: "https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    type: 'other',
    price: "₹399",
    rating: 4.6,
    reviews: 312
  },
  {
    id: "plates",
    title: "Plates",
    description: "Ceramic plates with anime designs",
    frontImageUrl: "https://images.pexels.com/photos/6373307/pexels-photo-6373307.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
    backImageUrl: "https://images.pexels.com/photos/5702993/pexels-photo-5702993.jpeg?auto=compress&cs=tinysrgb&w=600&h=400",
    type: 'other',
    price: "₹499",
    rating: 4.5,
    reviews: 89
  },
  {
    id: "bottles",
    title: "Bottles",
    description: "Anime-themed water bottles",
    frontImageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    backImageUrl: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    type: 'other',
    price: "₹299",
    rating: 4.4,
    reviews: 167
  }
];

// 🔧 Optimized Image Component with Error Handling
const OptimizedProductImage = React.memo(({ 
  src, 
  alt, 
  className = "",
  fallbackSrc = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
  onError,
  onLoad 
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else {
      setIsLoading(false);
      onError?.();
    }
  }, [hasError, imageSrc, fallbackSrc, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
});

OptimizedProductImage.displayName = 'OptimizedProductImage';

// 🎨 Optimized Product Card Component
const ProductCard = React.memo(({ 
  category, 
  isVisible, 
  isHovered, 
  isLiked,
  onMouseEnter,
  onMouseLeave,
  onToggleLike,
  onExploreDesigns
}: {
  category: ProductCategory;
  isVisible: boolean;
  isHovered: boolean;
  isLiked: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleLike: () => void;
  onExploreDesigns: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div 
      className={`transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${Math.random() * 500}ms` }}
    >
      <Card className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0">
        {/* Image Container */}
        <div 
          className="relative h-64 overflow-hidden cursor-pointer"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {imageError ? (
            <div className="h-full flex items-center justify-center bg-gray-200 text-gray-600">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-sm">Product Loading...</div>
              </div>
            </div>
          ) : (
            <>
              {/* Front Image */}
              <img
                src={category.frontImageUrl}
                alt={`${category.title} front view`}
                className={`absolute w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-110 ${
                  isHovered ? 'opacity-0 scale-105' : 'opacity-100'
                }`}
                loading="lazy"
              />
              
              {/* Back Image */}
              <img
                src={category.backImageUrl}
                alt={`${category.title} back view`}
                className={`absolute w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-110 ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0'
                }`}
                loading="lazy"
              />
            </>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg ${
              category.type === 'tshirt' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-emerald-500 to-teal-600'
            }`}>
              {category.type === 'tshirt' ? 'Apparel' : 'Merchandise'}
            </span>
          </div>
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>
          
          {/* Hover Instruction */}
          <div className={`absolute bottom-4 left-4 right-4 text-center transition-all duration-300 ${
            isHovered ? 'opacity-0 translate-y-2' : 'opacity-100'
          }`}>
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              Hover to see back view
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              {category.title}
            </h3>
            <span className="text-2xl font-bold text-purple-600">
              {category.price}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {category.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(category.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {category.rating}
            </span>
            <span className="text-sm text-gray-500">
              ({category.reviews} reviews)
            </span>
          </div>
          
          {/* Action Button */}
          <Button
            onClick={onExploreDesigns}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span className="mr-2">Explore Designs</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function ProductShowcase() {
  const [hoveredProducts, setHoveredProducts] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const [loadError, setLoadError] = useState(false);
  
  // Optimized visibility effect with error handling
  useEffect(() => {
    try {
      const timeouts = productCategories.map((category, index) => {
        return setTimeout(() => {
          setVisibleItems(prev => ({
            ...prev,
            [category.id]: true
          }));
        }, 150 * index);
      });

      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    } catch (error) {
      console.error('Visibility effect error:', error);
      setLoadError(true);
    }
  }, []);

  const handleMouseEnter = useCallback((productId: string) => {
    setHoveredProducts(prev => ({ ...prev, [productId]: true }));
  }, []);

  const handleMouseLeave = useCallback((productId: string) => {
    setHoveredProducts(prev => ({ ...prev, [productId]: false }));
  }, []);

  const toggleLike = useCallback((productId: string) => {
    setLikedProducts(prev => ({ ...prev, [productId]: !prev[productId] }));
  }, []);

  const handleExploreDesigns = useCallback((categoryId: string) => {
    try {
      window.location.href = `/products?category=${categoryId}`;
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, []);

  // Error boundary for the entire component
  if (loadError) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Anime Inspired Products</h2>
            <p className="text-gray-600 mb-8">Discover our premium collection of anime-themed products</p>
            <button 
              onClick={() => setLoadError(false)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Eye className="w-4 h-4 mr-2" />
            Premium Collection
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Anime-Inspired
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Express your passion for anime with our premium quality customizable merchandise
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <ProductCard
              key={category.id}
              category={category}
              isVisible={visibleItems[category.id] || false}
              isHovered={hoveredProducts[category.id] || false}
              isLiked={likedProducts[category.id] || false}
              onMouseEnter={() => handleMouseEnter(category.id)}
              onMouseLeave={() => handleMouseLeave(category.id)}
              onToggleLike={() => toggleLike(category.id)}
              onExploreDesigns={() => handleExploreDesigns(category.id)}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
            <span className="text-gray-600 mr-2">✨</span>
            <span className="text-gray-700 font-medium">
              New designs added weekly
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}