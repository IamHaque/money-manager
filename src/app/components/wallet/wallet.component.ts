import { Component, OnInit } from '@angular/core';
import { Wallet } from 'src/app/models/wallet.model';
import { CommonService } from 'src/app/services/common.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  wallets: Wallet[];
  showAddWallet = false;

  constructor(private walletService: WalletService) {}

  ngOnInit(): void {
    this.wallets = this.walletService.getWallets();
  }

  toggleAddWallet() {
    this.showAddWallet = !this.showAddWallet;
  }

  handleAddWalletEvent(event: string) {
    if (event === 'back') this.toggleAddWallet();
  }

  getWalletsToManageCount = () => this.wallets.length.toString();
}
