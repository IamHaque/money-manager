import { Component, OnInit } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showHeader: boolean;
  accountBalance: number = 0;
  username: string = 'Anonymous';

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showHeader = event.url === '/home';
      }
    });

    this.username = this.accountService.getUsername();
    this.accountBalance = this.accountService.getAccountBalance();
  }
}
