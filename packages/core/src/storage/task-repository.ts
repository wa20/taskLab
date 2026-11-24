import type { ITask } from "../domain/task.js";

export type ITaskRepository = {
    loadTasks: () => Promise<ITask[]>,
    saveTasks(tasks: readonly ITask[]): Promise<void>
}

export const createInMemoryTaskRepository = (): ITaskRepository => {

    let storedTasks: ITask[] = []



    return {  
        async loadTasks(){
            return structuredClone(storedTasks)
        }, 
        async saveTasks(tasks: readonly ITask[]){
            
           storedTasks = structuredClone([...tasks])
        } 
    }

}