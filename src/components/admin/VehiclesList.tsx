
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

interface VehiclesListProps {
  onEdit: (vehicle: Vehicle) => void;
}

const VehiclesList = ({ onEdit }: VehiclesListProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les véhicules",
      });
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
      toast({
        title: "Véhicule supprimé",
        description: "Le véhicule a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
      });
      console.error("Error deleting vehicle:", error);
    }
  };

  const toggleVehicleStatus = async (vehicle: Vehicle) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ is_sold: !vehicle.is_sold })
        .eq("id", vehicle.id);

      if (error) {
        throw error;
      }

      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id ? { ...v, is_sold: !v.is_sold } : v
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `Le véhicule est maintenant marqué comme ${
          !vehicle.is_sold ? "vendu" : "disponible"
        }.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du véhicule",
      });
      console.error("Error updating vehicle status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garage-red"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liste des véhicules ({vehicles.length})</h2>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun véhicule disponible</p>
          <p className="text-sm text-gray-400 mt-2">
            Ajoutez votre premier véhicule en cliquant sur "Nouvelle annonce"
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marque & Modèle</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Kilomètres</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }).format(vehicle.price)}
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('fr-FR').format(vehicle.mileage)} km
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={vehicle.is_sold ? "outline" : "default"}
                      className={vehicle.is_sold ? "bg-gray-100" : "bg-green-100 text-green-800"}
                    >
                      {vehicle.is_sold ? "Vendu" : "Disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVehicleStatus(vehicle)}
                      className="h-8 w-8 p-0"
                    >
                      {vehicle.is_sold ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(vehicle)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
