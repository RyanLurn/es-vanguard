import type { InputsSchema, PackageManagerSchema } from "@/helpers/schemas";
import * as z from "zod";

type Inputs = z.infer<typeof InputsSchema>;
type PackageManager = z.infer<typeof PackageManagerSchema>;

export type { Inputs, PackageManager };
