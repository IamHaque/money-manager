import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wallet } from 'src/app/models/wallet.model';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {
  @Output() clickEvent = new EventEmitter<any>();
  @Input() selectedWalletIndex: number = -1;

  wallets: Wallet[] = [];

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.wallets = this.walletService.getWallets();
  }

  selectWallet(index: number) {
    this.selectedWalletIndex = index;
    this.triggerClickEvent([
      index,
      this.wallets[index].name,
      this.wallets[index].balance,
      this.wallets[index].key,
    ]);
  }

  triggerClickEvent(data: any) {
    this.clickEvent.emit(data);
  }
}
