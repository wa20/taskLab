import { describe, it, expect } from "vitest"
import { taskFixtures } from "../src/data/task-fixtures"
import { getTasksByStatus } from "../src/domain/task-operations"


describe('getTasksByStatus', () => { 

    it('returns tasks 101 and 104 in that order', () =>{
        const result = getTasksByStatus(taskFixtures, "todo").map(taskItem => taskItem.id)

        expect(result).toEqual(['task-101', 'task-104'])  
    })

    it('it returns an empty []',() => {
        const result = getTasksByStatus([], 'todo')

        expect(result).toEqual([])
    } )

    it('returns an empty array when no tasks match', () => {
        const findTask = taskFixtures.filter( task => task.id === 'task-103')

    
        expect(getTasksByStatus(findTask, 'todo')).toEqual([])
    })


    it('does not change the input tasks', () => {
        const newArray = structuredClone(taskFixtures)

        const arrayTwo = structuredClone(newArray)

        getTasksByStatus(arrayTwo, 'todo')

        expect(arrayTwo).toEqual(newArray)
    })
    

})