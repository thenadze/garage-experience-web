
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeroSection = () => {
  const navigate = useNavigate();
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDevisSelection = (type: string) => {
    navigate(`/devis?type=${type}`);
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/70 to-black/50 z-10" />
      <div 
        ref={parallaxRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1567789884554-0b844b686158?q=80&w=1932&auto=format&fit=crop)', transform: 'translateY(0)' }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 opacity-0 animate-slide-down" style={{animationDelay: '300ms'}}>
            40 ANS D'EXPERIENCE <br /> <span className="text-garage-red">DE PÈRE EN FILS</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8 opacity-0 animate-fade-in" style={{animationDelay: '600ms'}}>
            SERVICE AUTOMOBILE 360° : RÉPARATION, VENTE, ENTRETIEN
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up" style={{animationDelay: '900ms'}}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="bg-garage-red hover:bg-garage-red/90 text-white font-bold hover-glow click-effect">
                  Devis en ligne
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white animate-fade-in">
                <DropdownMenuItem onClick={() => handleDevisSelection('reparation')} className="click-effect hover:bg-garage-red/10">
                  Réparation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('entretien')} className="click-effect hover:bg-garage-red/10">
                  Entretien
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('tuning')} className="click-effect hover:bg-garage-red/10">
                  Tuning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('vente')} className="click-effect hover:bg-garage-red/10">
                  Achat/Vente véhicule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              size="lg" 
              className="bg-white text-garage-black hover:bg-white/90 font-bold hover-lift click-effect"
              onClick={() => scrollToSection('vehicules')}
            >
              Rechercher un véhicule
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-garage-black hover:bg-white/90 font-bold hover-lift click-effect"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </Button>
          </div>
          
          <div className="mt-12 bg-garage-red/90 inline-block px-6 py-3 rounded-lg opacity-0 animate-scale" style={{animationDelay: '1200ms'}}>
            <span className="text-lg md:text-xl font-semibold">
              Véhicules d'occasions dès 2 990€
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
