import { useState } from "react"
import type { SubmitEvent } from 'react'
import type { ITaskPriority } from "@tasklab/core"


type ITaskFormProps = {
    onCancel: () => void
    onCreate: (title: string, priority: ITaskPriority) => void
}

const TaskForm = (props: ITaskFormProps) => {
   const [title, setTitle] = useState<string>('') 
   const [priority, setPriority] = useState<ITaskPriority>(1)
   const [titleError, setTitleError] = useState<string>('')
   

  const selectPriorty = (num: string) => {
    const priority = Number(num)

    if(priority !== 1 &&
        priority !== 2 &&
        priority !== 3) {
            return
        } 

    setPriority(priority)    
    }

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => { 
        event.preventDefault()

        const trimmedTitle = title.trim()

        if(!trimmedTitle){
           return setTitleError('Enter a task title.')   
        }

        if(trimmedTitle.length > 120){
            return setTitleError('Title must not exceed 120 characters')
        }

        setTitleError('')

        return props.onCreate(trimmedTitle, priority)
    }

  return (
    <form onSubmit={onSubmit}>
        <label htmlFor="task-title" >Title</label>
        <input 
            type="text" 
            name="title" 
            id="task-title" 
            value={title} onChange={(e) => setTitle(e.currentTarget.value)}
            />
            {titleError && <p role="alert">{titleError}</p> }

        <label htmlFor="new-task-priority">Priority</label>
        <select id="new-task-priority" value={priority} onChange={(e) => selectPriorty(e.currentTarget.value)}>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
        </select>

        <button type="submit"> Create Task </button>
        <button type="button" onClick={props.onCancel}> Cancel </button>

        
    </form>
  )
}

export default TaskForm