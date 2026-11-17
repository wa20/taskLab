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