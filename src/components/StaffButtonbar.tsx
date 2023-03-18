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

  const [isStaff, setIsStaff] = useState(false);
  const session = useSession();

  useEffect(() => {
    async function checkIfStaff() {
      try {
        const { data: profile_info } = await supabase
          .from("profiles")
          .select("isstaff")
          .eq("user_uid", session?.user?.id);
        const isStaff = Boolean(profile_info?.[0]?.isstaff);
        setIsStaff(isStaff);
      } catch (error) {
        console.error(error);
      }
    }
    if (session && session.user && session.user.id) {
      void checkIfStaff();
    }
    console.log("useEffect was run");
  }, [session]);

  if (router.pathname == "/login" || !isStaff || !session) {
    return null;
  } else {
    return <Navlabel text="Dashboard" />;
  }
}
