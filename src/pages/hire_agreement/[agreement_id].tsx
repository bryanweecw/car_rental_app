/* eslint-disable @next/next/no-img-element */
import {
  useSessionContext,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { type CSSProperties, useCallback, useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
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
  vehicle_registration_number: string;
}

type AgreementInfo = {
  staff: { profiles: { first_name: string; last_name: string } };
  client: { profiles: { first_name: string; last_name: string } };
  client_uid: string | null;
  date_end: string | null;
  date_start: string | null;
  hire_agreement_id: number;
  rental_cost: number | null;
  staff_uid: string | null;
  transaction_id: number | null;
  vehicle: CarType;
  vehicle_registration_number: string | null;
};

export default function Agreement() {
  //for ClipLoader
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const { session, isLoading } = useSessionContext();
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { agreement_id } = router.query;
  const [isStaff, setIsStaff] = useState(false);

  const checkIfStaff = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};
      const { data: profile_info } = await supabase
        .from("profiles")
        .select("isstaff")
        .eq("user_uid", id);
      const isStaffLocal = Boolean(profile_info?.[0]?.isstaff);
      if (!isStaffLocal) {
        setIsStaff(false);
        // if the user is not staff, redirect them to the home page
      } else {
        setIsStaff(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase]);

  //check if user is staff or if user is owner of agreement
  //if not, redirect to home page
  useEffect(() => {
    if (!isLoading && !session) {
      void router.push("/");
    } else {
      // if the user is logged in, or if we don't know if they are logged in
      // because it is still loading check if they are staff
      void checkIfStaff();
    }
  }, [session, isLoading, supabase, router, checkIfStaff]);

  const postQuery = api.HireAgreementInfoQuery.getHireAgreementInfo.useQuery({
    text: agreement_id ? agreement_id.toString() : "",
  });

  if (user) {
    if (postQuery.status == "loading") {
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
    } else if (postQuery.status == "success") {
      const { data } = postQuery;
      const infoData = data as unknown as AgreementInfo[];
      console.log(infoData);
      if (Object.keys(infoData).length == 0 || infoData[0] == null) {
        void router.push("/404");
      } else {
        if (
          isStaff ||
          (!isLoading &&
            user &&
            (user.id == infoData[0].client_uid ||
              user.id == infoData[0].staff_uid))
        ) {
          const selectedCar = infoData[0].vehicle;
          return (
            <>
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
                    <p className="mt-1 text-lg text-gray-500">
                      {selectedCar.color}
                    </p>
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
                  <span className="text-md font-medium">Description</span>
                  <p className="text-sm">{selectedCar.description}</p>
                </div>
              </div>
              <div className="mx-auto border p-10">
                YOUR HIRE AGREEMENT DETAILS:
                <div className="grid grid-cols-2">
                  <div className="mt-5">
                    <span className="text-md font-medium">Agreement ID</span>
                    <p className="text-sm">{infoData[0].hire_agreement_id}</p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">Start Date</span>
                    <p className="text-sm">{infoData[0].date_start}</p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">End Date</span>
                    <p className="text-sm">{infoData[0].date_end}</p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">Rental Cost</span>
                    <p className="text-sm">${infoData[0].rental_cost}</p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">Transaction ID</span>
                    <p className="text-sm">{infoData[0].transaction_id}</p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">Staff Name</span>
                    <p className="text-sm">
                      {infoData[0].staff.profiles.first_name}{" "}
                      {infoData[0].staff.profiles.last_name}
                    </p>
                  </div>
                  <div className="mt-5">
                    <span className="text-md font-medium">Client Name</span>
                    <p className="text-sm">
                      {infoData[0].client.profiles.first_name}{" "}
                      {infoData[0].client.profiles.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        }
      }
    } else {
      return <></>;
    }
  }
}
