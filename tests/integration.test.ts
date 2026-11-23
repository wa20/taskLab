import { describe, it, expect } from "vitest";
import { ITask } from "../src/domain/task";
import { addTask, deleteTask, getTaskSummary, getUnfinishedTasks, updateTask } from "../src/domain/task-operations";
import { createInMemoryTaskRepository } from "../src/storage/task-repository";

describe('integrations', () => { 
    it('supports the complete task lifecycle through storage and summary', async () => {

        const newTaskA: ITask = {
                    id: "A",
                    title: 'Task A Title',
                    status: "todo",
                    priority: 2,
                    createdAt: "2026-11-01T19:00:00.000Z"
                }

        const newTaskB: ITask = {
                    id: "B",
                    title: 'Task B Title',
                    status: "in-progress",
                    priority: 1,
                    createdAt: "2026-11-01T10:00:00.000Z"
                }

        const newTaskC: ITask = {
                    id: "C",
                    title: 'Task C Title',
                    status: "todo",
                    priority: 3,
                    createdAt: "2026-11-01T16:00:00.000Z"
                }

        const newTaskD: ITask = {
                    id: "B",
                    title: 'Task D Title',
                    status: "todo",
                    priority: 3,
                    createdAt: "2026-11-01T16:00:00.000Z"
                }
                
        const addTaskA = addTask([], newTaskA)
        const addTaskB = addTask(addTaskA, newTaskB)
        const addTaskC = addTask(addTaskB, newTaskC)

        const updateTaskAStatus = updateTask(addTaskC, 'A', {status: 'done'})
        const input = structuredClone(updateTaskAStatus)
        const beforeSnapshot = structuredClone(input)
        expect(() => addTask(input, newTaskD)).toThrow('Duplicate task ID');
        expect(input).toEqual(beforeSnapshot)

        const afterFirstDelete = deleteTask(input, 'C')
        const afterSecondDelete = deleteTask(afterFirstDelete, 'C')
        expect(afterSecondDelete).toEqual(afterFirstDelete)

        const repository = createInMemoryTaskRepository()
        await repository.saveTasks(afterSecondDelete)
        const loadedTasks = await repository.loadTasks() 

        console.log('loaded: ', {loadedTasks})
        expect(loadedTasks).toEqual(afterSecondDelete)

        const remainingId = loadedTasks.map(task => task.id)
        expect(remainingId).toEqual(['A', 'B'])

        const result = getTaskSummary(loadedTasks)
        
        expect(result).toEqual({
            total: 2,
            todo: 0,
            inProgress: 1,
            done: 1,
            completionPercent: 50
        })

        const unfinished = getUnfinishedTasks(loadedTasks)
        const unfinishedId = unfinished.map(task => task.id)
        expect(unfinishedId).toEqual(['B'])
})
})