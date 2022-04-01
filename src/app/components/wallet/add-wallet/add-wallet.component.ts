import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/modal/modal.service';
import { CommonService } from 'src/app/services/common.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit {
  @Output() clickEvent = new EventEmitter<string>();

  form: FormGroup;

  icons: string[];
  selectedIcon: number;

  colors: string[];
  selectedColor: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private walletService: WalletService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.selectedIcon = 0;
    this.selectedColor = 0;

    this.icons = this.commonService.getWalletIcons();
    this.colors = this.commonService.getColors();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      color: [this.selectedColor, [Validators.required]],
      icon: [this.selectedIcon, [Validators.required]],
      balance: ['', [Validators.required, Validators.pattern(/^[0-9.]*$/)]],
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string, index: number) {
    switch (id) {
      case 'icon-modal':
        this.selectedIcon = index;
        this.form.controls['icon'].setValue(this.selectedIcon);
        break;
      case 'color-modal':
        this.selectedColor = index;
        this.form.controls['color'].setValue(this.selectedColor);
        break;
    }

    this.modalService.close(id);
  }

  triggerClickEvent(data: string) {
    this.clickEvent.emit(data);
  }

  submitForm() {
    if (this.form.invalid) {
      alert('Fill all values');
      return;
    }

    const formValue = this.form.value;

    this.walletService.addNewWallet({
      name: formValue.name,
      balance: parseFloat(formValue.balance),
      icon: this.icons[formValue.icon],
      color: this.colors[formValue.color],
      primary: false,
    });

    this.triggerClickEvent('back');
  }
}
