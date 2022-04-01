import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, CategoryType } from 'src/app/models/category.model';
import { Transaction, TransactionType } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { WalletService } from 'src/app/services/wallet.service';
import * as moment from 'moment';
import { Wallet } from 'src/app/models/wallet.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss'],
})
export class NewTransactionComponent implements OnInit {
  form: FormGroup;
  date: moment.Moment;

  existingTransaction: Transaction;

  isCategoriesShown: boolean = false;
  selectedCategory: [number, string, string] = [-1, '', ''];

  isWalletsShown: boolean = false;
  selectedWallet: [number, string, number, string] = [-1, '', 0, ''];

  isFromWalletShown: boolean = false;
  selectedFromWallet: [number, string, number, string] = [-1, '', 0, ''];

  activeTabIndex = 1;
  tabs = ['income', 'expense', 'transfer'];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private walletService: WalletService,
    private categoryService: CategoryService,
    private transactionService: TransactionService
  ) {
    const data = this.router.getCurrentNavigation()?.extras?.state?.transaction;
    if (data) this.existingTransaction = JSON.parse(data) as Transaction;
  }

  ngOnInit(): void {
    this.date = moment();

    this.form = this.formBuilder.group({
      date: [this.date.format('YYYY-MM-DD'), [Validators.required]],
      time: [this.date.format('HH:mm'), [Validators.required]],
      desc: [''],
      fromWallet: [''],
      wallet: ['', [Validators.required]],
      amount: [, [Validators.required, Validators.pattern(/^[0-9.]*$/)]],
      category: [''],
      type: [TransactionType.EXPENSE],
    });

    this.getPrimaryWalletDetails();

    if (this.existingTransaction) this.setExistingValues();
  }

  setExistingValues() {
    this.activeTabIndex = this.existingTransaction.type;
    this.form.controls['desc'].setValue(this.existingTransaction.desc);
    this.form.controls['amount'].setValue(this.existingTransaction.amount);
    this.form.controls['type'].setValue(this.existingTransaction.type);

    const dt = moment(this.existingTransaction.date);
    this.form.controls['date'].setValue(dt.format('YYYY-MM-DD').toString());
    this.form.controls['time'].setValue(dt.format('HH:mm').toString());

    const w = this.getWallet(this.existingTransaction.wallet) as Wallet;
    this.selectedWallet = [0, w.name, w.balance, w.key || ''];
    this.setWalletValue();

    const isFrom = this.activeTabIndex === 2 ? 'from' : '';
    if (isFrom) {
      const fw = this.getWallet(
        this.existingTransaction.fromWallet as string
      ) as Wallet;
      this.selectedFromWallet = [0, fw.name, fw.balance, fw.key || ''];
      this.setWalletValue(isFrom);
    } else {
      const c = this.getCategory(this.existingTransaction.category) as Category;
      this.selectedCategory = [0, c.title, c.key || ''];
      this.form.controls['category'].setValue(c.title);
    }
  }

  changeTab(index: number) {
    if (index === this.activeTabIndex) return;

    this.activeTabIndex = index;

    // Reset values
    this.form.controls['type'].setValue(this.getTransactionType());
    this.form.controls['category'].setValue('');
    this.form.controls['fromWallet'].setValue('');
    this.selectedCategory = [-1, '', ''];
    this.selectedFromWallet = [-1, '', 0, ''];
  }

  getWallet = (key: string) => this.walletService.getWalletByKey(key);

  getCategory = (key: string) => this.categoryService.getCategoryByKey(key);

  submitForm() {
    if (this.form.invalid) {
      alert('Fill all values');
      return;
    }

    const formValue = this.form.value;

    let wallet = this.selectedWallet[3];
    let fromWallet = this.selectedFromWallet[3];

    if (this.isTransferTab() && fromWallet === '') return;
    if (!this.isTransferTab() && formValue.category === '') return;
    if (wallet === fromWallet) return;

    let date = moment(formValue.date + ' ' + formValue.time).toDate();

    const data = {
      desc: formValue.desc,
      wallet,
      fromWallet,
      amount: parseFloat(formValue.amount),
      category: this.selectedCategory[2],
      date,
      type: formValue.type,
    };

    if (this.existingTransaction) {
      this.transactionService.modifyTransaction(this.existingTransaction, {
        ...data,
        key: this.existingTransaction.key,
      });
    } else {
      this.transactionService.addNewTransaction(data);
    }

    this.router.navigate(['/home']);
  }

  toggleCategories() {
    this.isCategoriesShown = !this.isCategoriesShown;
  }

  toggleWallets(isFrom?: string) {
    if (isFrom && isFrom === 'from') {
      this.isFromWalletShown = !this.isFromWalletShown;
    } else {
      this.isWalletsShown = !this.isWalletsShown;
    }
  }

  isTransferTab = () => this.activeTabIndex === 2;

  handleCategoryEvent(event: string) {
    if (typeof event === 'object') {
      this.selectedCategory = event;
      this.form.controls['category'].setValue(this.selectedCategory[1]);
    }

    this.toggleCategories();
  }

  handleWalletEvent(event: string, isFrom?: string) {
    if (typeof event === 'object') {
      if (isFrom && isFrom === 'from') {
        this.selectedFromWallet = event;
      } else {
        this.selectedWallet = event;
      }

      this.setWalletValue(isFrom);
    }

    this.toggleWallets(isFrom);
  }

  getPrimaryWalletDetails() {
    this.selectedWallet = this.walletService.getPrimaryWallet();
    this.setWalletValue();
  }

  setWalletValue(isFrom?: string) {
    let val = '';
    if (isFrom && isFrom === 'from') {
      if (this.selectedFromWallet[0] > -1)
        val = `${this.selectedFromWallet[1]} • $ ${this.selectedFromWallet[2]}`;
      this.form.controls['fromWallet'].setValue(val);
    } else {
      if (this.selectedWallet[0] > -1)
        val = `${this.selectedWallet[1]} • $ ${this.selectedWallet[2]}`;
      this.form.controls['wallet'].setValue(val);
    }
  }

  getCategoryType() {
    if (this.activeTabIndex === 0) return CategoryType.INCOME;
    return CategoryType.EXPENSE;
  }

  getTransactionType() {
    if (this.activeTabIndex === 0) return TransactionType.INCOME;
    if (this.activeTabIndex === 1) return TransactionType.EXPENSE;
    return TransactionType.TRANSFER;
  }

  showCategoryValue() {
    return this.selectedCategory[0] > -1
      ? this.selectedCategory[1]
      : 'Select category';
  }

  showWalletValue(isFrom?: string) {
    if (isFrom && isFrom === 'from') {
      if (this.selectedFromWallet[0] > -1)
        return `${this.selectedFromWallet[1]} • $ ${this.selectedFromWallet[2]}`;

      return 'Select wallet';
    }

    if (this.selectedWallet[0] > -1)
      return `${this.selectedWallet[1]} • $ ${this.selectedWallet[2]}`;

    return 'Select wallet';
  }
}
