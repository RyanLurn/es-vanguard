// 1. The Redaction List (Lowercase for easier comparison)
const REDACTED_HEADER_KEYS = new Set([
  // Standard Auth
  "authorization",
  "proxy-authorization",
  "x-api-key",
  "api-key",
  "apikey",
  "cookie",
  "set-cookie",

  // OAuth / OIDC
  "x-auth-token",
  "x-access-token",
  "x-refresh-token",
  "x-id-token",
  "x-csrf-token",
  "x-xsrf-token",

  // Cloud / Platform Specific
  "gcloud-auth-token", // GCP
  "x-amz-security-token", // AWS
  "x-goog-iap-jwt-assertion", // GCP IAP

  // Custom / App Specific (Add common ones here)
  "token",
  "secret",
]);

export function serializeHeaders({
  headers,
  omit = [],
}: {
  headers: HeadersInit;
  omit?: string[];
}): Record<string, string> {
  const result: Record<string, string> = {};
  // Combine default list with user overrides
  const keysToRedact = new Set([
    ...REDACTED_HEADER_KEYS,
    ...omit.map((key) => key.toLowerCase()),
  ]);

  const headersInstance = new Headers(headers);

  headersInstance.forEach((value, key) => {
    const lowerCaseKey = key.toLowerCase();

    if (keysToRedact.has(lowerCaseKey)) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = value;
    }
  });

  return result;
}
