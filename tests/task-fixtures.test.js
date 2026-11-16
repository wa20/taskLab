import {describe, it, expect } from 'vitest'
import { taskFixtures } from "../src/data/task-fixtures"

describe('check array length', () => { 
    it('array has 5 tasks', () => {
        expect(taskFixtures).toHaveLength(5)
    })
})