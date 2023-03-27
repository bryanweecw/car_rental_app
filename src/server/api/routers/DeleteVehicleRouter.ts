import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const deleteVehicleRouter = createTRPCRouter({
  VehicleDelete: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("vehicle")
        .delete()
        .eq("vehicle_registration_number", input.text);
      if (error) {
        console.log(error);
      } else {
        console.log("deleted", data);
      }
      return data;
    }),
});
