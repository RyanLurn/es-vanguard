import { createFetch } from "@better-fetch/fetch";

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
      if (response.status === 429 || response.status === 503) {
        return true;
      }
      return false;
    },
  },
});
