import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const retrieveSetUpStatusRouter = createTRPCRouter({
  retrieveSetUpStatus: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select(`issetup`)
        .eq("user_uid", input.text);
      if (error) {
        //   console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
