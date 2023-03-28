import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "~/layout/navbar";
import TestimonyCarousel from "~/components/TestimonyCarousel";
import { useState } from "react";

export default function About() {
  return (
    <>
      <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      </div>
      <div className="(box-shadow: 0 4px 0px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1));lg:max-w-6xl mx-auto max-w-5xl border-b bg-white/80 px-2 pb-10 pt-10 text-center lg:px-5">
        <h2 className="text-3xl font-bold tracking-tight text-black">
          About Smiles
        </h2>
        <div className="leading-2 text-md mt-3 px-5 text-justify font-extralight tracking-tight text-gray-800">
          <p>
            Welcome to Smiles Rental, a car rental service dedicated to
            providing our customers with reliable and hassle-free rental
            experiences. We pride ourselves on our commitment to excellence and
            our unwavering dedication to customer satisfaction. At Smiles
            Rental, we understand the importance of trust.
          </p>
          <br></br>
          <p>
            That&apos;s why we prioritize transparency and open communication in
            all our interactions with our customers. We believe that trust is
            the foundation of any successful business relationship and we strive
            to earn and maintain that trust with each and every customer. Our
            commitment to providing exceptional service is unwavering.
          </p>
          <br></br>
          <p>
            We understand that your time is valuable and we aim to make the
            rental process as smooth and efficient as possible. Our team of
            experienced professionals is always available to assist you with any
            questions or concerns you may have, and we work tirelessly to ensure
            that your rental experience exceeds your expectations.
          </p>
          <br></br>
          <p>
            At Smiles Rental, we believe that service is more than just a
            buzzword. It&apos;s a core value that drives everything we do. We
            understand that our success is directly tied to the satisfaction of
            our customers, and we are dedicated to providing the highest level
            of service possible. From the moment you first contact us to the
            moment you return your rental, we are committed to providing you
            with the best possible experience.
          </p>
          <br></br>
          <p>
            Thank you for choosing Smiles Rental for your rental needs. We look
            forward to serving you and exceeding your expectations with our
            values of trust, commitment, and service. Lastly, do not forget to{" "}
            <b>Smile</b>!
          </p>
        </div>
      </div>
      <div className="(box-shadow: 0 4px 0px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1));lg:max-w-6xl mx-auto max-w-5xl border-b bg-white/80 px-2 pb-10 pt-10 text-center lg:px-5">
        <h2 className="text-3xl font-bold tracking-tight text-black">
          Real People, Real Stories
        </h2>
        <p className="leading-2 text-md mt-3 px-5 text-justify font-extralight tracking-tight text-gray-800">
          At Smiles Rental, we are committed to providing you with the best car
          rental experience possible. From our wide selection of well-maintained
          vehicles to our friendly and knowledgeable staff, we strive to exceed
          your expectations every step of the way. But don&apos;t just take our
          word for it - see what our satisfied customers have to say about us!
        </p>
      </div>
      <TestimonyCarousel />
    </>
  );
}
