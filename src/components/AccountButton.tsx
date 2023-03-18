import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Navlabel from "~/layout/navlabel";

export default function AccountButton() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogoutClick = async () => {
    await supabase.auth.signOut(); // Sign the user out
    void router.push("/");
  };
  const session = useSession();

  if (router.pathname != "/login") {
    if (session) {
      return (
        <>
          <Navlabel text="Account" />
          <button
            className="mx-5 py-2"
            onClick={(e) => {
              e.preventDefault();
              void handleLogoutClick();
            }}
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <button
          className="mx-5 py-2"
          onClick={(e) => {
            e.preventDefault();
            void router.push("/login");
          }}
        >
          Login
        </button>
      );
    }
  } else {
    return <></>;
  }
}
