import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navlabel from "~/layout/navlabel";

const isInitialRender = { current: true };

export default function StaffButtonBar() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const session = useSession();
  const [isStaff, setIsStaff] = useState(false);

  // console.log("isStaff", isStaff);
  // console.log("initial render 0? ", isInitialRender.current);

  useEffect(() => {
    function checkIfStaff() {
      console.log("reached");
      try {
        // console.log(session);
        supabase
          .from("profiles")
          .select("isstaff")
          .eq("user_uid", session?.user?.id)
          .then(({ data: profile_info, error }) => {
            // console.log("reached");
            if (profile_info?.[0]?.isstaff) {
              // console.log(profile_info);
              setIsStaff(true);
              //   console.log("isStaff", isStaff);
            } else {
              setIsStaff(false);
              //   console.log("isStaff", isStaff);
            }
          });
      } catch (error) {
        // console.log(error);
        setIsStaff(false);
      }
    }
    if (
      router.pathname != "/login" &&
      isInitialRender.current == true &&
      session
    ) {
      console.log("initial render 1? ", isInitialRender.current);
      checkIfStaff();
      isInitialRender.current = false;
      console.log("initial render 2? ", isInitialRender.current);
    } else if (router.pathname == "/login") {
      checkIfStaff();
      isInitialRender.current = true;
    }
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
