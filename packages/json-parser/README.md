# @es-vanguard/json-parser 🛡️

A type-safe, fault-tolerant JSON parser wrapper for the ES Vanguard ecosystem.

This library replaces the unsafe `JSON.parse()` with a robust function that:

1.  **Never Throws:** Returns a `Result` type (Ok/Err) for functional error handling.
2.  **Validates:** Enforces structure using any [Standard Schema](https://standardschema.dev) compliant library (Zod, Valibot, ArkType).
3.  **Types:** Infers TypeScript types automatically from your schema.

## Installation

```bash
bun add @es-vanguard/json-parser
```

## Why use this?

Standard `JSON.parse` is dangerous:

- It throws errors on malformed JSON (crashing your app if unhandled).
- It returns `any`, leading to runtime errors later when data structure doesn't match expectations.

`safeJsonParse` solves both problems in one atomic operation.

## Usage

### Basic Usage (with Zod)

```typescript
import { safeJsonParse } from "@es-vanguard/json-parser";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const jsonString = '{"id": 1, "name": "Alice"}';

const result = await safeJsonParse({
  text: jsonString,
  schema: UserSchema,
});

if (result.isErr()) {
  // Handle parsing syntax errors OR validation errors
  console.error("Failed:", result.error);
} else {
  // Fully typed as { id: number, name: string }
  const user = result.value;
  console.log("Hello", user.name);
}
```

### With Other Libraries (Valibot, ArkType)

Because this library implements **Standard Schema**, it works with any modern validation library.

```typescript
import * as v from "valibot";

const ConfigSchema = v.object({
  debug: v.boolean(),
});

const result = await safeJsonParse({
  text: '{"debug": true}',
  schema: ConfigSchema,
});
```

## API Reference

### `safeJsonParse(options)`

Asynchronously parses a string and validates it against a schema.

#### Arguments

| Property        | Type               | Description                                                     |
| :-------------- | :----------------- | :-------------------------------------------------------------- |
| `text`          | `string`           | The raw JSON string to parse.                                   |
| `schema`        | `StandardSchemaV1` | A Zod, Valibot, or ArkType schema.                              |
| `enableLogging` | `boolean`          | (Optional) Log validation issues to `stderr`. Default: `false`. |

#### Returns

`Promise<Result<Output, SyntaxError | SchemaError | Error>>`

- **Success (`Ok`):** Contains the parsed and validated data (inferred from schema).
- **Failure (`Err`):** Contains one of:
  - `SyntaxError`: The string was not valid JSON.
  - `SchemaError`: The JSON was valid, but did not match the schema.
  - `Error`: Unknown runtime error.
