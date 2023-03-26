import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { supabase } from "@supabase/auth-ui-shared";
import PersonUpdateComponent from "~/components/PersonUpdateComponent";
import { ClipLoader } from "react-spinners";

/* eslint-disable @next/next/no-img-element */
export default function Account() {
  type CustomDateRange = {
    startDate: Date | null;
    endDate: Date | null;
  };

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

  const [issetup, setIsSetUp] = useState(false);
  const supabase = useSupabaseClient();

  const getProfileInfo = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};
      const { data: profile_info } = await supabase
        .from("profiles")
        .select("*, client( * )")
        .eq("user_uid", id);
      const user_uid = profile_info?.[0]?.user_uid;
      const avatar_url = profile_info?.[0]?.avatar_url;
      const updated_at = profile_info?.[0]?.updated_at;
      const first_name = profile_info?.[0]?.first_name;
      const last_name = profile_info?.[0]?.last_name;
      const address = profile_info?.[0]?.address;
      const phone_number = profile_info?.[0]?.phone_number;
      const birthdate = profile_info?.[0]?.birthdate;
      const gender = profile_info?.[0]?.gender;
      const isstaff = Boolean(profile_info?.[0]?.isstaff);
      const issetup = Boolean(profile_info?.[0]?.issetup);
      const driving_license_number =
        profile_info?.[0]?.client?.driving_license_number;
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
    const { user } = session ?? {};
    const { id } = user ?? {};
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: personInfo?.first_name,
        last_name: personInfo?.last_name,
        address: personInfo?.address,
        phone_number: personInfo?.phone_number,
        birthdate: personInfo?.birthdate,
        gender: personInfo?.gender,
        updated_at: personInfo?.updated_at,
      })
      .eq("user_uid", id);
    const { data: data2, error: error2 } = await supabase
      .from("client")
      .update({
        driving_license_number: personInfo?.driving_license_number,
      })
      .eq("user_uid", id);
  };

  // const updateDrivingLicense = async (personInfo: {
  //   user_uid: any;
  //   avatar_url: any;
  //   updated_at: any;
  //   first_name: any;
  //   last_name: any;
  //   address: any;
  //   phone_number: any;
  //   birthdate: any;
  //   gender: any;
  //   isstaff: any;
  //   issetup: any;
  //   driving_license_number: any;
  // }) => {
  //   const { user } = session ?? {};
  //   const { id } = user ?? {};
  //   const { data, error } = await supabase
  //     .from("client")
  //     .update({
  //       driving_license_number: personInfo?.driving_license_number,
  //     })
  //     .eq("user_uid", id);
  // };

  const [current_person, setCurrentPerson] = useState<Person_profile>();

  //set person to be logged in account's profile.
  useEffect(() => {
    if (!isLoading && session) {
      getProfileInfo().then((person) => setCurrentPerson(person));
    }
  }, [getProfileInfo, isLoading, session, supabase]);

  console.log(current_person);

  // const [avatar_url, setAvatarUrl] = useState(current_person?.avatar_url);

  // const [first_name, setFirstName] = useState(current_person?.first_name);

  // const [last_name, setLastName] = useState(current_person?.last_name);

  // const [address, setAddress] = useState(current_person?.address);

  // const [phone_number, setPhoneNumber] = useState(current_person?.phone_number);

  // const [DOBvalue, setDOBValue] = useState<CustomDateRange>({
  //   startDate: current_person?.birthdate ?? null,
  //   endDate: null,
  // });

  // const handleValueChange = (newDOBValue: CustomDateRange) => {
  //   setDOBValue(newDOBValue);
  // };

  // const [gender, setGender] = useState(current_person?.gender);

  //need to use condition of issetup to trigger updating of profile, but how does
  // redirection work
  // either ways, for now, should return the value of the right profile
  // maybe i should update in getprofileinfo function and decalre all as null to begin with

  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
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
        );
      </>
    );
  } else {
    return (
      <>
        <PersonUpdateComponent
          personInfo={current_person}
          setState={setCurrentPerson}
          updateProfile={updateProfileDatabase}
        />
      </>
    );
  }
}
