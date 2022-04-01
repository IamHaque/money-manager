import { Injectable } from '@angular/core';
import { ArgumentOutOfRangeError } from 'rxjs';
import { WalletData } from '../data/wallets.data';
import { TransactionType } from '../models/transaction.model';
import { Wallet } from '../models/wallet.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private _wallets: Wallet[];
  private _LS_KEY = 'wallets';

  constructor(private commonService: CommonService) {
    const localWallets: Wallet[] | null =
      this.commonService.getItemFromLocalStorage<Wallet[]>(this._LS_KEY);

    if (localWallets) this._wallets = localWallets;
    else this._wallets = WalletData;
  }

  getWallets = () => this._wallets;

  getWalletByKey = (key: string) =>
    this._wallets.find((wallet) => wallet.key === key);

  getWalletIndexByKey = (key: string) =>
    this._wallets.findIndex((wallet) => wallet.key === key);

  getPrimaryWallet(): [number, string, number, string] {
    for (let i = 0; i < this._wallets.length; i++) {
      const wallet = this._wallets[i];
      if (wallet.primary)
        return [i, wallet.name, wallet.balance, wallet.key || ''];
    }

    return [-1, '', 0, ''];
  }

  saveToLS() {
    this.commonService.setItemToLocalStorage(this._LS_KEY, this._wallets);
  }

  addNewWallet(w: Wallet) {
    if (!w) return;

    const key = this.commonService.getID();
    this._wallets.push({ ...w, key });

    this.saveToLS();
  }

  modifyWalletBalance(walletData: { [any: string]: any }) {
    if (!walletData) return;
    if (!walletData.wallet) return;

    let w = this.getWalletIndexByKey(walletData.wallet);
    let fw = walletData.fromWallet
      ? this.getWalletIndexByKey(walletData.fromWallet)
      : -1;

    if (!walletData.isModified) {
      const multiplier = walletData.type === TransactionType.EXPENSE ? -1 : 1;
      const amount = walletData.amount * multiplier;
      this._wallets[w].balance += amount;

      if (walletData.type === TransactionType.TRANSFER) {
        this._wallets[fw].balance -= walletData.amount;
      }
    } else {
      const multiplier = walletData.type === TransactionType.EXPENSE ? 1 : -1;
      const amount = walletData.amount * multiplier;
      this._wallets[w].balance += amount;

      if (walletData.type === TransactionType.TRANSFER) {
        this._wallets[fw].balance += walletData.amount;
      }
    }

    this.saveToLS();
  }

  deductAmountFromWallet(key: string, amount: number) {
    if (!key) return;

    const w = this.getWalletIndexByKey(key);
    if (w < 0) return;

    this._wallets[w].balance -= amount;
    this.saveToLS();
  }

  addAmountToWallet(key: string, amount: number) {
    if (!key) return;

    const w = this.getWalletIndexByKey(key);
    if (w < 0) return;

    this._wallets[w].balance += amount;
    this.saveToLS();
  }
}
