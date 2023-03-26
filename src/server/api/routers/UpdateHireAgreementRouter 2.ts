import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

const HireAgreementCreationDataSchema = z.object({
  vehicle_registration_number: z.string(),
  hire_agreement_id: z.string(),
  date_start: z.string(),
  date_end: z.string(),
});

export const updateHireAgreementRouter = createTRPCRouter({
  HireAgreementUpdate: publicProcedure
    .input(HireAgreementCreationDataSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("hire_agreement")
        .update({
          date_start: input.date_start,
          date_end: input.date_end,
          vehicle_registration_number: input.vehicle_registration_number,
        })
        .eq("hire_agreement_id", input.hire_agreement_id);
      if (error) {
        console.log(error);
      } else {
        console.log("Contact form submitted successfully:", data);
      }
      return data;
    }),
});
