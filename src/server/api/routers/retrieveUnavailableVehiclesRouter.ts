import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

// async function getHireAgreements() {
//   return await supabaseClient.from("hire_agreement").select();
// }

// type getVehiclesResponse = Awaited<ReturnType<typeof getHireAgreements>>;
// export type getVehiclesResponseSuccess = getVehiclesResponse["data"];
// export type getVehiclesResponseError = getVehiclesResponse["error"];

export const retrieveUnavailableVehiclesRouter = createTRPCRouter({
  RetrieveUnavailableVehicles: publicProcedure
    .input(
      z.object({
        hire_agreement_id: z.number(),
        date_start: z.string(),
        date_end: z.string(),
      })
    )
    .query(async ({ input }) => {
      const startingDate = input.date_start;
      const endingDate = input.date_end;
      const { data, error } = await supabaseClient
        .from("hire_agreement")
        .select(
          `hire_agreement_id, date_start, date_end ,vehicle(vehicle_registration_number, vehicle_make, vehicle_model, outlet_id)`
        )
        .filter("date_start", "lte", endingDate)
        .filter("date_end", "gte", startingDate)
        .filter("hire_agreement_id", "neq", input.hire_agreement_id);
      //returns vehicle info from hire agreements during the specified dates
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
