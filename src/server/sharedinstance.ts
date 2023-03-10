import { createClient } from "@supabase/supabase-js";
import { type Database } from "../types/database-raw";

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);
