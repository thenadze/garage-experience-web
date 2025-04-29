
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Image, Plus, Trash } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VehicleImageUploadProps {
  initialImageUrls: string[];
  onImagesChange: (files: File[]) => void;
  onImageUrlsChange: (urls: string[]) => void;
}

const VehicleImageUpload = ({
  initialImageUrls,
  onImagesChange,
  onImageUrlsChange,
}: VehicleImageUploadProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        variant: "destructive",
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 5MB",
      });
      return;
    }

    // Create URL for preview
    const objectUrl = URL.createObjectURL(file);
    
    // Add the new file and URL to the arrays
    const updatedFiles = [...files, file];
    const updatedUrls = [...imageUrls, objectUrl];
    
    setFiles(updatedFiles);
    setImageUrls(updatedUrls);
    
    // Notify parent components
    onImagesChange(updatedFiles);
    onImageUrlsChange(updatedUrls);
  };

  const handleRemoveImage = (index: number) => {
    // Remove the image at the specified index
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    const updatedFiles = files.filter((_, i) => i !== index);
    
    setImageUrls(updatedUrls);
    setFiles(updatedFiles);
    
    // Notify parent components
    onImagesChange(updatedFiles);
    onImageUrlsChange(updatedUrls);
  };

  return (
    <div className="mb-6 space-y-2">
      <FormLabel>Photos du véhicule</FormLabel>
      
      {imageUrls.length > 0 ? (
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {imageUrls.map((url, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <div className="relative">
                    <img 
                      src={url} 
                      alt={`Photo ${index + 1}`} 
                      className="max-h-60 object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="lg:flex hidden" />
            <CarouselNext className="lg:flex hidden" />
          </Carousel>
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <label className="cursor-pointer flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une photo
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <div className="py-8 flex flex-col items-center justify-center text-gray-500">
            <Image className="h-12 w-12 mb-2" />
            <p>Déposez une image ici ou</p>
            <label className="cursor-pointer text-garage-red hover:underline">
              parcourez vos fichiers
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-xs mt-2">5MB maximum, formats: JPG, PNG</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleImageUpload;
