import { useSessionContext } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";
import router from "next/router";
import { toast } from "react-toastify";

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
  complete_by: Date;
  id: string;
  created_on: string;
}

export default function StaffToDo() {
  const { session } = useSessionContext();

  const { mutate, isLoading } = api.addTaskRouter.deletetask.useMutation({
    onSuccess: (res) => {
      console.log("success", res);
    },
    onError: (err) => {
      console.log("ERROR", err);
    },
  });

  const handleSubmit = (input: taskType) => {
    mutate(input as concreteTaskType);
  };

  const { data, refetch } = api.retrieveAllTasks.getTasks.useQuery({
    text: session?.user.id as string,
  });

  if (Array.isArray(data)) {
    return (
      <>
        <div className="rounded-md border py-10 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                To Do
              </h1>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  void router.push("/manage_tasks/createTask");
                }}
              >
                Add task
              </button>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                      >
                        Task Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Due Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Importance
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created On
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.map((task) => (
                      <tr key={task?.id as string}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {task.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {task.complete_by}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {task.importance}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {task.created_on}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              void handleSubmit(task);
                              void refetch();
                              toast("Good Job! Task Completed!");
                            }}
                            className="self-right my-2 rounded-md bg-green-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Completed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Error Retrieving To Do
          </h1>
        </div>
      </>
    );
  }
}
