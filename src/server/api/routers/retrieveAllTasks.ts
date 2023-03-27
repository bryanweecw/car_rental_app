import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

async function getTasks({ id }: { id: string }) {
  return await supabaseClient.from("staff_tasks").select().eq("id", id);
}

type getTasksResponse = Awaited<ReturnType<typeof getTasks>>;
export type getVehicleInfoResponseSuccess = getTasksResponse["data"];
export type getVehicleInfoResponseError = getTasksResponse["error"];

export const retrieveAllTasks = createTRPCRouter({
  getTasks: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("staff_tasks")
        .select("staff_tasks.*, profiles!created_by(first_name, last_name)")
        .eq("staff_id", input.text);

      //   const { data: data2, error: error2 } = await supabaseClient
      //     .from("profiles")
      //     .select("first_name, last_name")
      //     .eq("created_by", input.text);
      if (error) {
        // console.log(error);
        return error;
      } else {
        // console.log("data retrieved:", data);
        return data;
      }
    }),
});
