
import ServiceCard from './ServiceCard';
import { Wrench, Car, Settings, Clock } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-garage-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Une équipe d'experts qualifiés à votre service pour tous vos besoins automobiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            title="Réparation"
            description="Réparations mécaniques et électroniques par des techniciens expérimentés."
            icon={Wrench}
          />
          <ServiceCard
            title="Vente de véhicules"
            description="Large gamme de véhicules d'occasion contrôlés et garantis."
            icon={Car}
          />
          <ServiceCard
            title="Entretien"
            description="Entretien régulier et maintenance préventive de votre véhicule."
            icon={Settings}
          />
          <ServiceCard
            title="Services rapides"
            description="Tuning et amélioration des performances pour votre voiture."
            icon={Clock}
          />
        </div>

        <div className="mt-16 text-center">
          <div className="bg-garage-red text-white inline-block px-8 py-4 rounded-lg text-lg md:text-xl font-bold animate-pulse">
            OFFRE SPÉCIALE : Diagnostic complet offert pour tout nouvel entretien
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
