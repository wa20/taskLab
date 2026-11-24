import { getTaskSummary } from '@tasklab/core'
import { demoTasks } from './data/demo-tasks'

import './App.css'

function App() {

  const summary = getTaskSummary(demoTasks)

  return (
    <>
      <section id="center">
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <div className="counter" >
          Total Tasks:  {summary.total}
        </div>
      </section>
    </>
  )
}

export default App
