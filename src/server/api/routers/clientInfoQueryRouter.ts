import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const clientInfoQueryRouter = createTRPCRouter({
  getClientInfo: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select(`*, client(*)`)
        .eq("user_uid", input.text);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
