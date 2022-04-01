import { Injectable } from '@angular/core';
import { CategoriesData } from '../data/categories.data';
import { Category, CategoryType } from '../models/category.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private _categories: Category[];
  private _LS_KEY = 'categories';

  constructor(private commonService: CommonService) {
    const localCategories: Category[] | null =
      this.commonService.getItemFromLocalStorage<Category[]>(this._LS_KEY);

    if (localCategories) this._categories = localCategories;
    else this._categories = CategoriesData;
  }

  getCategoriesByType(type: CategoryType) {
    return this._categories.filter((category) => category.type === type);
  }

  getCategoryByKey = (key: string) =>
    this._categories.find((category) => category.key === key);

  removeCategory(key: string | undefined) {
    if (!key) return;

    this._categories = this._categories.filter(
      (category) => category.key !== key
    );
  }

  addNewCategory(c: Category) {
    if (!c) return;

    const key = this.commonService.getID();
    this._categories.push({ ...c, key });

    this.commonService.setItemToLocalStorage(this._LS_KEY, this._categories);
  }
}
