"use client";
import { FC, useState } from "react";
import { taskType } from "../types/taskType";
import Task from "./task";
import AddTask from "./addTask";
import {
  addTask,
  deleteTask,
  editTask,
  toggleTask,
} from "../actions/todoActions";
import { useRouter } from "next/navigation";

interface Props {
  tasks: taskType[];
  goalId: number;
  cycleId: number;
}

const Tasks: FC<Props> = ({ tasks, goalId, cycleId }) => {
  const router = useRouter();
  const [taskItems, setTaskItems] = useState<taskType[]>(tasks);

  const createTask = async (
    name: string,
    deadline: Date | undefined,
    goalId: number,
  ) => {
    try {
      const newTask = await addTask(name, deadline, goalId);
      if (newTask) {
        setTaskItems((prev) => [...prev, newTask]);
        router.refresh();
      } else {
        console.error("Error: New goal data is undefined.");
      }
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  const changeTaskText = (id: number, name: string) => {
    setTaskItems((prev) =>
      prev.map((task) => (task.id === id ? { ...task, name } : task)),
    );
    editTask(id, name);
  };

  const toggleIsTaskDone = (id: number) => {
    setTaskItems((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
    toggleTask(id);
  };

  const deleteTaskItem = (id: number) => {
    setTaskItems((prev) => prev.filter((task) => task.id !== id));
    deleteTask(id);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center p-16">
      <div className="mt-8 flex w-full flex-col gap-2">
        {taskItems.map((task) => (
          <Task
            key={task.id}
            task={task}
            changeTaskText={changeTaskText}
            toggleIsTaskDone={toggleIsTaskDone}
            deleteTaskItem={deleteTaskItem}
          />
        ))}
      </div>

      <AddTask cycleId={cycleId} goalId={goalId} createTask={createTask} />
    </main>
  );
};

export default Tasks;
