import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: ["curl https://example.com"],
  allowPositionals: true,
});

console.log(values);
console.log(positionals);
