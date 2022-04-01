import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerItems = [
    {
      title: 'Transaction',
      active: 'active',
      icon: 'fa-arrow-right-arrow-left',
      link: '/home',
    },
    {
      title: 'Calendar',
      active: '',
      icon: 'fa-calendar-days',
      link: '/calendar',
    },
    {
      title: 'Statistic',
      active: '',
      icon: 'fa-chart-pie',
      link: '/statistic',
    },
    {
      title: 'Wallet',
      active: '',
      icon: 'fa-wallet',
      link: '/wallet',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
