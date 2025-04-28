
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Image, Trash } from "lucide-react";

interface VehicleImageUploadProps {
  initialImageUrl: string | null;
  onImageChange: (file: File | null) => void;
  onImageUrlChange: (url: string | null) => void;
}

const VehicleImageUpload = ({
  initialImageUrl,
  onImageChange,
  onImageUrlChange,
}: VehicleImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const { toast } = useToast();

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

    onImageChange(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    onImageUrlChange(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageChange(null);
    onImageUrlChange(null);
  };

  return (
    <div className="mb-6 space-y-2">
      <FormLabel>Photo du véhicule</FormLabel>
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        {imageUrl ? (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Vehicle preview" 
              className="mx-auto max-h-60 object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default VehicleImageUpload;
