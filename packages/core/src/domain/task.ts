export type ITaskStatus = 'todo' | 'in-progress' | 'done'

export type ITaskPriority = 1 | 2 | 3

export type ITask = {
    id: string,
    title: string,
    status: ITaskStatus
    priority: ITaskPriority
    createdAt: string
}

export type ITaskSummary = {
    total: number
    todo: number
    inProgress: number
    done: number
    completionPercent: number
}