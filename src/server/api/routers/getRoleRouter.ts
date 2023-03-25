import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const retrieveAllHireAgreementsRouter = createTRPCRouter({
  RetrieveAllHireAgreements: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const idToSubmit = parseInt(input.text);
      const { data, error } = await supabaseClient
        .from("profiles")
        .select(`isStaff`)
        .eq("user_uid", idToSubmit);
      if (error) {
        //   console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
