import { getJsonResponse } from "@es-vanguard/safe-fetch/get-json-response";
import { NPM_REGISTRY_URL } from "@es-vanguard/utils/npm-constants";

export async function fetchPackageMetadata({
  packageName,
}: {
  packageName: string;
}) {
  const request = new Request(`${NPM_REGISTRY_URL}/${packageName}`);
  const getResult = await getJsonResponse(request);

  if (getResult.isErr()) {
    throw getResult.error;
  }

  return getResult.value;
}
