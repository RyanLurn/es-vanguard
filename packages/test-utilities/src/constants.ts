const npmLockfileUrls = [
  "https://github.com/npm/cli/blob/latest/package-lock.json",
  "https://github.com/microsoft/TypeScript/blob/main/package-lock.json",
  "https://github.com/axios/axios/blob/v1.x/package-lock.json",
  "https://github.com/twbs/bootstrap/blob/main/package-lock.json",
  "https://github.com/nestjs/nest/blob/master/package-lock.json",
  "https://github.com/tj/commander.js/blob/master/package-lock.json",
  "https://github.com/moment/moment/blob/develop/package-lock.json",
  "https://github.com/jashkenas/underscore/blob/master/package-lock.json",
  "https://github.com/isaacs/node-mkdirp/blob/main/package-lock.json",
  "https://github.com/isaacs/node-glob/blob/main/package-lock.json",
  "https://github.com/uuidjs/uuid/blob/main/package-lock.json",
  "https://github.com/JedWatson/classnames/blob/main/package-lock.json",
  "https://github.com/jquery/jquery/blob/main/package-lock.json",
  "https://github.com/yeoman/generator/blob/main/package-lock.json",
  "https://github.com/zloirock/core-js/blob/master/package-lock.json",
  "https://github.com/cheeriojs/cheerio/blob/main/package-lock.json",
  "https://github.com/isaacs/rimraf/blob/main/package-lock.json",
  "https://github.com/webpack/css-loader/blob/main/package-lock.json",
  "https://github.com/shelljs/shelljs/blob/main/package-lock.json",
  "https://github.com/motdotla/dotenv/blob/master/package-lock.json",
  "https://github.com/isaacs/minimatch/blob/main/package-lock.json",
  "https://github.com/isaacs/node-lru-cache/blob/main/package-lock.json",
  "https://github.com/juliangruber/brace-expansion/blob/main/package-lock.json",
  "https://github.com/mozilla/source-map/blob/master/package-lock.json",
  "https://github.com/isaacs/minipass/blob/main/package-lock.json",
  "https://github.com/acornjs/acorn/blob/master/package-lock.json",
  "https://github.com/moxystudio/node-cross-spawn/blob/master/package-lock.json",
  "https://github.com/jsdom/webidl-conversions/blob/main/package-lock.json",
  "https://github.com/jsdom/whatwg-url/blob/main/package-lock.json",
  "https://github.com/jsdom/tr46/blob/main/package-lock.json",
  "https://github.com/fb55/entities/blob/main/package-lock.json",
  "https://github.com/paulmillr/chokidar/blob/main/package-lock.json",
];

const npmV1LockfileUrls = [
  "https://github.com/lodash/lodash/blob/main/package-lock.json",
  "https://github.com/petkaantonov/bluebird/blob/master/package-lock.json",
  "https://github.com/Marak/colors.js/blob/master/package-lock.json",
  "https://github.com/json5/json5/blob/main/package-lock.json",
  // From Angular
  "https://github.com/angular/angular-seed/blob/master/package-lock.json",
  "https://github.com/angular/protractor/blob/master/package-lock.json",
  "https://github.com/angular/angular-phonecat/blob/master/package-lock.json",
];

const npmV2LockfileUrls = [
  "https://github.com/webpack/schema-utils/blob/main/package-lock.json",
  "https://github.com/juliangruber/balanced-match/blob/master/package-lock.json",
  // From Facebook
  "https://github.com/facebook/create-react-app/blob/main/package-lock.json",
  // From Angular
  "https://github.com/angular/material/blob/master/package-lock.json",
  // From Svelte
  "https://github.com/sveltejs/svelte-loader/blob/master/package-lock.json",
  "https://github.com/sveltejs/rollup-plugin-svelte/blob/master/package-lock.json",
];

const npmV3LockfileUrls = [
  "https://github.com/paulmillr/readdirp/blob/master/package-lock.json",
  "https://github.com/lydell/js-tokens/blob/main/package-lock.json",
  "https://github.com/jshttp/cookie/blob/master/package-lock.json",
  "https://github.com/broofa/mime/blob/main/package-lock.json",
  "https://github.com/eemeli/yaml/blob/main/package-lock.json",
  // From Facebook
  "https://github.com/facebook/stylex/blob/main/package-lock.json",
  // From Angular
  "https://github.com/angular/angularfire/blob/main/package-lock.json",
  // From Svelte
  "https://github.com/sveltejs/prettier-plugin-svelte/blob/master/package-lock.json",
];

const yarnLockfileUrls = [
  "https://github.com/yarnpkg/berry/blob/master/yarn.lock",
  "https://github.com/styled-components/styled-components/blob/main/yarn.lock",
  "https://github.com/prettier/prettier/blob/main/yarn.lock",
  "https://github.com/webpack/webpack/blob/main/yarn.lock",
  "https://github.com/SBoudrias/Inquirer.js/blob/main/yarn.lock",
  "https://github.com/ReactiveX/rxjs/blob/master/yarn.lock",
  "https://github.com/babel/babel/blob/main/yarn.lock",
  "https://github.com/jestjs/jest/blob/main/yarn.lock",
];

const yarnV1LockfileUrls = [
  // From others
  "https://github.com/dataform-co/dataform/blob/main/yarn.lock",
  // From Facebook
  "https://github.com/facebook/react/blob/main/yarn.lock",
  "https://github.com/facebook/react-native/blob/main/yarn.lock",
  "https://github.com/facebook/docusaurus/blob/main/yarn.lock",
  "https://github.com/facebook/flow/blob/main/yarn.lock",
  "https://github.com/facebook/relay/blob/main/yarn.lock",
  "https://github.com/facebook/jscodeshift/blob/main/yarn.lock",
  // From Vercel
  "https://github.com/vercel/hyper/blob/canary/yarn.lock",
  "https://github.com/vercel/pkg/blob/main/yarn.lock",
  "https://github.com/vercel/ncc/blob/main/yarn.lock",
  "https://github.com/vercel/styled-jsx/blob/main/yarn.lock",
  "https://github.com/vercel/micro/blob/main/yarn.lock",
  "https://github.com/vercel/og-image/blob/main/yarn.lock",
  "https://github.com/vercel/release/blob/master/yarn.lock",
  "https://github.com/vercel/hazel/blob/master/yarn.lock",
  "https://github.com/vercel/async-retry/blob/main/yarn.lock",
  // From Vue
  "https://github.com/vuejs/vue-cli/blob/dev/yarn.lock",
  "https://github.com/vuejs/vuex/blob/main/yarn.lock",
  "https://github.com/vuejs/devtools-v6/blob/main/yarn.lock",
  "https://github.com/vuejs/vuepress/blob/master/yarn.lock",
  "https://github.com/vuejs/vue-router/blob/dev/yarn.lock",
  "https://github.com/vuejs/vue-hackernews-2.0/blob/master/yarn.lock",
  "https://github.com/vuejs/vue-class-component/blob/master/yarn.lock",
  "https://github.com/vuejs/vetur/blob/master/yarn.lock",
  "https://github.com/vuejs/v2.vuejs.org/blob/master/yarn.lock",
  "https://github.com/vuejs/vue-test-utils/blob/dev/yarn.lock",
  "https://github.com/vuejs/vue-rx/blob/master/yarn.lock",
  // From Nuxt
  "https://github.com/nuxt/components/blob/main/yarn.lock",
  // From Angular
  "https://github.com/angular/angular.js/blob/master/yarn.lock",
  "https://github.com/angular/flex-layout/blob/master/yarn.lock",
  "https://github.com/angular/universal/blob/main/yarn.lock",
  "https://github.com/angular/zone.js/blob/master/yarn.lock",
];

const yarnV2LockfileUrls = [
  "https://github.com/typescript-eslint/typescript-eslint/blob/main/yarn.lock",
];

const pnpmV5LockfileUrls = [
  "https://github.com/vuejs/petite-vue/blob/main/pnpm-lock.yaml",
  // From TanStack
  "https://github.com/TanStack/bling/blob/main/pnpm-lock.yaml",
];

const pnpmV6LockfileUrls = [
  "https://github.com/TooTallNate/proxy-agents/blob/main/pnpm-lock.yaml",
  // From Vercel
  "https://github.com/vercel/vercel/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/satori/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/nextjs-subscription-payments/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/next-learn/blob/main/pnpm-lock.yaml",
  // From Vue
  "https://github.com/vuejs/vue/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/vue-loader/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/composition-api/blob/main/pnpm-lock.yaml",
  // From Svelte
  "https://github.com/sveltejs/devalue/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/svelte-devtools/blob/master/pnpm-lock.yaml",
];

const pnpmV9LockfileUrls = [
  "https://github.com/pnpm/pnpm/blob/main/pnpm-lock.yaml",
  "https://github.com/browserslist/browserslist/blob/main/pnpm-lock.yaml",
  "https://github.com/browserslist/caniuse-lite/blob/main/pnpm-lock.yaml",
  // From Facebook
  "https://github.com/facebook/lexical/blob/main/pnpm-lock.yaml",
  // From Vercel
  "https://github.com/vercel/next.js/blob/canary/pnpm-lock.yaml",
  "https://github.com/vercel/ms/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/ai/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/turborepo/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/swr/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/commerce/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/ai-chatbot/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/serve/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/next-forge/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/platforms/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/examples/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/streamdown/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/next-app-router-playground/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/virtual-event-starter-kit/blob/main/pnpm-lock.yaml",
  "https://github.com/vercel/little-date/blob/main/pnpm-lock.yaml",
  // From Vue
  "https://github.com/vuejs/core/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/vitepress/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/pinia/blob/v3/pnpm-lock.yaml",
  "https://github.com/vuejs/language-tools/blob/master/pnpm-lock.yaml",
  "https://github.com/vuejs/apollo/blob/v4/pnpm-lock.yaml",
  "https://github.com/vuejs/router/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/create-vue/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/vuefire/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/docs/blob/main/pnpm-lock.yaml",
  "https://github.com/vuejs/devtools/blob/main/pnpm-lock.yaml",
  // From Nuxt
  "https://github.com/nuxt/nuxt/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/ui/blob/v4/pnpm-lock.yaml",
  "https://github.com/nuxt/content/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/devtools/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/movies/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/image/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/hackernews/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/icon/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/modules/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/learn.nuxt.com/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/eslint/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/fonts/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/scripts/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/nuxt.com/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/test-utils/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/nuxt.new/blob/main/pnpm-lock.yaml",
  "https://github.com/nuxt/bridge/blob/main/pnpm-lock.yaml",
  // From Angular
  "https://github.com/angular/angular/blob/main/pnpm-lock.yaml",
  "https://github.com/angular/angular-cli/blob/main/pnpm-lock.yaml",
  "https://github.com/angular/components/blob/main/pnpm-lock.yaml",
  // From Svelte
  "https://github.com/sveltejs/svelte/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/kit/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/realworld/blob/master/pnpm-lock.yaml",
  "https://github.com/sveltejs/svelte-preprocess/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/language-tools/blob/master/pnpm-lock.yaml",
  "https://github.com/sveltejs/vite-plugin-svelte/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/cli/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/eslint-plugin-svelte/blob/main/pnpm-lock.yaml",
  "https://github.com/sveltejs/sites/blob/master/pnpm-lock.yaml",
  "https://github.com/sveltejs/svelte.dev/blob/main/pnpm-lock.yaml",
  // From PostCSS
  "https://github.com/postcss/postcss/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/autoprefixer/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/postcss-nested/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/postcss-100vh-fix/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/sugarss/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/postcss-scss/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/postcss-js/blob/main/pnpm-lock.yaml",
  "https://github.com/postcss/postcss-load-config/blob/main/pnpm-lock.yaml",
  // From TanStack
  "https://github.com/TanStack/query/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/table/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/router/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/virtual/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/form/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/db/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/ai/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/create-tsrouter-app/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/tanstack.com/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/ranger/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/store/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/pacer/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/devtools/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/config/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/select/blob/main/pnpm-lock.yaml",
  "https://github.com/TanStack/persister/blob/main/pnpm-lock.yaml",
];

const pnpmLockfileUrls = [
  ...pnpmV5LockfileUrls,
  ...pnpmV6LockfileUrls,
  ...pnpmV9LockfileUrls,
];

export {
  npmLockfileUrls,
  npmV1LockfileUrls,
  npmV2LockfileUrls,
  npmV3LockfileUrls,
  yarnLockfileUrls,
  yarnV1LockfileUrls,
  yarnV2LockfileUrls,
  pnpmLockfileUrls,
  pnpmV5LockfileUrls,
  pnpmV6LockfileUrls,
  pnpmV9LockfileUrls,
};
