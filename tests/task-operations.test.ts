import { describe, it, expect } from "vitest"
import { taskFixtures } from "../src/data/task-fixtures"
import { getTasksByStatus, groupTasksByStatus, sortTasks, getUnfinishedTasks } from "../src/domain/task-operations"


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
        const beforeSnapshot = structuredClone(taskFixtures)

        const input = structuredClone(beforeSnapshot)

        getTasksByStatus(input, 'todo')

        expect(input).toEqual(beforeSnapshot)
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

        const beforeSnapshot = structuredClone(taskFixtures)

        const input = structuredClone(beforeSnapshot)

        sortTasks(input)

        expect(input).toEqual(beforeSnapshot)

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

describe('groupTasksByStatus', () =>{

    it('returns all three empty groups for empty input', () =>{
        
        expect(groupTasksByStatus([])).toEqual({todo: [], 'in-progress': [], done: []})

    })

    it('groups each task by status while preserving order', () => {

       const grouped =  groupTasksByStatus(taskFixtures)

       const doneTaskId = grouped.done.map(task => task.id)
       const inProgressTaskId = grouped["in-progress"].map(task => task.id)
       const todoTaskId = grouped.todo.map(task => task.id)

       expect(doneTaskId).toEqual(['task-103'])
       expect(inProgressTaskId).toEqual(['task-102', 'task-105'])
       expect(todoTaskId).toEqual(['task-101', 'task-104'])
    })

    it('keeps an empty group when no tasks have that status', () => {

        const excludeDone = taskFixtures.filter(task => task.status !== 'done')

        const result = groupTasksByStatus(excludeDone)

        expect(result.done).toEqual([])
        expect(result["in-progress"]).toHaveLength(2)
        expect(result.todo).toHaveLength(2)
    })

    it('does not change the input tasks', () => {

        const input = structuredClone(taskFixtures)

        const beforeSnapshot = structuredClone(input)

        groupTasksByStatus(input)

        expect(input).toEqual(beforeSnapshot)
    })
})

describe('getUnfinishedTasks', () => {

    it('returns unfinished tasks in priority and creation-date order', () => {
        
        const result = getUnfinishedTasks(taskFixtures)

        const resultId = result.map(task => task.id)

        expect(resultId).toEqual(['task-102', 'task-101', 'task-105', 'task-104'])
    })
})

