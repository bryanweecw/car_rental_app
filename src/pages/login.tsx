import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  if (session) {
    void router.push("/");
    return null; // Return null to prevent rendering the rest of the component
  }

  return (
    <div className="pt-20">
      <div className="grid w-full">
        <div className="relative w-3/5 place-self-center rounded-lg  border p-10 custxs:w-4/5 custxl:w-2/5 cust2xl:w-2/5">
          <div className="">
            <Link
              href="/"
              className="relative w-1/5  font-light text-slate-400"
            >
              <button
                type="button"
                className="mb-5 flex items-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <svg width="24" height="24" viewBox="0 0 16 16">
                  <path
                    d="M9 4 L5 8 L9 12"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                </svg>
                Back
              </button>
            </Link>
            <Image src="/logo.png" alt="" width={500} height={500} />
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              theme="light"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
