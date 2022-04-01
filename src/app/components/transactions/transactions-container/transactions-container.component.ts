import { Component, Input, OnInit } from '@angular/core';
import { Transaction, TransactionType } from 'src/app/models/transaction.model';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-transactions-container',
  templateUrl: './transactions-container.component.html',
  styleUrls: ['./transactions-container.component.scss'],
})
export class TransactionsContainerComponent implements OnInit {
  amountSpent: number = 0;
  @Input() date: string = '0';
  @Input() day: string = 'Sunday';
  @Input() monthYear: string = 'Jan 2000';
  @Input() transactions: Transaction[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.sortByDate(this.transactions, 'DESC');
    this.getAmountSpent();
  }

  getAmountSpent() {
    this.amountSpent = this.transactions.reduce((a: number, e: Transaction) => {
      if (e.type === TransactionType.EXPENSE) return a - e.amount;
      else if (e.type === TransactionType.INCOME) return a + e.amount;
      else return a;
    }, 0);
  }

  sortByDate(arr: Transaction[], order?: string) {
    arr.sort(function (a: Transaction, b: Transaction) {
      if (order === 'DESC') return moment(b.date).diff(moment(a.date));
      return moment(a.date).diff(moment(b.date));
    });
  }

  showTransactionInfo(transaction: Transaction) {
    if (!transaction) return;

    this.router.navigateByUrl('/show-transaction', {
      state: {
        transaction: JSON.stringify(transaction),
      },
    });
  }
}
