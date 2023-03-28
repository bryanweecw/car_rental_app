import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { api } from "~/utils/api";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import Datepicker from "react-tailwindcss-datepicker";
import Link from "next/link";

// const TaskCreationDataSchema = z.object({
//   description: z.string(),
//   importance: z.string(),
//   staff_id: z.string(),
//   is_done: z.boolean(),
//   created_by: z.string(),
//   complete_by: z.date(),
//   id: z.string(),
//   created_on: z.date(),
// });

interface taskType {
  description?: string;
  importance?: string;
  staff_id?: string;
  is_done?: boolean;
  created_by?: string;
  complete_by?: Date;
  id?: string;
  created_on?: string;
}

interface concreteTaskType {
  description: string;
  importance: string;
  staff_id: string;
  is_done: boolean;
  created_by: string;
  complete_by: string;
  id: string;
  created_on: string;
}

type CustomDateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

function formatDate(inputDate: string): string {
  const parts = inputDate.split("/");
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  const formattedDate = `${year as string}-${month as string}-${day as string}`;
  return formattedDate;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TaskEdit() {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { user } = session ?? {};
  const { id } = user ?? {};

  const [formState, setFormState] = useState<taskType>();

  const [DDvalue, setDDValue] = useState<CustomDateRange>({
    startDate: formState?.complete_by ?? null,
    endDate: null,
  });

  const handleDDValueChange = (newDDValue: CustomDateRange) => {
    setDDValue(newDDValue);
    if (newDDValue.startDate != null) {
      setFormState({ ...formState, complete_by: newDDValue.startDate });
    }
  };

  const { mutate, isLoading } = api.addTaskRouter.addtask.useMutation({
    onSuccess: (res) => {
      toast("Good Job! Task Created!");
    },
    onError: (err) => {
      toast("Error! Task Not Created!");
      console.log("ERROR", err);
    },
  });

  const handleSubmit = (input: taskType) => {
    mutate(input as unknown as concreteTaskType);
  };

  return (
    <>
      <div className="grid">
        <div className="mx-auto mt-8 place-self-center rounded-2xl border-2 bg-white p-10 drop-shadow-lg md:w-2/5 custxs:w-4/5 custsm:w-4/5 custmd:w-3/5">
          <Link
            href="/staffdashboard"
            className="relative w-auto  font-light text-gray-400"
          >
            <button
              type="button"
              className="mb-8 flex items-center rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
          <h1 className="bg-grey-700 mb-2 text-center text-2xl font-bold">
            New task
          </h1>
          <div className="flex flex-col items-center justify-center pt-4"></div>
          <form>
            <div className="flex flex-col px-5">
              <div className="relative my-3">
                <p>
                  <label
                    htmlFor="Description"
                    className="absolute -top-5 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    name="Description"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formState?.description}
                    onChange={(e) => {
                      setFormState(
                        formState
                          ? {
                              ...formState,
                              description: e.target.value,
                              created_by: id,
                              staff_id: id,
                              is_done: false,
                              created_on: new Date().toLocaleString(),
                              id: uuidv4(),
                            }
                          : { description: e.target.value }
                      );
                    }}
                  />
                </p>
              </div>
              <div className="relative my-3 ">
                <label
                  htmlFor="due_date"
                  // className="absolute -top-2 left-2 inline-block max-w-xs bg-white px-1 text-xs font-medium text-gray-900"
                  className="absolute -top-5 left-2 inline-block max-w-xs bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Complete by
                </label>
                <Datepicker
                  value={DDvalue.startDate}
                  onChange={(event: CustomDateRange) => {
                    handleDDValueChange(event);
                  }}
                  useRange={false}
                  inputClassName="shadow-md"
                  toggleClassName="rounded-r-lg bg-opacity-40 bg-gray-400 hover:bg-blue-800 hover:bg-opacity-60 transition-all duration-150 ease-in-out"
                  // minDate={new Date("1900-01-01")}
                  minDate={new Date(Date.now() - 86400000)}
                  placeholder={
                    DDvalue.startDate
                      ? new Date(DDvalue.startDate).toLocaleDateString()
                      : ""
                  }
                  showShortcuts={false}
                  startFrom={formState?.complete_by}
                  asSingle={true}
                  displayFormat={"DD/MM/YYYY"}
                />
              </div>
              <div px-5 py-3>
                <div>
                  <Menu
                    as="div"
                    className="relative inline-block w-full text-left "
                  >
                    <div>
                      <Menu.Button className="inline-flex w-full justify-between gap-x-1.5 rounded-md bg-white px-3 py-2 text-left text-xs font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        {formState?.importance
                          ? formState.importance
                          : "Pick Importance"}
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-right text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => {
                                  setFormState(
                                    formState
                                      ? {
                                          ...formState,
                                          importance: "Low",
                                        }
                                      : { importance: "Low" }
                                  );
                                }}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Low
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => {
                                  setFormState(
                                    formState
                                      ? {
                                          ...formState,
                                          importance: "Medium",
                                        }
                                      : { importance: "Medium" }
                                  );
                                }}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                Medium
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => {
                                  setFormState(
                                    formState
                                      ? {
                                          ...formState,
                                          importance: "High",
                                        }
                                      : { importance: "High" }
                                  );
                                }}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                High
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (
                  formState?.description != "" &&
                  formState?.importance != "" &&
                  formState?.description &&
                  formState?.importance &&
                  formState?.complete_by != undefined
                ) {
                  void handleSubmit(formState);
                  setFormState({
                    ...formState,
                    description: "",
                    importance: "",
                    complete_by: undefined,
                    staff_id: undefined,
                    created_by: undefined,
                  });
                } else {
                  toast("Please ensure all fields are filled.");
                }
              }}
              className="self-left my-8 w-full rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Task
            </button>
            {/* create form with fields that update a state */}
            {/* after which, enter this state to handleSubmit */}
          </form>
        </div>
      </div>
    </>
  );
}
function getSession(arg0: { req: any }) {
  throw new Error("Function not implemented.");
}
