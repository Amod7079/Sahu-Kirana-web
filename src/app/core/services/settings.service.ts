import { Injectable } from '@angular/core';

export interface ShopSettings {
    shopName: string;
    ownerName: string;
    phone: string;
    address: string;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly SETTINGS_KEY = 'shop_settings';
    private readonly CUSTOMERS_KEY = 'customers';
    private readonly TRANSACTIONS_KEY = 'transactions';

    constructor() { }

    getShopSettings(): ShopSettings {
        const data = localStorage.getItem(this.SETTINGS_KEY);
        return data ? JSON.parse(data) : {
            shopName: 'My Kirana Shop',
            ownerName: '',
            phone: '',
            address: ''
        };
    }

    saveShopSettings(settings: ShopSettings): void {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }

    clearApplicationData(): void {
        localStorage.removeItem(this.CUSTOMERS_KEY);
        localStorage.removeItem(this.TRANSACTIONS_KEY);
    }
}
