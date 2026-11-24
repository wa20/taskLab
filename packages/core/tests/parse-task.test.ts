import { describe, expect, it } from 'vitest';
import { taskFixtures } from "../src/data/task-fixtures"
import { parseTask } from '../src/domain/parse-task';


describe('parseTask', () => {

    it('accepts a valid task object', () => {

        const result = parseTask(taskFixtures[0])

        expect(result).toEqual(taskFixtures[0])
    })

    it('rejects null instead of treating it as a task object', () => {

        expect(() => parseTask(null)).toThrow('Task must be an object')
    })


    it('rejects arrays instead of treating them as task objects', () => {
        
       expect(() => parseTask([])).toThrow('Task must be an object')
    })

    it('rejects an unrecognised status at runtime', () => {

        const input = {...taskFixtures[0], status: 'blocked' }

        expect(() => parseTask(input)).toThrow('Task status must be todo, in-progress, or done')
    })

    it('rejects a priority outside the permitted values', () => {

        const input = {...taskFixtures[0], priority: 9}

        expect(() => parseTask(input)).toThrow('Task priority must be 1, 2, or 3')
    })
    
    it('rejects an object with no title property', () => {

        const input =  {
        id: "task-101",
        status: "todo",
        priority: 2,
        createdAt: "2026-11-01T09:00:00.000Z"
        }

        expect(() => parseTask(input)).toThrow('Task title must be a string')

    })

    it('rejects a title that is blank after trimming', () => {
        
        const input = {...taskFixtures[0], title: ' '}

        expect(() => parseTask(input)).toThrow('Title must not be blank')
    })

    it('rejects an invalid creation timestamp', () => {

        const input = {...taskFixtures[0], createdAt: 'not-a-date'}

        expect(() => parseTask(input)).toThrow('Task createdAt must be a valid UTC timestamp')
    })

    it('rejects a timestamp that is not in the full UTC ISO format', () => {
        
        const input = {...taskFixtures[0], createdAt: '2026-11-01T09:00:00Z'}

        expect(() => parseTask(input)).toThrow('Task createdAt must use the full UTC ISO format')

    })

    it('rejects a string instead of treating it as a task object', () => {
        
        expect(() => parseTask('not a task')).toThrow('Task must be an object')
    })
})