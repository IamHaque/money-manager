export interface Date {
  date: string;
  amount: number;
  type: DateType;
  isToday: boolean;
}

export enum DateType {
  PREV,
  CURR,
  NEXT,
}
