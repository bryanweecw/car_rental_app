import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Navlabel from "~/layout/navlabel";

export default function StaffButtonBar() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const { session, isLoading } = useSessionContext();

  const checkIfStaff = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};
      const { data: profile_info } = await supabase
        .from("profiles")
        .select("isstaff")
        .eq("user_uid", id);
      const isStaffLocal = Boolean(profile_info?.[0]?.isstaff);
      setIsStaff(isStaffLocal);
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase]);
  // useCallback is used to prevent the function from being recreated every time in the useEffect
  // instead, it's only recreated when the dependencies change

  useEffect(() => {
    if (!isLoading && session) {
      void checkIfStaff();
    }
  }, [checkIfStaff, isLoading, session, supabase]);

  if (router.pathname != "/login" && isStaff && session) {
    return <Navlabel text="Dashboard" />;
  } else {
    return null;
  }
}
