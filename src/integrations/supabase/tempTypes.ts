
import { Database } from './types';

// Extension temporaire des types Supabase pour inclure vehicle_images
export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  created_at: string;
}

// Fonction utilitaire pour vérifier si les données sont des images de véhicules
export function isVehicleImageArray(data: any): data is VehicleImage[] {
  return Array.isArray(data) && data.length > 0 && 'image_url' in data[0];
}
