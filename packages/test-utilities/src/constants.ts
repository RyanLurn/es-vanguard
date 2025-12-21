const npmLockfileUrls = [
  "https://github.com/npm/cli/blob/latest/package-lock.json",
  "https://github.com/microsoft/TypeScript/blob/main/package-lock.json",
  "https://github.com/axios/axios/blob/v1.x/package-lock.json",
  "https://github.com/twbs/bootstrap/blob/main/package-lock.json",
  "https://github.com/nestjs/nest/blob/master/package-lock.json",
];

const yarnLockfileUrls = [
  "https://github.com/yarnpkg/berry/blob/master/yarn.lock",
  "https://github.com/facebook/react/blob/main/yarn.lock",
  "https://github.com/styled-components/styled-components/blob/main/yarn.lock",
  "https://github.com/prettier/prettier/blob/main/yarn.lock",
  "https://github.com/webpack/webpack/blob/main/yarn.lock",
];

const pnpmLockfileUrls = [
  "https://github.com/pnpm/pnpm/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/next.js/blob/canary/pnpm-lock.yaml",
  "https://github.com/angular/angular/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/core/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/svelte/blob/main/pnpm-lock.yaml",
];

export { npmLockfileUrls, yarnLockfileUrls, pnpmLockfileUrls };
