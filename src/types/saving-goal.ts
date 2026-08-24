export type SavingGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate: string | null;
  percentage: number;
};
