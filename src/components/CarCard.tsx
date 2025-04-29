
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';
import { extractImageUrls, formatVehicleId, fetchVehicleImages } from '@/integrations/supabase/tempTypes';

interface CarCardProps {
  image: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuel: string;
  vehicleId?: string | number;
}

const CarCard = ({ image, model, year, price, kilometers, fuel, vehicleId }: CarCardProps) => {
  // Format price to include space as thousands separator and € symbol
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);

  // Format kilometers to include space as thousands separator and km
  const formattedKilometers = new Intl.NumberFormat('fr-FR').format(kilometers) + ' km';
  
  const [images, setImages] = useState<string[]>(image ? [image] : []);
  
  // Récupérer les images supplémentaires si un vehicleId est fourni
  useEffect(() => {
    if (vehicleId) {
      const fetchAdditionalImages = async () => {
        try {
          // Utiliser la fonction utilitaire pour récupérer les images
          const { data, error } = await fetchVehicleImages(vehicleId);
              
          if (error) {
            console.error("Erreur lors de la récupération des images:", error);
            console.log("Vérifiez que vous avez créé la fonction RPC 'get_vehicle_images'");
            return;
          }
          
          // Utiliser la fonction utilitaire pour extraire les URLs d'images en toute sécurité
          const additionalUrls = extractImageUrls(data);
          
          if (additionalUrls.length > 0) {
            setImages(prev => {
              // Fusionner l'image principale avec les images supplémentaires et supprimer les doublons
              const allImages = [image, ...additionalUrls];
              return [...new Set(allImages)].filter(Boolean);
            });
          }
        } catch (error) {
          console.error("Erreur générale:", error);
          // En cas d'erreur, s'assurer qu'on a au moins l'image principale
          if (image && !images.includes(image)) {
            setImages([image]);
          }
        }
      };
      
      fetchAdditionalImages();
    }
  }, [vehicleId, image]);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="w-full h-48 overflow-hidden">
        {images.length > 1 ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <img 
                    src={img} 
                    alt={`${model} - Photo ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex" />
            <CarouselNext className="hidden lg:flex" />
          </Carousel>
        ) : (
          <img 
            src={image} 
            alt={model} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        )}
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
