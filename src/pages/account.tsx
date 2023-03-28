import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import PersonUpdateComponent from "~/components/PersonUpdateComponent";
import { ClipLoader } from "react-spinners";

import { useRouter } from "next/router";
import ClientTabBar from "~/components/ClientTabBar";
import { useClientTabContext } from "~/context/ClientTabContext";
import ClientHireAgreementTable from "~/components/ClientHireAgreementTable";

/* eslint-disable @next/next/no-img-element */
export default function Account() {
  // type CustomDateRange = {
  //   startDate: Date | null;
  //   endDate: Date | null;
  // };

  interface Person_profile {
    user_uid: string | undefined;
    avatar_url: string | undefined;
    updated_at: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    address: string | undefined;
    phone_number: string | undefined;
    birthdate: Date | undefined;
    gender: string | undefined;
    isstaff: boolean | undefined;
    issetup: boolean | undefined;
    driving_license_number: string | undefined;
  }

  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  const [issetup, setIsSetUp] = useState(false);
  const supabase = useSupabaseClient();
  useEffect(() => {
    if (!isLoading && !session) {
      if (!session) {
        void router.push("/login");
      }
    }
  }, [session, isLoading, supabase, router]);

  const getProfileInfo = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};
      const { data: profile_info } = await supabase
        .from("profiles")
        .select("*, client( * )")
        .eq("user_uid", id);
      const user_uid = (profile_info?.[0] as Person_profile)?.user_uid;
      const avatar_url = (profile_info?.[0] as Person_profile)?.avatar_url;
      const updated_at = (profile_info?.[0] as Person_profile)?.updated_at;
      const first_name = (profile_info?.[0] as Person_profile)?.first_name;
      const last_name = (profile_info?.[0] as Person_profile)?.last_name;
      const address = (profile_info?.[0] as Person_profile)?.address;
      const phone_number = (profile_info?.[0] as Person_profile)?.phone_number;
      const birthdate = (profile_info?.[0] as Person_profile)?.birthdate;
      const gender = (profile_info?.[0] as Person_profile)?.gender;
      const isstaff = Boolean((profile_info?.[0] as Person_profile)?.isstaff);
      const issetup = Boolean((profile_info?.[0] as Person_profile)?.issetup);
      const driving_license_number = (
        profile_info?.[0]?.client as Person_profile
      ).driving_license_number;
      setIsSetUp(issetup);
      const person: Person_profile = {
        user_uid: user_uid,
        avatar_url: avatar_url,
        updated_at: updated_at,
        first_name: first_name,
        last_name: last_name,
        address: address,
        phone_number: phone_number,
        birthdate: birthdate,
        gender: gender,
        isstaff: isstaff,
        issetup: issetup,
        driving_license_number: driving_license_number,
      };
      return person;
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase]);

  const updateProfileDatabase = async (personInfo: {
    user_uid: any;
    avatar_url: any;
    updated_at: any;
    first_name: any;
    last_name: any;
    address: any;
    phone_number: any;
    birthdate: any;
    gender: any;
    isstaff: any;
    issetup: any;
    driving_license_number: any;
  }) => {
    let setup = false;
    const updated_at_local = new Date().toLocaleString();
    // console.log("before update updated_at", updated_at_local);
    if (
      personInfo?.first_name != null &&
      personInfo?.last_name != null &&
      personInfo?.address != null &&
      personInfo?.phone_number != null &&
      personInfo?.birthdate != null &&
      personInfo?.gender != null &&
      personInfo?.driving_license_number != null &&
      personInfo?.first_name != "" &&
      personInfo?.last_name != "" &&
      personInfo?.address != "" &&
      personInfo?.phone_number != "" &&
      (personInfo?.birthdate as Date).toString() != "" &&
      personInfo?.gender != "" &&
      personInfo?.driving_license_number != ""
    ) {
      setup = true;
    }
    const { user } = session ?? {};
    const { id } = user ?? {};
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: (personInfo as Person_profile)?.first_name,
        last_name: (personInfo as Person_profile)?.last_name,
        address: (personInfo as Person_profile)?.address,
        phone_number: (personInfo as Person_profile)?.phone_number,
        birthdate: (personInfo as Person_profile)?.birthdate,
        gender: (personInfo as Person_profile)?.gender,
        updated_at: updated_at_local,
        avatar_url: (personInfo as Person_profile)?.avatar_url,
        issetup: setup,
      })
      .eq("user_uid", id);
    const { data: data2, error: error2 } = await supabase
      .from("client")
      .update({
        driving_license_number: (personInfo as Person_profile)
          ?.driving_license_number,
      })
      .eq("user_uid", id);
    if (!error && !error2) {
      toast("Changes saved!");
    } else {
      toast("Something went wrong. Please try again.");
    }
  };

  const [current_person, setCurrentPerson] = useState<Person_profile>();

  //set person to be logged in account's profile.
  useEffect(() => {
    if (!isLoading && session) {
      void getProfileInfo().then((person) => setCurrentPerson(person));
    }
  }, [getProfileInfo, isLoading, session, supabase]);

  console.log(current_person);

  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const { activeTab, setActiveTab } = useClientTabContext();

  useEffect(() => {
    if (
      router.query.tab === "hire_agreements" ||
      router.query.tab === "profile"
    ) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    const selectElement = document.getElementById("tabs") as HTMLSelectElement;

    if (selectElement) {
      selectElement.value = activeTab;
    }
  }, [activeTab]);

  if (!current_person) {
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
  } else {
    return (
      <>
        <ClientTabBar />
        {activeTab === "hire_agreements" ? (
          <ClientHireAgreementTable id={session?.user.id as string} />
        ) : activeTab === "profile" ? (
          <PersonUpdateComponent
            personInfo={current_person}
            setState={setCurrentPerson}
            updateProfile={updateProfileDatabase}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}
