import { useEffect, useState } from "react";
import { api } from "~/utils/api";

interface SHAVProps {
  agreementData: AgreementInfo;
}

interface CarType {
  id: number;
  vehicle_make: string;
  vehicle_model: string;
  color: string;
  mileage: number;
  capacity: number;
  hire_rate: number;
  imagesrc: string;
  imagealt: string;
  description: string;
  vehicle_registration_number: string;
  outlet_id: number;
}

interface BriefCarType {
  vehicle_make: string;
  vehicle_model: string;
  vehicle_registration_number: string;
  outlet_id: number;
}

type AvailableVehicleDetailType = {
  [key: string]: BriefCarType;
};

type AgreementInfo = {
  staff: { profiles: { first_name: string; last_name: string } };
  client: { profiles: { first_name: string; last_name: string } };
  client_uid: string | null;
  date_end: string | null;
  date_start: string | null;
  hire_agreement_id: number;
  rental_cost: number | null;
  staff_uid: string | null;
  transaction_id: number | null;
  vehicle: CarType;
  vehicle_registration_number: string | null;
};

export default function StaffHireAgreementView({ agreementData }: SHAVProps) {
  const readOnly = true;
  const infoData = agreementData;
  const [formData, setFormData] = useState<AgreementInfo>(infoData);
  const [availableVehicles, setAvailableVehicles] = useState<Set<string>>();
  const [availableVehicleDetails, setAvailableVehicleDetails] =
    useState<AvailableVehicleDetailType>({});

  const infoDataOrFormDataStartDate = (
    infoData: AgreementInfo,
    formData: AgreementInfo
  ) => {
    if (infoData.date_start) {
      if (formData && formData.date_start != infoData.date_start) {
        return formData.date_start as string;
      } else {
        return infoData.date_start;
      }
    } else {
      return "";
    }
  };

  const infoDataOrFormDataEndDate = (
    infoData: AgreementInfo,
    formData: AgreementInfo
  ) => {
    if (infoData.date_end) {
      if (formData && formData.date_end != infoData.date_end) {
        return formData.date_end as string;
      } else {
        return infoData.date_end;
      }
    } else {
      return "";
    }
  };

  const postQuery =
    api.RetrieveUnavailableVehicles.RetrieveUnavailableVehicles.useQuery({
      hire_agreement_id: infoData.hire_agreement_id,
      date_start: infoDataOrFormDataStartDate(infoData, formData),
      date_end: infoDataOrFormDataEndDate(infoData, formData),
    });
  const postQuery2 = api.vehicleQuery.hello.useQuery();
  const outlet_id = infoData.vehicle?.outlet_id;

  useEffect(() => {
    if (postQuery.status == "success" && postQuery2.status == "success") {
      const vehicleSet = new Set<string>(); //local set of unavailable vehicles
      (
        postQuery.data as unknown as {
          vehicle: BriefCarType;
          hire_agreement_id: number;
          date_start: string;
          date_end: string;
        }[]
      ).map((vehicle) => {
        if (vehicle.vehicle.outlet_id == outlet_id) {
          vehicleSet.add(vehicle.vehicle.vehicle_registration_number);
        }
      });
      console.log(vehicleSet);
      const localAvailableVehicleSet = new Set<string>();
      const localAvailableVehicleDetails: AvailableVehicleDetailType = {};
      (postQuery2.data as CarType[]).map((vehicle) => {
        if (
          vehicle.outlet_id == outlet_id &&
          vehicle.vehicle_registration_number &&
          !vehicleSet.has(vehicle.vehicle_registration_number)
        ) {
          localAvailableVehicleSet.add(vehicle.vehicle_registration_number);
          localAvailableVehicleDetails[vehicle.vehicle_registration_number] = {
            vehicle_make: vehicle.vehicle_make,
            vehicle_model: vehicle.vehicle_model,
            vehicle_registration_number: vehicle.vehicle_registration_number,
            outlet_id: vehicle.outlet_id,
          };
        }
      });
      setAvailableVehicles(localAvailableVehicleSet);
      setAvailableVehicleDetails(localAvailableVehicleDetails);
    }
  }, [postQuery.data, postQuery2.data, formData.date_start, formData.date_end]);
  if (postQuery.status == "success" && postQuery2.status == "success") {
    return (
      <div className="mx-auto border p-5">
        YOUR HIRE AGREEMENT DETAILS:
        <div className="grid grid-cols-2">
          <div className="col-span-1 mr-5 flex flex-col">
            <div className="mt-5 flex flex-col">
              <span className="text-md font-medium">Agreement ID</span>
              <span className="text-sm">{infoData.hire_agreement_id}</span>
            </div>
            <div className="mt-5 flex flex-col">
              <span className="text-md font-medium">Transaction ID</span>
              <span className="text-sm">
                {infoData.transaction_id?.toString()}
              </span>
            </div>
          </div>
          <div className="col-span-1 flex flex-col pr-5">
            <div className="mt-5 flex flex-col">
              <span className="text-md font-medium">Client Name</span>
              <p className="text-sm">
                {infoData.client.profiles.first_name}{" "}
                {infoData.client.profiles.last_name}
              </p>
            </div>
            <div className="mt-5 flex flex-col">
              <span className="text-md font-medium">Staff Name</span>
              <p className="text-sm">
                {infoData.staff.profiles.first_name}{" "}
                {infoData.staff.profiles.last_name}
              </p>
            </div>
            <div className="mt-5 flex flex-col">
              <span className="text-md font-medium">Rental Cost</span>
              <span className="text-sm">
                {infoData.rental_cost?.toString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-row">
          <div className="mt-5 flex flex-col">
            <span className="text-md font-medium">Start Date</span>
            <input
              type="date"
              className="text-sm"
              value={formData.date_start as string}
              max={formData.date_end as string}
              readOnly={!readOnly}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  date_start: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-5 flex flex-col">
            <span className="text-md font-medium">End Date</span>
            <input
              type="date"
              className="text-sm"
              value={formData.date_end as string}
              min={formData.date_start as string}
              readOnly={!readOnly}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  date_end: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-5 flex flex-col">
            <span className="text-md font-medium">
              Vehicle Registration Number
            </span>
            <select
              className="text-sm"
              value={formData.vehicle_registration_number?.toString()}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  vehicle_registration_number: e.target.value,
                }))
              }
            >
              {infoData.vehicle_registration_number &&
              availableVehicles?.has(infoData.vehicle_registration_number) ? (
                <option
                  value={infoData.vehicle_registration_number.toString()}
                  selected
                >
                  {infoData.vehicle_registration_number.toString() +
                    " (Current)"}
                </option>
              ) : (
                <option value={""} selected>
                  {"Select a vehicle"}
                </option>
              )}
              {availableVehicleDetails &&
                Object.values(availableVehicleDetails).map((vehicle) => (
                  <option key={vehicle.vehicle_registration_number}>
                    {vehicle.vehicle_registration_number} (
                    {vehicle.vehicle_make} {vehicle.vehicle_model})
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
          }}
          className="self-right my-10 w-full rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save Changes
        </button>
      </div>
    );
  } else {
    return null;
  }
}
