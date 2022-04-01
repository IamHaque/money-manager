export interface Category {
  key?: string;
  title: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export enum CategoryType {
  INCOME,
  EXPENSE,
}
