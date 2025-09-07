/**
 * Optimizations for scrolling performance
 * 
 * This file contains utility functions to improve scrolling performance
 * by reducing unnecessary repaints, optimizing animations, and properly
 * handling intersection observations.
 */

// Scroll optimization utilities for better performance
// This file contains utilities to optimize scrolling performance

// Initialize scroll optimizations
export function initScrollOptimizations() {
  // Remove any existing scroll event listeners that might interfere
  cleanupScrollListeners();
  
  // Apply performance improvements
  applyScrollOptimizations();
  
  // Fix backdrop filter performance issues
  fixBackdropFilterPerformance();
  
  // Enable smooth scrolling
  enableSmoothScrolling();
  
  // Add performance optimizations for heavy components
  optimizeHeavyComponents();
}

// Clean up any problematic scroll listeners
function cleanupScrollListeners() {
  // Remove any existing scroll optimizations that might be causing issues
  const body = document.body;
  body.classList.remove('is-scrolling', 'scrolling', 'optimize-scroll');
  
  // Remove any inline styles that might interfere
  const elements = document.querySelectorAll('[style*="overflow: hidden"]');
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      // Only remove overflow hidden from body and html
      if (element.tagName === 'BODY' || element.tagName === 'HTML') {
        element.style.overflow = '';
      }
    }
  });
}

// Apply performance improvements to the DOM
export function applyScrollOptimizations() {
  // Optimize images
  optimizeImages();
  
  // Find potential heavy elements like carousels, animations, etc.
  const heavyElements = document.querySelectorAll('.anime-scroll-animation, .limited-edition-scroll, .carousel-component');
  
  heavyElements.forEach(element => {
    if (element instanceof HTMLElement) {
      // Apply hardware acceleration without breaking scroll
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform';
      element.style.backfaceVisibility = 'hidden';
      
      // Ensure smooth transitions
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    }
  });
  
  // Remove problematic scroll throttling
  let scrollTimer: number | null = null;
  const body = document.body;
  
  // Use passive scroll listeners for better performance
  window.addEventListener('scroll', () => {
    // Remove any classes that might interfere with scrolling
    body.classList.remove('is-scrolling', 'scrolling');
    
    if (scrollTimer !== null) {
      window.clearTimeout(scrollTimer);
    }
    
    scrollTimer = window.setTimeout(() => {
      // Clean up after scroll ends
    }, 100) as unknown as number;
  }, { passive: true });
}

// Optimize heavy components specifically
function optimizeHeavyComponents() {
  // Optimize carousel components
  const carousels = document.querySelectorAll('[class*="carousel"], [class*="scroll"]');
  carousels.forEach(element => {
    if (element instanceof HTMLElement) {
      // Apply containment for better performance
      element.style.contain = 'layout style paint';
      element.style.willChange = 'transform';
      element.style.transform = 'translateZ(0)';
      
      // Reduce repaints during scroll
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
    }
  });
  
  // Optimize image containers
  const imageContainers = document.querySelectorAll('img');
  imageContainers.forEach(img => {
    if (img instanceof HTMLImageElement) {
      // Apply hardware acceleration
      img.style.transform = 'translateZ(0)';
      img.style.willChange = 'transform';
      img.style.backfaceVisibility = 'hidden';
      
      // Ensure proper loading
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    }
  });
  
  // Optimize animation containers
  const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
  animatedElements.forEach(element => {
    if (element instanceof HTMLElement) {
      // Use transform instead of other properties for better performance
      element.style.willChange = 'transform';
      element.style.transform = 'translateZ(0)';
    }
  });
}

// Enable smooth scrolling
function enableSmoothScrolling() {
  // Ensure smooth scrolling is enabled
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add smooth scroll class to body
  document.body.classList.add('smooth-scroll');
  
  // Fix for iOS Safari
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.style.webkitOverflowScrolling = 'touch';
  }
}

// Optimize images for better scroll performance
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img instanceof HTMLImageElement) {
      // Add loading optimization
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding optimization
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
      
      // Apply hardware acceleration
      img.style.transform = 'translateZ(0)';
      img.style.willChange = 'transform';
    }
  });
}

// Fix for Safari and Chrome specific issues with backdrop-filter
export function fixBackdropFilterPerformance() {
  // Detect Safari/Chrome
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isChrome = /chrome/i.test(navigator.userAgent);
  
  if (isSafari || isChrome) {
    const glassElements = document.querySelectorAll('[style*="backdrop-filter"]');
    
    glassElements.forEach(element => {
      if (element instanceof HTMLElement) {
        // For Safari/Chrome, use a simpler backdrop filter or disable during scroll
        element.setAttribute('data-has-backdrop', 'true');
        
        // Add a class that we can target during scroll
        element.classList.add('backdrop-element');
        
        // Apply hardware acceleration
        element.style.transform = 'translateZ(0)';
        element.style.willChange = 'backdrop-filter, transform';
      }
    });
  }
}

// Fix for mobile scrolling issues
export function fixMobileScrolling() {
  // Add touch-action for better mobile scrolling
  document.body.style.touchAction = 'pan-x pan-y';
  
  // Fix for iOS Safari momentum scrolling
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.style.webkitOverflowScrolling = 'touch';
  }
  
  // Ensure no horizontal scroll on mobile
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(meta);
  }
}

// Performance monitoring for heavy sections
export function monitorPerformance() {
  // Monitor for performance issues
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.duration > 16) {
          console.warn('Performance issue detected:', entry.name, entry.duration);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
}

// Debounce function for scroll events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export all functions for use in components
export {
  cleanupScrollListeners,
  enableSmoothScrolling,
  optimizeImages,
  optimizeHeavyComponents
};