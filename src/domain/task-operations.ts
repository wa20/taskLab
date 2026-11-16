import type { Task, TaskStatus } from "./task";

export const getTasksByStatus = (tasks: readonly Task [], status: TaskStatus): Task[] => {
  return  tasks.filter((task) => task.status === status )
}