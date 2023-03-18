import AccountButton from "~/components/AccountButton";
import Image from "next/image";
import Navlabel from "./navlabel";
import Link from "next/link";
import StaffButtonBar from "~/components/StaffButtonbar";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 border-b-2 bg-white shadow-md">
      <div className=" mx-auto flex w-full max-w-2xl flex-row items-center justify-between px-4 py-2 sm:px-6 lg:max-w-7xl lg:px-8 custxs:flex-col">
        <div className="block place-self-start custxs:place-self-center">
          <Link href="/">
            <Image src="/logo.png" alt="" width={250} height={79} />
          </Link>
        </div>
        <div className="flex flex-row items-center place-self-end custxs:place-self-center custxs:text-sm">
          <Navlabel text="Home" />
          <Navlabel text="About" />
          <Navlabel text="Contact" />
          <StaffButtonBar />
          <AccountButton />
        </div>
      </div>
    </div>
  );
}
