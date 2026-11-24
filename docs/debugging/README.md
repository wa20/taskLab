# TaskLab debugging commands

Run these commands from the repository root unless stated otherwise. This guide explains how to gather evidence before changing dependencies or code.

## Start with the failure

Run the command that failed and read its error before changing anything:

```bash
npm run lint -w @tasklab/web
```

This runs the web package's `lint` script. `-w @tasklab/web` selects the workspace by its package name. A lint rule violation points to code to inspect; a stack trace crashing inside a dependency may indicate a tooling problem. Neither conclusion should be assumed without reading the error.

For the lint crash we investigated, the stack trace named `ts-api-utils` and referred to `Intrinsic`. That gave us a concrete dependency and API to investigate.

## Check tool versions

```bash
node --version
npm --version
```

These print the Node.js and npm versions used by this terminal. They help identify differences between machines or terminals.

## Inspect installed dependencies

```bash
npm ls typescript --all
```

Shows installed TypeScript versions throughout the dependency tree. `--all` includes nested dependencies, rather than just the direct packages.

```bash
npm ls typescript ts-api-utils typescript-eslint --all
```

Focuses the tree on the packages involved in our lint investigation. Use it to see which versions exist and how they relate.

Read the output as follows:

- Indentation shows dependency relationships.
- A version beside a package is the installed version.
- `deduped` means npm is reusing an installed copy instead of installing another copy at that position.
- Multiple TypeScript versions are not automatically a bug. The important question is which version the failing tool actually loads and whether it supports that version.
- `invalid`, `missing`, or a nonzero exit status means npm found a dependency-tree problem; read the accompanying explanation.

`package.json` contains requested version ranges. For example, `~6.0.3` permits compatible patch updates below `6.1.0`; it does not prove which version is installed. `package-lock.json` records resolved dependencies, and `npm ls` inspects the installed tree. These can differ if dependencies have not been refreshed after editing a manifest.

## Check workspace links

```bash
npm ls @tasklab/core @tasklab/web --depth=1
```

Shows the local workspace packages and one level of their dependencies. Look for links to `./packages/core` and `./apps/web`, including web's dependency on core. A local link means the workspace is being used rather than a separate downloaded copy.

## Check what Node actually loads

The following commands are diagnostic JavaScript, executed directly by Node. `node -e` evaluates the supplied code without creating a file. The single quotes keep the shell from interpreting the JavaScript text.

```bash
node -e 'const ts = require("typescript"); console.log({version: ts.version, hasObjectFlags: !!ts.ObjectFlags});'
```

Loads TypeScript as resolved from the repository root, then prints its version and whether it exposes `ObjectFlags`. `!!` converts the property value into a boolean.

This checks the root resolution only; it does not by itself prove which TypeScript every dependency loads.

```bash
node -e 'console.log(require.resolve("typescript", {paths: [require.resolve("ts-api-utils")]}));'
```

First finds `ts-api-utils`, then asks Node where it would resolve TypeScript from that location. The printed path identifies the actual installed copy that this dependency resolves. This command uses Node's CommonJS resolution, matching the failing dependency in our investigation.

```bash
node -e 'const tsPath = require.resolve("typescript", {paths: [require.resolve("ts-api-utils")]}); const ts = require(tsPath); console.log({path: tsPath, version: ts.version, hasObjectFlags: !!ts.ObjectFlags});'
```

Combines the resolution check and API inspection: it loads that specific TypeScript copy and prints its path, version, and whether `ObjectFlags` exists.

In our original failure, `ts-api-utils` resolved root TypeScript 7.0.2, which did not expose the expected `ObjectFlags` API. That supported a compatibility diagnosis. It did not prove that changing versions would fix lint; rerunning the failing command is required to verify a fix.

## Apply an intentional dependency change

These commands change installed dependencies. Use them deliberately, rather than as the first response to an error.

```bash
npm install
```

Installs dependencies using the current manifests, updates workspace links, and may update `package-lock.json`. Run this after an intentional manifest change, then inspect the resulting diff.

```bash
npm ci
```

Installs the dependency tree recorded in the lockfile. It requires manifests and lockfile to agree, replaces the existing `node_modules` installation, and does not update the lockfile. Use it for a fresh checkout or reproducible installation, not to update the lockfile after changing a manifest.

Do not delete the lockfile or upgrade unrelated packages merely because a tool failed. First identify the mismatch and choose the smallest relevant correction.

## Verify the result

After a dependency change, rerun the original failing command, then the checks affected by that change:

| Command | What it checks |
|---|---|
| `npm run lint -w @tasklab/web` | Whether the web lint tool runs successfully and the code passes its rules |
| `npm run build:core` | Whether core compiles to JavaScript and declaration files |
| `npm run test:core` | Whether the core behaviour tests pass |
| `npm run typecheck:core` | Whether core passes TypeScript checking without emitting files |
| `npm run build -w @tasklab/web` | Whether the web TypeScript build and Vite production build succeed |

Build core before building web, because web consumes core's generated output. A passing build does not imply lint passes, and a passing typecheck does not imply behaviour tests pass.

## Review what changed

```bash
git status --short
git diff -- package.json apps/web/package.json package-lock.json
```

The first command lists changed and untracked files. The second shows unstaged dependency-related edits. If files are staged, inspect them with:

```bash
git diff --cached -- package.json apps/web/package.json package-lock.json
```

These commands inspect changes; they do not stage or commit them.

## The investigation pattern

1. Reproduce the failure and read the first useful error.
2. Identify the file or dependency named in the stack trace.
3. Inspect installed versions and actual module resolution.
4. Form a specific explanation supported by that evidence.
5. Make one relevant change.
6. Rerun the failing command and appropriate checks.
7. Review the diff before committing.

Keep a distinction between an observation, a proposed explanation, and a verified fix. For example: “two versions are installed” is an observation; “the lint dependency loads an unsupported API” is an explanation; “lint now passes after aligning versions” requires an actual successful run.
