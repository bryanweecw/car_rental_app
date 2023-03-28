import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

// const TaskCreationDataSchema = z.object({
//   description: z.string(),
//   importance: z.string(),
//   staff_id: z.string(),
//   is_done: z.boolean(),
//   created_by: z.string(),
//   complete_by: z.date(),
//   id: z.string(),
//   created_on: z.string(),
// });

const TaskCreationDataSchema = z.object({
  description: z.string(),
  importance: z.string(),
  staff_id: z.string(),
  is_done: z.boolean(),
  created_by: z.string(),
  complete_by: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return (
          Object.prototype.toString.call(date) === "[object Date]" &&
          !isNaN(date.getTime())
        );
      },
      { message: "Invalid date format" }
    )
    .transform((val) => new Date(val)),
  id: z.string(),
  created_on: z.string(),
});

export const addTaskRouter = createTRPCRouter({
  addtask: publicProcedure
    .input(TaskCreationDataSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("staff_tasks")
        .insert({
          description: input.description,
          importance: input.importance,
          is_done: false,
          complete_by: input.complete_by,
          created_on: input.created_on,
          id: input.id,
          staff_id: input.staff_id,
          created_by: input.created_by,
        })
        .select("*");
      if (error) {
        console.log(error);
      } else {
        console.log("Task Added successfully:", data);
      }
      return data;
    }),
  deletetask: publicProcedure
    .input(TaskCreationDataSchema.pick({ id: true }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient
        .from("staff_tasks")
        .delete()
        .eq("id", input.id);
      if (error) {
        console.log(error);
        throw new Error("Error deleting task");
      }
      console.log("Task deleted successfully:", data);
      return data?.[0];
    }),
});
