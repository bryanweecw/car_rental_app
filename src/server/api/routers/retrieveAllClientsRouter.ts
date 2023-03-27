import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const retrieveAllClientsRouter = createTRPCRouter({
  RetrieveAllClients: publicProcedure.query(async () => {
    const { data, error } = await supabaseClient
      .from("profiles")
      .select(`*, client(*)`);
    // this syntax is OP wtf
    if (error) {
      // console.log(error);
      return error;
    } else {
      // console.log("data retrieved:", data);
      return data;
    }
  }),
});
