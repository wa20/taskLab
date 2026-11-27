import { useState } from 'react'
import type { ITask } from '@tasklab/core'
import { getTaskSummary, updateTask } from '@tasklab/core'
import { demoTasks } from './data/demo-tasks'
import SummaryCards from './components/SummaryCards'
import Toolbar from './components/Toolbar'
import TaskBoard from './components/TaskBoard'
import './styles/app.css'


function App() {
  const [tasks, setTasks] = useState<ITask[]>(demoTasks)

  const summary = getTaskSummary(tasks)

  const handleDemoStatusChange = () => {

   setTasks((previousTasks) => {

        console.log('previ: ', {previousTasks})
        const result = updateTask(previousTasks, 'task-101', { status: 'done' })

        console.log('result: ', {result})
        return result

        
    } )

    
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
          
          <button type='button'> New Task</button>
          <button type='button' onClick={handleDemoStatusChange}> Mark Done</button>
        </header>
        <main className="app-main">
          
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
