import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export type UserContextType = {
  role: userRole;
  setRole: (role: userRole) => void;
  userLogOut: () => void;
};

type userRole = "client" | "staff" | "unauthenticated";

const UserContext = createContext<UserContextType>({
  role: "unauthenticated",
  setRole: () => {
    null;
  },
  userLogOut: () => {
    null;
  },
});
export default function UserContextWrapper({ children }: Props) {
  const [role, setRole] = useState<userRole>("unauthenticated");

  const userLogOut = () => {
    setRole("unauthenticated");
  };

  const sharedState = {
    role,
    setRole,
    userLogOut,
  };

  return (
    <UserContext.Provider value={sharedState}>{children}</UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
