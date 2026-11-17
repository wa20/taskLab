import { describe, it, expect } from "vitest"
import { taskFixtures } from "../src/data/task-fixtures"
import { getTasksByStatus } from "../src/domain/task-operations"
import { sortTasks } from "../src/domain/task-operations"


describe('getTasksByStatus', () => { 

    it('returns tasks 101 and 104 in that order', () => {
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


describe('sortTasks', () => {

    it('sorts the fixtures by priority then creation date', () => {
        const result = sortTasks(taskFixtures).map(taskItem => taskItem.id)

         expect(result).toEqual(['task-102', 'task-103', 'task-101', 'task-105', 'task-104'])
    })

    it('it returns an empty []',() => {
        const result = sortTasks([])

        expect(result).toEqual([])
    } )

    it('does not change the input tasks', () => {

        const newArray = structuredClone(taskFixtures)

        const arrayTwo = structuredClone(newArray)

        sortTasks(arrayTwo)

        expect(arrayTwo).toEqual(newArray)

    })

     it('sorts equal-priority tasks by earliest creation date',() => {
        const priority = taskFixtures.filter( task => task.priority === 1)


        const reversedResult = priority.reverse()

        const sortedId =  sortTasks(reversedResult).map(taskItem => taskItem.id)

        expect(sortedId).toEqual(['task-102', 'task-103'])
    } )

    it('sorts by ID when priority and creation date match', () => {
        const clonedArray = structuredClone(taskFixtures)

        const filteredClone = clonedArray.filter(task => task.priority === 1)

        const selectedTasks = filteredClone.map(tasks => {

             return {...tasks, createdAt: "2026-11-02T09:00:00.000Z"}
        })

        const reversedResult = selectedTasks.reverse()

        const sortedId =  sortTasks(reversedResult).map(taskItem => taskItem.id)


        expect(sortedId).toEqual(['task-102', 'task-103'])
    })

    it('returns the task when the input contains one task', () => {

        const selectSingleTask = taskFixtures.filter(tasks => tasks.id === 'task-101')

        const sortedTask = sortTasks(selectSingleTask)

        expect(sortedTask).toEqual(selectSingleTask)
    })

    it('preserves the order of already-sorted tasks', () => {
        const priority = taskFixtures.filter(tasks => tasks.priority === 1)

        const sortedPriority = sortTasks(priority).map(tasks => tasks.id)

        expect(sortedPriority).toEqual(['task-102', 'task-103'])
    })

})