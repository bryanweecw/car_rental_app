/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { type CSSProperties, useState, FormEvent } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import { useSession } from "@supabase/auth-helpers-react";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { vehicleInfoQueryRouter } from "~/server/api/routers/vehicleInfoQueryRouter";
import type {
  GetStaticPropsContext,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "next";
import { api } from "~/utils/api";
import { supabaseClient } from "~/server/sharedinstance";
import superjson from "superjson";
import ClipLoader from "react-spinners/ClipLoader";
import input from "postcss/lib/input";
import Stripe from "stripe";
import getStripe from "~/utils/stripe-js";

interface HAInvalidType {
  date_start: string;
  date_end: string;
}

interface SetUpStatusType {
  issetup: boolean;
}

interface CarType {
  id: number;
  hire_agreement: HAInvalidType[];
  vehicle_make: string;
  vehicle_model: string;
  color: string;
  mileage: number;
  capacity: number;
  hire_rate: number;
  imagesrc: string;
  imagealt: string;
  description: string;
  vehicle_registration_number: string;
  outlet: { outlet_id: number; location: string };
} //declare type to be used in getStaticProps

interface dataObjectType {
  vehicle_registration_number: string;
  client_uid: string;
  date_start: string;
  date_end: string;
  amount: number;
  outlet_uid: number;
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ carid: string }>
  // this is the type of the params object, which is inferred from the file name, in this case `pages/cars/[carid].tsx`, so it's `{ carid: string }`
  // this allows us to make sure that the `id` is a string and query the database with it
) {
  const ssg = createProxySSGHelpers({
    router: vehicleInfoQueryRouter,
    ctx: {},
    transformer: superjson,
  });
  // this is used to prefetch data on the server-side, ssg is short for server-side generation, you can read more about it here: https://trpc.io/docs/ssg
  // we can use supabase queries directly, but we use trpc to make it easier to use and to make it easier to add more queries in the future if we need to
  // additionally, using trpc allows us to use the same queries on the client-side, so we don't have to write the same queries twice
  const id = context.params?.carid as string;
  // prefetch `post.byId`
  await ssg.getVehicleInfo.prefetch({ text: id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 3600, //this sets the revalidation time to 60 seconds, so the page will be regenerated every 60 seconds
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  // this function is used to generate the paths for the pages, so we can use the data from the database to generate the paths
  // what this means is that if we have 10 cars in the database, we will generate 10 pages, one for each car
  const { data: vehicles, error } = await supabaseClient
    .from("vehicle")
    .select("id");

  if (error) {
    console.error(error);
    return { paths: [], fallback: "blocking" };
    //this is the fallback option, if there is an error, we will return an empty array of paths and fallback to blocking
    //blocking means that the page will be generated on the server-side, so the user will have to wait for the page to be generated
    //you can read more about fallback here: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  }

  const paths = vehicles.map((vehicle) => ({
    params: {
      carid: vehicle?.id?.toString(),
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default function Car(
  props: InferGetStaticPropsType<typeof getStaticProps> & { car: CarType }
) {
  type CustomDateRange = {
    startDate: Date;
    endDate: Date | null;
  };
  type UnformattedDateRange = {
    startDate: string;
    endDate: string | null;
  };
  const session = useSession();

  function isDateRangeValid(
    startDate: string,
    endDate: string,
    invalidDates: {
      startDate: string;
      endDate: string;
    }[]
  ) {
    for (let i = 0; i < invalidDates.length; i++) {
      const invalidStartDate = new Date(invalidDates?.[i]?.startDate as string);
      const invalidEndDate = new Date(invalidDates?.[i]?.endDate as string);

      if (
        new Date(startDate) <= invalidEndDate &&
        new Date(endDate) >= invalidStartDate
      ) {
        // The date range overlaps with an invalid date range
        return false;
      }
    }

    // The date range does not overlap with any invalid date range
    return true;
  }

  const [value, setValue] = useState<CustomDateRange>({
    startDate: new Date(),
    endDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const { data: setupStatusData } =
    api.retrieveSetUpStatus.retrieveSetUpStatus.useQuery({
      text: session?.user?.id as string,
    });

  const { mutate, isLoading } =
    api.hireAgreementCreationMutation.HireAgreementCreation.useMutation({
      onSuccess: (res) => {
        toast("Booking successful!");
      },
      onError: (err) => {
        toast("Hire Agreement Creation Failed");
        console.log(err);
      },
    });

  const notify = () => {
    if (
      session != null &&
      setupStatusData &&
      (setupStatusData as SetUpStatusType[])[0]?.issetup &&
      value.endDate != null &&
      value.startDate != null &&
      car[0]
    ) {
      const dataObject = {
        vehicle_registration_number: car[0].vehicle_registration_number,
        client_uid: session.user.id,
        date_start: value.startDate.toISOString().substring(0, 10),
        date_end: value.endDate.toISOString().substring(0, 10),
        amount: getTotalPrice(value.startDate, value.endDate, car[0].hire_rate),
        outlet_uid: car[0].outlet.outlet_id,
      };
      void handleSubmit(dataObject);
    } else if (session == null) {
      toast("Please log in or create an account!");
    } else if (
      setupStatusData &&
      (setupStatusData as SetUpStatusType[])[0]?.issetup == false
    ) {
      toast("Please complete your account setup!");
    } else {
      toast("Please select a date range!");
    }
  };

  const handleValueChange = (newValue: UnformattedDateRange) => {
    //if no overlap with invalid dates
    if (
      isDateRangeValid(
        newValue.startDate,
        newValue.endDate ? newValue.endDate : newValue.startDate,
        invalidDates ? invalidDates : []
      ) == true
    ) {
      const formattedValue: CustomDateRange = {
        startDate: new Date(newValue.startDate),
        endDate:
          newValue.endDate != null
            ? new Date(newValue.endDate)
            : new Date(newValue.startDate),
      };
      setValue(formattedValue);
    } else {
      toast("Please select a valid date range!");
    }
    //else toast
  };

  function getTotalPrice(startDate: Date, endDate: Date, pricePerDay: number) {
    const numberOfDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
    const totalPrice = pricePerDay * numberOfDays;
    return totalPrice;
  }

  const { id } = props;

  const postQuery = api.vehicleInfoQuery.getVehicleInfo.useQuery({
    text: id,
  });
  if (postQuery.status !== "success") {
    // won't happen since we're using `fallback: "blocking"`
    // but while loading, we can show a loading indicator
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto">
          <ClipLoader
            color={color}
            loading={loading}
            size={150}
            cssOverride={override}
          />
        </div>
      </div>
    );
  }

  // Partial of ./components/CheckoutForm.tsx
  // ...

  async function fetchPostJSON(url: string, data?: object) {
    try {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await response.json(); // parses JSON response into native JavaScript objects
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  }
  const handleSubmit = async (dataSubmitted: dataObjectType) => {
    // Create a Checkout Session.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
      "/api/checkout_sessions",
      dataSubmitted
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((checkoutSession as any).statusCode === 500) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error((checkoutSession as any).message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      sessionId: checkoutSession.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
  };
  // ...

  const { data } = postQuery;
  const car = data as unknown as CarType[];
  //no choice lol
  //we have to cast the data to the CarType array, because the data is an array of objects, and we want to access the first element of the array, which is an object
  //but we need to cast it to unknown first, because the data may be undefined, and we can't cast undefined to an array
  //this is very sus, but it works

  const invalidDates = car[0]?.hire_agreement.map((dates) => {
    return { startDate: dates.date_start, endDate: dates.date_end };
  });

  if (!car[0]) {
    return <p>Car not found</p>;
  }

  return (
    <>
      <div className="grid">
        <div
          key={car[0].id}
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
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              Back
            </button>
          </Link>

          <div className="aspect-w-1 aspect-h-1 lg:aspect-none min-h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-80">
            <img
              src={car[0].imagesrc}
              alt={car[0].imagealt}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-xl text-gray-700">
                {car[0].vehicle_make} {car[0].vehicle_model}
              </h3>
              <p className="mt-1 text-lg text-gray-500">{car[0].color}</p>
              <p className="mt-1 text-lg text-gray-700">
                Mileage: {car[0].mileage} Km
              </p>
              <p className="mt-1 text-lg text-gray-700">
                Capacity: {car[0].capacity} People
              </p>
              <p className="mt-1 text-lg text-gray-700">
                Outlet: {car[0].outlet.location}
              </p>
            </div>
            <p className="text-xl font-medium text-gray-900">
              ${car[0].hire_rate}/day
            </p>
          </div>
          <div className="mt-5">
            <span className="text-md font-medium">Description</span>
            <p className="text-sm">{car[0].description}</p>
          </div>
          <div className="my-5">
            <p className="text-md mb-3 font-medium">Select Booking Dates:</p>
            <Datepicker
              value={value}
              toggleClassName="rounded-r-lg bg-opacity-40 bg-gray-400 hover:bg-blue-800 hover:bg-opacity-60 transition-all duration-150 ease-in-out"
              onChange={handleValueChange}
              minDate={yesterday}
              showShortcuts={false}
              disabledDates={invalidDates}
            />
          </div>
          {value.endDate != null && value.startDate != null ? (
            <>
              Total Cost: $
              {getTotalPrice(value.startDate, value.endDate, car[0].hire_rate)}
            </>
          ) : (
            <></>
          )}
          <button
            type="button"
            onClick={(e) => {
              void postQuery.refetch();
              e.preventDefault();
              void notify();
            }}
            className="mb-2 block w-full rounded border-2 px-6 pt-2 pb-[6px] text-xs font-medium uppercase leading-normal transition duration-150 ease-in-out hover:border-gray-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-gray-600 focus:border-gray-600 focus:text-gray-600 focus:outline-none focus:ring-0 active:bg-gray-700 active:text-white dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
