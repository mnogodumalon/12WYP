"use client";
import { ChangeEvent, FC, useState } from "react";
import { taskType } from "../types/taskType";

interface Props {
  task: taskType;
  changeTaskText: (id: number, text: string) => void;
  toggleIsTaskDone: (id: number, done: boolean) => void;
  deleteTaskItem: (id: number) => void;
}

const Task: FC<Props> = ({
  task,
  changeTaskText,
  toggleIsTaskDone,
  deleteTaskItem,
}) => {
  const [editing, setEditing] = useState(false);

  const [text, setText] = useState(task.name);

  const [isDone, setIsDone] = useState(task.done);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleIsDone = async () => {
    toggleIsTaskDone(task.id, !isDone);
    setIsDone((prev) => !prev);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    changeTaskText(task.id, text);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setText(task.name);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTaskItem(task.id);
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-solid border-gray-200 p-4">
      <input
        type="checkbox"
        className="h-4 w-4 rounded-sm text-blue-200"
        checked={isDone}
        onChange={handleIsDone}
      />

      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        readOnly={!editing}
        className={`${
          task.done ? "line-through" : ""
        } w-full rounded border-gray-200 px-2 py-1 outline-none read-only:border-transparent focus:border`}
      />

      <div className="ml-auto flex gap-1">
        {editing ? (
          <button
            onClick={handleSave}
            className="w-14 rounded bg-green-600 px-2 py-1 text-green-50"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="w-14 rounded bg-blue-400 px-2 py-1 text-blue-50"
          >
            Edit
          </button>
        )}
        {editing ? (
          <button
            onClick={handleCancel}
            className="w-16 rounded bg-red-400 px-2 py-1 text-red-50"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="w-16 rounded bg-red-400 px-2 py-1 text-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;
