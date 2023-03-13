import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/layout/navbar";
import ContactPage from "~/components/contactpage";

export default function Contact() {
  return <>
  <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
  </Head>
  <Navbar />
  <div className = "w-full">
    <ContactPage/>
  </div>
  </>;
}
