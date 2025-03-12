import type { Database } from "./supabase-types.d.ts";

import { SUPABASE_KEY, SUPABASE_URL } from "$env/static/private";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
