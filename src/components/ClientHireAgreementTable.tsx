import Link from "next/link";
import { api } from "~/utils/api";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];
type Client = {
  profiles: {
    first_name: string;
    last_name: string;
  };
};

type HireAgreement = {
  client: Client;
  client_uid: string | null;
  date_end: string | null;
  date_start: string | null;
  hire_agreement_id: number;
  rental_cost: number | null;
  staff_uid: string | null;
  transaction_id: number | null;
  vehicle_registration_number: string | null;
};

interface HATProps {
  id: string;
}

export default function HireAgreementTable({ id }: HATProps) {
  const { data } =
    api.RetrieveClientHireAgreements.RetrieveClientHireAgreements.useQuery({
      text: id,
    });
  console.log(data);

  function getPeriodStatus(datestart: string, dateend: string) {
    if (datestart == "" || dateend == "") {
      return "Invalid Booking";
    }
    const today = new Date();
    const start = new Date(datestart);
    const end = new Date(dateend);

    if (today < start) {
      return "Upcoming";
    } else if (today > end) {
      return "Completed";
    } else {
      return "Active";
    }
  }

  const hireAgreements = data as HireAgreement[];

  return (
    <div className="mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
      <div className="rounded-md border py-10 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Hire Agreements
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the hire agreements assigned to you including the
              client name, car registration number, booking period and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button> */}
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
                      Hire Agreement ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Client Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Car Registration Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Booking Period
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {hireAgreements?.map((agreement) => (
                    <tr key={agreement.hire_agreement_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {agreement.hire_agreement_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agreement.client.profiles.first_name}{" "}
                        {agreement.client.profiles.last_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {agreement.vehicle_registration_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {`${
                          agreement.date_start ? agreement.date_start : "N.A."
                        } - ${
                          agreement.date_end ? agreement.date_end : "N.A."
                        }`}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {getPeriodStatus(
                          agreement.date_start ? agreement.date_start : "",
                          agreement.date_end ? agreement.date_end : ""
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <Link
                          href={`/hire_agreement/${agreement.hire_agreement_id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                          <span className="sr-only">
                            {agreement.hire_agreement_id}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
