import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

const HireAgreementCreationDataSchema = z.object({
  amount: z.number(),
  vehicle_registration_number: z.string(),
  client_uid: z.string(),
  date_start: z.string(),
  date_end: z.string(),
});

export const createHireAgreementRouter = createTRPCRouter({
  HireAgreementCreation: publicProcedure
    .input(HireAgreementCreationDataSchema)
    .mutation(async ({ input }) => {
      const { data: transactionData, error: transactionError } =
        await supabaseClient
          .from("transaction")
          .insert({ amount: input.amount })
          .select("*");
      if (transactionError) {
        console.log(transactionError);
      } else {
        console.log("Transaction inserted successfully:", transactionData);
      }

      if (
        transactionData &&
        transactionData[0] &&
        transactionData[0].transaction_id
      ) {
        const { data: hireAgreementData, error: hireAgreementError } =
          await supabaseClient
            .from("hire_agreement")
            .insert({
              transaction_id: transactionData[0].transaction_id,
              rental_cost: input.amount,
              vehicle_registration_number: input.vehicle_registration_number,
              client_uid: input.client_uid,
              staff_uid: "ec4fd7e3-a5cb-45e2-980c-32b385960322", //fix later
              date_start: input.date_start,
              date_end: input.date_end,
            })
            .select("*");

        if (hireAgreementError) {
          console.log(hireAgreementError);
        } else {
          console.log(
            "Hire agreement inserted successfully:",
            hireAgreementData
          );
        }

        return [transactionData, hireAgreementData];
      }
    }),
});
