
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CarsSection from "@/components/CarsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement initial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="relative w-24 h-24">
          {/* Loader avec animation personnalisée */}
          <div className="absolute inset-0 border-4 border-t-garage-red border-r-garage-black/20 border-b-garage-black/20 border-l-garage-black/20 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-garage-red animate-pulse">GARAGE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <CarsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
