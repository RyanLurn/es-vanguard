# ES Vanguard

Automated supply chain security for the JavaScript ecosystem.

## Overview

ES Vanguard is a security tool designed to audit third-party dependency updates. It automatically inspects package updates proposed by tools like Renovate or Dependabot, generates a code diff between versions, and uses an AI model to analyze the changes for malicious code, backdoors, or suspicious behavior.

It addresses the "blind merge" problem where developers approve dependency updates without inspecting the underlying code changes.

## How It Works

Here's what a simplified I/O flow looks like:

1.  **Detection**: The CLI parses the lockfile (npm, pnpm, yarn, or bun) to identify changed packages.
2.  **Isolation**: It creates a secure temporary directory outside the project path.
3.  **Diff Generation**:
    - Installs the previous version of the package.
    - Installs the new version of the package.
    - Generates a clean git diff of the `node_modules` directory, ignoring lockfiles and metadata noise.
4.  **Analysis**: The diff is sent to an LLM (Large Language Model) with a specialized system prompt to detect security threats.
5.  **Reporting**: A verdict and explanation are output to the console or posted as a comment on the Pull Request.

## Repository Structure

This is a monorepo containing the core CLI tool and reference architectures for the SaaS platform.

- **apps/cli**: The core open-source tool. This is a standalone CLI designed to run in CI environments (GitHub Actions) or locally.
- **apps/api**: Reference implementation for a centralized orchestration server (Cloud Run).
- **apps/watcher**: Reference implementation for an NPM registry monitoring service.
- **apps/sandbox**: The execution logic for the analysis engine.

## License

MIT
