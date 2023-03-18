import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navlabel from "~/layout/navlabel";

export default function StaffButtonBar() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const handleLogoutClick = async () => {
    await supabase.auth.signOut(); // Sign the user out
  };

  const session = useSession();
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    function checkIfStaff() {
      try {
        supabase
          .from("profiles")
          .select("isstaff")
          .eq("user_uid", session?.user?.id)
          .then(({ data: profile_info, error }) => {
            if (profile_info?.[0]?.isstaff) {
              setIsStaff(true);
              console.log("isStaff", isStaff);
            } else {
              setIsStaff(false);
              console.log("isStaff", isStaff);
            }
          });
      } catch (error) {
        setIsStaff(false);
      }
    }
    checkIfStaff();
  }, [session]);

  if (router.pathname != "/login" && session && isStaff) {
    return (
      <>
        <Navlabel text="Dashboard" />
      </>
    );
  } else {
    return null;
  }
}
