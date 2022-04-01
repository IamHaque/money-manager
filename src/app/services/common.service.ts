import { Injectable } from '@angular/core';
import { ColorsData } from '../data/colors.data';
import { CategoriesIconData, WalletsIconData } from '../data/icons.data';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _category_icons: string[] = [];
  private _wallet_icons: string[] = [];
  private _colors: string[] = [];

  constructor() {
    this._category_icons = CategoriesIconData;
    this._wallet_icons = WalletsIconData;
    this._colors = ColorsData;
  }

  setItemToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify({ value }));
  }

  getCategoryIcons = () => [...this._category_icons];
  getWalletIcons = () => [...this._wallet_icons];
  getColors = () => [...this._colors];

  getItemFromLocalStorage<T>(key: string): T | null;
  getItemFromLocalStorage<T>(key: string, otherwise: T): T;
  getItemFromLocalStorage<T>(key: string, otherwise?: T): T | null {
    const data: string | null = localStorage.getItem(key);
    if (data !== null) return JSON.parse(data).value;
    if (otherwise) return otherwise;
    return null;
  }

  getID() {
    let ID = String.fromCharCode(Math.floor(Math.random() * 25 + 65));
    do {
      let ASCIICode = Math.floor(Math.random() * 42 + 48);
      if (ASCIICode < 58 || ASCIICode > 64) {
        ID += String.fromCharCode(ASCIICode);
      }
    } while (ID.length < 32);
    return ID;
  }
}
