import type { ITask, ITaskStatus } from "@tasklab/core"
import TaskCard from './TaskCard'


type ITaskColumnProps = {
    status: ITaskStatus, 
    tasks: readonly ITask[]
}

const TaskColumn = (props: ITaskColumnProps) => {

  const statusLabels = {
    todo: 'To do',
    'in-progress': 'In progress',
    done: 'Done'
  }  

  return (
    <section className="task-column">
        <h2>{statusLabels[props.status]}: {props.tasks.length}</h2>
        <ul className="task-list">
            {props.tasks.map(task => {

                return <li key={task.id}>
                        <TaskCard task={task}/>
                    </li>
            
            })}
        </ul>
    </section>

    
  )
}

export default TaskColumn