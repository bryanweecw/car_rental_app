import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Navbar from "~/layout/navbar";
import TestimonyComponent, { TestifierObject } from "~/components/TestimonyComponent";
import testimonies from "~/pages/testimonies.json"

export default function About() {
  const ryan_testimony: TestifierObject = {
    name: "Ryan Lee",
    role: "Student at Yale-NUS College",
    testimonial: `One of the most reasonable and responsive car rental companies I've ever tried! I mean, just look at their website. Wow.`, 
    org_image: "/YNC.png",
    testifier_image: "/ryan.png",
  }

  return <>
    <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    <div className = "color = sand-700">

    </div>
    {testimonies.map((ele)=>{
      return(
        <TestimonyComponent testimonyObject={ele} />
      )
    })}
  </>;
}
