
import { Database } from './types';
import { supabase } from './client';

// Définition d'un type pour les images de véhicules
export interface VehicleImage {
  id?: string | number;
  vehicle_id: number;
  image_url: string;
  created_at?: string;
}

// Fonction utilitaire pour vérifier si les données sont des images de véhicules
export function isVehicleImageArray(data: any): data is VehicleImage[] {
  return Array.isArray(data) && 
         data.length > 0 && 
         typeof data[0] === 'object' &&
         data[0] !== null &&
         'image_url' in data[0] &&
         typeof data[0].image_url === 'string';
}

// Fonction utilitaire pour extraire les URL d'images en toute sécurité
export function extractImageUrls(data: any): string[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data
    .filter(item => item && typeof item === 'object' && item !== null)
    .filter(item => 'image_url' in item && typeof item.image_url === 'string')
    .map(item => item.image_url as string)
    .filter(Boolean);
}

// Fonction pour convertir l'ID du véhicule au format approprié
export function formatVehicleId(vehicleId: string | number): number {
  // Pour une colonne vehicle_id de type integer dans Supabase
  return typeof vehicleId === 'string' ? parseInt(vehicleId, 10) : vehicleId;
}

// Fonctions utilitaires pour interagir avec la table vehicle_images
export async function fetchVehicleImages(vehicleId: string | number) {
  const formattedId = formatVehicleId(vehicleId);
  
  // Utilisation de la méthode rpc pour contourner la limitation des types
  const { data, error } = await supabase.rpc('get_vehicle_images', {
    v_id: formattedId
  });
  
  return { data, error };
}

// Fonction pour ajouter des images de véhicule
export async function addVehicleImages(images: VehicleImage[]) {
  // Utilisation de la méthode rpc pour contourner la limitation des types
  const { data, error } = await supabase.rpc('add_vehicle_images', {
    images_data: JSON.stringify(images)
  });
  
  return { data, error };
}
