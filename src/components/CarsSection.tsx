
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CarCard from './CarCard';
import { Search } from 'lucide-react';

const CarsSection = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for cars
  const cars = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1740&auto=format&fit=crop',
      model: 'Peugeot 308',
      year: 2018,
      price: 12990,
      kilometers: 68000,
      fuel: 'Diesel',
      category: 'compact'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2940&auto=format&fit=crop',
      model: 'Renault Clio',
      year: 2019,
      price: 9990,
      kilometers: 42000,
      fuel: 'Essence',
      category: 'city'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1552519507-88aa2dfa9fdb?q=80&w=1780&auto=format&fit=crop',
      model: 'Dacia Duster',
      year: 2020,
      price: 15990,
      kilometers: 35000,
      fuel: 'Essence',
      category: 'suv'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=1740&auto=format&fit=crop',
      model: 'Citroen C3',
      year: 2017,
      price: 8490,
      kilometers: 89000,
      fuel: 'Diesel',
      category: 'city'
    }
  ];

  // Filter cars based on active tab
  const filteredCars = activeTab === 'all' ? cars : cars.filter(car => car.category === activeTab);

  return (
    <section id="vehicules" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Véhicules</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Découvrez notre sélection de véhicules d'occasion à partir de 2 990€.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'all'
                  ? 'bg-garage-red text-white'
                  : 'bg-garage-light-gray text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              Tous
            </button>
            <button
              onClick={() => setActiveTab('city')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'city'
                  ? 'bg-garage-red text-white'
                  : 'bg-garage-light-gray text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              Citadines
            </button>
            <button
              onClick={() => setActiveTab('compact')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'compact'
                  ? 'bg-garage-red text-white'
                  : 'bg-garage-light-gray text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              Compactes
            </button>
            <button
              onClick={() => setActiveTab('suv')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'suv'
                  ? 'bg-garage-red text-white'
                  : 'bg-garage-light-gray text-gray-700 hover:bg-gray-300'
              } transition-colors`}
            >
              SUV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              image={car.image}
              model={car.model}
              year={car.year}
              price={car.price}
              kilometers={car.kilometers}
              fuel={car.fuel}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-garage-black hover:bg-garage-black/80 text-white font-bold">
            <Search className="mr-2 h-4 w-4" />
            Voir tous nos véhicules
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CarsSection;
