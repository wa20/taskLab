import type { Task, TaskStatus } from "./task";

export const getTasksByStatus = (tasks: readonly Task [], status: TaskStatus): Task[] => {
  return  tasks.filter((task) => task.status === status )
}

export const sortTasks = (tasks: readonly Task[]): Task[] => {

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

export type ITasksByStatus = Record<TaskStatus, Task[]>;

export const groupTasksByStatus = (tasks: readonly Task[]): ITasksByStatus => {

    const groups: ITasksByStatus = {todo: [], 'in-progress': [], done: []}

    for(const task of tasks) {

       groups[task.status].push(task)
    }

    return groups
}

export const getUnfinishedTasks = (tasks: readonly Task[]): Task[] => {
    
    const unFinishedTodo = getTasksByStatus(tasks, 'todo') 

    const unFinishedInProgress = getTasksByStatus(tasks, 'in-progress') 

    const unFinishedTasks = [...unFinishedTodo, ...unFinishedInProgress]

    return sortTasks(unFinishedTasks)
}

export const countTasksByStatus = (tasks: readonly Task[], status: TaskStatus): number => {
    
    const taskStatusCount = getTasksByStatus(tasks, status).length

    return taskStatusCount
}

export const addTask = (tasks: readonly Task[], taskToAdd: Task): Task[] => {

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

export type ITaskChanges = Partial<Pick<Task, 'title' | 'status' | 'priority'>>

export const updateTask = (tasks: readonly Task[], id: string, changes: ITaskChanges): Task[] => {

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