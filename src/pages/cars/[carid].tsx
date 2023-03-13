/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import cars from "../cars.json";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import { useSession } from "@supabase/auth-helpers-react";

const Car = () => {
  type CustomDateRange = {
    startDate: Date;
    endDate: Date | null;
  };
  type UnformattedDateRange = {
    startDate: string;
    endDate: string | null;
  };
  const session = useSession();

  const router = useRouter();
  const { carid } = router.query;
  const car = cars.find((car) => car.id.toString() === carid);

  const [value, setValue] = useState<CustomDateRange>({
    startDate: new Date(),
    endDate: null,
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const notify = () => {if(session != null) {
                        toast("Booking successful!");
                        } else {toast("Please log in or create an account!")}}

  const handleValueChange = (newValue: UnformattedDateRange) => {
    const formattedValue: CustomDateRange = {
      startDate: new Date(newValue.startDate),
      endDate:
        newValue.endDate != null
          ? new Date(newValue.endDate)
          : new Date(newValue.startDate),
    };
    console.log("newValue:", newValue);
    setValue(formattedValue);
  };

  function getTotalPrice(startDate: Date, endDate: Date, pricePerDay: number) {
    const numberOfDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const totalPrice = pricePerDay * numberOfDays;
    return totalPrice;
  }

  if (!car) {
    return <p>Car not found</p>;
  }

  return (
    <>
      <div className="grid">
        <div
          key={car.id}
          className="relative m-10 place-self-center rounded-xl border p-10 pt-5 shadow-lg custxs:w-5/6  custsm:w-5/6 custmd:w-5/6 custlg:w-5/6 custxl:w-2/3 cust2xl:w-2/3"
        >
          <Link href="/" className="w-1/5  font-light text-slate-400">
            <button
              type="button"
              className="mb-5 flex items-center rounded-md bg-white  py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <svg width="24" height="24" viewBox="0 0 16 16">
                <path
                  d="M9 4 L5 8 L9 12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />
              </svg>
              Back
            </button>
          </Link>

          <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
            <img
              src={car.imageSrc}
              alt={car.imageAlt}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-xl text-gray-700">{car.vehicle_make} {" "} {car.vehicle_model}</h3>
              <p className="mt-1 text-lg text-gray-500">{car.color}</p>
              <p className="mt-1 text-lg text-gray-700">Milage: {car.milage} Km</p>
              <p className="mt-1 text-lg text-gray-700">Capacity: {car.capacity} people</p>
            </div>
            <p className="text-xl font-medium text-gray-900">
              ${car.hire_rate}/day
            </p>
          </div>
          <div className="mt-5">
            <span className="text-md font-medium">Description</span>
            <p className="text-sm">{car.description}</p>
          </div>
          <div className="my-5">
            <p className="text-md mb-3 font-medium">Select Booking Dates:</p>
            <Datepicker
              value={value}
              toggleClassName="rounded-r-lg bg-opacity-40 bg-gray-400 hover:bg-blue-800 hover:bg-opacity-60 transition-all duration-150 ease-in-out"
              onChange={handleValueChange}
              minDate={yesterday}
              showShortcuts={false}
            />
          </div>
          {value.endDate != null && value.startDate != null ? (
            <>
              Total Cost: $
              {getTotalPrice(value.startDate, value.endDate, car.hire_rate)}
            </>
          ) : (
            <></>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              notify();
            }}
            className="mb-2 block w-full rounded border-2 px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-gray-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-gray-600 focus:border-gray-600 focus:text-gray-600 focus:outline-none focus:ring-0 active:bg-gray-700 active:text-white dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Car;
