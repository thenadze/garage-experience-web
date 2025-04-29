
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { extractImageUrls } from '@/integrations/supabase/tempTypes';

interface CarCardProps {
  image: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuel: string;
  vehicleId?: string;
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
          // Use a try/catch block to handle potential errors
          try {
            // Using "as any" to bypass TypeScript check until the table exists
            const { data, error } = await supabase
              .from('vehicle_images' as any)
              .select('*')
              .eq('vehicle_id', vehicleId);
              
            if (error) {
              console.error("Erreur lors de la récupération des images:", error);
              return;
            }
            
            // Use the utility function to safely extract image URLs
            const additionalUrls = extractImageUrls(data);
            
            if (additionalUrls.length > 0) {
              setImages(prev => {
                // Merge main image with additional images and remove duplicates
                const allImages = [image, ...additionalUrls];
                return [...new Set(allImages)].filter(Boolean);
              });
            }
          } catch (queryError) {
            console.error("Erreur de requête:", queryError);
            // Table might not exist yet - silently fail
          }
        } catch (error) {
          console.error("Erreur générale:", error);
          // In case of any error, ensure we at least have the main image
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
