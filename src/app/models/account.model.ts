import { Wallet } from './wallet.model';

export interface Account {
  user: string;
  balance: number;
  currency: string;
  wallets: Wallet[];
}
