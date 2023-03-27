import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export type ClientTabContextType = {
  activeTab: ClientTabSelectionString;
  setActiveTab: (tab: ClientTabSelectionString) => void;
};

export type ClientTabSelectionString = "hire_agreements" | "profile";

const ClientTabContext = createContext<ClientTabContextType>({
  activeTab: "profile",
  setActiveTab: () => {
    null;
  },
});
export default function ClientTabContextWrapper({ children }: Props) {
  const [activeTab, setActiveTab] =
    useState<ClientTabSelectionString>("profile");

  const sharedState = {
    activeTab,
    setActiveTab,
  };

  return (
    <ClientTabContext.Provider value={sharedState}>
      {children}
    </ClientTabContext.Provider>
  );
}

export function useClientTabContext() {
  return useContext(ClientTabContext);
}
