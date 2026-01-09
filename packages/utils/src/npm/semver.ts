import semverValid from "semver/functions/valid";
import semverValidRange from "semver/ranges/valid";
import * as z from "zod";

export const SemverSchema = z
  .stringFormat("semver", (value) => {
    return semverValid(value);
  })
  .brand("semver")
  .brand("semver-range");
export type Semver = z.infer<typeof SemverSchema>;

export const SemverRangeSchema = z
  .stringFormat("semver-range", (value) => {
    return semverValidRange(value);
  })
  .brand("semver-range");
export type SemverRange = z.infer<typeof SemverRangeSchema>;
