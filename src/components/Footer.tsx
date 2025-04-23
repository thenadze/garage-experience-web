
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-garage-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GARAGE <span className="text-garage-red">AUTO</span></h3>
            <p className="text-gray-300 mb-4">
              40 ans d'expérience à votre service pour tous vos besoins automobiles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-garage-red transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-garage-red transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-garage-red transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-garage-red transition-colors">Réparation automobile</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-garage-red transition-colors">Vente de véhicules</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-garage-red transition-colors">Entretien régulier</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-garage-red transition-colors">Services rapides</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-garage-red transition-colors">Diagnostics électroniques</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">ACTUS</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="group">
                  <p className="text-sm text-gray-400">12 Avril 2023</p>
                  <p className="text-gray-300 group-hover:text-garage-red transition-colors">Les nouvelles normes d'émissions pour 2024</p>
                </a>
              </li>
              <li>
                <a href="#" className="group">
                  <p className="text-sm text-gray-400">5 Mars 2023</p>
                  <p className="text-gray-300 group-hover:text-garage-red transition-colors">Comment prolonger la vie de votre batterie</p>
                </a>
              </li>
              <li>
                <a href="#" className="group">
                  <p className="text-sm text-gray-400">18 Février 2023</p>
                  <p className="text-gray-300 group-hover:text-garage-red transition-colors">Préparation de votre véhicule pour l'été</p>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-garage-red mr-3 mt-1" />
                <p className="text-gray-300">+33 1 23 45 67 89</p>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-garage-red mr-3 mt-1" />
                <p className="text-gray-300">contact@garage-auto.fr</p>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-garage-red mr-3 mt-1" />
                <p className="text-gray-300">123 Rue de la Mécanique<br />75001 Paris</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>© {currentYear} Garage Auto. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
