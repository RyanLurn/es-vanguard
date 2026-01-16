import { betterFetch, ValidationError } from "@better-fetch/fetch";
import * as z from "zod";

try {
  const { data: todos, error: todoError } = await betterFetch(
    "https://jsonplaceholder.typicode.com/todos/1",
    {
      output: z.string(),
    }
  );

  console.log(todos);
  console.log(todoError);
} catch (error) {
  console.log("Caught error:");
  if (error instanceof z.ZodError) {
    console.log("ZodError's issues:", error.issues);
  } else if (error instanceof ValidationError) {
    console.log("Validation error:");
    console.log("Name:", error.name);
    console.log("Message:", error.message);
    console.log("Issues:", error.issues);
    console.log("Stack:", error.stack);
    console.log("Cause:", error.cause);
  } else {
    console.log("Unknown error:", error);
  }
}
