
import { supabase } from './client';

/**
 * Initialize required Supabase resources for the application
 * - Creates the "vehicles" storage bucket if it doesn't exist
 * - Sets up public access policy for the bucket
 * - Ensures admin_users table exists
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
 * Helper function to setup required admin access
 * Can be used to create the first admin user programmatically
 * Note: In production, you'd want to set up admins directly in Supabase dashboard
 */
export async function setupAdminUser(email: string, password: string) {
  try {
    // First, check if the user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin
      .getUserByEmail(email);
      
    if (!existingUser || checkError) {
      // Create the user if they don't exist
      const { data: newUser, error: createError } = await supabase.auth
        .signUp({
          email,
          password,
        });
      
      if (createError) throw createError;
      
      // Add the user to admin_users table
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({ 
          email: email,
          created_at: new Date().toISOString()
        });
        
      if (insertError) throw insertError;
      
      return { success: true };
    }
    
    return { success: true, message: "Admin user already exists" };
  } catch (error) {
    console.error("Error setting up admin user:", error);
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
      "Exemple de politique: (auth.uid() IN (SELECT user_id FROM admin_users))",
      "Faites de même pour le bucket 'vehicles' dans Storage"
    ]
  };
}
