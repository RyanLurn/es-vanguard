export interface Rule {
  category: "network" | "fs" | "exec" | "eval" | "env";
  patterns: RegExp[];
}
