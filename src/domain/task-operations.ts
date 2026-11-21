import type { ITask, ITaskStatus, ITaskSummary } from "./task";

export const getTasksByStatus = (tasks: readonly ITask[], status: ITaskStatus): ITask[] => {
  return  tasks.filter((task) => task.status === status )
}

export const sortTasks = (tasks: readonly ITask[]): ITask[] => {

    const copy = [...tasks]

    copy.sort((a, b) => {

        const priorityDifference = a.priority - b.priority 

        if(priorityDifference !== 0){

            return priorityDifference

        } else if (a.createdAt < b.createdAt) {

            return -1 

        } else if(a.createdAt > b.createdAt){

            return 1

        } else if(a.id < b.id) {

            return -1
        } else if(a.id > b.id){

            return 1
        }

        return 0
    })

    return copy
}

export type ITasksByStatus = Record<ITaskStatus, ITask[]>;

export const groupTasksByStatus = (tasks: readonly ITask[]): ITasksByStatus => {

    const groups: ITasksByStatus = {todo: [], 'in-progress': [], done: []}

    for(const task of tasks) {

       groups[task.status].push(task)
    }

    return groups
}

export const getUnfinishedTasks = (tasks: readonly ITask[]): ITask[] => {
    
    const unFinishedTodo = getTasksByStatus(tasks, 'todo') 

    const unFinishedInProgress = getTasksByStatus(tasks, 'in-progress') 

    const unFinishedTasks = [...unFinishedTodo, ...unFinishedInProgress]

    return sortTasks(unFinishedTasks)
}

export const countTasksByStatus = (tasks: readonly ITask[], status: ITaskStatus): number => {
    
    const ITaskStatusCount = getTasksByStatus(tasks, status).length

    return ITaskStatusCount
}

export const addTask = (tasks: readonly ITask[], taskToAdd: ITask): ITask[] => {

    const hasDuplicated = tasks.some(task => task.id === taskToAdd.id)

    if(hasDuplicated){

        throw new Error('Duplicate task ID')
    }

    const checkTitle = taskToAdd.title.trim()

    if(checkTitle.length === 0){

        throw new Error('Title must not be blank')
    }

    if(checkTitle.length > 120){
        throw new Error('Title must not exceed 120 characters')
    }


      return [...tasks, { ...taskToAdd, title: checkTitle }]
    
}

export type ITaskChanges = Partial<Pick<ITask, 'title' | 'status' | 'priority'>>

export const updateTask = (tasks: readonly ITask[], id: string, changes: ITaskChanges): ITask[] => {

    const taskExists = tasks.some(task => task.id === id)

    if(!taskExists){
            throw new Error('Task not found')
        }

    const update = tasks.map(task => {

        if(task.id === id){

            const updatedTask = {...task, ...changes}

            if(changes.title !== undefined){

                updatedTask.title = changes.title.trim()

                if(updatedTask.title.length === 0){
                    throw new Error('Title must not be blank')
                }

                if(updatedTask.title.length > 120){
                    throw new Error('Title must not exceed 120 characters')
                 }
            }

            return updatedTask
        }

        return task

    })

    return update
}


export const deleteTask = (tasks: readonly ITask[], id: string): ITask[] => {

    const filteredTasks = tasks.filter(task => task.id !== id)

    return filteredTasks
}


export const searchTasks = (tasks: readonly ITask[], query: string): ITask[] => {

    const normalizedQuery = query.trim().toLowerCase()
    
    if(normalizedQuery.length === 0){

        return [...tasks]
    }

    const filtered = tasks.filter(task => {

        return task.title.toLowerCase().includes(normalizedQuery)
    })

    return filtered
}


export const getTaskSummary = (tasks: readonly ITask[]): ITaskSummary => {

    const total = tasks.length

    const groups = groupTasksByStatus(tasks)

    const todo = groups.todo.length
    const done = groups.done.length
    const inProgress = groups["in-progress"].length

    const completionPercent = total === 0 ? 0 : ( done / total) * 100


    return { total, todo, done, inProgress, completionPercent }
}