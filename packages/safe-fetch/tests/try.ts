import { RequestConstructionError } from "@/utils/errors";
import { serializeError } from "serialize-error";

const request = new Request("https://example.com");

const error = new RequestConstructionError("Something went wrong", {
  input: request,
  cause: new TypeError("Invalid request"),
});

const serializedError = serializeError(error);

console.log(serializedError);
