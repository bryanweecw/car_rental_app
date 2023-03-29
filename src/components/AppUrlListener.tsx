/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from "react";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { useRouter } from "next/router";

const AppUrlListener: React.FC<any> = () => {
  const router = useRouter();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      const slug = event.url.split(".com").pop();
      if (slug) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void router.push(slug);
      }
      // If no match, do nothing - let regular routing
      // logic take over
    });
  }, []);

  return null;
};

export default AppUrlListener;
