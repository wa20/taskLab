import { describe, expect, it } from 'vitest';
import { createInMemoryTaskRepository } from '../src/storage/task-repository'
import { taskFixtures } from '../src/data/task-fixtures';


describe('createInMemoryTaskRepository', () => {

    it('loads the tasks that were previously saved', async() => {

        const repository = createInMemoryTaskRepository()

        await repository.saveTasks(taskFixtures)

        const loadedTasks = await repository.loadTasks() 

        expect(loadedTasks).toEqual(taskFixtures)

       
    })

    it('keeps stored tasks unchanged when a loaded task is edited', async() => {
       
        const repository = createInMemoryTaskRepository()

        await repository.saveTasks(taskFixtures)

        const loadedTasks = await repository.loadTasks()

        loadedTasks[0].title = 'Edited outside storage'

        const reloadedTasks = await repository.loadTasks()

        expect(reloadedTasks).toEqual(taskFixtures)
    })


    it('keeps stored tasks unchanged when the supplied save data is edited later', async () => {

        const repository = createInMemoryTaskRepository()

        const input = structuredClone(taskFixtures)
        
        await repository.saveTasks(input)

        input[0].title = 'Changed after saving'

        const loadedTasks = await repository.loadTasks()

        console.log('loadedTasks: ', { loadedTasks })

        expect(loadedTasks).toEqual(taskFixtures)
        
    })


    it('allows the caller to detect a rejected save', async () => {

        const failingSave = async () => {
            throw new Error('Save failed')
        }

        await expect(failingSave()).rejects.toThrow('Save failed')
    })
})