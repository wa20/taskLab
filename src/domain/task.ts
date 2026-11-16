export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 1 | 2 | 3

export type Task = {
    id: string,
    title: string,
    status: TaskStatus
    priority: TaskPriority
    createdAt: string
}
