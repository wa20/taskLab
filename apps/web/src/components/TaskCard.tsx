import type { ITask } from "@tasklab/core";

type ITaskCardProps = {
    task: ITask
}


const TaskCard = (props: ITaskCardProps) => {

  const priorityLabels = {
    1: 'High',
    2: 'Medium',
    3: 'Low'
  }  


  return (
    <article className="task-card">
        <h3>{props.task.title}</h3>
        <p>Priority: {priorityLabels[props.task.priority]}</p>
        <p>Created <time dateTime={props.task.createdAt}>{props.task.createdAt.slice(0, 10) }</time></p>
    </article>
  )
}

export default TaskCard