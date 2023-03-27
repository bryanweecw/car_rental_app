import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { type NextRouter, useRouter } from "next/router";
import {
  useState,
  useEffect,
  useCallback,
  CSSProperties,
  SetStateAction,
} from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import CarUpdateComponent from "~/components/CarUpdateComponent";
import PersonUpdateComponent from "~/components/PersonUpdateComponent";
import { api } from "~/utils/api";

interface ClientProfile {
  address: string | undefined;
  avatar_url: string | undefined;
  birthdate: string | undefined;
  client: {
    user_uid: string;
    driving_license_number: string;
  };
  first_name: string;
  gender: string;
  issetup: boolean;
  isstaff: boolean;
  last_name: string | undefined;
  phone_number: string;
  updated_at: string;
  user_uid: string;
}

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

export default function ClientEdit() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isStaff, setIsStaff] = useState(false);
  const [outletID, setOutletID] = useState(0);

  const { session, isLoading } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  function redirectToHome(router: NextRouter) {
    void router.push("/");
  }

  const checkIfStaff = useCallback(async () => {
    try {
      const { user } = session ?? {};
      const { id } = user ?? {};

      const profileRes = await supabase
        .from("profiles")
        .select(`isstaff, staff(outlet_id)`)
        .eq("user_uid", id);
      // profileRes gets replaced with the return value of the query, which contains the boolean flag of whether the user is staff or not

      const isStaffLocal = Boolean(profileRes.data?.[0]?.isstaff);
      const outletLocal = Number(
        (profileRes.data?.[0]?.staff as { outlet_id: number }).outlet_id
      );
      // const staffOutlet = profileRes.data?.[0]?.staff?.[0]?.outlet_id;
      // we extract the boolean flag from the return value of the query

      setIsStaff(isStaffLocal);
      setOutletID(outletLocal);

      if (!isStaffLocal) {
        void redirectToHome(router);
      }
    } catch (error) {
      console.error(error);
    }
  }, [session, supabase, router]);
  // useCallback is used to prevent the function from being
  // recreated every time the component is rendered

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        redirectToHome(router);
      }
      // if the user is not logged in, redirect them to the home page
      else {
        // if the user is logged in, or if we don't know if they are logged in
        // because it is still loading check if they are staff
        void checkIfStaff();
      }
    }
  }, [session, isLoading, supabase, router, checkIfStaff]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        redirectToHome(router);
        //playing it realllyyy safe here
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  });

  //retrieve client info
  const { clientid } = router.query;

  const { data } = api.clientInfoQuery.getClientInfo.useQuery({
    text: clientid as string,
  });

  function mapClientProfileToPersonProfile(
    clientProfile: ClientProfile
  ): Person_profile {
    const {
      user_uid,
      avatar_url,
      updated_at,
      first_name,
      last_name,
      address,
      phone_number,
      birthdate,
      gender,
      isstaff,
      issetup,
      client: { driving_license_number },
    } = clientProfile;

    // Parse the birthdate string into a Date object
    const parsedBirthdate = birthdate ? new Date(birthdate) : undefined;

    // Return the mapped object
    return {
      user_uid,
      avatar_url,
      updated_at,
      first_name,
      last_name,
      address,
      phone_number,
      birthdate: parsedBirthdate,
      gender,
      isstaff,
      issetup,
      driving_license_number,
    };
  }

  const [client, setClient] = useState(
    (data as ClientProfile[])?.[0]
      ? mapClientProfileToPersonProfile(
          (data as ClientProfile[])?.[0] as unknown as ClientProfile
        )
      : undefined
  );

  useEffect(() => {
    if (data) {
      setClient(
        (data as ClientProfile[])?.[0]
          ? mapClientProfileToPersonProfile(
              (data as ClientProfile[])?.[0] as unknown as ClientProfile
            )
          : undefined
      );
    }
  }, [data]);

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
    const idtoSubmit = (personInfo as Person_profile)?.user_uid;
    if (id) {
      if ((personInfo as Person_profile)?.isstaff) {
        if (id == idtoSubmit) {
          const { data, error } = await supabase
            .from("profiles")
            .update({
              first_name: (personInfo as Person_profile)?.first_name,
              last_name: (personInfo as Person_profile)?.last_name,
              address: (personInfo as Person_profile)?.address,
              phone_number: (personInfo as Person_profile)?.phone_number,
              birthdate: (personInfo as Person_profile)?.birthdate,
              gender: (personInfo as Person_profile)?.gender,
              updated_at: (personInfo as Person_profile)?.updated_at,
              avatar_url: (personInfo as Person_profile)?.avatar_url,
            })
            .eq("user_uid", idtoSubmit);
          const { data: data2, error: error2 } = await supabase
            .from("client")
            .update({
              driving_license_number: (personInfo as Person_profile)
                ?.driving_license_number,
            })
            .eq("user_uid", idtoSubmit);
          if (error || error2) {
            toast("Error updating profile");
          }
          toast("Changes saved!");
        } else {
          toast("You are not authorized to edit this profile");
        }
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .update({
            first_name: (personInfo as Person_profile)?.first_name,
            last_name: (personInfo as Person_profile)?.last_name,
            address: (personInfo as Person_profile)?.address,
            phone_number: (personInfo as Person_profile)?.phone_number,
            birthdate: (personInfo as Person_profile)?.birthdate,
            gender: (personInfo as Person_profile)?.gender,
            updated_at: (personInfo as Person_profile)?.updated_at,
            avatar_url: (personInfo as Person_profile)?.avatar_url,
          })
          .eq("user_uid", idtoSubmit);
        const { data: data2, error: error2 } = await supabase
          .from("client")
          .update({
            driving_license_number: (personInfo as Person_profile)
              ?.driving_license_number,
          })
          .eq("user_uid", idtoSubmit);
        if (error || error2) {
          toast("Error updating profile");
        }
        toast("Changes saved!");
      }
    }
  };

  if (!isStaff && !session) {
    return null;
  } else {
    if (!client) {
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
    } else {
      return (
        <PersonUpdateComponent
          personInfo={client}
          setState={setClient}
          updateProfile={updateProfileDatabase}
        />
      );
    }
  }
}
