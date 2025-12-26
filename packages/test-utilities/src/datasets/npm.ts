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
  "https://github.com/nestjs/nest-cli/blob/master/package-lock.json",
  "https://github.com/jashkenas/underscore/blob/master/package-lock.json",
  "https://github.com/uuidjs/uuid/blob/main/package-lock.json",
  "https://github.com/motdotla/dotenv/blob/master/package-lock.json",
  "https://github.com/juliangruber/brace-expansion/blob/main/package-lock.json",
  "https://github.com/mozilla/source-map/blob/master/package-lock.json",
  // From Moment.js
  "https://github.com/moment/moment/blob/develop/package-lock.json",
  "https://github.com/moment/luxon/blob/master/package-lock.json",
  // From Microsoft
  "https://github.com/microsoft/TypeScript/blob/main/package-lock.json",
  // From Axios
  "https://github.com/axios/axios/blob/v1.x/package-lock.json",
  "https://github.com/axios/axios-docs/blob/master/package-lock.json",
  // From Facebook
  "https://github.com/facebook/create-react-app/blob/main/package-lock.json",
  // From Angular
  "https://github.com/angular/material/blob/master/package-lock.json",
  // From Svelte
  "https://github.com/sveltejs/svelte-loader/blob/master/package-lock.json",
  "https://github.com/sveltejs/rollup-plugin-svelte/blob/master/package-lock.json",
  // From Tailwind Labs
  "https://github.com/tailwindlabs/heroicons/blob/master/package-lock.json",
  "https://github.com/tailwindlabs/tailwindcss-typography/blob/main/package-lock.json",
];

const npmV3LockfileUrls = [
  "https://github.com/paulmillr/readdirp/blob/master/package-lock.json",
  "https://github.com/lydell/js-tokens/blob/main/package-lock.json",
  "https://github.com/jshttp/cookie/blob/master/package-lock.json",
  "https://github.com/broofa/mime/blob/main/package-lock.json",
  "https://github.com/eemeli/yaml/blob/main/package-lock.json",
  "https://github.com/twbs/bootstrap/blob/main/package-lock.json",
  "https://github.com/koajs/koa/blob/master/package-lock.json",
  "https://github.com/tj/commander.js/blob/master/package-lock.json",
  "https://github.com/JedWatson/classnames/blob/main/package-lock.json",
  "https://github.com/jquery/jquery/blob/main/package-lock.json",
  "https://github.com/yeoman/generator/blob/main/package-lock.json",
  "https://github.com/zloirock/core-js/blob/master/package-lock.json",
  "https://github.com/cheeriojs/cheerio/blob/main/package-lock.json",
  "https://github.com/webpack/css-loader/blob/main/package-lock.json",
  "https://github.com/shelljs/shelljs/blob/main/package-lock.json",
  "https://github.com/acornjs/acorn/blob/master/package-lock.json",
  "https://github.com/moxystudio/node-cross-spawn/blob/master/package-lock.json",
  "https://github.com/fb55/entities/blob/main/package-lock.json",
  "https://github.com/paulmillr/chokidar/blob/main/package-lock.json",
  "https://github.com/typeorm/typeorm/blob/master/package-lock.json",
  // From isaacs
  "https://github.com/isaacs/node-mkdirp/blob/main/package-lock.json",
  "https://github.com/isaacs/node-glob/blob/main/package-lock.json",
  "https://github.com/isaacs/rimraf/blob/main/package-lock.json",
  "https://github.com/isaacs/minimatch/blob/main/package-lock.json",
  "https://github.com/isaacs/node-lru-cache/blob/main/package-lock.json",
  "https://github.com/isaacs/minipass/blob/main/package-lock.json",
  // From jsdom
  "https://github.com/jsdom/webidl-conversions/blob/main/package-lock.json",
  "https://github.com/jsdom/whatwg-url/blob/main/package-lock.json",
  "https://github.com/jsdom/tr46/blob/main/package-lock.json",
  // From NPM
  "https://github.com/npm/cli/blob/latest/package-lock.json",
  // From NestJS
  "https://github.com/nestjs/nest/blob/master/package-lock.json",
  "https://github.com/nestjs/nestjs.com/blob/master/package-lock.json",
  // From Facebook
  "https://github.com/facebook/stylex/blob/main/package-lock.json",
  // From Angular
  "https://github.com/angular/angularfire/blob/main/package-lock.json",
  // From Svelte
  "https://github.com/sveltejs/prettier-plugin-svelte/blob/master/package-lock.json",
  // From Tailwind Labs
  "https://github.com/tailwindlabs/headlessui/blob/main/package-lock.json",
  "https://github.com/tailwindlabs/prettier-plugin-tailwindcss/blob/main/package-lock.json",
  "https://github.com/tailwindlabs/tailwindcss-forms/blob/main/package-lock.json",
  // From Microsoft
  "https://github.com/microsoft/vscode/blob/main/package-lock.json",
];

const npmLockfileUrls = [
  ...npmV1LockfileUrls,
  ...npmV2LockfileUrls,
  ...npmV3LockfileUrls,
];

export {
  npmLockfileUrls,
  npmV1LockfileUrls,
  npmV2LockfileUrls,
  npmV3LockfileUrls,
};
