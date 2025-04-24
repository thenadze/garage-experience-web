
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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-sm ${
      scrolled ? 'bg-white/90 shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-garage-black">
              GARAGE <span className="text-garage-red">AUTO</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {['accueil', 'services', 'vehicules', 'contact'].map((item, index) => (
              <a 
                key={item}
                href={`#${item}`} 
                className="font-medium relative overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="transition-colors duration-300 group-hover:text-garage-red">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-garage-red transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center active:scale-95 transition-transform duration-150" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className={`h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {['accueil', 'services', 'vehicules', 'contact'].map((item, index) => (
                <a 
                  key={item}
                  href={`#${item}`} 
                  className="font-medium relative overflow-hidden group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="transition-colors duration-300 group-hover:text-garage-red">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-garage-red transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
