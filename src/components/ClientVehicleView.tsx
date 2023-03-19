/* eslint-disable @next/next/no-img-element */
interface CarType {
  id: number;
  vehicle_make: string;
  vehicle_model: string;
  color: string;
  mileage: number;
  capacity: number;
  hire_rate: number;
  imagesrc: string;
  imagealt: string;
  description: string;
  vehicle_registration_number: string;
}

type CVVProps = {
  vehicleData: CarType;
};

export default function ClientVehicleView({ vehicleData }: CVVProps) {
  const selectedCar = vehicleData;
  return (
    <div className="mx-auto border p-10">
      YOU PICKED
      <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
        <img
          src={selectedCar.imagesrc}
          alt={selectedCar.imagealt}
          className="h-full w-full object-contain object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-xl text-gray-700">
            {selectedCar.vehicle_make} {selectedCar.vehicle_model}
          </h3>
          <p className="mt-1 text-lg text-gray-500">{selectedCar.color}</p>
          <p className="mt-1 text-lg text-gray-700">
            Mileage: {selectedCar.mileage} Km
          </p>
          <p className="mt-1 text-lg text-gray-700">
            Capacity: {selectedCar.capacity} People
          </p>
        </div>
        <p className="text-xl font-medium text-gray-900">
          ${selectedCar.hire_rate}/day
        </p>
      </div>
      <div className="mt-5">
        <div className="text-md font-medium">Description</div>
        <p className="text-sm">{selectedCar.description}</p>
      </div>
    </div>
  );
}
