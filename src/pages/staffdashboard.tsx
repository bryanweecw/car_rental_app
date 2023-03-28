import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { type NextRouter, useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";
import ClientManagementTable from "~/components/ClientManagementTable";
import FleetManagementTable from "~/components/FleetManagementTable";
import HireAgreementTable from "~/components/HireAgreementTable";
import TabBar from "~/components/TabBar";
import { useStaffTabContext } from "~/context/StaffTabContext";
import StaffToDo from "~/components/StaffToDo";

interface profileResType {
  isstaff: boolean;
  first_name: string;
  last_name: string;
  staff: {
    outlet: {
      outlet_id: number;
      location: string;
    };
  };
}

export default function StaffDashboard() {
  const { activeTab } = useStaffTabContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [location, setLocation] = useState("");
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
        .select(`*, staff(outlet(outlet_id, location))`)
        .eq("user_uid", id);
      // profileRes gets replaced with the return value of the query, which contains the boolean flag of whether the user is staff or not

      const isStaffLocal = Boolean(profileRes.data?.[0]?.isstaff);
      // we extract the boolean flag from the return value of the query

      const staffNameLocal =
        String((profileRes.data?.[0] as profileResType).first_name) +
        " " +
        String((profileRes.data?.[0] as profileResType).last_name);

      const outletNameLocal =
        String((profileRes.data?.[0] as profileResType).staff.outlet.location) +
        " (Outlet ID: " +
        String(
          (profileRes.data?.[0] as profileResType).staff.outlet.outlet_id
        ) +
        ")";

      setStaffName(staffNameLocal);
      setLocation(outletNameLocal);

      setIsStaff(isStaffLocal);

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

  if (!isStaff && !session) {
    return null;
  } else {
    return (
      <>
        <div className="min-h-full">
          <div className="py-10">
            <header>
              <div className="mx-auto mb-5 max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Dashboard
                </h1> */}
                <h1 className="mb-2 text-3xl font-light leading-tight tracking-tight text-gray-900">
                  Welcome to your Dashboard, <br />
                  {staffName}
                </h1>
                <span className="text-md">Outlet: {location}</span>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <TabBar />
                {activeTab === "hire_agreements" ? (
                  <HireAgreementTable id={session?.user.id as string} />
                ) : activeTab === "fleet_management" ? (
                  <FleetManagementTable id={session?.user.id as string} />
                ) : activeTab === "client_management" ? (
                  <ClientManagementTable />
                ) : activeTab === "billing" ? (
                  <div>Billing</div>
                ) : activeTab === "to_do" ? (
                  <StaffToDo />
                ) : (
                  <></>
                )}
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }
}
