export function serializeHeaders(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}
