import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { type NextRouter, useRouter } from "next/router";
import { useState, useEffect, useCallback, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import CarUpdateComponent from "~/components/CarUpdateComponent";
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
  outlet: {
    outlet_id: number;
    location: string;
  };
}

export default function CarEdit() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const [outletID, setOutletID] = useState(0);

  const { session, isLoading } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

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

  const { data } = api.vehicleInfoQuery.getVehicleInfo.useQuery({
    text: carid as string,
  });

  const vehicle = (data as CarType[])?.[0];

  if (!isStaff && !session) {
    return null;
  } else {
    //check that staff is from the same outlet as the vehicle
    if (!vehicle) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="mx-auto">
            <ClipLoader
              color={color}
              loading={loading}
              size={150}
              cssOverride={override}
            />
          </div>
        </div>
      );
    } else {
      if (outletID == vehicle?.outlet_id) {
        return <CarUpdateComponent vehicleInfo={vehicle} />;
      } else {
        return <div>Not authorized to view this page</div>;
      }
    }
  }
}
