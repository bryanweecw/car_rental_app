import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import router, { NextRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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

export default function VehicleAdd() {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { user } = session ?? {};
  const { id } = user ?? {};

  const supabase = useSupabaseClient();
  const [isStaff, setIsStaff] = useState(false);
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

      if (!isStaffLocal) {
        void redirectToHome(router);
      }
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase]);
  // useCallback is used to prevent the function from being
  // recreated every time the component is rendered

  useEffect(() => {
    if (!isSessionLoading) {
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
  }, [session, isSessionLoading, supabase, checkIfStaff]);

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

  const [car, setCar] = useState({} as CarType);

  const outlets = [
    {
      outlet_id: 1929,
      location: "50 Kallang Ave, #01-01, Singapore 339505",
    },
    {
      outlet_id: 1028,
      location: "1 Kim Seng Promenade, #01-01, Singapore 237994",
    },
    {
      outlet_id: 1050,
      location: "10 Bayfront Avenue, #01-01, Singapore 018956",
    },
  ];

  const { mutate, isLoading } = api.addCarRouter.CarAdd.useMutation({
    onSuccess: (res) => {
      if (res?.code) {
        toast("Failed to add Vehicle");
      } else {
        toast("Vehicle Added");
      }
    },
    onError: (err) => {
      console.log(err);
      toast("Failed to add Vehicle");
    },
  });

  if (!isStaff && !session) {
    return null;
  } else {
    return (
      <div className="grid">
        <form className="relative m-10 place-self-center overflow-auto rounded-xl border p-10 pt-5 shadow-lg custxs:w-5/6  custsm:w-5/6 custmd:w-5/6 custlg:w-5/6 custxl:w-2/3 cust2xl:w-2/3">
          <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
            <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
              <img
                src={car?.imagesrc ? car?.imagesrc : ""}
                alt={car?.imagealt ? car?.imagealt : ""}
                className="h-full w-full object-contain object-center lg:h-full lg:w-full"
              />
            </div>
          </div>
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
                onChange={(e) =>
                  setCar({ ...car, vehicle_make: e.target.value })
                }
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
                onChange={(e) =>
                  setCar({ ...car, engine_size: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <label
                className="mt-4 mb-2 block font-bold text-gray-700"
                htmlFor="outlet-id"
              >
                Outlet ID
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setCar({ ...car, outlet_id: parseInt(e.target.value) })
                }
                value={isNaN(car?.outlet_id) ? "" : car?.outlet_id}
              >
                {outlets.map((outlet) => {
                  if (outlet.outlet_id === car?.outlet_id)
                    return (
                      <option selected value={outlet.outlet_id}>
                        {outlet.outlet_id}: {outlet.location}
                      </option>
                    );
                  else
                    return (
                      <option value={outlet.outlet_id}>
                        {outlet.outlet_id}: {outlet.location}
                      </option>
                    );
                })}
              </select>
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
              value={car?.mot_test_date}
              onChange={(e) =>
                setCar({ ...car, mot_test_date: e.target.value })
              }
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
            Add Vehicle
          </button>
        </form>
      </div>
    );
  }
}
