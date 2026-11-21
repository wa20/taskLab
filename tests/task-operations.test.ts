import { describe, it, expect } from "vitest"
import { taskFixtures } from "../src/data/task-fixtures"
import { 
    getTasksByStatus, 
    groupTasksByStatus, 
    sortTasks, 
    getUnfinishedTasks, 
    addTask, 
    updateTask, 
    deleteTask 
} from "../src/domain/task-operations"
import type { Task } from "../src/domain/task"


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

        const clonedArray = structuredClone(taskFixtures)

        const newArray = structuredClone(clonedArray)

        groupTasksByStatus(clonedArray)

        expect(clonedArray).toEqual(newArray)
    })
})

describe('getUnfinishedTasks', () => {

    it('returns unfinished tasks in priority and creation-date order', () => {
        
        const result = getUnfinishedTasks(taskFixtures)

        const resultId = result.map(task => task.id)

        expect(resultId).toEqual(['task-102', 'task-101', 'task-105', 'task-104'])
    })
})


describe('addTask', () => {

    it('appends a new task to the end of the collection', () =>{

        const newTask: Task = {
            id: "task-106",
            title: "New Test Task",
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        const result = addTask(taskFixtures, newTask)

        expect(result).toEqual([...taskFixtures, newTask])


    } )

    it('rejects a task whose ID already exists', () => {

        const newTask: Task = {
            id: "task-101",
            title: "New Test Task",
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        expect(() => addTask(taskFixtures, newTask)).toThrow('Duplicate task ID');

    })

    it('rejects a title containing only whitespace', () => {

        const newTask: Task = {
            id: "task-106",
            title: "   ",
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        expect(() => addTask(taskFixtures, newTask)).toThrow('Title must not be blank')

    })

    it('trims the new title without changing the supplied task', () => {
        
        const newTask: Task = {
            id: "task-106",
            title: " Read a book ",
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        const returnedTitles = addTask(taskFixtures, newTask).map(task => task.title)

        expect(returnedTitles[returnedTitles.length - 1]).toBe('Read a book')
        expect(newTask.title).toBe(' Read a book ')

    })


    it('rejects a title longer than 120 characters after trimming', () => {
    
        const newTask: Task = {
            id: "task-106",
            title: "a".repeat(121),
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

     expect(() => addTask(taskFixtures, newTask)).toThrow('Title must not exceed 120 characters')

    })


    it('accepts a 120-character title after trimming surrounding spaces', () => {
    
        const newTask: Task = {
            id: "task-106",
            title: ' ' + 'a'.repeat(120) + ' ',
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        const returnedTitles = addTask(taskFixtures, newTask).map(task => task.title)

        expect(returnedTitles[returnedTitles.length - 1]).toBe('a'.repeat(120))
    })


    it('returns a new array without changing existing tasks', () => {
        
        const input = structuredClone(taskFixtures)

        const beforeSnapshot = structuredClone(input)

        const newTask: Task = {
            id: "task-106",
            title: ' ' + 'a'.repeat(120) + ' ',
            status: "todo",
            priority: 2,
            createdAt: "2026-11-01T09:00:00.000Z"
        }

        const result = addTask(input, newTask)

        expect(input).toEqual(beforeSnapshot)
        expect(result).not.toBe(input)

    })
})


describe('updateTask', () => {

    it('updates the selected task status and preserves its other fields', () => {
        const result = updateTask(taskFixtures, 'task-101', {status: 'done'})

        const targetTask = result.find(task => task.id === 'task-101')

        const expectedObject ={
            id:        'task-101',
            title:     'Research UI patterns',
            status:    'done',
            priority:  2,
            createdAt: '2026-11-01T09:00:00.000Z'
        }

        expect(targetTask).toEqual(expectedObject)

    })

    it('throws when the task ID does not exist', () => {

        expect(() => updateTask(taskFixtures, 'task-999', {status: 'done'})).toThrow('Task not found')
    })


    it('updates multiple fields without changing other tasks', () => {

        const result = updateTask(taskFixtures, 'task-102', { title: 'Finish unit tests', priority: 2 })

        const expected = taskFixtures.map(task => {

            if(task.id === 'task-102'){
                return {...task, title: 'Finish unit tests', priority: 2 }
            }

            return task
        })

        expect(result).toEqual(expected)

    })


    it('leaves task values unchanged when changes are empty', () => {

        const result = updateTask(taskFixtures, 'task-101', {})

        expect(result).toEqual(taskFixtures)

    })

    it('updates a copied task without changing the original input', () => {

        const input = structuredClone(taskFixtures)

        const beforeSnapshot = structuredClone(input)

        const result = updateTask(input, 'task-101', {status: 'done'})


        const originalTask = input.find(task => task.id === 'task-101')
        const updatedTask = result.find(task => task.id === 'task-101')

        expect(input).toEqual(beforeSnapshot)
        expect(result).not.toBe(input)
        expect(updatedTask).not.toBe(originalTask)

    })

    it('trims an updated title without changing the supplied changes', () => {

        const changes = { title: ' Finish research ' }
        
        const result = updateTask(taskFixtures, 'task-101', changes)

        const targetTask = result.find(task => task.id === 'task-101')

        expect(targetTask?.title).toEqual('Finish research')
        expect(changes.title).toEqual(' Finish research ')
    })


    it('rejects an updated title that is blank after trimming', () => {

         expect(() => updateTask(taskFixtures, 'task-101', {title: ' '})).toThrow('Title must not be blank')

    })


    it('rejects an updated title longer than 120 characters', () => {

         expect(() => updateTask(taskFixtures, 'task-101', { title: 'a'.repeat(121) })).toThrow('Title must not exceed 120 characters')
    }) 
})


describe('deleteTask', () =>{

    it('removes only the task with the requested ID', () =>{

        const expectedArray = ['task-101', 'task-102', 'task-104', 'task-105']

        const result = deleteTask(taskFixtures, 'task-103')

        const taskIds = result.map(task => task.id)


        expect(taskIds).toEqual(expectedArray)
    })

    it('removing the same task twice has the same result', () => {

        const afterFirstDelete = deleteTask(taskFixtures, 'task-103')

        const afterSecondDelete = deleteTask(afterFirstDelete, 'task-103')

        expect(afterSecondDelete).toEqual(afterFirstDelete)
    })


    it('returns an empty array when deleting from empty input', () => {
        
        const result = deleteTask([], 'task-103')
        
        expect(result).toEqual([])
    })


    it('preserves all tasks when the requested ID does not exist', () => {

        const result = deleteTask(taskFixtures, 'task-999')

        expect(result).toEqual(taskFixtures)
    })

    it('returns a new array without changing the original tasks', () =>{

        const input = structuredClone(taskFixtures)

        const beforeSnapshot = structuredClone(input)

        const result = deleteTask(input, 'task-103')

        const targetTaskInput = input.find(task => task.id === 'task-101')


        const targetTaskResult = result.find(task => task.id === 'task-101')

        expect(input).toEqual(beforeSnapshot)
        expect(result).not.toBe(input)
        expect(targetTaskInput).toBe(targetTaskResult)
    })
})
