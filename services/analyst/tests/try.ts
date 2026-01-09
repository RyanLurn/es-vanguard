import {
  ExoticError,
  UnexpectedError,
} from "@es-vanguard/utils/errors/classes";

const unexpectedError = new UnexpectedError("Something went wrong");
console.log(unexpectedError.name);

const exoticError = new ExoticError("Something went wrong", {
  cause: "Something went wrong",
});
console.log(exoticError.name);
console.log(exoticError instanceof UnexpectedError);
