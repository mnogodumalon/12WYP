"use client";
import { ChangeEvent, FC, useMemo, useState } from "react";
import { Calendar } from "../../components/ui/calendar";
import { set } from "date-fns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";
import { getData } from "../actions/goalActions";
import { getData as getDataCycle } from "../actions/cycleActions";

interface Props {
  createTask: (
    text: string,
    deadline: Date | undefined,
    goalId: number,
  ) => void;
  cycleId: number;
}

const AddTask: FC<Props> = ({ createTask, cycleId }) => {
  const [goalData, setGoalData] = useState<any[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | undefined>();
  const [cycleData, setCycleData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(cycleId);
        setGoalData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten: ", error);
      }
    };

    fetchData();
  }, [cycleId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataCycle();
        setCycleData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten: ", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  const selectedCycle = useMemo(
    () => cycleData.find((cycle) => cycle.id == cycleId),
    [cycleData, cycleId],
  );

  const [name, setName] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const [deadline, setDeadline] = useState<Date | undefined>();

  const handleSelectDate = (date: Date | undefined) => {
    setDeadline(date);
  };

  const handleGoalSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoalId(Number(event.target.value));
  };

  const handleAdd = async () => {
    if (!selectedGoalId) {
      console.error("Error: No goal selected.");
      return;
    }
    createTask(name, deadline, selectedGoalId);
    setName("");
    setDeadline(undefined);
  };

  const selectedGoalName = useMemo(() => {
    const goal = goalData.find((g) => g.id == selectedGoalId);
    console.log(goal);
    return goal ? goal.name : "Select a goal";
  }, [goalData, selectedGoalId]);

  return (
    <div className="mt-2 flex gap-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Plus size={26} weight="light" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new Task?</AlertDialogTitle>
          </AlertDialogHeader>

          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Task:</Label>
                <Input
                  onChange={handleInput}
                  value={name}
                  id="name"
                  placeholder="Name of your project"
                />
                <Label htmlFor="name">Set Deadline:</Label>
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={handleSelectDate}
                  className="rounded-md border"
                  fromDate={selectedCycle ? selectedCycle.startDate : undefined}
                  toDate={selectedCycle ? selectedCycle.endDate : undefined}
                />
                <Select
                  onValueChange={(value) => setSelectedGoalId(Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={selectedGoalName} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Goals</SelectLabel>
                      {goalData.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          {goal.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdd}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTask;
