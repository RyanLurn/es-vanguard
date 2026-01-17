export type SerializedFallback = {
  message: string;
  thrownValue?: unknown;
  kind?: string;
  [key: string]: unknown;
};

/**
 * Converts a non-Error "unknown" thrown value into a JSON-friendly object
 * for structured logging.
 */
export function serializeUnknown(value: unknown): SerializedFallback {
  // 1. Handle Null/Undefined
  if (value === null) {
    return { message: "Throw triggered with value: null", kind: "null" };
  }
  if (value === undefined) {
    return {
      message: "Throw triggered with value: undefined",
      kind: "undefined",
    };
  }

  // 2. Handle Primitives (String, Number, Boolean, Symbol, BigInt)
  if (typeof value !== "object") {
    return {
      message: String(value),
      thrownValue: value, // Keep the raw value in a separate field
      kind: typeof value,
    };
  }

  // 3. Handle Objects (that are not standard Errors)
  // We treat these as "structured data" that was thrown.
  try {
    // We attempt to shallow-copy the object to ensure it behaves like a POJO.
    // If it's a library object, this usually captures the relevant data.
    const rawObject = value as Record<string, unknown>;

    // We look for a 'message' property to hoist up, otherwise create a generic one.
    const message =
      typeof rawObject.message === "string"
        ? rawObject.message
        : `Non-Error object thrown: ${getConstructorName(value)}`;

    return {
      ...rawObject, // Spread properties so they are searchable in logs (e.g., { code: 500 })
      message, // Ensure a message exists for the logger
      kind: "object",
    };
  } catch (e) {
    // 4. Safety Fallback (Circular references or getters that throw)
    // If accessing the object fails, we fallback to the safest string representation.
    return {
      message: "Thrown value could not be serialized",
      kind: "unserializable",
      stringRep: String(value),
    };
  }
}

// Helper to get a clean class name if available
function getConstructorName(val: object): string {
  try {
    return val.constructor?.name || "Object";
  } catch {
    return "Object";
  }
}
