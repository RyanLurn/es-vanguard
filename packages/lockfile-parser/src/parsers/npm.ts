import semver from "semver";

function parseNpmLockfile(content: Record<string, any>) {
  const dependencies: { name: string; version: string }[] = [];
  const seen = new Set<string>(); // <--- Cache to prevent duplicates

  // Helper to add safely
  const add = (name: string, version: string) => {
    // 1. DEDUPLICATION
    const key = `${name}@${version}`;
    if (seen.has(key)) {
      return;
    }

    // 2. VALIDATION (New)
    // Ensure it looks like a version number (1.0.0, 1.0.0-beta)
    // and NOT a URL, git hash, or file path.
    // semver.valid() returns the version string if valid, or null if not.
    if (!semver.valid(version)) {
      return;
    }

    seen.add(key);
    dependencies.push({ name, version });
  };

  // Strategy 1: Modern Lockfiles (v2/v3) use "packages"
  // This is a flat map of everything in node_modules
  if (content.packages && typeof content.packages === "object") {
    for (const [path, meta] of Object.entries(content.packages)) {
      if (path === "") {
        continue;
      } // Skip the root package definition

      // Ignore local workspaces / internal packages.
      // If it's not in node_modules, it's part of the repo source code.
      if (!path.includes("node_modules/")) {
        continue;
      }

      // Extract data
      // Use explicit name if available (common in workspaces), otherwise derive from path
      const metaObj = meta as Record<string, any>;
      const version = metaObj.version;

      let name = metaObj.name;
      if (!name) {
        // Path looks like: "node_modules/react" or "node_modules/@types/node"
        // We want the last part after the last "node_modules/"
        const segments = path.split("node_modules/");
        name = segments[segments.length - 1];
      }

      // Filter out invalid entries (symlinks sometimes lack versions)
      if (name && version) {
        add(name, version); // Use helper instead of push
      }
    }
    return dependencies;
  }

  // Strategy 2: Legacy Lockfiles (v1) use "dependencies"
  // This is a nested tree, but the top level has the direct deps
  if (content.dependencies && typeof content.dependencies === "object") {
    for (const [name, meta] of Object.entries(content.dependencies)) {
      const metaObj = meta as Record<string, any>;
      const version = metaObj.version;

      if (version) {
        add(name, version);
      }
    }
    return dependencies;
  }

  return dependencies;
}

export { parseNpmLockfile };
