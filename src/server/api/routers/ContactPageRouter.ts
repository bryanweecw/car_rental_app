import { z } from "zod";
import { supabaseClient } from "../../sharedinstance";
import { createTRPCRouter, publicProcedure } from "../trpc";
import validator from "validator";

const phoneSchema = z
  .string()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  .refine((val) => validator.isMobilePhone(val, "any"), {
    message: "Invalid phone number",
  });

const contactFormDataSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone_number: phoneSchema,
  message: z.string().min(1),
});

export const contactMutationRouter = createTRPCRouter({
  sendContactForm: publicProcedure
    .input(contactFormDataSchema)
    .mutation(async ({ input }) => {
      const now = new Date().toISOString();
      const { data, error } = await supabaseClient.from("contact_page").insert({
        created_at: now.toString(),
        email: input.email,
        first_name: input.first_name,
        last_name: input.last_name,
        company: input.company,
        phone_number: input.phone_number,
        message: input.message,
      });
      if (error) {
        // console.log(error);
      } else {
        // console.log("Contact form submitted successfully:", data);
      }
      return data;
    }),
});
