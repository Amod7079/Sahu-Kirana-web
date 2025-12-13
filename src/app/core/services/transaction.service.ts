import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction, TransactionType } from '../models/transaction.model';
import { CustomerService } from './customer.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly TRANSACTIONS_KEY = 'kirana_udhar_transactions';
  private transactions: Transaction[] = [];

  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    const storedTransactions = localStorage.getItem(this.TRANSACTIONS_KEY);
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
  }

  private saveTransactions(): void {
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(this.transactions));
  }

  getTransactionsByCustomer(customerId: string): Observable<Transaction[]> {
    const customerTransactions = this.transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return of(customerTransactions);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return of(this.transactions);
  }



  addTransaction(
    customerId: string,
    amount: number,
    type: TransactionType,
    description?: string
  ): Observable<Transaction> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    // In a real app, this would be handled by the backend
    const customer = this.transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const previousBalance = customer?.balanceAfter || 0;
    let newBalance = previousBalance;

    if (type === TransactionType.CREDIT) {
      newBalance = previousBalance + amount;
    } else if (type === TransactionType.PAYMENT) {
      newBalance = previousBalance - amount;
    } else if (type === TransactionType.ADJUSTMENT) {
      newBalance = amount; // Directly set the balance to the amount for adjustments
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      customerId,
      userId: currentUser.id || 'unknown',
      amount,
      type,
      description,
      date: new Date(),
      balanceAfter: newBalance,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.transactions.push(newTransaction);
    this.saveTransactions();

    // Update customer's balance
    this.updateCustomerBalance(customerId);

    return of(newTransaction);
  }

  private updateCustomerBalance(customerId: string): void {
    const customerTransactions = this.transactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (customerTransactions.length === 0) return;

    const latestTransaction = customerTransactions[customerTransactions.length - 1];

    // Update customer's balance in the customer service
    this.customerService.getCustomerById(customerId).subscribe(customer => {
      if (customer) {
        const totalCredit = this.calculateTotal(customerId, TransactionType.CREDIT);
        const totalPaid = this.calculateTotal(customerId, TransactionType.PAYMENT);

        this.customerService.updateCustomer(customerId, {
          totalCredit,
          totalPaid,
          balance: latestTransaction.balanceAfter,
          lastTransactionDate: latestTransaction.date
        }).subscribe();
      }
    });
  }

  private calculateTotal(customerId: string, type: TransactionType): number {
    return this.transactions
      .filter(t => t.customerId === customerId && t.type === type)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  deleteTransaction(transactionId: string): Observable<boolean> {
    const transaction = this.transactions.find(t => t.id === transactionId);
    if (!transaction) return of(false);

    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== transactionId);
    const wasDeleted = this.transactions.length < initialLength;

    if (wasDeleted) {
      this.saveTransactions();
      // Update customer's balance after deletion
      this.updateCustomerBalance(transaction.customerId);
    }

    return of(wasDeleted);
  }
}
