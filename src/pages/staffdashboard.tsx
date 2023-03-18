import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import HireAgreementTable from "~/components/HireAgreementTable";
import TabBar from "~/components/TabBar";
import { useStaffTabContext } from "~/context/StaffTabContext";

export default function StaffDashboard() {
  const { activeTab } = useStaffTabContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const session = useSession();

  useEffect(() => {
    async function checkIfStaff() {
      try {
        const { data: profile_info } = await supabase
          .from("profiles")
          .select("isstaff")
          .eq("user_uid", session?.user?.id);
        const isStaffLocal = Boolean(profile_info?.[0]?.isstaff);
        setIsStaff(isStaffLocal);
      } catch (error) {
        console.error(error);
      }
    }
    if (session && session.user && session.user.id) {
      void checkIfStaff();
    }
  }, [session, supabase]);

  useEffect(() => {
    if (!isStaff && !session) {
      void router.push("/");
    }
  }, [isStaff, session, router]);

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
