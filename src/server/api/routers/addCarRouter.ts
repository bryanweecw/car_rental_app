import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";

const CarUpdateDataSchema = z.object({
  capacity: z.number(),
  color: z.string(),
  description: z.string(),
  engine_size: z.string(),
  hire_rate: z.number(),
  imagealt: z.string(),
  imagesrc: z.string(),
  isactive: z.boolean(),
  mileage: z.number(),
  mot_test_date: z.string(),
  outlet_id: z.number(),
  vehicle_make: z.string(),
  vehicle_model: z.string(),
  vehicle_registration_number: z.string(),
});

export const addCarRouter = createTRPCRouter({
  CarAdd: publicProcedure
    .input(CarUpdateDataSchema)
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseClient.from("vehicle").insert({
        capacity: input.capacity,
        color: input.color,
        description: input.description,
        engine_size: input.engine_size,
        hire_rate: input.hire_rate,
        imagealt: input.imagealt,
        imagesrc: input.imagesrc,
        isactive: input.isactive,
        mot_test_date: input.mot_test_date,
        outlet_id: input.outlet_id,
        vehicle_make: input.vehicle_make,
        vehicle_model: input.vehicle_model,
        mileage: input.mileage,
        vehicle_registration_number: input.vehicle_registration_number,
      });
      if (error) {
        console.log(error);
        return error;
      } else {
        console.log("Vehicle update form submitted successfully:", data);
      }
      return data;
    }),
});
