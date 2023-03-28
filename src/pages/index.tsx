/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Navbar from "~/layout/navbar";
import SearchBar from "~/components/SearchBar";
import Fuse from "fuse.js";
import {
  type getVehiclesResponseSuccess,
  vehicleQueryRouter,
} from "~/server/api/routers/vehicleQueryRouter";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

// type staticprops = {
//   data: object;
// };

// const cars_available = cars.filter((cars) => cars.isActive == true);

interface TrpcStateVehicle {
  queries: {
    state: {
      data: getVehiclesResponseSuccess;
    };
  }[];
}

interface HomeProps {
  trpcState: TrpcStateVehicle;
}

interface OutletInfo {
  outlet_id: number;
  location: string;
}

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: vehicleQueryRouter,
    ctx: {},
  });
  // prefetch `post.byId`
  await ssg.hello.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

const Home = (props: HomeProps) => {
  const outlets = [
    {
      outlet_id: 1929,
      location: "50 Kallang Ave, #01-01, Singapore 339505",
    },
    {
      outlet_id: 1028,
      location: "1 Kim Seng Promenade, #01-01, Singapore 237994",
    },
    {
      outlet_id: 1050,
      location: "10 Bayfront Avenue, #01-01, Singapore 018956",
    },
  ];
  const [outletSelected, setOutletSelected] = useState<number[]>([]);

  const data = props.trpcState.queries[0]?.state.data;
  const cars_available = data?.filter((ele) => {
    if (outletSelected.length == 0) {
      return ele.isactive;
    } else {
      return ele.isactive && outletSelected.includes(ele.outlet_id as number);
    }
  });
  const [query, setQuery] = useState("");
  const options = {
    keys: ["vehicle_make", "vehicle_model", "hire_rate"],
    includedScore: true,
    threshold: 0.35,
  };
  const fuse = new Fuse(cars_available ? cars_available : [], options);
  const results = fuse.search(query);
  const carResult = query
    ? results.map((result) => {
        result.item;
      })
    : cars_available;

  return (
    <>
      <Head>
        <title>SMILES Car Rental</title>
        <meta name="description" content="Rent Cars with a Smile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Cars Available
          </h2>
          {/* <CarsSearchBar apiData={cars} /> */}
          <SearchBar query={query} setQuery={setQuery} />
          <div className="rounded-lg border border-black px-2 py-5">
            <h1 className="font-bold">Select Outlets</h1>
            {outlets.map((outlet) => (
              <span key={outlet.outlet_id} className="mx-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={outlet.outlet_id}
                  key={outlet.outlet_id}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    if (outletSelected.includes(newValue)) {
                      setOutletSelected((prevState) =>
                        prevState.filter((id) => id !== newValue)
                      );
                    } else {
                      setOutletSelected((prevState) => [
                        ...prevState,
                        newValue,
                      ]);
                    }
                  }}
                />
                <label htmlFor={outlet.outlet_id.toString()}>
                  {outlet.location}
                </label>
              </span>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {carResult?.map((car) => (
              <div key={car?.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 lg:aspect-none h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
                  <img
                    src={car?.imagesrc !== null ? car?.imagesrc : ""}
                    alt={car?.imagealt !== null ? car?.imagealt : ""}
                    className="g:h-full h-full w-full object-contain object-center lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link
                        href={`/cars/${
                          car?.id && car?.id !== undefined
                            ? car?.id.toString()
                            : ""
                        }`}
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {car?.vehicle_make} {car?.vehicle_model}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{car?.color}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {(car?.outlet as unknown as OutletInfo)?.location}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${car?.hire_rate}/day
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
