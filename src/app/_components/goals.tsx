"use client";
import { FC, useState } from "react";
import { goalType } from "../types/goalType";
import Goal from "./goal";
import AddGoal from "./addGoal";
import { useRouter } from "next/navigation";
import {
  addGoal,
  deleteGoal,
  editGoal,
  toggleGoal,
} from "../actions/goalActions";
import { goal } from "~/server/db/schema";
import { is } from "drizzle-orm";

interface Props {
  goals: goalType[];
  cycleId: number;
}

const Goals: FC<Props> = ({ goals, cycleId }) => {
  const router = useRouter();

  const [goalItems, setGoalItems] = useState<goalType[]>(goals);

  const createGoal = async (
    name: string,
    description: string,
    cycleId: number,
  ) => {
    try {
      const newGoal = await addGoal(name, description, cycleId);
      if (newGoal) {
        setGoalItems((prev) => [...prev, newGoal]);
      } else {
        console.error("Error: New goal data is undefined.");
      }
    } catch (error) {
      console.error("Error adding new goal:", error);
    }
    router.refresh();
  };

  const changeGoalText = (id: number, name: string, description: string) => {
    setGoalItems((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, name, description } : goal,
      ),
    );
    editGoal(id, name, description);
  };

  const toggleIsGoalDone = (id: number) => {
    setGoalItems((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? { ...goal, isAcomplished: !goal.isAccomplished }
          : goal,
      ),
    );
    toggleGoal(id);
  };

  const deleteGoalItem = (id: number) => {
    setGoalItems((prev) => prev.filter((goal) => goal.id !== id));
    deleteGoal(id);
  };

  return (
    <main className="flex w-full max-w-xl flex-col items-center">
      <div className="flex w-full flex-col gap-2">
        {goalItems.map((goal) => (
          <Goal
            key={goal.id}
            goal={goal}
            changeGoalName={changeGoalText}
            toggleIsGoalDone={toggleIsGoalDone}
            deleteGoalItem={deleteGoalItem}
          />
        ))}
      </div>

      <AddGoal createGoal={createGoal} cycleId={cycleId} />
    </main>
  );
};

export default Goals;
