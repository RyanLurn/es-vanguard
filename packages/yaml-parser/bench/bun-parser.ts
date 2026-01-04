import { safeYamlParse } from "@/index";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import * as z from "zod";

async function bunParser(dataset: string[]) {
  const t0 = Bun.nanoseconds();
  for (const url of dataset) {
    const result = await getGithubContent({ githubBlobUrl: url });
    if (result.isErr()) {
      console.error(`Failed to get ${url}: ${result.error.message}`);
      continue;
    }
    const text = result.value;

    const yamlObject = await safeYamlParse({
      text,
      schema: z.any(),
      parser: "bun",
    });
    if (yamlObject.isErr()) {
      console.error(`Failed to parse ${url}: ${yamlObject.error.message}`);
      continue;
    }
  }
  const t1 = Bun.nanoseconds();
  const totalTime = t1 - t0;
  return totalTime;
}

export { bunParser };
