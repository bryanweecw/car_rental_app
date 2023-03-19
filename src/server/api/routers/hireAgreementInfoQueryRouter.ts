import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

async function getHireAgreement({ id }: { id: string }) {
  return await supabaseClient
    .from("hire_agreement")
    .select(
      `*, client(profiles(first_name, last_name)), vehicle(*), staff(profiles(first_name, last_name)))`
    )
    .eq("hire_agreement_id", id);
}

type getHireAgreementInfoResponse = Awaited<
  ReturnType<typeof getHireAgreement>
>;
export type getHireAgreementInfoResponseSuccess =
  getHireAgreementInfoResponse["data"];
export type getHireAgreementInfoResponseError =
  getHireAgreementInfoResponse["error"];

export const HireAgreementInfoQueryRouter = createTRPCRouter({
  getHireAgreementInfo: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const idToSubmit = parseInt(input.text);
      const { data, error } = await supabaseClient
        .from("hire_agreement")
        .select(
          `*, client(profiles(first_name, last_name)), vehicle(*), staff(profiles(first_name, last_name)))`
        )
        .eq("hire_agreement_id", idToSubmit);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
