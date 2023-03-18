import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navlabel from "~/layout/navlabel";

export default function StaffButtonBar() {
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

  if (router.pathname != "/login" && isStaff && session) {
    return <Navlabel text="Dashboard" />;
  } else {
    return null;
  }
}
