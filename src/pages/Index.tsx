
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CarsSection from "@/components/CarsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5 secondes de chargement

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-garage-black">
        <LoadingAnimation />
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <h1 
            className="text-4xl md:text-6xl font-light tracking-wider text-white/90 animate-fade-in"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ED CLUICI
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
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
