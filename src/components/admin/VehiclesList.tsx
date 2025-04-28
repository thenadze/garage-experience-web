
import { Tables } from "@/integrations/supabase/types";
import { useVehiclesData } from "./hooks/useVehiclesData";
import VehiclesTable from "./VehiclesTable";
import EmptyVehiclesList from "./EmptyVehiclesList";
import VehiclesLoading from "./VehiclesLoading";

type Vehicle = Tables<"vehicles">;

interface VehiclesListProps {
  onEdit: (vehicle: Vehicle) => void;
}

const VehiclesList = ({ onEdit }: VehiclesListProps) => {
  const { vehicles, loading, handleDeleteVehicle, toggleVehicleStatus } = useVehiclesData();

  if (loading) {
    return <VehiclesLoading />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liste des véhicules ({vehicles.length})</h2>
      
      {vehicles.length === 0 ? (
        <EmptyVehiclesList />
      ) : (
        <VehiclesTable
          vehicles={vehicles}
          onEdit={onEdit}
          onDelete={handleDeleteVehicle}
          onToggleStatus={toggleVehicleStatus}
        />
      )}
    </div>
  );
};

export default VehiclesList;
