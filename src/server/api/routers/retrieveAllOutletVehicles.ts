import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

async function getHireAgreements() {
  return await supabaseClient.from("hire_agreement").select();
}

type getVehiclesResponse = Awaited<ReturnType<typeof getHireAgreements>>;
export type getVehiclesResponseSuccess = getVehiclesResponse["data"];
export type getVehiclesResponseError = getVehiclesResponse["error"];

export const retrieveAllOutletVehiclesRouter = createTRPCRouter({
  RetrieveAllOutletVehicles: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("staff")
        .select(`outlet(vehicle(*))`)
        // this syntax is OP wtf
        .eq("user_uid", input.text);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
