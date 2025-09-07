import React, { useCallback, useMemo } from 'react';
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react';
import { Link } from 'wouter';
import PerformanceOptimizedImage from './PerformanceOptimizedImage';

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
  images?: string | string[];
  discountPercent?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
  isListView?: boolean;
  isFavorite: boolean;
  isInCart: boolean;
  requiresSize: boolean;
  onAddToCart: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  onToggleFavorite: (productId: string) => void;
  onOpenDetail: (product: Product) => void;
}

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

const PerformanceOptimizedProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  isListView = false,
  isFavorite,
  isInCart,
  requiresSize,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  onOpenDetail
}) => {
  // Memoized calculations
  const { tags, displayImage, price, discountPercent, originalPrice, rating, reviewCount } = useMemo(() => {
    let tags: string[] = [];
    if (product.tags) {
      try {
        tags = JSON.parse(product.tags);
      } catch (e) {
        tags = [product.tags];
      }
    }

    let displayImage = product.imageUrl;
    if (product.images) {
      try {
        const parsedImages = typeof product.images === 'string'
          ? JSON.parse(product.images)
          : product.images;
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          displayImage = parsedImages[0];
          console.log('🖼️ Using uploaded image for product:', product.name, 'Image:', displayImage);
        } else {
          console.log('⚠️ No valid uploaded images found for product:', product.name, 'Using fallback:', product.imageUrl);
        }
      } catch (e) {
        console.warn('Error parsing product images for:', product.name, e);
        console.log('🔄 Falling back to imageUrl for product:', product.name, 'Image:', product.imageUrl);
      }
    } else {
      console.log('📸 No images field for product:', product.name, 'Using imageUrl:', product.imageUrl);
    }

    const price = parseFloat(product.price);
    const productSeed = product.id || 1;
    const discountPercent = 10 + (productSeed % 21);
    const originalPrice = (price * (1 + discountPercent / 100)).toFixed(2);
    // Generate truly varied and realistic rating based on product properties
    const nameHash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const combinedSeed = (productSeed * 31 + nameHash * 17) % 1000;
    const rating = (3.0 + (combinedSeed % 21) / 10).toFixed(1);
    const reviewCount = 50 + (combinedSeed % 950);

    return { tags, displayImage, price, discountPercent, originalPrice, rating, reviewCount };
  }, [product]);

  // Memoized event handlers
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (requiresSize) {
      onOpenDetail(product);
    } else {
      onAddToCart(product._id);
    }
  }, [requiresSize, product, onAddToCart, onOpenDetail]);

  const handleBuyNow = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (requiresSize) {
      onOpenDetail(product);
    } else {
      onBuyNow(product._id);
    }
  }, [requiresSize, product, onBuyNow, onOpenDetail]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(product._id);
  }, [product._id, onToggleFavorite]);

  const handleImageClick = useCallback(() => {
    onOpenDetail(product);
  }, [product, onOpenDetail]);

  // List view layout
  if (isListView) {
    return (
              <div className="group bg-white/95 rounded-2xl shadow-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0" onClick={handleImageClick}>
            <PerformanceOptimizedImage
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <Star className="w-3 h-3 mr-1 inline" />
                  FEATURED
                </div>
              )}
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {discountPercent}% OFF
              </div>
            </div>

            {/* Heart Button */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                {product.name}
              </h3>
              
              {/* Category and Subcategory */}
              <div className="mb-3">
                <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-1">
                  {product.category}
                </div>
                {product.subcategory && (
                  <div className="text-sm text-gray-600 font-medium">
                    {product.subcategory}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black text-gray-900">₹{price}</span>
                <span className="text-lg text-gray-500 line-through">₹{originalPrice}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  {discountPercent}% OFF
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-bold text-gray-700 ml-1">{rating}</span>
                </div>
                <span className="text-gray-500">({reviewCount} reviews)</span>
                {/* Sizes badge removed for cleaner look */}
                {/* {requiresSize && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Ruler className="w-4 h-4 mr-1" />
                    SIZES AVAILABLE
                  </div>
                )} */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart || product.status !== 'in-stock'}
                className={`flex-1 ${isInCart
                  ? 'bg-green-600 text-white'
                  : product.status === 'in-stock'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  } px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isInCart ? (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    ADDED TO CART
                  </>
                ) : product.status === 'coming-soon' ? (
                  <>
                    <span className="mr-2">🟡</span>
                    COMING SOON
                  </>
                ) : product.status === 'out-of-stock' ? (
                  <>
                    <span className="mr-2">🔴</span>
                    OUT OF STOCK
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {requiresSize ? 'SELECT SIZE' : 'ADD TO CART'}
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.status !== 'in-stock'}
                className={`flex-1 ${product.status === 'in-stock'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  } px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {product.status === 'coming-soon' ? (
                  <>
                    <span className="mr-2">🟡</span>
                    COMING SOON
                  </>
                ) : product.status === 'out-of-stock' ? (
                  <>
                    <span className="mr-2">🔴</span>
                    OUT OF STOCK
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    BUY NOW
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view layout (default)
  return (
    <div className="group bg-white/95 rounded-2xl shadow-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-102 overflow-hidden border border-gray-100 relative cursor-pointer">
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden" onClick={handleImageClick}>
        <PerformanceOptimizedImage
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges - REMOVED for cleaner look */}
        {/* <div className="absolute top-3 left-3 flex flex-col gap-2 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300">
          {product.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <Star className="w-3 h-3 mr-1 inline" />
              FEATURED
            </div>
          )}
          
          {product.status === 'coming-soon' && (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🟡 COMING SOON
            </div>
          )}
          {product.status === 'out-of-stock' && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              🔴 OUT OF STOCK
            </div>
          )}
          {product.status === 'in-stock' && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {discountPercent}% OFF
            </div>
          )}
          
          {requiresSize && product.status === 'in-stock' && (
            <Link 
              href="/size-chart"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <Ruler className="w-3 h-3 mr-1 inline" />
              SIZE CHART
            </Link>
          )}
        </div> */}

        {/* Heart Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110 group-hover:opacity-100 opacity-0"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 text-sm md:text-base">
          {product.name}
        </h3>

        {/* Category and Subcategory */}
        <div className="mb-3">
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            {product.category}
          </div>
          {product.subcategory && (
            <div className="text-xs text-gray-600 font-medium">
              {product.subcategory}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg md:text-xl font-black text-gray-900">₹{price}</span>
          <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isInCart || product.status !== 'in-stock'}
            className={`flex-1 ${isInCart
              ? 'bg-green-600 text-white'
              : product.status === 'in-stock'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              } px-3 py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-xs`}
          >
            {isInCart ? (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                ADDED
              </>
            ) : product.status === 'coming-soon' ? (
              <>
                <span className="mr-1">🟡</span>
                COMING SOON
              </>
            ) : product.status === 'out-of-stock' ? (
              <>
                <span className="mr-1">🔴</span>
                OUT OF STOCK
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 mr-1" />
                {requiresSize ? 'SIZE' : 'CART'}
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.status !== 'in-stock'}
            className={`flex-1 ${product.status === 'in-stock'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              } px-3 py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 text-xs`}
          >
            <span className="mr-1 text-sm font-bold tracking-tighter">》》</span>
            BUY
          </button>
        </div>
      </div>
    </div>
  );
});

PerformanceOptimizedProductCard.displayName = 'PerformanceOptimizedProductCard';

export default PerformanceOptimizedProductCard; 