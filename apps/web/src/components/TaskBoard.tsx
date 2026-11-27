import type { ITask } from "@tasklab/core"
import { groupTasksByStatus } from "@tasklab/core"
import TaskColumn from "./TaskColumn"

type ITaskBoardProps = {
    tasks: readonly ITask[]

}

const TaskBoard = (props: ITaskBoardProps) => {

  const groups = groupTasksByStatus(props.tasks)  

  return (
    <div className="task-board">
        <TaskColumn status={"todo"} tasks={groups.todo}/>
        <TaskColumn status={"in-progress"} tasks={groups['in-progress']}/>
        <TaskColumn status={'done'} tasks={groups.done}/>
    </div>
  )
}

export default TaskBoard