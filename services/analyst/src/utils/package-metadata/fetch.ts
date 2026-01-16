import { CustomError } from "@es-vanguard/telemetry/errors/classes";
import { createFallbackError } from "@es-vanguard/telemetry/errors/fallback";
import {
  ABBREVIATED_METADATA_ACCEPT_HEADER,
  NPM_REGISTRY_URL,
} from "@es-vanguard/utils/npm-constants";
import type { NpmPackageName } from "@es-vanguard/utils/npm-package-name";
import { err, ok, Result } from "neverthrow";
import { betterFetch } from "@better-fetch/fetch";

export async function fetchPackageMetadata({ name }: { name: NpmPackageName }) {
  const url = `${NPM_REGISTRY_URL}/${encodeURIComponent(name)}`;
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      Accept: ABBREVIATED_METADATA_ACCEPT_HEADER,
    },
  };
  const context = {
    packageName: name,
    url,
    fetchOptions,
  };

  try {
    const { data, error } = await betterFetch(url, fetchOptions);
    if (error) {
      return err(error);
    }
    return ok(data);
  } catch (error) {
    if (error instanceof TypeError) {
      const fetchError = new CustomError(
        `Failed to fetch metadata for ${name} from the npm registry`,
        {
          cause: error,
          expected: true,
          code: "FETCH_ERROR",
          context,
        }
      );

      return err(fetchError);
    }

    const fallbackError = createFallbackError({ error, context });
    return err(fallbackError);
  }
}
