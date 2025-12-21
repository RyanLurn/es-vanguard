# @es-vanguard/lockfile-parser 🔒

A unified, security-focused parser for Node.js package manager lockfiles.

This library ingests complex lockfiles (npm, yarn, pnpm) and normalizes them into a simple, flat list of dependencies. It is designed specifically for **Supply Chain Security** analysis.

## Features

- **Unified Output:** Regardless of the input format, returns a standard `{ name, version }` array.
- **Security Filtering:** Automatically ignores internal workspace packages (monorepo local links) to focus strictly on external third-party dependencies.
- **Deduplication:** Flattens nested `node_modules` hell (e.g., `semver` appearing 50 times) into a unique set of versions to scan.
- **Validation:** Filters out non-SemVer dependencies (git URLs, file links) to ensure analysis tools don't choke.

## Supported Formats

| Format                        | Status     | Notes                              |
| :---------------------------- | :--------- | :--------------------------------- |
| **NPM** (`package-lock.json`) | ✅ Ready   | Supports v1, v2, and v3 lockfiles. |
| **PNPM** (`pnpm-lock.yaml`)   | 🚧 Planned | Coming soon.                       |
| **Yarn** (`yarn.lock`)        | 🚧 Planned | Coming soon (Berry & Classic).     |

## Installation

```bash
bun add @es-vanguard/lockfile-parser
```

## Usage

### Parsing NPM Lockfiles

Currently, the parser expects a JavaScript object (not a raw string). You should use `@es-vanguard/json-parser` or `JSON.parse` before passing data to this library.

```typescript
import { parseNpmLockfile } from "@es-vanguard/lockfile-parser/parsers/npm";

// 1. Load your lockfile data
const lockfileData = await loadJson("package-lock.json");

// 2. Parse it
const dependencies = parseNpmLockfile(lockfileData);

console.log(dependencies);
// Output:
// [
//   { name: "react", version: "18.3.1" },
//   { name: "lodash", version: "4.17.21" },
//   ...
// ]
```

## Output Format

The parser returns an array of `ParsedDependency` objects:

```typescript
type ParsedDependency = {
  name: string; // e.g. "@types/node"
  version: string; // e.g. "20.12.0"
};
```

## How it handles edge cases

1.  **Nested Dependencies:** If `library-a` uses `semver@6.0.0` and your root uses `semver@7.0.0`, both versions will be returned in the list.
2.  **Duplicates:** If 10 different libraries use `semver@6.0.0`, it will only appear **once** in the output list.
3.  **Workspaces:** If you have a monorepo where `apps/web` depends on `packages/ui`, `packages/ui` will be **excluded** from the result (as it is internal code, not a supply chain target).
