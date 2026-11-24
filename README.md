# TaskLab

TaskLab is a single-user task-board teaching project with the goal of strengthening TypeScript fundamentals, testing, and reasoning about code.

The current implementation is a TypeScript domain engine with task operations, runtime validation, automated tests, and an in-memory repository. There isn't a web interface yet.

Later sessions will add a React interface, an HTTP API, and database persistence.

## Setup and checks

Use Node.js 24 LTS or a compatible supported LTS release, with npm. The project has been checked with Node.js 26.13.1 and npm 11.20.0.

Run these commands from the repository root:

| Command | Purpose |
|---|---|
| `npm ci` | Install the dependencies recorded in the lockfile |
| `npm run test:core` | Run all tests once |
| `npm run typecheck:core` | Check TypeScript without generating files |
| `npm test` | Run core tests once |
| `npm run test -w @tasklab/core` | Run tests in watch mode during development |

For a new checkout, run `npm ci` first, then run the tests and typecheck. Use `npm run test -w @tasklab/core` while working; press Ctrl+C to stop watch mode.

## Building core

From the repository root, run:

```bash
npm run build:core
```

This compiles the core package into `packages/core/dist/`. The generated `.js` files contain executable JavaScript, while the `.d.ts` files describe the public types for TypeScript consumers.

Build core before another package imports `@tasklab/core`. After changing core source, run the build again so consumers use the updated output.

The `dist/` directory is Git-ignored because its contents are generated from the committed source and build configuration. Make changes in `packages/core/src/`, rather than editing generated files.

## Current behaviour

Each task has an ID, title, status, priority, and creation timestamp. Status is `todo`, `in-progress`, or `done`. Priority is `1` for High, `2` for Medium, and `3` for Low.

The domain functions can:

- Add, update, and delete tasks without mutating the supplied data.
- Filter and group tasks by status, keeping their original order within each group.
- Sort by priority, then earliest creation timestamp, then string ID to break ties.
- Search title substrings, ignoring case and surrounding query whitespace.
- Select sorted unfinished tasks and calculate status counts and completion percentage.
- Validate an untrusted task object at runtime with `parseTask`.

Titles are stored trimmed and must contain 1–120 characters. Duplicate IDs are rejected when adding a task. Updating a missing ID throws; deleting a missing ID leaves the task values unchanged. Repeating a deletion is safe.

## Example use cases

These examples illustrate calls inside TypeScript code; they are not standalone terminal commands. See `packages/core/tests/task-operations.test.ts` for executable examples using the five training fixtures.

```ts
getTasksByStatus(taskFixtures, 'todo');
// Tasks task-101 and task-104.

searchTasks(taskFixtures, '  TEST  ');
// Task task-102: "Write unit tests".

getUnfinishedTasks(taskFixtures);
// Tasks task-102, task-101, task-105, task-104, in that order.

getTaskSummary(taskFixtures);
// { total: 5, todo: 2, inProgress: 2, done: 1, completionPercent: 20 }
```

The repository provides asynchronous save and load methods:

```ts
const repository = createInMemoryTaskRepository();
await repository.saveTasks(taskFixtures);
const loadedTasks = await repository.loadTasks();
```

The factory is exported from `packages/core/src/storage/task-repository.ts`. Each call creates an independent store. See `packages/core/tests/repository.test.ts` for complete examples with imports and assertions.

## Structure and design choices

- `packages/core/src/domain/task.ts` defines the task and summary types.
- `packages/core/src/domain/task-operations.ts` contains the task operations.
- `packages/core/src/domain/validate-task-title.ts` centralises title trimming and content validation so adding, updating, and parsing follow the same rules.
- `packages/core/src/domain/parse-task.ts` checks external values before returning a task. Type assertions alone do not validate data at runtime.
- `packages/core/src/storage/task-repository.ts` keeps storage behind a small promise-based contract.
- `packages/core/src/data/task-fixtures.ts` supplies deterministic training data, and `packages/core/tests/` checks the behaviour.

The domain functions receive data and return results without importing React or using browser state. A future React interface can call them with its current tasks and use the returned values. Summary counts are calculated from tasks rather than stored separately, avoiding totals that drift out of sync.

Domain operations preserve their inputs, but unchanged task objects may be shared between input and output arrays. This avoids copying objects that the operation does not edit. It does not freeze those objects or prevent callers from mutating them later.

The repository uses `structuredClone` on both save and load to prevent callers from changing its private data through shared references. That isolation costs additional copying and memory. Its methods return promises, but the current cloning work runs on the calling thread; `async` does not move it to a background thread.

## Current limitations

- There is no React interface, HTTP server, or database yet.
- Repository data exists only in memory. It is not persisted across process restarts, and a new repository instance starts empty.
- The application is single-user. Accounts, shared editing, due dates, descriptions, and drag-and-drop are outside the core scope.
- Task timestamps use the full UTC ISO representation, such as `2026-11-01T09:00:00.000Z`. Sorting relies on their consistent format.
- `getTasksCreatedBefore` is a local exercise in `packages/core/tests/task-operations.test.ts`, not an exported application feature.

Later delivery sessions will keep a public browser-local demo separate from private API mode. A public unauthenticated shared write API is outside the project's scope.
