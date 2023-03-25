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
        <div className="p-24">
          <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
            <img
              src={vehicle?.imagesrc}
              alt={vehicle?.imagealt}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-xl text-gray-700">
                {vehicle?.vehicle_make} {vehicle?.vehicle_model}
              </h3>
              <p className="mt-1 text-lg text-gray-500">{vehicle?.color}</p>
              <p className="mt-1 text-lg text-gray-700">
                Mileage: {vehicle?.mileage} Km
              </p>
              <p className="mt-1 text-lg text-gray-700">
                Capacity: {vehicle?.capacity} People
              </p>
            </div>
            <p className="text-xl font-medium text-gray-900">
              ${vehicle?.hire_rate}/day
            </p>
          </div>
          <div className="mt-5">
            <span className="text-md font-medium">Description</span>
            <p className="text-sm">{vehicle?.description}</p>
          </div>
        </div>
      );
    } else {
      return <div>Not authorized to view this page</div>;
    }
  }
}
