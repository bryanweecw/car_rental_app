/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import cars from "./cars.json";
import React, { useState } from "react";
import Navbar from "~/layout/navbar";
import SearchBar from "~/components/SearchBar";
import Fuse from "fuse.js";

const cars_available = cars.filter((cars) => cars.isRented == false);

const Home: NextPage = () => {
  interface carObject {
    // id: number;
    // name: string;
    // imageSrc: string;
    // imageAlt: string;
    // description: string;
    // price: number;
    // color: string;
    id: number;
    vehicle_registration_number: string;
    vehicle_model: string;
    vehicle_make: string;
    engine_size: string;
    capacity: number;
    milage: number;
    MOT_test_date: string;
    hire_rate: number;
    outlet_id: number;
    isRented: boolean;
    isActive: boolean;
    imageSrc: string;
    imageAlt: string;
    description: string;
    color: string;
  }

  const [query, setQuery] = useState("");
  const options = {
    keys: ["vehicle_make", "vehicle_model", "hire_rate"],
    includedScore: true,
    threshold: 0.35,
  };
  const fuse = new Fuse(cars_available, options);
  const results = fuse.search(query);
  const carResult: carObject[] = query
    ? results.map((result) => result.item)
    : cars_available;

  return (
    <>
      <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Cars Available
          </h2>
          {/* <CarsSearchBar apiData={cars} /> */}
          <SearchBar query={query} setQuery={setQuery} />
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {carResult.map((car) => (
              <div key={car.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 lg:aspect-none h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                  <img
                    src={car.imageSrc}
                    alt={car.imageAlt}
                    className="g:h-full h-full w-full object-contain object-center lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/cars/${car.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {car.vehicle_make}
                        {" "}
                        {car.vehicle_model}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{car.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${car.hire_rate}/day
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
