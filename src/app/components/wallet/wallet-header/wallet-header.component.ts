import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-header',
  templateUrl: './wallet-header.component.html',
  styleUrls: ['./wallet-header.component.scss'],
})
export class WalletHeaderComponent implements OnInit {
  @Input() title = '';
  @Input() toManage = '';

  constructor() {}

  ngOnInit(): void {}
}
