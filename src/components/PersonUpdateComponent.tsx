import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import Avatar from "~/components/UploadAvatar";

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

type CustomDateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

interface PUCProps {
  personInfo: Person_profile;
  setState: Dispatch<SetStateAction<Person_profile | undefined>>;
  updateProfile: (personInfo: {
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
  }) => Promise<void>;
}

export default function PersonUpdateComponent({
  personInfo,
  setState,
  updateProfile,
}: PUCProps) {
  const [DOBvalue, setDOBValue] = useState<CustomDateRange>({
    startDate: personInfo?.birthdate ?? null,
    endDate: null,
  });

  const handleValueChange = (newDOBValue: CustomDateRange) => {
    setDOBValue(newDOBValue);
    if (newDOBValue.startDate != null) {
      setState({ ...personInfo, birthdate: newDOBValue.startDate });
    }
  };

  return (
    <>
      <div className="grid">
        <div className="mx-auto mt-8 place-self-center rounded-2xl border-2 bg-white p-10 drop-shadow-lg md:w-2/5 custxs:w-4/5 custsm:w-4/5 custmd:w-3/5">
          {/* <Link href="/" className="relative w-1/5  font-light text-gray-400">
        <button
          type="button"
          className="mb-2 flex items-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
      </Link> */}
          <div className="flex flex-col items-center justify-center">
            {/* <span className="relative inline-block justify-center">
              <img
                className="mx-auto h-auto w-48 rounded-full border-2 text-center md:h-56 md:w-56"
                src={
                  personInfo?.avatar_url
                    ? personInfo?.avatar_url
                    : "https://avataaars.io/?avatarStyle=Circle&topType=WinterHat3&accessoriesType=Prescription01&hatColor=Red&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&eyeType=Cry&eyebrowType=DefaultNatural&mouthType=Tongue&skinColor=Tanned"
                }
                alt="Person Avatar"
              />
              <label
                htmlFor="dropzone-file"
                className="absolute bottom-0 right-0 mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gray-700 text-white opacity-70 ring-1 ring-white hover:opacity-70 md:h-56 md:w-56"
              >
                 Change Avatar 
            <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={() => {
                    console.log("Updated Photo");
                  }}
                />
                
              </label>
            </span> */}
            <Avatar
              uid={personInfo?.user_uid ?? ""}
              url={personInfo?.avatar_url ?? ""}
              size={150}
              onUpload={(url) => {
                setState({ ...personInfo, avatar_url: url });
              }}
            />

            <input
              className="mx-2 mt-6 bg-transparent text-center text-2xl font-semibold tracking-tight text-black"
              defaultValue={personInfo?.first_name}
              onBlur={(e) => {
                if (e.target && !e.target.value) {
                  setState({
                    ...personInfo,
                    first_name: e.target.value,
                    user_uid: personInfo?.user_uid || "",
                  });
                }
              }}
              onChange={(event) =>
                setState({
                  ...personInfo,
                  first_name: event.target.value,
                  user_uid: personInfo?.user_uid || "",
                })
              }
              // placeholder={personInfo?.first_name}
              placeholder="First Name"
              id="first_name_input"
              value={personInfo?.first_name}
            ></input>
            <input
              className="mx-2 bg-transparent text-center text-2xl font-semibold tracking-tight text-black"
              defaultValue={personInfo?.last_name}
              onBlur={(e) => {
                if (e.target && !e.target.value) {
                  setState({
                    ...personInfo,
                    last_name: e.target.value,
                    user_uid: personInfo?.user_uid || "",
                  });
                }
              }}
              onChange={(event) =>
                setState({
                  ...personInfo,
                  last_name: event.target.value,
                  user_uid: personInfo?.user_uid || "",
                })
              }
              // placeholder={personInfo?.last_name}
              placeholder="Last Name"
              id="last_name_input"
              value={personInfo?.last_name}
            ></input>

            <p className="text-sm leading-6 text-black">
              {" "}
              {personInfo?.isstaff ? "Staff" : "Client"}{" "}
            </p>
          </div>
          <div className="mt-10 flex flex-col">
            <div className="relative my-3">
              <label
                htmlFor="Driving License Number"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Driving License Number
              </label>
              <input
                type="text"
                name="driving license number"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={personInfo?.driving_license_number}
                placeholder={personInfo?.driving_license_number}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setState({
                      ...personInfo,
                      driving_license_number: e.target.value,
                    });
                  }
                }}
                onChange={(event) =>
                  setState({
                    ...personInfo,
                    driving_license_number: event.target.value,
                  })
                }
                value={personInfo?.driving_license_number}
              />
            </div>
            <div className="relative my-3">
              <label
                htmlFor="gender"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Gender
              </label>
              <input
                type="text"
                name="gender"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={personInfo?.gender}
                placeholder={personInfo?.gender}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setState({ ...personInfo, gender: e.target.value });
                  }
                }}
                onChange={(event) =>
                  setState({ ...personInfo, gender: event.target.value })
                }
                value={personInfo?.gender}
              />
            </div>
            <div className="relative my-3">
              <label
                htmlFor="phonenumber"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phonenumber"
                id="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={personInfo?.phone_number}
                placeholder={personInfo?.phone_number}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setState({ ...personInfo, phone_number: e.target.value });
                  }
                }}
                onChange={(event) =>
                  setState({ ...personInfo, phone_number: event.target.value })
                }
                value={personInfo?.phone_number}
              />
            </div>
            <div className="relative my-3">
              <label
                htmlFor="address"
                className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={personInfo?.address}
                defaultValue={personInfo?.address}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setState({ ...personInfo, address: e.target.value });
                  }
                }}
                onChange={(event) =>
                  setState({ ...personInfo, address: event.target.value })
                }
                value={personInfo?.address}
              />
            </div>
            <div className="relative my-3">
              <label
                htmlFor="DOB"
                className="absolute -top-2 left-2 z-40 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                Date of Birth
              </label>
              <Datepicker
                value={DOBvalue.startDate}
                onChange={(event: CustomDateRange) => {
                  handleValueChange(event);
                }}
                useRange={false}
                inputClassName="shadow-md"
                toggleClassName="rounded-r-lg bg-opacity-40 bg-gray-400 hover:bg-blue-800 hover:bg-opacity-60 transition-all duration-150 ease-in-out"
                minDate={new Date("1900-01-01")}
                placeholder={
                  DOBvalue.startDate
                    ? new Date(DOBvalue.startDate).toLocaleDateString()
                    : ""
                }
                showShortcuts={false}
                startFrom={personInfo?.birthdate}
                asSingle={true}
                displayFormat={"DD/MM/YYYY"}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setState({
                  ...personInfo,
                  updated_at: new Date().toLocaleString(),
                });
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
                  personInfo?.birthdate.toString() != "" &&
                  personInfo?.gender != "" &&
                  personInfo?.driving_license_number != ""
                ) {
                  setState({ ...personInfo, issetup: true });
                  void updateProfile({ ...personInfo, issetup: true });
                } else {
                  toast("Changes not saved, please complete all fields!");
                }
                // console.log(personInfo);
              }}
              className="self-right my-2 rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
