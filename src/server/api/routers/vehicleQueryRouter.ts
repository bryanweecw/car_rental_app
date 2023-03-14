import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

async function getVehicles() {
  return await supabaseClient.from("vehicle").select();
}

type getVehiclesResponse = Awaited<ReturnType<typeof getVehicles>>;
export type getVehiclesResponseSuccess = getVehiclesResponse["data"];
export type getVehiclesResponseError = getVehiclesResponse["error"];

export const vehicleQueryRouter = createTRPCRouter({
  hello: publicProcedure.query(async () => {
    const { data, error } = await supabaseClient.from("vehicle").select();
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("data retrieved:", data);
      return data;
    }
  }),
});
