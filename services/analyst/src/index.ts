import { isBinary } from "#utils/is-binary";

const filePath = "dist/lib/with-promise-cache.d.ts";
const binaryCheckResult = isBinary({ filePath });
if (binaryCheckResult.isErr()) {
  console.error(binaryCheckResult.error);
  process.exit(1);
}
console.log(binaryCheckResult.value);
