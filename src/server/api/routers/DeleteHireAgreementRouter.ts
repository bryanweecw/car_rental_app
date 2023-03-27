import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const deleteHireAgreementRouter = createTRPCRouter({
  HireAgreementDelete: publicProcedure
    .input(z.object({ text: z.number() }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("hire_agreement")
        .delete()
        .eq("hire_agreement_id", input.text);
      if (error) {
        console.log(error);
      } else {
        console.log("deleted", data);
      }
      return data;
    }),
});
