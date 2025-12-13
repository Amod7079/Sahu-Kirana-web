import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly CUSTOMERS_KEY = 'kirana_udhar_customers';
  private customers: Customer[] = [];

  constructor(private authService: AuthService) {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    const storedCustomers = localStorage.getItem(this.CUSTOMERS_KEY);
    if (storedCustomers) {
      this.customers = JSON.parse(storedCustomers);
    }
  }



  private saveCustomers(): void {
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(this.customers));
  }

  getCustomers(): Observable<Customer[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return of([]);

    const userCustomers = this.customers.filter(c => c.userId === currentUser.id);
    return of(userCustomers);
  }

  getCustomerById(id: string): Observable<Customer | undefined> {
    const customer = this.customers.find(c => c.id === id);
    return of(customer);
  }

  addCustomer(customer: Omit<Customer, 'id' | 'balance' | 'totalCredit' | 'totalPaid' | 'createdAt' | 'updatedAt' | 'lastTransactionDate'>): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      totalCredit: 0,
      totalPaid: 0,
      balance: 0,
      userId: this.authService.getCurrentUser()?.id || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.customers.push(newCustomer);
    this.saveCustomers();
    return of(newCustomer);
  }

  updateCustomer(id: string, updates: Partial<Customer>): Observable<Customer | null> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) return of(null);

    const updatedCustomer = {
      ...this.customers[index],
      ...updates,
      updatedAt: new Date()
    };

    this.customers[index] = updatedCustomer;
    this.saveCustomers();
    return of(updatedCustomer);
  }

  deleteCustomer(id: string): Observable<boolean> {
    const initialLength = this.customers.length;
    this.customers = this.customers.filter(c => c.id !== id);
    const wasDeleted = this.customers.length < initialLength;

    if (wasDeleted) {
      this.saveCustomers();
    }

    return of(wasDeleted);
  }
}
