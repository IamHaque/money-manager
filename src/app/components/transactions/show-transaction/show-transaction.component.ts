import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Transaction, TransactionType } from 'src/app/models/transaction.model';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-show-transaction',
  templateUrl: './show-transaction.component.html',
  styleUrls: ['./show-transaction.component.scss'],
})
export class ShowTransactionComponent implements OnInit {
  isTypeTransfer: boolean;
  transaction: Transaction;
  transactionCategory: Category;
  transactionTypes = ['Income', 'Expense', 'Transfer'];

  constructor(
    private router: Router,
    private walletService: WalletService,
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    const data = this.router.getCurrentNavigation()?.extras?.state?.transaction;
    if (data) this.transaction = JSON.parse(data) as Transaction;
  }

  ngOnInit(): void {
    this.isTypeTransfer = this.transaction.type === TransactionType.TRANSFER;

    if (!this.isTypeTransfer) this.getTransactionCategory();
  }

  getConfirmation = (text: string) => confirm(text);

  deleteTransaction() {
    const shouldDelete = this.getConfirmation(
      'Are you sure you want to delete this transaction!'
    );
    if (!shouldDelete) return;

    this.transactionService.deleteTransaction(this.transaction.key as string);

    this.router.navigate(['/home']);
  }

  editTransaction() {
    this.router.navigateByUrl('/new-transaction', {
      state: {
        transaction: JSON.stringify(this.transaction),
      },
    });
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
      return this.showCategory();
    }
    return this.transaction.desc;
  }

  showCategory() {
    return this.isTypeTransfer ? 'Transfer' : this.transactionCategory.title;
  }

  showTransactionType = () => this.transactionTypes[this.transaction.type];

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
