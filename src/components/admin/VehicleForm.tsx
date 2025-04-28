
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

const formSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  price: z.coerce.number().positive("Le prix doit être positif"),
  mileage: z.coerce.number().nonnegative("Le kilométrage doit être positif ou zéro"),
  fuel_type: z.string().min(1, "Le type de carburant est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  is_sold: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;
type Vehicle = Tables<"vehicles">;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: () => void;
}

const VehicleForm = ({ vehicle, onSuccess }: VehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(vehicle?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: vehicle?.brand || "",
      model: vehicle?.model || "",
      year: vehicle?.year || new Date().getFullYear(),
      price: vehicle?.price || 0,
      mileage: vehicle?.mileage || 0,
      fuel_type: vehicle?.fuel_type || "",
      description: vehicle?.description || "",
      is_sold: vehicle?.is_sold || false,
    },
  });

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

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageFile(null);
    setUploadProgress(0);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `vehicle_images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('vehicles')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const onSubmit = async (formData: FormValues) => {
    setLoading(true);
    
    try {
      let finalImageUrl = vehicle?.image_url || null;

      // If there's a new image to upload
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      const now = new Date().toISOString();

      if (vehicle) {
        // Update existing vehicle - make sure all required fields are included
        const { error } = await supabase
          .from("vehicles")
          .update({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            fuel_type: formData.fuel_type,
            description: formData.description,
            is_sold: formData.is_sold,
            image_url: finalImageUrl,
            updated_at: now,
          })
          .eq("id", vehicle.id);

        if (error) throw error;
      } else {
        // Add new vehicle - make sure all required fields are included
        const { error } = await supabase
          .from("vehicles")
          .insert({
            brand: formData.brand,
            model: formData.model,
            year: formData.year,
            price: formData.price,
            mileage: formData.mileage,
            fuel_type: formData.fuel_type,
            description: formData.description,
            is_sold: formData.is_sold,
            image_url: finalImageUrl,
            created_at: now,
            updated_at: now,
          });

        if (error) throw error;
      }

      toast({
        title: vehicle ? "Véhicule mis à jour" : "Véhicule ajouté",
        description: vehicle
          ? "Le véhicule a été mis à jour avec succès."
          : "Le véhicule a été ajouté avec succès.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du véhicule.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Image upload section */}
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

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Peugeot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Modèle</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 308" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Carburant</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de carburant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybride">Hybride</SelectItem>
                      <SelectItem value="Électrique">Électrique</SelectItem>
                      <SelectItem value="GPL">GPL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Kilométrage</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez le véhicule en détail..." 
                      className="h-32 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_sold"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                  <div className="space-y-0.5">
                    <FormLabel>Statut du véhicule</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Indiquez si le véhicule a été vendu
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onSuccess()}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-garage-red hover:bg-garage-red/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Enregistrement...
              </>
            ) : (
              vehicle ? "Mettre à jour" : "Ajouter le véhicule"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
