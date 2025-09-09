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
        <title>ANIME INDIA POD - Unleash Your Passion. Wear Your Power.</title>
        <meta name="description" content="Transform your anime fandom into wearable art with our premium customized products featuring your favorite legendary characters and epic designs." />
        <meta property="og:title" content="ANIME INDIA POD - Unleash Your Passion. Wear Your Power." />
        <meta property="og:description" content="Transform your anime fandom into wearable art with our premium customized products featuring your favorite legendary characters and epic designs." />
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
