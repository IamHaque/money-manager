import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  _account: Account;

  constructor(private walletService: WalletService) {
    this._account = {
      balance: 0,
      user: 'Haque',
      currency: '$',
      wallets: this.walletService.getWallets(),
    };

    this.calculateAccountBalance();
  }

  getWallets = () => this._account.wallets;
  getUsername = () => this._account.user;
  getAccountBalance = () => this._account.balance;

  calculateAccountBalance() {
    const accountBalance = this._account.wallets.reduce(
      (balance, wallet) => balance + wallet.balance,
      0
    );
    this._account.balance = accountBalance;
  }
}
