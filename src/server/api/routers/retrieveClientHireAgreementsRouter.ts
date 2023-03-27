import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const retrieveClientHireAgreementsRouter = createTRPCRouter({
  RetrieveClientHireAgreements: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("hire_agreement")
        .select(`*, client(profiles(first_name, last_name))`)
        .eq("client_uid", input.text);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
