
import { Button } from '@/components/ui/button';

interface CarCardProps {
  image: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuel: string;
}

const CarCard = ({ image, model, year, price, kilometers, fuel }: CarCardProps) => {
  // Format price to include space as thousands separator and € symbol
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);

  // Format kilometers to include space as thousands separator and km
  const formattedKilometers = new Intl.NumberFormat('fr-FR').format(kilometers) + ' km';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={image} 
          alt={model} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold">{model}</h3>
          <span className="text-garage-red font-bold">{formattedPrice}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-garage-light-gray px-2 py-1 rounded text-sm">{year}</span>
          <span className="bg-garage-light-gray px-2 py-1 rounded text-sm">{formattedKilometers}</span>
          <span className="bg-garage-light-gray px-2 py-1 rounded text-sm">{fuel}</span>
        </div>
        <Button className="w-full bg-garage-black hover:bg-garage-black/80 text-white">
          Voir détails
        </Button>
      </div>
    </div>
  );
};

export default CarCard;
