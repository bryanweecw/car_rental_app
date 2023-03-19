import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { type NextRouter, useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import HireAgreementTable from "~/components/HireAgreementTable";
import TabBar from "~/components/TabBar";
import { useStaffTabContext } from "~/context/StaffTabContext";

export default function StaffDashboard() {
  const { activeTab } = useStaffTabContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const { session, isLoading } = useSessionContext();

  function redirectToHome(router: NextRouter) {
    void router.push("/");
  }

  const checkIfStaff = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};

      const [profileRes, sessionRes] = await Promise.all([
        supabase.from("profiles").select("isstaff").eq("user_uid", id),
        // profileRes gets replaced with the boolean value of whether the user is staff
        Promise.resolve({ session, isLoading }),
        // sessionRes gets replaced with the actual session data
      ]);
      // promise.all is a bit of a hack to get around the fact that supabase doesn't
      // have a way to check if a user is logged in without making a request to the database
      // (which is slow) or making a request to the auth endpoint (which is also slow) so we
      // just make both requests at the same time and then check if the user is logged in after
      // both requests are done (which is still slow but at least it's not as slow as
      // making two requests)
      // and then we check if the user is staff after that
      // (which is also slow but at least it's not as slow as making three requests sequentially)

      const isStaffLocal = Boolean(profileRes.data?.[0]?.isstaff);
      const { session: sessionData, isLoading: isLoadingData } = sessionRes;

      setIsStaff(isStaffLocal);

      if (!isLoadingData && !isStaffLocal && !sessionData) {
        void redirectToHome(router);
      }
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase, isLoading, router]);
  // useCallback is used to prevent the function from being
  // recreated every time the component is rendered

  useEffect(() => {
    if (!isLoading && !session) {
      // if the user is not logged in, redirect them to the home page
      redirectToHome(router);
    } else {
      // if the user is logged in, or if we don't know if they are logged in
      // because it is still loading check if they are staff
      void checkIfStaff();
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
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                  Dashboard
                </h1>
              </div>
            </header>
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <TabBar />
                {activeTab === "hire_agreements" ? (
                  <HireAgreementTable />
                ) : activeTab === "fleet_management" ? (
                  <div>Fleet Management</div>
                ) : activeTab === "client_management" ? (
                  <div>Client Management</div>
                ) : activeTab === "billing" ? (
                  <div>Billing</div>
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
