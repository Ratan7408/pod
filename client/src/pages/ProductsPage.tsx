import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Grid, 
  List, 
  Loader2, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RotateCcw, 
  AlertCircle, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  Share2, 
  Package, 
  Ruler, 
  Info,
  StarHalf,
  StarOff,
  Play,
  Download
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useToast } from '../hooks/use-toast';
import { throttle, debounce } from '../utils/performanceUtils';
import AuthModal from '../components/auth/AuthModal';
import PerformanceOptimizedProductCard from '../components/PerformanceOptimizedProductCard';
import AnimatedTshirtShowcase from '../components/AnimatedTshirtShowcase';


// Types for your API
interface Product {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  subcategory?: string; // NEW: Add subcategory field for t-shirt types
  status: 'in-stock' | 'out-of-stock' | 'coming-soon'; // NEW: Product status
  inStock: boolean;
  featured: boolean;
  tags?: string;
  images?: string | string[]; // Can be JSON string or array
  discountPercent?: number; // Add consistent discount field
  createdAt: string;
  updatedAt: string;
}

// CartItem interface for local use
interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
  product?: Product;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}



// Size chart data
const SIZE_CHART = {
  'T-Shirts': {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: {
      'XS': { chest: '34-36', length: '26', shoulder: '16' },
      'S': { chest: '36-38', length: '27', shoulder: '17' },
      'M': { chest: '38-40', length: '28', shoulder: '18' },
      'L': { chest: '40-42', length: '29', shoulder: '19' },
      'XL': { chest: '42-44', length: '30', shoulder: '20' },
      'XXL': { chest: '44-46', length: '31', shoulder: '21' }
    }
  },
  'Hoodies': {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: {
      'XS': { chest: '36-38', length: '25', shoulder: '17' },
      'S': { chest: '38-40', length: '26', shoulder: '18' },
      'M': { chest: '40-42', length: '27', shoulder: '19' },
      'L': { chest: '42-44', length: '28', shoulder: '20' },
      'XL': { chest: '44-46', length: '29', shoulder: '21' },
      'XXL': { chest: '46-48', length: '30', shoulder: '22' }
    }
  }
};

// ✅ FIXED: Consistent API Base URL with admin page
const API_BASE = (() => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // Always use port 5000 for API calls
  return `${protocol}//${hostname}:5000`;
})();

console.log('🔧 API_BASE configured as:', API_BASE);

// ✅ FIXED: Helper function to resolve image URLs
const resolveImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';

  console.log('🔍 Resolving image URL:', imageUrl);

  // If it's already a complete URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    console.log('✅ Complete URL detected:', imageUrl);
    return imageUrl;
  }

  // Build the base URL - always use localhost:5000
  const baseUrl = 'http://localhost:5000';

  // Handle relative URLs starting with /uploads
  if (imageUrl.startsWith('/uploads/')) {
    const resolvedUrl = baseUrl + imageUrl;
    console.log('✅ Resolved uploads URL:', resolvedUrl);
    return resolvedUrl;
  }

  // Handle other relative URLs
  if (imageUrl.startsWith('/')) {
    const resolvedUrl = baseUrl + imageUrl;
    console.log('✅ Resolved relative URL:', resolvedUrl);
    return resolvedUrl;
  }

  // Default case - assume it's a filename and add /uploads/
  const resolvedUrl = `${baseUrl}/uploads/${imageUrl}`;
  console.log('✅ Resolved filename URL:', resolvedUrl);
  return resolvedUrl;
};

// ✅ FIXED: API functions with consistent response handling
const fetchProducts = async (filters?: { category?: string; featured?: boolean; inStock?: boolean }): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
  if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

  const url = `${API_BASE}/api/products${params.toString() ? `?${params.toString()}` : ''}`;
  console.log('🔗 Products: Fetching from:', url);

  try {
    const response = await fetch(url);
    console.log('📡 Products: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Products: API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Products: API Response:', data);
    console.log('🔍 Products: Response structure:', {
      hasData: !!data.data,
      dataType: typeof data.data,
      isArray: Array.isArray(data.data),
      dataLength: data.data ? data.data.length : 'no data',
      rawData: data
    });

    // ✅ FIXED: Handle both response formats consistently
    const products = data.data || data;
    console.log('📦 Products: Final products array:', products);
    console.log('🔍 Products: Final products type:', typeof products, 'isArray:', Array.isArray(products));
    
    // Debug: Log image data for each product
    if (Array.isArray(products)) {
      products.forEach((product, index) => {
        console.log(`📸 Product ${index + 1} (${product.name}):`, {
          imageUrl: product.imageUrl,
          images: product.images,
          imagesType: typeof product.images,
          hasImages: !!product.images,
          status: product.status,
          inStock: product.inStock,
          category: product.category,
          subcategory: product.subcategory
        });
      });
    }
    
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('🚨 Products: Fetch Error:', error);
    throw error;
  }
};

const fetchCategories = async (): Promise<string[]> => {
  const url = `${API_BASE}/api/products/categories`;
  console.log('🔗 Products: Fetching categories from:', url);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // ✅ FIXED: Handle both response formats
    const categories = data.data || data;
    
    // ✅ FIXED: Return all categories instead of filtering them out
    return Array.isArray(categories) ? categories : ['T-Shirts', 'Phone Covers', 'Bottles', 'Plates'];
  } catch (error) {
    console.error('🚨 Products: Categories Error:', error);
    // ✅ FIXED: Return default categories if API fails
    return ['T-Shirts', 'Phone Covers', 'Bottles', 'Plates'];
  }
};

// Add this after your imports and interfaces, before ProductDetailPage
const RobustImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=300&fit=crop",
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  [key: string]: any;
}) => {
  const [imageSrc, setImageSrc] = useState(resolveImageUrl(src));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolvedSrc = resolveImageUrl(src);
    console.log('🖼️ RobustImage resolving:', src, '→', resolvedSrc);
    setImageSrc(resolvedSrc);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    console.log('❌ RobustImage failed to load:', imageSrc);
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    console.log('✅ RobustImage loaded successfully:', imageSrc);
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

// Size Chart Modal Component
const SizeChartModal = ({
  isOpen,
  onClose,
  category,
  productName = "Product"
}: {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  productName?: string;
}) => {
  const [activeTab, setActiveTab] = useState<'size-chart' | 'measure'>('size-chart');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen || !SIZE_CHART[category as keyof typeof SIZE_CHART]) return null;

  const sizeData = SIZE_CHART[category as keyof typeof SIZE_CHART];

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <h2 className="text-xl font-bold text-gray-900">Size Chart</h2>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('size-chart')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'size-chart'
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Size Chart
              </button>
              <button
                onClick={() => setActiveTab('measure')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
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
                    {sizeData.sizes.map((size, index) => (
                      <tr key={size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{size}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{size}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(sizeData.measurements[size].chest, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(sizeData.measurements[size].length, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{convertUnit(sizeData.measurements[size].shoulder, 'in')}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">-</td>
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
                <div className="bg-gray-100 rounded-2xl p-8 max-w-md mx-auto">
                  {/* T-Shirt Diagram Placeholder */}
                  <div className="relative w-48 h-64 mx-auto bg-white rounded-lg border-2 border-gray-300">
                    {/* T-Shirt Shape */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gray-200 rounded-t-full"></div>
                    
                    {/* Measurement Lines */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-red-400 border-dashed border-red-400"></div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-blue-400 border-dashed border-blue-400"></div>
                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-green-400 border-dashed border-green-400"></div>
                    
                    {/* Labels */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-red-600">Chest</div>
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600">Length</div>
                    <div className="absolute top-22 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-600">Waist</div>
                  </div>
                </div>

                {/* Measurement Instructions */}
                <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
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
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium text-gray-800">Length</p>
                            <p className="text-sm text-gray-600">Measure from the highest point of your shoulder to desired length</p>
                          </div>
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Need help?</span> Contact our support team
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>WISHLIST</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors flex items-center space-x-2"
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

// Size Selection Component
const SizeSelector = ({
  category,
  selectedSize,
  onSizeSelect
}: {
  category: string;
  selectedSize?: string;
  onSizeSelect: (size: string) => void;
}) => {
  const sizeData = SIZE_CHART[category as keyof typeof SIZE_CHART];

  if (!sizeData) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Select Size:</h4>
        <Link href="/size-chart">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Ruler className="w-4 h-4" />
            Size Chart
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {sizeData.sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`p-3 border-2 rounded-lg font-medium transition-all transform hover:scale-105 ${selectedSize === size
              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
              : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
          >
            {size}
          </button>
        ))}
      </div>

      {selectedSize && (
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-green-800 text-sm">
            ✅ Size <strong>{selectedSize}</strong> selected
            <span className="block text-xs mt-1">
              Chest: {sizeData.measurements[selectedSize].chest}" | Length: {sizeData.measurements[selectedSize].length}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

// Product Detail Page Component - UPDATED with size selection
const ProductDetailPage = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  toggleFavorite,
  relatedProducts,
  openProductDetail
}: {
  product: Product;
  onBack: () => void;
  onAddToCart: (id: string, size?: string) => void;
  onBuyNow: (id: string, size?: string) => void;
  toggleFavorite: (id: string) => void;
  relatedProducts: Product[];
  openProductDetail: (product: Product) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>();

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Check if this product requires size selection
  const requiresSize = SIZE_CHART[product.category as keyof typeof SIZE_CHART];

  // Get product images with proper URL resolution
  let productImages: string[] = [];

  if (product.images) {
    try {
      const parsedImages = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : product.images;
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        // ✅ FIXED: Resolve URLs for uploaded images
        productImages = parsedImages.map(img => resolveImageUrl(img));
        console.log('🖼️ ProductDetailPage: Using uploaded images for', product.name, ':', {
          original: parsedImages,
          resolved: productImages
        });
      } else {
        productImages = [resolveImageUrl(product.imageUrl)];
        console.log('⚠️ ProductDetailPage: No valid uploaded images for', product.name, ', using imageUrl:', product.imageUrl);
      }
    } catch (e) {
      productImages = [resolveImageUrl(product.imageUrl)];
      console.log('🔄 ProductDetailPage: Error parsing images for', product.name, ', falling back to imageUrl:', product.imageUrl);
    }
  } else {
    productImages = [resolveImageUrl(product.imageUrl)];
    console.log('📸 ProductDetailPage: No images field for', product.name, ', using imageUrl:', product.imageUrl);
  }

  console.log('🖼️ ProductDetailPage: Final images for', product.name, ':', {
    totalImages: productImages.length,
    images: productImages,
    currentIndex: currentImageIndex,
    productImagesField: product.images,
    productImageUrl: product.imageUrl
  });

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Parse tags safely
  let tags: string[] = [];
  if (product.tags) {
    try {
      tags = JSON.parse(product.tags);
    } catch (e) {
      tags = [product.tags];
    }
  }

  const isFavorite = false; // Will be passed from parent component

  // Use same consistent calculation as ProductCard
  const price = parseFloat(product.price);
  const productSeed = product.id || 1;
  const discountPercent = 10 + (productSeed % 21);
  const originalPrice = (price * (1 + discountPercent / 100)).toFixed(2);

  // Generate truly varied and realistic rating based on product properties
  const nameHash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const combinedSeed = (productSeed * 31 + nameHash * 17) % 1000;
  const rating = (3.0 + (combinedSeed % 21) / 10).toFixed(1);
  const reviewCount = 50 + (combinedSeed % 950);

  // Handle add to cart with size validation
  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      onAddToCart(product._id, selectedSize);
    }
  };

  // Handle buy now with size validation
  const handleBuyNow = () => {
    if (requiresSize && !selectedSize) {
      alert('Please select a size before purchasing');
      return;
    }

    onBuyNow(product._id, selectedSize);
  };

  // Related Products Component
  const RelatedProductCard = ({ relatedProduct }: { relatedProduct: Product }) => {
    const relatedPrice = parseFloat(relatedProduct.price);
    const relatedSeed = relatedProduct.id || 1;
    const relatedDiscount = 10 + (relatedSeed % 21);
    const relatedOriginal = (relatedPrice * (1 + relatedDiscount / 100)).toFixed(2);
    
    // Generate varied rating for related products
    const relatedNameHash = relatedProduct.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const relatedCombinedSeed = (relatedSeed * 31 + relatedNameHash * 17) % 1000;
    const relatedRating = (3.0 + (relatedCombinedSeed % 21) / 10).toFixed(1);
    const relatedReviewCount = 50 + (relatedCombinedSeed % 950);

    return (
      <div
        onClick={() => openProductDetail(relatedProduct)}
        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={resolveImageUrl(relatedProduct.imageUrl)}
            alt={relatedProduct.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=300&fit=crop";
            }}
          />
          {relatedProduct.featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ⭐ BESTSELLER
            </div>
          )}
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            {relatedDiscount}% OFF
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {relatedProduct.category}
          </div>

          <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {relatedProduct.name}
          </h4>

          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-gray-900">₹{relatedProduct.price}</span>
            <span className="text-sm text-gray-400 line-through ml-2">₹{relatedOriginal}</span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded text-xs">
              <span className="font-bold">{relatedRating}</span>
              <Star className="w-3 h-3 ml-1 fill-current" />
            </div>
            <span className="text-xs text-gray-600">({relatedReviewCount} reviews)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingTop: '4rem' }}>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-[500px] object-cover rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    console.log('❌ Main image failed to load:', productImages[currentImageIndex]);
                    // Try to fallback to imageUrl if available
                    if (product.imageUrl && productImages[currentImageIndex] !== resolveImageUrl(product.imageUrl)) {
                      target.src = resolveImageUrl(product.imageUrl);
                    } else {
                      // Show placeholder if no fallback available
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
                            <div class="text-center">
                              <div class="text-6xl mb-4">🖼️</div>
                              <p class="text-gray-500 font-medium">Image not available</p>
                              <p class="text-gray-400 text-sm">${product.name}</p>
                            </div>
                          </div>
                        `;
                      }
                    }
                  }}
                />

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-3 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-3 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      BESTSELLER
                    </div>
                  )}
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {discountPercent}% OFF
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                                ${index + 1}
                              </div>
                            `;
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category */}
              <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                {product.category}
              </div>

              {/* Title & Actions */}
              <div className="flex items-start justify-between">
                <h1 className="text-4xl font-bold text-gray-900 pr-4">{product.name}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(product._id)}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </button>
                  <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg">
                  <span className="font-bold text-lg">{rating}</span>
                  <Star className="w-5 h-5 ml-1 fill-current" />
                </div>
                <span className="text-gray-600 text-lg">({reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-3xl text-gray-400 line-through">₹{originalPrice}</span>
                </div>
                <div className="text-green-600 text-xl font-semibold">
                  You save ₹{(parseFloat(originalPrice) - parseFloat(product.price)).toFixed(2)}
                  ({discountPercent}% off)
                </div>
              </div>

              {/* Stock Status */}
              <div className={`flex items-center gap-2 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-4 h-4 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-lg">
                  {product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}
                </span>
              </div>

              {/* Size Selection */}
              {requiresSize && product.inStock && (
                <SizeSelector
                  category={product.category}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
          
                />
              )}

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 rounded-l-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 text-lg font-semibold border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 rounded-r-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    ADD TO CART
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-6 h-6 mr-3" />
                    BUY NOW
                  </button>
                </div>

                {/* Delivery Info */}
                {product.inStock && (
                  <div className="bg-green-50 p-6 rounded-xl space-y-3">
                    <div className="flex items-center text-green-800">
                      <Truck className="w-6 h-6 mr-3" />
                      <span className="font-medium text-lg">Free delivery by tomorrow</span>
                    </div>
                    <div className="flex items-center text-green-800">
                      <RotateCcw className="w-6 h-6 mr-3" />
                      <span className="font-medium text-lg">Easy 30-day returns</span>
                    </div>
                    <div className="flex items-center text-green-800">
                      <Shield className="w-6 h-6 mr-3" />
                      <span className="font-medium text-lg">2 year warranty included</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Description & Details */}
          <div className="border-t border-gray-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Product Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm border border-blue-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Product Features</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    High-quality materials
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Authentic anime design
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Comfortable fit
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Machine washable
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Perfect for anime fans
                  </li>
                  {requiresSize && (
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      Multiple sizes available
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
              <p className="text-gray-600 text-lg">Check out these similar amazing products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct.id} relatedProduct={relatedProduct} />
              ))}
            </div>

            {relatedProducts.length > 4 && (
              <div className="text-center">
                <button
                  onClick={onBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

// Shopping Cart Modal Component - UPDATED to show sizes
const ShoppingCartModal = ({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  onCheckout
}: {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  onCheckout: () => void;
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">🛒 Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some amazing anime products to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={`${item.productId}-${item.size || 'no-size'}-${index}`} className="flex items-center gap-4 p-4 border rounded-lg">
                    <RobustImage
                      src={item.imageUrl || ''}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                      <p className="text-sm text-gray-600">{item.product?.category || 'Product'}</p>
                      {item.size && (
                        <p className="text-sm text-blue-600 font-medium">Size: {item.size}</p>
                      )}
                      <p className="text-lg font-bold text-blue-600">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Favorites Modal Component
const FavoritesModal = ({
  isOpen,
  onClose,
  favoriteItems,
  removeFromFavorites,
  addToCart
}: {
  isOpen: boolean;
  onClose: () => void;
  favoriteItems: Product[];
  removeFromFavorites: (productId: string) => void;
  addToCart: (productId: string, size?: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl w-full">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">❤️ Your Favorites</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Favorites Grid */}
        <div className="p-6">
          {favoriteItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600">Start adding products to your wishlist!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="relative mb-4">
                    <RobustImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFromFavorites(product._id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-lg font-bold text-blue-600 mb-4">₹{product.price}</p>

                  <button
                    onClick={() => addToCart(product._id.toString(), product.category)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Checkout Page Component - UPDATED to show sizes in order summary
const CheckoutPage = ({
  cartItems,
  onBack,
  onPaymentSuccess
}: {
  cartItems: CartItem[];
  onBack: () => void;
  onPaymentSuccess: () => void;
}) => {
  const { user } = useAuth(); // Get current user

  // Helper function to get user's full name
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    return '';
  };

  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: getUserName(),
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (paymentMethod === 'razorpay') {
        // Simulate Razorpay payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('🎉 Payment Successful! Order confirmed.');
      } else {
        // Cash on Delivery
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('📦 Order placed! Pay on delivery.');
      }

      // Create purchase data for MongoDB
      const purchaseData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: null
        })),
        totalAmount: totalAmount,
        paymentMethod: paymentMethod,
        paymentId: paymentMethod === 'razorpay' ? `pay_${Date.now()}` : null,
        shippingAddress: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          street: userDetails.address,
          city: userDetails.city,
          state: userDetails.state,
          zipCode: userDetails.pincode,
          country: 'India'
        },
        orderNotes: ''
      };

      // Save purchase to MongoDB
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      console.log('🔐 Purchase - Token available:', !!token);

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.post(`${API_BASE}/api/purchases`, purchaseData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('✅ Purchase saved to MongoDB:', response.data.data);

        // Also save to localStorage for admin analytics
        const purchase = {
          id: response.data.data._id,
          userId: user?.id || 'guest',
          userEmail: user?.email || userDetails.email,
          userName: user?.name || userDetails.name,
          items: cartItems.map(item => ({
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null
          })),
          totalAmount: totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        // --- Add real order notification for admin ---
        const adminNotif = {
          id: `order_${purchase.id}`,
          type: 'order',
          title: 'New Order Received',
          message: `Order #${purchase.id} for ₹${purchase.totalAmount} from ${purchase.userName}`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          order: {
            id: purchase.id,
            totalAmount: purchase.totalAmount,
            userName: purchase.userName,
            userEmail: purchase.userEmail,
            items: purchase.items.map((item: any) => ({
              productName: item.productName,
              quantity: item.quantity,
              size: item.size
            }))
          }
        };
        const existingAdminNotifs = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
        localStorage.setItem('admin_notifications', JSON.stringify([adminNotif, ...existingAdminNotifs]));
        // --- End notification code ---

        const existingPurchases = JSON.parse(localStorage.getItem('all_purchases') || '[]');
        existingPurchases.push(purchase);
        localStorage.setItem('all_purchases', JSON.stringify(existingPurchases));

        // Send email notification
        try {
          const emailResponse = await axios.post(`${API_BASE}/api/mail`, { purchase });
          if (emailResponse.data.success) {
            alert('🎉 Order placed successfully! Check your email for confirmation.');
          } else {
            alert('Order placed successfully! Email notification failed.');
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          alert('Order placed successfully! Email notification failed.');
        }

        onPaymentSuccess();
      } else {
        throw new Error('Failed to save purchase to database');
      }
    } catch (error: any) {
      console.error('❌ Payment/Purchase failed:', error);
      alert(`❌ Payment failed: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">🛒 Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">📦 Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={`${item.productId}-${item.size || 'no-size'}-${index}`} className="flex items-center gap-4">
                  <RobustImage
                    src={item.imageUrl || ''}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.productName}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.size && (
                      <p className="text-sm text-blue-600 font-medium">Size: {item.size}</p>
                    )}
                  </div>
                  <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Shipping:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">📋 Delivery Details</h2>

            <div className="space-y-4 mb-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={userDetails.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={userDetails.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={userDetails.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">💳 Payment Method</h3>

              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'razorpay')}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">Credit/Debit Card, UPI, Net Banking</div>
                    <div className="text-sm text-gray-600">Secure payment via Razorpay</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="mr-3"
                  />
                  <Truck className="w-5 h-5 mr-3 text-green-600" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when you receive the order</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure Checkout</span>
              </div>
              <div className="text-sm text-green-700">
                Your payment information is encrypted and secure. We never store your card details.
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Place Order - ₹{totalAmount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const { user } = useAuth();
  const { addToCart: addToCartContext, updateCartItem, removeFromCart: removeFromCartContext, state: cartState } = useCart();
  const { addToWishlist, removeFromWishlist, state: wishlistState } = useWishlist();
  const actualUser = localStorage.getItem('current_user');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All"); // NEW: Subcategory filter
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [userUpload, setUserUpload] = useState<File | null>(null);


  // Page Navigation State
  const [currentView, setCurrentView] = useState<'products' | 'product-detail'>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Shopping System State
  const [showCheckout, setShowCheckout] = useState(false);

  // ✅ NEW: Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<'login' | 'checkout'>('login');
  
  // GIF Showcase State
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);
  




  // URL params handling for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, []);

  // Debounced search handler for performance
  const debouncedSetSearchQuery = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  // ✅ FIXED: Use consistent query key with admin page
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      featured: showFeaturedOnly
    }),
    retry: 3,
    retryDelay: 1000,
  });

  // ✅ FIXED: Use consistent query key for categories
  const { data: apiCategories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: 3,
    retryDelay: 1000,
  });

  // Categories including "All"
  const categories = ["All", ...apiCategories];

  // Memoized filtered products for performance
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    console.log('🔍 Filtering products:', products.length, 'total products');

    const filtered = products.filter(product => {
      const matchesSearch = searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      
      // ✅ NEW: Handle subcategory filtering for T-Shirts
      const matchesSubcategory = selectedSubcategory === "All" || 
        (product.category === "T-Shirts" && product.subcategory === selectedSubcategory) ||
        product.category !== "T-Shirts";
        
      const matchesFeatured = !showFeaturedOnly || product.featured;

      const shouldInclude = matchesSearch && matchesCategory && matchesSubcategory && matchesFeatured;
      
      if (!shouldInclude) {
        console.log(`❌ Filtered out ${product.name}:`, {
          matchesSearch,
          matchesCategory,
          matchesSubcategory,
          matchesFeatured,
          status: product.status,
          inStock: product.inStock
        });
      }

      return shouldInclude;
    });

    console.log('✅ Filtered products:', filtered.length, 'products remaining');
    return filtered;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, showFeaturedOnly]);

  // Memoized sorted products
  const filteredAndSortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [filteredProducts, sortBy]);

  // Toggle favorite - UPDATED to use context with performance optimization
  const toggleFavorite = useCallback(async (productId: string) => {
    console.log('💖 toggleFavorite called for product:', productId);
    const product = products.find(p => p._id === productId);
    if (!product) return;

    try {
      // Check if product is in wishlist
      const isInWishlist = wishlistState.wishlist?.items.some(item =>
        item.productId === productId
      );

      if (isInWishlist) {
        await removeFromWishlist(productId);
        console.log('💔 Removed from wishlist:', productId);
      } else {
        await addToWishlist({
          productId: productId,
          productName: product.name,
          price: parseFloat(product.price),
          imageUrl: product.imageUrl,
          category: product.category,
        });
        console.log('💝 Added to wishlist:', productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }, [products, wishlistState.wishlist?.items, addToWishlist, removeFromWishlist]);

  // Add to cart - UPDATED to use context with performance optimization
  const addToCart = useCallback(async (productId: string, size?: string) => {
    console.log('🛒 addToCart called for product:', productId, 'size:', size);

    const product = products.find(p => p._id === productId);
    console.log({ product, productId });
    if (!product) return;

    // Check if product requires size selection
    const requiresSize = SIZE_CHART[product.category as keyof typeof SIZE_CHART];
    if (requiresSize && !size) {
      alert('Please select a size before adding to cart');
      return;
    }

    try {
      await addToCartContext({
        productId: productId,
        productName: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        size: size || undefined,
        imageUrl: product.imageUrl,
      });
      console.log(`✅ Added ${product.name}${size ? ` (Size: ${size})` : ''} to cart!`);
      
      // Navigate to cart page after adding item
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [products, addToCartContext]);

  // Update quantity in cart - UPDATED to use context
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove from cart - UPDATED to use context
  const removeFromCart = async (itemId: string) => {
    try {
      await removeFromCartContext(itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // ✅ FIXED: Buy now function with authentication check and size handling
  const buyNow = async (productId: string, size?: string) => {
    console.log('⚡ buyNow called for product:', productId, 'size:', size);

    // Check if user is logged in
    if (!user) {
      console.log('❌ User not logged in, showing auth modal');
      setAuthAction('checkout');
      setShowAuthModal(true);
      // Add to cart so when they login, they can proceed
      await addToCart(productId, size);
      return;
    }

    // User is logged in, proceed with purchase
    await addToCart(productId, size);
    setShowCheckout(true);
    console.log(`🚀 Proceeding to checkout for product ${productId}${size ? ` (Size: ${size})` : ''}!`);
  };

  // ✅ FIXED: Handle checkout with authentication check
  const handleCheckout = () => {
    console.log('🛒 handleCheckout called');

    // Check if user is logged in
    if (!user) {
      console.log('❌ User not logged in, showing auth modal');
      setAuthAction('checkout');
      setShowAuthModal(true);
      return;
    }

    // User is logged in, proceed with checkout
    setShowCheckout(true);
    console.log('🚀 Proceeding to checkout!');
  };

  // ✅ FIXED: Handle auth success
  const handleAuthSuccess = () => {
    console.log('✅ Auth success, handling action:', authAction);
    setShowAuthModal(false);
    
    if (authAction === 'checkout') {
      setShowCheckout(true);
    }
  };

  // ✅ FIXED: Open product detail
  const openProductDetail = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    // Scroll to top when opening product detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ✅ FIXED: Go back to products
  const goBackToProducts = useCallback(() => {
    setCurrentView('products');
    setSelectedProduct(null);
  }, []);

  // ✅ FIXED: Get related products
  const getRelatedProducts = useCallback((product: Product) => {
    return products
      .filter(p => p._id !== product._id && p.category === product.category)
      .slice(0, 4);
  }, [products]);

  // ✅ UPDATED: ProductCard Component with authentication check and size awareness
  // Memoized ProductCard component for performance
  const ProductCard = useCallback(({ product, isListView = false }: { product: Product; isListView?: boolean }) => {
    const isFavorite = wishlistState.wishlist?.items.some(item =>
      item.productId === product._id
    ) || false;
    const isInCart = cartState.cart?.items.some(item =>
      item.productId === product._id
    ) || false;
    const requiresSize = SIZE_CHART[product.category as keyof typeof SIZE_CHART];

    return (
      <PerformanceOptimizedProductCard
        product={product}
        isListView={isListView}
        isFavorite={isFavorite}
        isInCart={isInCart}
        requiresSize={!!requiresSize}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
        onToggleFavorite={toggleFavorite}
        onOpenDetail={openProductDetail}
      />
    );
  }, [wishlistState.wishlist?.items, cartState.cart?.items, addToCart, buyNow, toggleFavorite, openProductDetail]);

  // Only clear cart and close checkout on payment success
  const handlePaymentSuccess = () => {
    setShowCheckout(false);
  };

  // Show Product Detail Page if a product is selected
  if (currentView === 'product-detail' && selectedProduct) {
    const relatedProducts = getRelatedProducts(selectedProduct);

    return (
      <>
        <ProductDetailPage
          product={selectedProduct}
          onBack={goBackToProducts}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
          toggleFavorite={toggleFavorite}
          relatedProducts={relatedProducts}
          openProductDetail={openProductDetail}
        />

        {/* Modals */}
        {/* ShoppingCartModal and FavoritesModal removed due to type conflicts */}

              {/* ✅ NEW: Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode="login"
      />



        {showCheckout && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <CheckoutPage
              cartItems={cartState.cart?.items || []}
              onBack={() => {
                setShowCheckout(false);
              }}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </>
    );
  }

  // Show Products List (Default View) - COMPLETELY REDESIGNED
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{ paddingTop: '4rem' }}>
      {/* Hero Section with Floating Elements */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Background Elements - Reduced animations for performance */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-lg"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-pink-400/8 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-400/10 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center bg-white/30 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-white/90 text-sm font-medium">🎌 Premium Print-on-Demand Collection</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Anime
              </span>
              <span className="text-white"> Collection</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
              Premium print-on-demand anime merchandise with high-quality designs! ✨
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{products.length}+</div>
                <div className="text-white/70 text-sm">Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-white/70 text-sm">Custom</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-white/70 text-sm">Printing</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/cart">
                <button className="group relative px-8 py-4 bg-white/30 rounded-2xl hover:bg-white/40 transition-all transform hover:scale-105 hover:shadow-xl border border-white/30">
                  <ShoppingCart className="w-5 h-5 mr-2 inline" />
                  <span className="font-semibold text-white">View Cart</span>
                  {cartState.cart && cartState.cart.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {cartState.cart.itemCount}
                    </span>
                  )}
                </button>
              </Link>
              <Link href="/wishlist">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 hover:shadow-xl">
                  <Heart className="w-5 h-5 mr-2 inline" />
                  <span className="font-semibold text-white">Wishlist</span>
                  {wishlistState.wishlist && wishlistState.wishlist.items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {wishlistState.wishlist.items.length}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search anime designs..."
                onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("All"); // Reset subcategory when category changes
                  }}
                  className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Subcategory Filter - Only show for T-Shirts */}
              {selectedCategory === "T-Shirts" && (
                <div className="relative">
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="All">All T-Shirt Types</option>
                    {TSHIRT_SUBCATEGORIES.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              )}



              {/* View Mode Toggle */}
              <div className="flex bg-white/90 backdrop-blur-sm rounded-xl p-1 border border-gray-300">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {products.filter(p => p.featured && p.status === 'in-stock').length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ⭐ Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular and trending anime merchandise, handpicked for you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products
              .filter(p => p.featured && p.status === 'in-stock')
              .slice(0, 8) // Show max 8 featured products
              .map((product) => (
                <div key={product._id} className="relative">
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ FEATURED
                    </div>
                  </div>
                  
                  <ProductCard product={product} isListView={false} />
                </div>
              ))}
          </div>
          
          {/* View All Featured Button */}
          {products.filter(p => p.featured && p.status === 'in-stock').length > 8 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowFeaturedOnly(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                View All Featured Products
              </button>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productsLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing designs...</p>
            </div>
          </div>
        ) : productsError ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} isListView={viewMode === "list"} />
            ))}
          </div>
        )}
      </div>



      {/* Print Quality Showcase */}
      <div className="py-20 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Premium Print Quality
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with our professional print-on-demand technology. 
              Every design is crafted with precision and premium materials.
            </p>
          </div>
          
          {/* Quality Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">HD Print Technology</h3>
              <p className="text-gray-600">Crystal-clear designs with 1440 DPI resolution for sharp, vibrant prints</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Materials</h3>
              <p className="text-gray-600">100% cotton, eco-friendly inks, and durable finishes that last wash after wash</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24-Hour Turnaround</h3>
              <p className="text-gray-600">From design to print in under 24 hours with our automated production line</p>
            </div>
          </div>
          
          {/* Print Quality Demo */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                {/* Loading State */}
                {!gifLoaded && !gifError && (
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading print quality showcase...</p>
                  </div>
                )}
                
                {/* Error State */}
                {gifError && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    <p className="text-red-600 font-medium text-lg">Failed to load showcase</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                )}
                
                {/* Print Quality GIF */}
                <img
                  src="/product-page.gif"
                  alt="Print Quality Showcase - Premium T-Shirt Printing"
                  className={`w-full h-full object-contain rounded-2xl showcase-element transition-opacity duration-500 ${
                    gifLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    animation: gifLoaded ? 'pulse 4s ease-in-out infinite' : 'none'
                  }}
                  onLoad={() => {
                    console.log('🎨 Print quality showcase loaded!');
                    setGifLoaded(true);
                  }}
                  onError={(e) => {
                    console.error('❌ Print quality showcase failed to load');
                    setGifError(true);
                  }}
                />
                
                {/* Print Quality Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-8">
                  <div className="text-white text-center">
                    <h3 className="text-3xl font-bold mb-3">Professional Print Quality</h3>
                    <p className="text-white/90 mb-4 text-lg">See the difference in every detail - from thread count to ink precision</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="bg-white/25 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">#HDPrinting</span>
                      <span className="bg-white/25 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">#PremiumMaterials</span>
                      <span className="bg-white/25 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">#FastTurnaround</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quality Guarantee Section */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Quality Guaranteed 🏆
            </h3>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-lg">
              Every print is inspected for perfection. If you're not 100% satisfied, 
              we'll reprint it or give you a full refund.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/customize">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold text-lg">
                  Start Your Design
                </button>
              </Link>
              <Link href="/products">
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-semibold text-lg">
                  View Print Samples
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>



      {/* Modals */}
      {/* ShoppingCartModal and FavoritesModal removed due to type conflicts */}

      {/* ✅ NEW: Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultMode="login"
      />

      {showCheckout && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <CheckoutPage
            cartItems={cartState.cart?.items || []}
            onBack={() => {
              setShowCheckout(false);
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      )}




    </div>
  );
}

// ✅ NEW: T-Shirt subcategories
const TSHIRT_SUBCATEGORIES = [
  'Regular T-Shirts',
  'Oversized T-Shirts',
  'Hoodies',
  'Full Sleeve T-Shirts'
];


