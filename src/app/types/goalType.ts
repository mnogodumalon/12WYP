export type goalType = {
  id?: number;
  name: string;
  description: string;
  isAccomplished: boolean;
  cycleId?: number;
  createdAt?: Date;
  updatedAt?: Date | null;
};
