import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet-item',
  templateUrl: './wallet-item.component.html',
  styleUrls: ['./wallet-item.component.scss'],
})
export class WalletItemComponent implements OnInit {
  @Input() icon = '';
  @Input() title = '';
  @Input() color = '';
  @Input() balance = 0;

  constructor() {}

  ngOnInit(): void {}
}
