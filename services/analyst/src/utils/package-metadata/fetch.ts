import type { LogStep } from "@/contexts";
import type {
  ValidateInputsContext,
  ValidInputs,
} from "@/utils/inputs/validate";
import { HttpError } from "@es-vanguard/utils/errors/classes";
import { createFallbackError } from "@es-vanguard/utils/errors/fallback";
import {
  ABBREVIATED_METADATA_ACCEPT_HEADER,
  NPM_REGISTRY_URL,
} from "@es-vanguard/utils/npm-constants";
import { err, ok } from "neverthrow";
import { serializeError } from "serialize-error";

type SerializedResponse = {
  headers: Record<string, string>;
  ok: Response["ok"];
  redirected: Response["redirected"];
  status: Response["status"];
  statusText: Response["statusText"];
  type: Response["type"];
  url: Response["url"];
};

function serializeResponse(response: Response) {
  const serializedHeaders = Object.fromEntries(response.headers.entries());
  const serializedResponse: SerializedResponse = {
    headers: serializedHeaders,
    ok: response.ok,
    redirected: response.redirected,
    status: response.status,
    statusText: response.statusText,
    type: response.type,
    url: response.url,
  };

  return serializedResponse;
}

type FetchPackageMetadataStep = LogStep<
  "fetch-package-metadata",
  SerializedResponse
>;
export interface FetchPackageMetadataContext extends Omit<
  ValidateInputsContext,
  "steps"
> {
  steps: [...ValidateInputsContext["steps"], FetchPackageMetadataStep];
}

export async function fetchPackageMetadata({
  validInputs,
  context,
}: {
  validInputs: ValidInputs;
  context: ValidateInputsContext;
}) {
  const startTime = Bun.nanoseconds();
  try {
    const url = `${NPM_REGISTRY_URL}/${validInputs.name}`;
    const response = await fetch(url, {
      headers: {
        Accept: ABBREVIATED_METADATA_ACCEPT_HEADER,
      },
    });
    const endTime = Bun.nanoseconds();

    const serializedResponse = serializeResponse(response);

    if (!response.ok) {
    }
    const newContext: FetchPackageMetadataContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "fetch-package-metadata",
          time: {
            start: startTime,
            end: endTime,
            duration: endTime - startTime,
          },
          success: true,
          data: serializedResponse,
        },
      ],
    };

    return ok({
      response,
      context: newContext,
    });
  } catch (error) {
    const endTime = Bun.nanoseconds();
    const fallbackError = createFallbackError(error);
    const newContext: FetchPackageMetadataContext = {
      ...context,
      steps: [
        ...context.steps,
        {
          name: "fetch-package-metadata",
          time: {
            start: startTime,
            end: endTime,
            duration: endTime - startTime,
          },
          success: false,
          error: serializeError(fallbackError),
        },
      ],
    };

    return err({
      error: fallbackError,
      context: newContext,
    });
  }
}
