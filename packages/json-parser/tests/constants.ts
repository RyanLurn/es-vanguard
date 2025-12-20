const githubBlobJsonUrls = [
  "https://github.com/npm/cli/blob/latest/package-lock.json",
  "https://github.com/microsoft/TypeScript/blob/main/package-lock.json",
  "https://github.com/axios/axios/blob/v1.x/package-lock.json",
  "https://github.com/twbs/bootstrap/blob/main/package-lock.json",
  "https://github.com/nestjs/nest/blob/master/package-lock.json",
];

const githubBlobNotJsonUrls = [
  "https://github.com/facebook/react/blob/main/yarn.lock",
  "https://github.com/vercel/next.js/blob/canary/pnpm-lock.yaml",
];

export { githubBlobJsonUrls, githubBlobNotJsonUrls };
