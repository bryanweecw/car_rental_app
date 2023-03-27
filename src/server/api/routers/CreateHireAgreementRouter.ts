import { randomInt } from "crypto";
import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

const HireAgreementCreationDataSchema = z.object({
  amount: z.number(),
  vehicle_registration_number: z.string(),
  client_uid: z.string(),
  date_start: z.string(),
  date_end: z.string(),
  outlet_uid: z.number(),
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

      const { data: staffData, error: staffError } = await supabaseClient
        .from("staff")
        .select("user_uid")
        .eq("outlet_id", input.outlet_uid);
      if (staffError) {
        console.log(staffError);
      } else {
        console.log("Transaction inserted successfully:", transactionData);
      }

      const staffAssigned = staffData?.[randomInt(0, staffData.length)]
        ?.user_uid as string;

      if (
        transactionData &&
        transactionData[0] &&
        transactionData[0].transaction_id &&
        staffAssigned
      ) {
        const { data: hireAgreementData, error: hireAgreementError } =
          await supabaseClient
            .from("hire_agreement")
            .insert({
              transaction_id: transactionData[0].transaction_id,
              rental_cost: input.amount,
              vehicle_registration_number: input.vehicle_registration_number,
              client_uid: input.client_uid,
              staff_uid: staffAssigned,
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
