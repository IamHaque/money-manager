import { Injectable } from '@angular/core';
import { Transaction, TransactionType } from '../models/transaction.model';
import { Date, DateType } from '../models/date.model';
import * as moment from 'moment';
import { TransactionData } from '../data/transactions.data';
import { CommonService } from './common.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _transactions: Transaction[];
  private _LS_KEY = 'transactions';

  constructor(
    private commonService: CommonService,
    private walletService: WalletService
  ) {
    const localTransactions: Transaction[] | null =
      this.commonService.getItemFromLocalStorage<Transaction[]>(this._LS_KEY);

    if (localTransactions) this._transactions = localTransactions;
    else this._transactions = TransactionData;
  }

  getMonthYear = (dt: moment.Moment) => dt.format('MMMM YYYY');

  addNewTransaction(t: Transaction) {
    if (!t) return;

    if (t.type === 0) {
      this.walletService.addAmountToWallet(t.wallet, t.amount);
    }

    if (t.type === 1) {
      this.walletService.deductAmountFromWallet(t.wallet, t.amount);
    }

    if (t.type === 2) {
      this.walletService.addAmountToWallet(t.wallet, t.amount);
      this.walletService.deductAmountFromWallet(t.fromWallet || '', t.amount);
    }

    const key = this.commonService.getID();
    this._transactions.push({ ...t, key });
    this.commonService.setItemToLocalStorage(this._LS_KEY, this._transactions);
  }

  modifyTransaction(p: Transaction, t: Transaction) {
    if (!t || !p) return;
    if (!t.key || !p.key) return;

    const pi = this.getTransactionIndexByKey(p.key);
    const ti = this.getTransactionIndexByKey(t.key);

    if (p.type === t.type) {
      this.walletService.modifyWalletBalance({
        fromWallet: t.fromWallet || '',
        wallet: t.wallet,
        amount: this._transactions[ti].amount - t.amount,
        type: t.type,
        isModified: true,
      });
    } else {
      // Income   ->  Expense
      if (
        p.type === TransactionType.INCOME &&
        t.type === TransactionType.EXPENSE
      ) {
        this.walletService.deductAmountFromWallet(p.wallet, p.amount);
        this.walletService.deductAmountFromWallet(t.wallet, t.amount);
      }

      // Transfer ->  Expense
      if (
        p.type === TransactionType.TRANSFER &&
        t.type === TransactionType.EXPENSE
      ) {
        this.walletService.addAmountToWallet(p.fromWallet || '', p.amount);
        this.walletService.deductAmountFromWallet(p.wallet, p.amount);
        this.walletService.deductAmountFromWallet(t.wallet, t.amount);
      }

      // Expense  ->  Income
      if (
        p.type === TransactionType.EXPENSE &&
        t.type === TransactionType.INCOME
      ) {
        this.walletService.addAmountToWallet(p.wallet, p.amount);
        this.walletService.addAmountToWallet(t.wallet, t.amount);
      }

      // Transfer ->  Income
      if (
        p.type === TransactionType.TRANSFER &&
        t.type === TransactionType.INCOME
      ) {
        this.walletService.addAmountToWallet(p.fromWallet || '', p.amount);
        this.walletService.deductAmountFromWallet(p.wallet, p.amount);
        this.walletService.addAmountToWallet(t.wallet, t.amount);
      }

      // Income   ->  Transfer
      if (
        p.type === TransactionType.INCOME &&
        t.type === TransactionType.TRANSFER
      ) {
        this.walletService.deductAmountFromWallet(p.wallet, p.amount);
        this.walletService.deductAmountFromWallet(t.fromWallet || '', p.amount);
        this.walletService.addAmountToWallet(t.wallet, t.amount);
      }

      // Expense  ->  Transfer
      if (
        p.type === TransactionType.EXPENSE &&
        t.type === TransactionType.TRANSFER
      ) {
        this.walletService.addAmountToWallet(p.wallet, p.amount);
        this.walletService.deductAmountFromWallet(t.fromWallet || '', p.amount);
        this.walletService.addAmountToWallet(t.wallet, t.amount);
      }
    }

    this._transactions[ti] = { ...t };
    this.commonService.setItemToLocalStorage(this._LS_KEY, this._transactions);
  }

  deleteTransaction(k: string) {
    if (!k) return;

    const ti = this.getTransactionIndexByKey(k);
    if (ti < 0) return;

    const t = this._transactions.splice(ti, 1)[0];

    if (t.type === 0) {
      this.walletService.deductAmountFromWallet(t.wallet, t.amount);
    }

    if (t.type === 1) {
      this.walletService.addAmountToWallet(t.wallet, t.amount);
    }

    if (t.type === 2) {
      this.walletService.addAmountToWallet(t.fromWallet || '', t.amount);
      this.walletService.deductAmountFromWallet(t.wallet, t.amount);
    }

    this.commonService.setItemToLocalStorage(this._LS_KEY, this._transactions);
  }

  getTransactionIndexByKey = (key: string) =>
    this._transactions.findIndex((transaction) => transaction.key === key);

  getTransactionsForMonth(monthYear?: string) {
    if (!monthYear) {
      monthYear = this.getMonthYear(moment());
    }

    return this._transactions.reduce((acc, t) => {
      const mDate = moment(t.date);
      if (this.getMonthYear(mDate) !== monthYear) return acc;

      let date = mDate.format('D');
      if (!acc.hasOwnProperty(date)) {
        (acc as any)[date] = {
          day: mDate.format('dddd'),
          monthYear: this.getMonthYear(mDate),
          transactions: [],
        };
      }

      (acc as any)[date].transactions.push(t);
      return acc;
    }, {});
  }

  getTransactionSummaryForMonth(monthYear?: string): {
    [any: string]: number;
  } {
    if (!monthYear) {
      monthYear = this.getMonthYear(moment());
    }

    return this._transactions.reduce(
      (acc, t) => {
        let mDate = moment(t.date);
        if (this.getMonthYear(mDate) !== monthYear) return acc;

        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else if (t.type === TransactionType.EXPENSE) acc.expense += t.amount;

        return acc;
      },
      {
        income: 0,
        expense: 0,
      }
    );
  }

  populateDates(date: moment.Moment): Date[] {
    let dates: Date[] = [];
    const start = moment(date).startOf('month');
    const end = moment(date).endOf('month');
    const monthYear = this.getMonthYear(date);
    const transactionsForCurrentMonth: { [any: string]: any } =
      this.getTransactionsForMonth(monthYear);

    // PREVIOUS month
    for (let i = 0; i < start.weekday(); i++) {
      dates.push({
        date: moment(start)
          .subtract({ day: start.weekday() - i })
          .date()
          .toString(),
        amount: 0,
        type: DateType.PREV,
        isToday: false,
      });
    }

    // CURRENT month
    for (let i = start.date() - 1; i < end.date(); i++) {
      let amount = 0;
      let dt = moment(start).add({ day: i });
      let key = dt.format('D');
      let isToday = dt.isSame(new Date(), 'day');

      if (transactionsForCurrentMonth[key]) {
        amount = transactionsForCurrentMonth[key].transactions.reduce(
          (a: number, e: Transaction) => {
            if (e.type === TransactionType.EXPENSE) return a - e.amount;
            else if (e.type === TransactionType.INCOME) return a + e.amount;
            else return a;
          },
          0
        );
      }

      dates.push({
        date: dt.date().toString(),
        amount,
        type: DateType.CURR,
        isToday,
      });
    }

    // NEXT month
    let endI = dates.length <= 35 ? 14 : 7;
    for (let i = end.weekday() + 1; i < endI; i++) {
      dates.push({
        date: moment(end)
          .add({ day: i - end.weekday() })
          .date()
          .toString(),
        amount: 0,
        type: DateType.NEXT,
        isToday: false,
      });
    }

    return dates;
  }
}
