
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, CheckCircle, XCircle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Vehicle = Tables<"vehicles">;

interface VehicleTableRowProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (vehicle: Vehicle) => void;
}

const VehicleTableRow = ({ vehicle, onEdit, onDelete, onToggleStatus }: VehicleTableRowProps) => {
  return (
    <TableRow>
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
          onClick={() => onToggleStatus(vehicle)}
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
          onClick={() => onDelete(vehicle.id)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default VehicleTableRow;
