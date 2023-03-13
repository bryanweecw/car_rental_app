/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Link from "next/link";
import config from "~/config.json";

interface NavlabelProps {
  text: "Home" | "About" | "Contact" | "Login" | "Account";
}

export default function Navlabel({ text }: NavlabelProps) {
  return (
    <Link className="mx-5 py-2" href={config.NavBarLinks[text]}>
      {text}
    </Link>
  );
}
