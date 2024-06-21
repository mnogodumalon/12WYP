"use client";
import { ChangeEvent, FC, useState } from "react";
import { cycle } from "~/server/db/schema";
import { Button } from "../../components/ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface Props {
  createGoal: (name: string, description: string, cycleId: number) => void;
  cycleId: number;
}

const AddGoal: FC<Props> = ({ createGoal, cycleId }) => {

  const [name, setName] = useState("");


  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const [description, setDescription] = useState("");

  const handleDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };


  const handleAdd = async () => {
    createGoal(name, description, cycleId);
    setName("");
    setDescription("");
  };


  return (
    <div className="mt-2 flex w-full gap-1">
      {/* Input field for entering new todo text */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Plus size={26} weight="light" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new Goal?</AlertDialogTitle>
          </AlertDialogHeader>

          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Goal</Label>
                <Input
                  onChange={handleName}
                  value={name}
                  id="name"
                  placeholder="Name of your project"
                />
                <Label htmlFor="name">Description</Label>
                <Input
                  onChange={handleDescription}
                  value={description}
                  id="name"
                  placeholder="Name of your project"
                />
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

export default AddGoal;
