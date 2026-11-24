import { getTaskSummary } from '@tasklab/core'
import { demoTasks } from './data/demo-tasks'
import SummaryCards from './components/SummaryCards'
import Toolbar from './components/Toolbar'
import './styles/app.css'


function App() {

  const summary = getTaskSummary(demoTasks)

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
        </header>
        <main className="app-main">
          
          <section className="summary-grid" aria-label="Task summary">
            <SummaryCards  total={summary.total} inProgress={summary.inProgress} done={summary.done} />
          </section>
          <section className="toolbar" aria-label="Task filters">
            <Toolbar />
          </section>
          <section aria-label="Task board">
            <h2>Task Board</h2>
          </section>
        </main>
    </>
  )
}

export default App
