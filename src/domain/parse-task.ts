import type { ITask } from "./task";

export const parseTask = (value: unknown): ITask => {

    if(typeof value !== 'object' || value === null || Array.isArray(value)){

        throw new Error('Task must be an object')
    }

    if(!('id' in value) || typeof value.id !== 'string' ||  value.id.trim().length === 0){

        throw new Error('Task ID must be a nonempty string')
    }


     if(!('title' in value) || typeof value.title !== 'string'){

        throw new Error('Task title must be a string')
    }

    const title = value.title.trim()

    if(title.length === 0){
        throw new Error('Title must not be blank')
    }

    if(title.length > 120) {
        throw new Error('Title must not exceed 120 characters')
    }


    if(!('status' in value) || typeof value.status !== 'string'){
         throw new Error('Task status must be a string')
    }

    const status = value.status

    if (
        status !== 'todo' &&
        status !== 'in-progress' &&
        status !== 'done'
    ) {
        throw new Error('Task status must be todo, in-progress, or done')
    }

    if(!('priority' in value) || typeof value.priority !== 'number'){
         throw new Error('Task priority must be a number')
    }

    const priority = value.priority

     if (
        priority !== 1 &&
        priority !== 2 &&
        priority !== 3
    ) {
        throw new Error('Task priority must be 1, 2, or 3')
    }

    if (!('createdAt' in value) || typeof value.createdAt !== 'string'){
        throw new Error('Task createdAt must be a string')
    }

    const createdAt = value.createdAt

    const parsedDate = new Date(createdAt)

    if(Number.isNaN(parsedDate.getTime())){
        throw new Error('Task createdAt must be a valid UTC timestamp')
    }

    if(parsedDate.toISOString() !== createdAt){

        throw new Error('Task createdAt must use the full UTC ISO format')
    }


    return {
        id: value.id, 
        title: title, 
        status: status, 
        priority: priority, 
        createdAt: createdAt
    }

}