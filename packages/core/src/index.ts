export type {
    ITask,
    ITaskStatus,
    ITaskPriority,
    ITaskSummary
} from './domain/task.js';

export {
    getTasksByStatus,
    sortTasks,
    groupTasksByStatus,
    getUnfinishedTasks,
    countTasksByStatus,
    addTask,
    updateTask,
    deleteTask,
    searchTasks,
    getTaskSummary
} from './domain/task-operations.js';

export type {ITaskChanges, ITasksByStatus} from './domain/task-operations.js'
export { parseTask } from './domain/parse-task.js'

export type { ITaskRepository } from './storage/task-repository.js'
export { createInMemoryTaskRepository } from './storage/task-repository.js'