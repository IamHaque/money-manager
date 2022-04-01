import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, CategoryType } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  @Output() clickEvent = new EventEmitter<any>();
  @Input() selectedCategoryIndex: number = -1;
  @Input() categoryType: CategoryType = CategoryType.EXPENSE;

  showAddCategory: boolean;
  canEditCategories: boolean;
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.showAddCategory = false;
    this.canEditCategories = false;
    this.getCategoriesFromService();
  }

  getCategoriesFromService() {
    this.categories = this.categoryService.getCategoriesByType(
      this.categoryType
    );

    if (!this.hasCategories()) this.canEditCategories = true;
  }

  addCategoryOrShowSettings() {
    if (this.canEditCategories) this.showAddCategory = true;
    else this.toggleSettings();
  }

  getIconClass(index: number) {
    if (this.canEditCategories) return 'fa-trash-can';

    return this.selectedCategoryIndex === index
      ? 'fa-circle-check'
      : 'fa-circle';
  }

  toggleSettings() {
    this.canEditCategories = !this.canEditCategories;
  }

  toggleAddCategory() {
    this.showAddCategory = !this.showAddCategory;
  }

  hasCategories = () => this.categories.length > 0;

  selectCategory(index: number) {
    if (this.canEditCategories) return;
    if (index < 0 || index >= this.categories.length) return;

    this.selectedCategoryIndex = index;
    this.triggerClickEvent([
      index,
      this.categories[index].title,
      this.categories[index].key,
    ]);
  }

  checkAndDelete(index: number) {
    if (index < 0 || index >= this.categories.length) return;

    this.categoryService.removeCategory(this.categories[index].key);
    this.getCategoriesFromService();
  }

  triggerClickEvent(data: any) {
    if (this.canEditCategories && this.categories.length > 0) {
      this.toggleSettings();
    } else {
      this.clickEvent.emit(data);
    }
  }

  handleAddCategoryEvent(event: string) {
    if (event === 'back') {
      this.toggleAddCategory();
      this.getCategoriesFromService();
    }
  }
}
