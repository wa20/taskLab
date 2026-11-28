import { useState } from 'react'
import type { ITask, ITaskPriority } from '@tasklab/core'
import { getTaskSummary, updateTask, addTask } from '@tasklab/core'
import { demoTasks } from './data/demo-tasks'
import SummaryCards from './components/SummaryCards'
import Toolbar from './components/Toolbar'
import TaskBoard from './components/TaskBoard'
import TaskForm from './components/TaskForm'
import './styles/app.css'

function App() {
  const [tasks, setTasks] = useState<ITask[]>(demoTasks)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState<boolean>(false)

  const summary = getTaskSummary(tasks)
  const handleDemoStatusChange = () => {
   setTasks((previousTasks) => {
        return updateTask(previousTasks, 'task-101', { status: 'done' })
       
    } )  
  }

  const handleCancelButton = () => {
   return setIsTaskFormOpen(false)
  }

  const handleOnCreateButton = (title: string, priority: ITaskPriority) => {
    
    const newTask: ITask = {
      id: crypto.randomUUID(),
      title: title,
      priority: priority,
      status: 'todo',
      createdAt: new Date().toISOString()
    }

    setTasks((previousTasks) => {
      return addTask(previousTasks, newTask )
    })

    setIsTaskFormOpen(false)
    
    console.log('newTask: ', {newTask})
  }

  return (
    <>
        <header className="app-header">
          <div>
            <h1>TaskLab</h1>
            <p>
              Manage your tasks
            </p>
          </div>
          
          <button type='button' onClick={() => setIsTaskFormOpen(true)}> New Task</button>
          <button type='button' onClick={handleDemoStatusChange}> Mark Done</button>
        </header>
        <main className="app-main">
          {isTaskFormOpen && <TaskForm onCreate={handleOnCreateButton} onCancel={handleCancelButton}/>}  
          <section className="summary-grid" aria-label="Task summary">
            <SummaryCards  total={summary.total} inProgress={summary.inProgress} done={summary.done} />
          </section>
          <section className="toolbar" aria-label="Task filters">
            <Toolbar />
          </section>
          <section aria-label="Task board">
            <TaskBoard tasks={tasks}/>
          </section>
        </main>
    </>
  )
}

export default App
