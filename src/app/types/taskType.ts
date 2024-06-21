export type taskType = {
  id: number;
  name: string;
  done?: boolean;
  deadline: Date | undefined | null;
  goalId?: number;
  createdAt?: Date;
  updatedAt?: Date | null;
};
