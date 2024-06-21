"use client";
import { FC, useState } from "react";
import { cycleType } from "../types/cycleType";
import Cycle from "./cycle";
import AddCycle from "./addCycle";
import { addCycle, deleteCycle, editCycle } from "../actions/cycleActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  cycles: cycleType[];
}

const Cycles: FC<Props> = ({ cycles }) => {
  const router = useRouter();
  // State to manage the list of todo items
  const [cycleItems, setCycleItems] = useState<cycleType[]>(cycles);

  // Function to create a new todo item
  const createCycle = async (name: string, startDate: Date, endDate: Date) => {
    try {
      const newCycle = await addCycle(name, startDate, endDate);
      if (newCycle) {
        // Stelle sicher, dass newCycle nicht undefined ist
        setCycleItems((prev) => [...prev, newCycle]);
        router.refresh();
      } else {
        console.error("Error: New cycle data is undefined.");
      }
    } catch (error) {
      console.error("Error adding new cycle:", error);
    }
  };

  // Function to change the text of a todo item
  const changeCycleText = (id: number, text: string) => {
    setCycleItems((prev) =>
      prev.map((cycle) => (cycle.id === id ? { ...cycle, text } : cycle)),
    );
    editCycle(id, text);
  };

  // Function to delete a todo item
  const deleteCycleItem = (id: number) => {
    setCycleItems((prev) => prev.filter((cycle) => cycle.id !== id));
    deleteCycle(id);
  };

  // Rendering the Todo List component
  return (
    <div className="flex flex-col items-start justify-center gap-3 md:flex-row md:items-center">
      <div className="mt-8 flex gap-2">
        {/* Mapping through todoItems and rendering Todo component for each */}
        {cycleItems.map((cycle) => (
          <Link key={cycle.id} href={`/cycles/${cycle.id}`}>
            <Cycle
              key={cycle.id}
              cycle={cycle}
              changeCycleText={changeCycleText}
              deleteCycleItem={deleteCycleItem}
            />
          </Link>
        ))}
      </div>
      <AddCycle createCycle={createCycle} />
    </div>
  );
};

export default Cycles;
