# @es-vanguard/test-utilities 🛠️

Internal shared utilities for testing parsers and tools within the **ES Vanguard** monorepo.

This package provides a robust way to fetch, cache, and manage real-world test fixtures (like massive lockfiles) without bloating the git repository size.

## Features

- **Remote Fixtures:** Fetches files directly from GitHub (e.g., `npm/cli`'s `package-lock.json`) instead of checking them into git.
- **Smart Caching:** Caches downloaded files to a local `.cache` directory to ensure tests run instantly after the first fetch and work offline.
- **Resilience:** Includes exponential backoff and retries for network flakiness.
- **Type Safety:** Uses `neverthrow` patterns for robust error handling.

## Installation

This is an internal workspace package. Add it to another package in the monorepo via:

```bash
bun add @es-vanguard/test-utilities --filter @your-package/name
```

## Usage

### 1. Fetching Remote Content (with Cache)

Use `getGithubContent` to safely fetch files. It handles converting GitHub Blob URLs to Raw URLs automatically.

```typescript
import { getGithubContent } from "@es-vanguard/test-utilities/get-github-content";

const result = await getGithubContent({
  // You can copy-paste the URL from your browser address bar
  githubBlobUrl: "https://github.com/npm/cli/blob/latest/package-lock.json",
  enableLogging: true, // Optional: logs cache hits/misses
});

if (result.isErr()) {
  console.error("Fetch failed:", result.error);
} else {
  const content = result.value; // string
  console.log("File loaded!", content.length, "bytes");
}
```

### 2. Using Curated Lockfile Lists

We maintain lists of real-world lockfiles for various package managers to use in parameterized tests.

```typescript
import {
  npmLockfileUrls,
  pnpmLockfileUrls,
  yarnLockfileUrls,
} from "@es-vanguard/test-utilities/constants";

describe("Parser Compliance", () => {
  // Great for usage with test.each()
  test.each(npmLockfileUrls)("Parses %s correctly", async (url) => {
    const content = await getGithubContent({ githubBlobUrl: url });
    // ... assertions ...
  });
});
```

## Caching Behavior

Downloaded files are stored in:
`packages/test-utilities/.cache/<md5-hash>.txt`

- **Persistence:** The cache persists between test runs.
- **Clearing Cache:** To force a re-download, simply delete the `.cache` directory or pass `forceRefresh: true` to the function.
- **Git:** The `.cache` directory is ignored by git.

## API Reference

### `getGithubContent(options)`

| Option          | Type      | Default      | Description                                     |
| :-------------- | :-------- | :----------- | :---------------------------------------------- |
| `githubBlobUrl` | `string`  | **Required** | The full web URL to the file on GitHub.         |
| `enableLogging` | `boolean` | `false`      | Log cache status and fetch attempts to console. |
| `forceRefresh`  | `boolean` | `false`      | Ignore cache and force a network request.       |

**Returns:** `Promise<Result<string, Error>>`
