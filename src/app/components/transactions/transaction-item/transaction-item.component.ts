import { Component, Input, OnInit } from '@angular/core';
import { Transaction, TransactionType } from 'src/app/models/transaction.model';
import * as moment from 'moment';
import { WalletService } from 'src/app/services/wallet.service';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { Wallet } from 'src/app/models/wallet.model';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
})
export class TransactionItemComponent implements OnInit {
  @Input() transaction: Transaction;

  time: string = '';
  isTypeTransfer: boolean;
  transactionCategory: Category;

  constructor(
    private walletService: WalletService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.time = moment(this.transaction.date).format('hh:mm A');
    this.isTypeTransfer = this.transaction.type === TransactionType.TRANSFER;

    if (!this.isTypeTransfer) this.getTransactionCategory();
  }

  formatAmount() {
    return `${this.transaction.type === TransactionType.EXPENSE ? '-' : ''}$ ${
      this.transaction.amount
    }`;
  }

  getWalletName = (key: string) =>
    this.walletService.getWalletByKey(key)?.name as string;

  getTransactionCategory() {
    this.transactionCategory = this.categoryService.getCategoryByKey(
      this.transaction.category
    ) as Category;
  }

  getTransactionIcon = () =>
    this.isTypeTransfer
      ? 'fa-solid fa-right-left'
      : this.transactionCategory.icon;

  getTransactionColor = () =>
    this.isTypeTransfer ? 'transfer-bg' : this.transactionCategory.color;

  showDesc() {
    if (this.transaction.desc === '') {
      return this.isTypeTransfer ? 'Transfer' : this.transactionCategory.title;
    }
    return this.transaction.desc;
  }

  showWallet = () => {
    let wallet_line = this.getWalletName(this.transaction.wallet);

    if (this.isTypeTransfer)
      wallet_line =
        this.getWalletName(this.transaction.fromWallet as string) +
        ' → ' +
        wallet_line;

    return wallet_line;
  };
}
