/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import useSWR from "swr";
import { toast } from "react-toastify";
import Stripe from "stripe";
import { CSSProperties, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { ClipLoader } from "react-spinners";

interface dataObjectTypeBefore {
  vehicle_registration_number: string;
  client_uid: string;
  date_start: string;
  date_end: string;
  amount: string;
  outlet_uid: string;
}

interface dataObjectType {
  vehicle_registration_number: string;
  client_uid: string;
  date_start: string;
  date_end: string;
  amount: number;
  outlet_uid: number;
  checkout_session_id: string;
}

const ResultPage: NextPage = () => {
  function convertDataObjectType(
    data: dataObjectTypeBefore,
    session_id: string
  ): dataObjectType {
    return {
      ...data,
      amount: Number(data.amount),
      outlet_uid: Number(data.outlet_uid),
      checkout_session_id: String(session_id),
    };
  }

  const { mutate, isLoading } =
    api.hireAgreementCreationMutation.HireAgreementCreation.useMutation({
      onSuccess: (res) => {
        if (res != undefined) {
          toast("Hire Agreement Creation Successful");
        } else {
          toast(
            "Hire Agreement Creation Failed. Please try again, or contact support."
          );
        }
        console.log(res);
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        // if ((res as unknown as PostgrestError)?.code.toString() === "23505") {
        //   toast("Booking already exists");
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        // } else if (
        //   (res as unknown as PostgrestError)?.code.toString() === "23503"
        // ) {
        //   toast("Vehicle or Client does not exist");
        // } else {
        //   toast("Booking successful!");
        // }
      },
      onError: (err) => {
        toast("Hire Agreement Creation Failed");
        console.log(err);
      },
    });
  async function fetchGetJSON(url: string) {
    try {
      const data = await fetch(url).then((res) => res.json());
      return data;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw err;
    }
  }
  const router = useRouter();

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );
  console.log(data);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data && data.payment_status === "paid") {
      const dataToSubmit = (data as Stripe.Checkout.Session).metadata;
      if (dataToSubmit) {
        mutate(
          convertDataObjectType(
            dataToSubmit as unknown as dataObjectTypeBefore,
            router.query.session_id as string
          )
        );
      }
    }
  }, [data]);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  if (error) {
    console.log(error);
    return <div>failed to load</div>;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (data?.statusCode == 500) {
    return (
      <div className="flex h-fit items-center justify-center py-48">
        <div className="mx-auto text-center text-2xl">
          Invalid Stripe Session ID
          <br />
          <a
            className="cursor-pointer text-lg text-blue-500 underline hover:text-blue-700"
            onClick={(e) => {
              e.preventDefault();
              void router.push("/");
            }}
          >
            Go Home?
          </a>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <>
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
      </>
    );
  }
  void router.push("/account?tab=hire_agreements");
  return <></>;
};

export default ResultPage;
