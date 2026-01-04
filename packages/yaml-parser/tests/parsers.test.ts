import { describe, test, expect, beforeAll } from "bun:test";
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";
import { pnpmLockfileUrls } from "@es-vanguard/test-utilities/datasets/pnpm.ts";
import { safeYamlParse } from "@/index";
import * as z from "zod";

describe("Bun YAML Parser vs js-yaml", () => {
  beforeAll(async () => {
    await Promise.all(
      pnpmLockfileUrls.map((url) => getGithubContent({ githubBlobUrl: url }))
    );
  });

  test.each(pnpmLockfileUrls)(
    "should give the same result for %s",
    async (url) => {
      const contentResult = await getGithubContent({ githubBlobUrl: url });
      if (contentResult.isErr()) {
        throw new Error(contentResult.error.message);
      }

      const bunParseResult = await safeYamlParse({
        text: contentResult.value,
        schema: z.any(),
        parser: "bun",
      });
      if (bunParseResult.isErr()) {
        console.error("Bun Parse Error:", bunParseResult.error);
      }

      const jsYamlParseResult = await safeYamlParse({
        text: contentResult.value,
        schema: z.any(),
        parser: "js-yaml",
      });
      if (jsYamlParseResult.isErr()) {
        console.error("js-yaml Parse Error:", jsYamlParseResult.error);
      }

      expect(bunParseResult.isOk()).toBe(true);
      expect(jsYamlParseResult.isOk()).toBe(true);

      if (bunParseResult.isOk() && jsYamlParseResult.isOk()) {
        expect(bunParseResult.value).toStrictEqual(jsYamlParseResult.value);
      }
    }
  );
});
