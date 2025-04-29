
import { supabase } from './client';

/**
 * Initialize required Supabase resources for the application
 * - Creates the "vehicles" storage bucket if it doesn't exist
 * - Sets up public access policy for the bucket
 */
export async function setupSupabaseResources() {
  try {
    // Check if the vehicles bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) throw bucketsError;
    
    // Create the vehicles bucket if it doesn't exist
    const vehiclesBucketExists = buckets?.some(bucket => bucket.name === 'vehicles');
    
    if (!vehiclesBucketExists) {
      console.log("Creating vehicles storage bucket...");
      const { error: createError } = await supabase
        .storage
        .createBucket('vehicles', {
          public: true, // Make the bucket public
          fileSizeLimit: 5242880, // 5MB file size limit
        });
      
      if (createError) throw createError;
      console.log("Vehicles bucket created successfully");
    } else {
      console.log("Vehicles bucket already exists");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error setting up Supabase resources:", error);
    return { 
      success: false, 
      error 
    };
  }
}

/**
 * Helper function to check if the user has RLS errors when trying to add/edit vehicles
 * Returns guidance on how to fix RLS issues
 */
export function getRLSInstructions() {
  return {
    title: "Problème de sécurité Supabase (RLS)",
    steps: [
      "Connectez-vous à votre console Supabase",
      "Allez dans 'Authentication' puis 'Policies'",
      "Ajoutez une politique pour la table 'vehicles' qui autorise les administrateurs",
      "Exemple de politique: (auth.uid() IN (SELECT id FROM profiles))",
      "Faites de même pour le bucket 'vehicles' dans Storage"
    ]
  };
}
