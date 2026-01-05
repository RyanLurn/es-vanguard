import * as z from "zod";

export const WatchReportEndpointInputSchema = z.object({
  packages: z.array(z.object({ name: z.string(), version: z.string() })),
});
export type WatchReportEndpointInput = z.infer<
  typeof WatchReportEndpointInputSchema
>;
