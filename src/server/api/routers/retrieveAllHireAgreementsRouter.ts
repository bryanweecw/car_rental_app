import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

async function getHireAgreements() {
  return await supabaseClient.from("hire_agreement").select();
}

type getVehiclesResponse = Awaited<ReturnType<typeof getHireAgreements>>;
export type getVehiclesResponseSuccess = getVehiclesResponse["data"];
export type getVehiclesResponseError = getVehiclesResponse["error"];

export const retrieveAllHireAgreementsRouter = createTRPCRouter({
  RetrieveAllHireAgreements: publicProcedure.query(async () => {
    const { data, error } = await supabaseClient
      .from("hire_agreement")
      .select(`*, client(profiles(first_name, last_name))`);
    if (error) {
      // console.log(error);
      return error;
    } else {
      // console.log("data retrieved:", data);
      return data;
    }
  }),
});
