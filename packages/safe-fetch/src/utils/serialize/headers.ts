export function serializeHeaders(
  headers: Headers | Record<string, string>
): Record<string, string> {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  return headers;
}
