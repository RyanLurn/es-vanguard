// Based on the types at:
// https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/lockfileFileTypes.ts
// https://github.com/pnpm/pnpm/blob/main/lockfile/types/src/index.ts

import * as z from "zod";

const PnpmLockfileSchema = z.looseObject({
  packages: z.record(z.string(), z.any()).optional(),
});

type PnpmLockfile = z.infer<typeof PnpmLockfileSchema>;

export { PnpmLockfileSchema };
export type { PnpmLockfile };
