import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/modal/modal.service';
import { CategoryType } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  @Input() categoryType: CategoryType = CategoryType.EXPENSE;
  @Output() clickEvent = new EventEmitter<string>();

  form: FormGroup;

  icons: string[];
  selectedIcon: number;

  colors: string[];
  selectedColor: number;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private commonService: CommonService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.selectedIcon = 1;
    this.selectedColor = 0;

    this.icons = this.commonService.getCategoryIcons();
    this.colors = this.commonService.getColors();

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      color: [this.selectedColor, [Validators.required]],
      icon: [this.selectedIcon, [Validators.required]],
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

    this.categoryService.addNewCategory({
      title: formValue.name,
      icon: this.icons[formValue.icon],
      color: this.colors[formValue.color],
      type: this.categoryType,
    });

    this.triggerClickEvent('back');
  }
}
