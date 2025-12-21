import type { DependenciesSchema } from "@/schemas";
import type * as z from "zod";

type ParsedDependencies = z.infer<typeof DependenciesSchema>;

export type { ParsedDependencies };
