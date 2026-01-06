import semver from "semver";
import * as z from "zod";

export const SemverSchema = z
  .stringFormat("semver", (value) => {
    return semver.valid(value);
  })
  .brand("semver")
  .brand("semver-range");
export type Semver = z.infer<typeof SemverSchema>;

export const SemverRangeSchema = z
  .stringFormat("semver-range", (value) => {
    return semver.validRange(value);
  })
  .brand("semver-range");
export type SemverRange = z.infer<typeof SemverRangeSchema>;
