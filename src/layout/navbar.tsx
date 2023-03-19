import AccountButton from "~/components/AccountButton";
import Image from "next/image";
import Navlabel from "./navlabel";
import Link from "next/link";
import StaffButtonBar from "~/components/StaffButtonbar";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-40 min-w-full border-b-2 bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-between px-4 py-2 sm:px-6 lg:max-w-7xl lg:flex-row lg:px-8">
        <div className="block place-self-center lg:place-self-start">
          <Link href="/">
            <Image src="/logo.png" alt="" width={250} height={79} />
          </Link>
        </div>
        <div className="hidden flex-row items-center lg:flex lg:place-self-end custxs:place-self-center custxs:text-sm">
          <Navlabel text="Home" />
          <Navlabel text="About" />
          <Navlabel text="Contact" />
          <StaffButtonBar />
          <AccountButton />
        </div>
        <div className="scrollbar-hide flex w-full flex-row items-center overflow-x-scroll lg:hidden lg:place-self-end custxs:place-self-center custxs:text-sm">
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
