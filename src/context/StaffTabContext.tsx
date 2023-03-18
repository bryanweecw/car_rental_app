import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export type StaffTabContextType = {
  activeTab: StaffTabSelectionString;
  setActiveTab: (tab: StaffTabSelectionString) => void;
};

export type StaffTabSelectionString =
  | "hire_agreements"
  | "fleet_management"
  | "client_management"
  | "billing";

const StaffTabContext = createContext<StaffTabContextType>({
  activeTab: "hire_agreements",
  setActiveTab: () => {
    null;
  },
});
export default function StaffTabContextWrapper({ children }: Props) {
  const [activeTab, setActiveTab] =
    useState<StaffTabSelectionString>("hire_agreements");

  const sharedState = {
    activeTab,
    setActiveTab,
  };

  return (
    <StaffTabContext.Provider value={sharedState}>
      {children}
    </StaffTabContext.Provider>
  );
}

export function useStaffTabContext() {
  return useContext(StaffTabContext);
}
