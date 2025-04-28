
const EmptyVehiclesList = () => {
  return (
    <div className="text-center py-10 bg-gray-50 rounded-lg">
      <p className="text-gray-500">Aucun véhicule disponible</p>
      <p className="text-sm text-gray-400 mt-2">
        Ajoutez votre premier véhicule en cliquant sur "Nouvelle annonce"
      </p>
    </div>
  );
};

export default EmptyVehiclesList;
