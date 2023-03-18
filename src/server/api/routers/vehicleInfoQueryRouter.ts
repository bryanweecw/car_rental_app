import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

async function getVehicleInfo({ id }: { id: string }) {
  return await supabaseClient.from("vehicle").select().eq("id", id);
}

type getVehicleInfoResponse = Awaited<ReturnType<typeof getVehicleInfo>>;
export type getVehicleInfoResponseSuccess = getVehicleInfoResponse["data"];
export type getVehicleInfoResponseError = getVehicleInfoResponse["error"];

export const vehicleInfoQueryRouter = createTRPCRouter({
  getVehicleInfo: publicProcedure 
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const idToSubmit = parseInt(input.text);
      const { data, error } = await supabaseClient
        .from("vehicle")
        .select()
        .eq("id", idToSubmit);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
