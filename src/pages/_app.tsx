import { type AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { useState } from "react";
import type { Database } from "~/types/database-raw";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "~/layout/navbar";
import StaffTabContextWrapper from "~/context/StaffTabContext";
import ClientTabContextWrapper from "~/context/ClientTabContext";
import { Analytics } from "@vercel/analytics/react";

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <ClientTabContextWrapper>
        <StaffTabContextWrapper>
          <Navbar />
          <Component {...pageProps} />
          <Analytics />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </StaffTabContextWrapper>
      </ClientTabContextWrapper>
    </SessionContextProvider>
  );
}

export default api.withTRPC(MyApp);
