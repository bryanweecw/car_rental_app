import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/layout/navbar";

export default function About() {
  return <>
    <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {/* <div className="bg-white">
        <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8"></div>
        </div> */}
  </>;
}
