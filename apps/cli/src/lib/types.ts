import type { InputsSchema } from "@/helpers/schemas";
import * as z from "zod";

type Inputs = z.infer<typeof InputsSchema>;

export type { Inputs };
