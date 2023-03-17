import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { toast } from "react-toastify";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */
export default function Account() {
  type CustomDateRange = {
    startDate: Date | null;
    endDate: Date | null;
  };

  const person = {
    name: "John Doe",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    role: "Personal Client",
    phonenumber: "1231240215",
    addressLine: "1234 Main St #123",
    dateofbirth: new Date("1990-01-01"),
  };

  const [DOBvalue, setDOBValue] = useState<CustomDateRange>({
    startDate: person.dateofbirth,
    endDate: null,
  });

  const handleValueChange = (newDOBValue: CustomDateRange) => {
    setDOBValue(newDOBValue);
  };

  const notify = () => toast("Changes saved!");

  const [name, setName] = useState(person.name);
  const [phoneNumber, setPhoneNumber] = useState(person.phonenumber);
  const [address, setAddress] = useState(person.addressLine);

  return (
    <>
      <div className="grid">
        <div className="mx-auto mt-8 place-self-center rounded-2xl border-2 bg-white p-10 drop-shadow-lg md:w-2/5 custxs:w-4/5 custsm:w-4/5 custmd:w-3/5">
          <Link href="/" className="relative w-1/5  font-light text-gray-400">
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
          </Link>
          <div className="flex flex-col items-center justify-center">
            <span className="relative inline-block justify-center">
              <img
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src={person.imageUrl}
                alt="Person Avatar"
              />
              <label
                htmlFor="dropzone-file"
                className="absolute bottom-0 right-0 mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-gray-700 text-white opacity-0 ring-1 ring-white hover:opacity-70 md:h-56 md:w-56"
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
            </span>
            <input
              className="mt-6 bg-transparent text-center text-2xl font-semibold leading-7 tracking-tight text-black"
              defaultValue={person.name}
              onBlur={(e) => {
                if (e.target && !e.target.value) {
                  setName(person.name);
                }
              }}
              onChange={(event) => setName(event.target.value)}
              placeholder={person.name}
              value={name}
            ></input>
            <p className="text-sm leading-6 text-black">{person.role}</p>
          </div>
          <div className="mt-10 flex flex-col">
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
                defaultValue={person.phonenumber}
                placeholder={person.phonenumber}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setPhoneNumber(person.phonenumber);
                  }
                }}
                onChange={(event) => setPhoneNumber(event.target.value)}
                value={phoneNumber}
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
                placeholder={person.addressLine}
                defaultValue={person.addressLine}
                onBlur={(e) => {
                  if (e.target && !e.target.value) {
                    setAddress(person.addressLine);
                  }
                }}
                onChange={(event) => setAddress(event.target.value)}
                value={address}
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
                value={DOBvalue}
                onChange={handleValueChange}
                useRange={false}
                inputClassName="shadow-md"
                toggleClassName="rounded-r-lg bg-opacity-40 bg-gray-400 hover:bg-blue-800 hover:bg-opacity-60 transition-all duration-150 ease-in-out"
                minDate={new Date("1900-01-01")}
                showShortcuts={false}
                startFrom={person.dateofbirth}
                placeholder={person.dateofbirth.toLocaleDateString()}
                asSingle={true}
                displayFormat={"DD/MM/YYYY"}
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                notify();
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
