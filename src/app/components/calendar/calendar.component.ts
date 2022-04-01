import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { Date, DateType } from '../../models/date.model';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  date: moment.Moment;
  transactionSummary: { [any: string]: number } = {};

  dates: Date[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    moment.updateLocale('en', {
      week: {
        dow: 1,
      },
    });

    this.date = moment();
    this.getTransactionSummary();
  }

  getMonthYear = (dt: moment.Moment) => dt.format('MMMM YYYY');

  getTransactionSummary() {
    this.transactionSummary =
      this.transactionService.getTransactionSummaryForMonth(
        this.getMonthYear(this.date)
      );
    this.populateDateValues();
  }

  decrementMonth() {
    this.date.subtract({ month: 1 });
    this.getTransactionSummary();
  }

  incrementMonth() {
    this.date.add({ month: 1 });
    this.getTransactionSummary();
  }

  shouldBeInactive(type: number) {
    return type === 0 || type === 2;
  }

  formatAmount(amount: number) {
    if (amount === 0) return '';
    return '$ ' + Math.abs(amount);
  }

  populateDateValues() {
    this.dates = this.transactionService.populateDates(this.date);
  }
}
