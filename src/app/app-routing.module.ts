import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MainComponent } from './components/main/main.component';
import { NewTransactionComponent } from './components/transactions/new-transaction/new-transaction.component';
import { StatisticComponent } from './components/statistic/statistic.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { ShowTransactionComponent } from './components/transactions/show-transaction/show-transaction.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    pathMatch: 'full',
    component: MainComponent,
  },
  {
    path: 'calendar',
    pathMatch: 'full',
    component: CalendarComponent,
  },
  {
    path: 'statistic',
    pathMatch: 'full',
    component: StatisticComponent,
  },
  {
    path: 'wallet',
    pathMatch: 'full',
    component: WalletComponent,
  },
  {
    path: 'new-transaction',
    pathMatch: 'full',
    component: NewTransactionComponent,
  },
  {
    path: 'show-transaction',
    pathMatch: 'full',
    component: ShowTransactionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
