
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tables } from "@/integrations/supabase/types";
import VehicleTableRow from "./VehicleTableRow";

type Vehicle = Tables<"vehicles">;

interface VehiclesTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (vehicle: Vehicle) => void;
}

const VehiclesTable = ({ vehicles, onEdit, onDelete, onToggleStatus }: VehiclesTableProps) => {
  return (
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
            <VehicleTableRow 
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehiclesTable;
