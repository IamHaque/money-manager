import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  Object = Object;
  transactionsByDate: any;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionsByDate = this.transactionService.getTransactionsForMonth();
  }

  hasTransactions() {
    return (
      this.transactionsByDate && Object.keys(this.transactionsByDate).length > 0
    );
  }
}
