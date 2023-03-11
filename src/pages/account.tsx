import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
export default function Account() {
  const person = {
    name: "John Doe",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    role: "Personal Client",
    phonenumber: 1231240215,
  };

  const [name, setName] = useState(person.name);

  return (
    <>
      <div className="grid">
        <div className="m-10 w-2/5 place-self-center rounded-2xl bg-blue-200 py-10 px-8">
          <img
            className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
            src={person.imageUrl}
            alt=""
          />
          <div className="flex flex-col items-center justify-center">
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
          <div className="mt-10 rounded-2xl bg-white p-10 drop-shadow-md">
            <h1>Profile Information</h1>
            <div className="isolate -space-y-px rounded-md shadow-sm">
              <div className="relative rounded-md rounded-b-none px-3 pt-2.5 pb-1.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                  htmlFor="phone-number"
                  className="block text-xs font-medium text-gray-900"
                >
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phone-number"
                  id="phone-number"
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Jane Smith"
                />
              </div>
              <div className="relative rounded-md rounded-t-none px-3 pt-2.5 pb-1.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-indigo-600">
                <label
                  htmlFor="job-title"
                  className="block text-xs font-medium text-gray-900"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Head of Tomfoolery"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
