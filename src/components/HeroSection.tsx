
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeroSection = () => {
  const navigate = useNavigate();
  
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
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1567789884554-0b844b686158?q=80&w=1932&auto=format&fit=crop)' }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20 text-white">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            40 ANS D'EXPERIENCE <br /> <span className="text-garage-red">DE PÈRE EN FILS</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-8">
            SERVICE AUTOMOBILE 360° : RÉPARATION, VENTE, ENTRETIEN
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="bg-garage-red hover:bg-garage-red/90 text-white font-bold">
                  Devis en ligne
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuItem onClick={() => handleDevisSelection('reparation')}>
                  Réparation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('entretien')}>
                  Entretien
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('tuning')}>
                  Tuning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDevisSelection('vente')}>
                  Achat/Vente véhicule
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              size="lg" 
              className="bg-white text-garage-black hover:bg-white/90 font-bold"
              onClick={() => scrollToSection('vehicules')}
            >
              Rechercher un véhicule
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-garage-black hover:bg-white/90 font-bold"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </Button>
          </div>
          
          <div className="mt-12 bg-garage-red/90 inline-block px-6 py-3 rounded-lg animate-slide-up">
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
