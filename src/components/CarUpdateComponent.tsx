import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";

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
  isactive: boolean;
  outlet_id: number;
  vehicle_registration_number: string;
  engine_size: string;
  mot_test_date: string;
}

interface CUCProps {
  vehicleInfo: CarType;
}

export default function CarUpdateComponent({ vehicleInfo }: CUCProps) {
  const [car, setCar] = useState(vehicleInfo);

  const { mutate, isLoading } = api.mutateCarRouter.CarUpdate.useMutation({
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return (
    <div className="grid">
      <form className="relative m-10 place-self-center overflow-auto rounded-xl border p-10 pt-5 shadow-lg custxs:w-5/6  custsm:w-5/6 custmd:w-5/6 custlg:w-5/6 custxl:w-2/3 cust2xl:w-2/3">
        <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
          <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
            <img
              src={car?.imagesrc}
              alt={car?.imagealt}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            />
          </div>
        </div>
        <label
          className="mt-4 mb-2 block font-bold text-gray-700"
          htmlFor="reg-number"
        >
          Vehicle Registration Number [Read-Only]
        </label>
        <input
          readOnly={true}
          type="text"
          name="reg-number"
          id="reg-number"
          value={car?.vehicle_registration_number}
          onChange={(e) =>
            setCar({ ...car, vehicle_registration_number: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <div className="mt-4 grid grid-cols-2 justify-between custxs:text-xs">
          <div>
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="make"
            >
              Vehicle Make
            </label>
            <input
              type="text"
              name="make"
              id="make"
              value={car?.vehicle_make}
              onChange={(e) => setCar({ ...car, vehicle_make: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />

            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="imagesrc"
            >
              Image Source
            </label>
            <input
              type="text"
              name="imagesrc"
              id="imagesrc"
              value={car?.imagesrc}
              onChange={(e) => setCar({ ...car, imagesrc: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="capacity"
            >
              Vehicle Capacity
            </label>
            <input
              type="text"
              name="capacity"
              id="capacity"
              value={isNaN(car?.capacity) ? "" : car?.capacity}
              onChange={(e) =>
                setCar({ ...car, capacity: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />

            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="color"
            >
              Vehicle Color
            </label>
            <input
              type="text"
              name="color"
              id="color"
              value={car?.color}
              onChange={(e) => setCar({ ...car, color: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="mileage"
            >
              Vehicle Mileage
            </label>
            <input
              type="text"
              name="mileage"
              id="mileage"
              value={isNaN(car?.mileage) ? "" : car?.mileage}
              onChange={(e) =>
                setCar({ ...car, mileage: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="availability"
            >
              Availability
            </label>
            <select
              name="availability"
              id="availability"
              value={car?.isactive ? "Yes" : "No"}
              onChange={(e) =>
                setCar({ ...car, isactive: e.target.value === "Yes" })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="model"
            >
              Vehicle Model
            </label>
            <input
              type="text"
              name="model"
              id="model"
              value={car?.vehicle_model}
              onChange={(e) =>
                setCar({ ...car, vehicle_model: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="hire-rate"
            >
              Hire Rate
            </label>
            <input
              type="text"
              name="hire-rate"
              id="hire-rate"
              value={isNaN(car?.hire_rate) ? "" : car?.hire_rate}
              onChange={(e) =>
                setCar({ ...car, hire_rate: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="imagealt"
            >
              Image Alt
            </label>
            <input
              type="text"
              name="imagealt"
              id="imagealt"
              value={car?.imagealt}
              onChange={(e) => setCar({ ...car, imagealt: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />

            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="engine-size"
            >
              Engine Size
            </label>
            <input
              type="text"
              name="engine-size"
              id="engine-size"
              value={car?.engine_size}
              onChange={(e) => setCar({ ...car, engine_size: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label
              className="mt-4 mb-2 block font-bold text-gray-700"
              htmlFor="outlet-id"
            >
              Outlet ID
            </label>
            <input
              type="text"
              name="outlet-id"
              id="outlet-id"
              value={isNaN(car?.outlet_id) ? "" : car?.outlet_id}
              onChange={(e) =>
                setCar({ ...car, outlet_id: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            className="mt-4 mb-2 block font-bold text-gray-700"
            htmlFor="mot_test_date"
          >
            MOT Test Date
          </label>
          <input
            type="date"
            value={car.mot_test_date}
            onChange={(e) => setCar({ ...car, mot_test_date: e.target.value })}
          ></input>
        </div>
        <div className="mb-5 mt-5 h-auto overflow-auto">
          <span className="text-md font-medium">Description</span>
          <textarea
            name="description"
            id="description"
            rows={7}
            value={car?.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            className="mt-1 block h-auto w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log(car);
            const hasNoNullValues = Object.values(car).every(
              (value) => value != null && value != undefined
            );
            if (hasNoNullValues) {
              mutate(car);
            } else {
              toast("Please fill in all the fields");
            }
          }}
          className="mb-2 block w-full rounded border-2 px-6 pt-2 pb-[6px] text-xl font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-gray-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-gray-600 focus:border-gray-600 focus:text-gray-600 focus:outline-none focus:ring-0 active:bg-gray-700 active:text-white dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
        >
          Update Vehicle
        </button>
      </form>
    </div>
  );
}
