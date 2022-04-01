import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from './modal/modal.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './components/main/main.component';
import { TransactionItemComponent } from './components/transactions/transaction-item/transaction-item.component';
import { TransactionsContainerComponent } from './components/transactions/transactions-container/transactions-container.component';
import { FabComponent } from './components/fab/fab.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { FooterItemComponent } from './components/footer/footer-item/footer-item.component';
import { DividerComponent } from './components/divider/divider.component';
import { WalletItemComponent } from './components/wallet/wallet-item/wallet-item.component';
import { WalletHeaderComponent } from './components/wallet/wallet-header/wallet-header.component';
import { NewTransactionComponent } from './components/transactions/new-transaction/new-transaction.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { WalletsComponent } from './components/wallets/wallets.component';
import { TodolistIconComponent } from './components/todolist-icon/todolist-icon.component';
import { AddWalletComponent } from './components/wallet/add-wallet/add-wallet.component';
import { AddCategoryComponent } from './components/categories/add-category/add-category.component';
import { CategoriesIconComponent } from './components/categories-icon/categories-icon.component';
import { ShowTransactionComponent } from './components/transactions/show-transaction/show-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    TransactionItemComponent,
    TransactionsContainerComponent,
    FabComponent,
    CalendarComponent,
    StatisticComponent,
    WalletComponent,
    FooterItemComponent,
    DividerComponent,
    WalletItemComponent,
    WalletHeaderComponent,
    NewTransactionComponent,
    CategoriesComponent,
    WalletsComponent,
    TodolistIconComponent,
    AddWalletComponent,
    AddCategoryComponent,
    CategoriesIconComponent,
    ShowTransactionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
