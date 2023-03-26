import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { type NextRouter, useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
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
}

export default function CarEdit() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const [outletID, setOutletID] = useState(0);

  const { session, isLoading } = useSessionContext();

  function redirectToHome(router: NextRouter) {
    void router.push("/");
  }

  const checkIfStaff = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};

      const profileRes = await supabase
        .from("profiles")
        .select(`isstaff, staff(outlet_id)`)
        .eq("user_uid", id);
      // profileRes gets replaced with the return value of the query, which contains the boolean flag of whether the user is staff or not

      const isStaffLocal = Boolean(profileRes.data?.[0]?.isstaff);
      const outletLocal = Number(
        (profileRes.data?.[0]?.staff as { outlet_id: number }).outlet_id
      );
      // const staffOutlet = profileRes.data?.[0]?.staff?.[0]?.outlet_id;
      // we extract the boolean flag from the return value of the query

      setIsStaff(isStaffLocal);
      setOutletID(outletLocal);

      if (!isStaffLocal) {
        void redirectToHome(router);
      }
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase, router]);
  // useCallback is used to prevent the function from being
  // recreated every time the component is rendered

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        redirectToHome(router);
      }
      // if the user is not logged in, redirect them to the home page
      else {
        // if the user is logged in, or if we don't know if they are logged in
        // because it is still loading check if they are staff
        void checkIfStaff();
      }
    }
  }, [session, isLoading, supabase, router, checkIfStaff]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        redirectToHome(router);
        //playing it realllyyy safe here
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  //retrieve vehicle info
  const { carid } = router.query;

  console.log(carid);

  const { data } = api.vehicleInfoQuery.getVehicleInfo.useQuery({
    text: carid as string,
  });

  const vehicle = (data as CarType[])?.[0];

  console.log(vehicle);

  if (!isStaff && !session) {
    return null;
  } else {
    //check that staff is from the same outlet as the vehicle
    if (outletID == vehicle?.outlet_id) {
      return (
        <div className="grid">
          <form className="relative m-10 place-self-center overflow-auto rounded-xl border p-10 pt-5 shadow-lg custxs:w-5/6  custsm:w-5/6 custmd:w-5/6 custlg:w-5/6 custxl:w-2/3 cust2xl:w-2/3">
            <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
              <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                <img
                  src={vehicle?.imagesrc}
                  alt={vehicle?.imagealt}
                  className="h-full w-full object-contain object-center lg:h-full lg:w-full"
                />
              </div>
            </div>
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
                  value={vehicle?.vehicle_make}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <label
                  className="mt-4 mb-2 block font-bold text-gray-700"
                  htmlFor="reg-number"
                >
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  name="reg-number"
                  id="reg-number"
                  value={vehicle?.vehicle_registration_number}
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
                  value={vehicle?.imagesrc}
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
                  value={vehicle?.capacity}
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
                  value={vehicle?.color}
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
                  value={vehicle?.mileage}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
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
                  value={vehicle?.vehicle_model}
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
                  value={vehicle?.hire_rate}
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
                  value={vehicle?.imagealt}
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
                  value={vehicle?.engine_size}
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
                  value={vehicle?.outlet_id}
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
                  value={vehicle?.isactive ? "Yes" : "No"}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="mb-5 mt-5 h-auto overflow-auto">
              <span className="text-md font-medium">Description</span>
              <textarea
                name="description"
                id="description"
                rows={7}
                value={vehicle?.description}
                className="mt-1 block h-auto w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                // notify();
              }}
              className="mb-2 block w-full rounded border-2 px-6 pt-2 pb-[6px] text-xl font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-gray-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-gray-600 focus:border-gray-600 focus:text-gray-600 focus:outline-none focus:ring-0 active:bg-gray-700 active:text-white dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
            >
              Update Vehicle
            </button>
          </form>
        </div>

        // <div className="p-24">
        //   <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
        //     <img
        //       src={vehicle?.imagesrc}
        //       alt={vehicle?.imagealt}
        //       className="h-full w-full object-contain object-center lg:h-full lg:w-full"
        //     />
        //   </div>
        //   <div className="mt-4 flex justify-between">
        //     <div>
        //       <h3 className="text-xl text-gray-700">
        //         {vehicle?.vehicle_make} {vehicle?.vehicle_model}
        //       </h3>
        //       <p className="mt-1 text-lg text-gray-500">{vehicle?.color}</p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Mileage: {vehicle?.mileage} Km
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Capacity: {vehicle?.capacity} People
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Engine Size: {vehicle?.engine_size}
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Outlet ID: {vehicle?.outlet_id}
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Available: {vehicle?.isactive ? "Yes" : "No"}
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         Vehicle Registration Number:{" "}
        //         {vehicle?.vehicle_registration_number}
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         imagesrc: {vehicle?.imagesrc}
        //       </p>
        //       <p className="mt-1 text-lg text-gray-700">
        //         imagealt: {vehicle?.imagealt}
        //       </p>
        //     </div>
        //     <p className="text-xl font-medium text-gray-900">
        //       ${vehicle?.hire_rate}/day
        //     </p>
        //   </div>
        //   <div className="mt-5">
        //     <span className="text-md font-medium">Description</span>
        //     <p className="text-sm">{vehicle?.description}</p>
        //   </div>
        // </div>
      );
    } else {
      return <div>Not authorized to view this page</div>;
    }
  }
}
