export interface Transaction {
  key?: string;
  date: Date;
  desc: string;
  fromWallet?: string;
  wallet: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export enum TransactionType {
  INCOME,
  EXPENSE,
  TRANSFER,
}
