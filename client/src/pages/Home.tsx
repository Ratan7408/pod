import { Helmet } from "react-helmet";
import { useEffect } from "react";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomerReviews from "@/components/CustomerReviews";
import FAQSection from "@/components/FAQSection";
import ContactForm from "@/components/ContactForm";
import LimitedEditionCarousel from "@/components/LimitedEditionCarousel";
import { initScrollOptimizations, fixMobileScrolling } from "@/lib/scroll-optimize";

export default function Home() {
  // Initialize scroll optimizations when component mounts
  useEffect(() => {
    // Initialize performance optimizations for scrolling
    initScrollOptimizations();
    
    // Fix mobile scrolling issues
    fixMobileScrolling();
    
    // Clean up when component unmounts
    return () => {
      // Clean up any scroll optimizations
      document.body.classList.remove('optimize-scroll', 'is-scrolling', 'scrolling');
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>PrintCraft - Premium Print on Demand Service</title>
        <meta name="description" content="Transform your creativity into premium custom products with our high-quality print on demand service. T-Shirts, Phone Covers, Plates, Bottles and more!" />
        <meta property="og:title" content="PrintCraft - Premium Print on Demand Service" />
        <meta property="og:description" content="Transform your creativity into premium custom products with our high-quality print on demand service." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <main className="smooth-scroll">
        <Hero />
        <ProductShowcase />
        <LimitedEditionCarousel />
        <WhyChooseUs />
        <CustomerReviews />
        <FAQSection />
        <ContactForm />
      </main>
    </>
  );
}
