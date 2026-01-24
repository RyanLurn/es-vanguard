import { createFetch } from "@better-fetch/fetch";

const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

export const $fetch = createFetch({
  timeout: 5000, // 5 seconds
  retry: {
    type: "exponential",
    attempts: 3,
    baseDelay: 500, // 0.5 seconds
    maxDelay: 2000, // 2 seconds
    shouldRetry: (response) => {
      if (response === null) {
        return true;
      }
      if (retryStatusCodes.has(response.status)) {
        return true;
      }
      return false;
    },
  },
});
