
import { Database } from './types';

// Extension temporaire des types Supabase pour inclure vehicle_images
export interface VehicleImage {
  id: string | number;
  vehicle_id: string | number; // Support both string (UUID) and number formats
  image_url: string;
  created_at: string;
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
