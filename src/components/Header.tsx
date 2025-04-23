
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-garage-black">
              GARAGE <span className="text-garage-red">AUTO</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#accueil" className="font-medium hover:text-garage-red transition-colors">Accueil</a>
            <a href="#services" className="font-medium hover:text-garage-red transition-colors">Services</a>
            <a href="#vehicules" className="font-medium hover:text-garage-red transition-colors">Véhicules</a>
            <a href="#contact" className="font-medium hover:text-garage-red transition-colors">Contact</a>
          </nav>

          <div className="hidden md:block">
            <Button className="bg-garage-red hover:bg-garage-red/90 text-white">
              Devis en ligne
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#accueil" 
                className="font-medium hover:text-garage-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </a>
              <a 
                href="#services" 
                className="font-medium hover:text-garage-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#vehicules" 
                className="font-medium hover:text-garage-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Véhicules
              </a>
              <a 
                href="#contact" 
                className="font-medium hover:text-garage-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button className="bg-garage-red hover:bg-garage-red/90 text-white w-full">
                Devis en ligne
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
