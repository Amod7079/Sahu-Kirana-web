import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {}

  sendPaymentReminder(customer: Customer, amount: number): Observable<boolean> {
    // In a real app, this would integrate with an SMS/Email service
    console.log(`Sending payment reminder to ${customer.name} (${customer.phone}) for amount: ₹${amount}`);
    return of(true);
  }

  sendReceipt(customer: Customer, amount: number, transactionId: string): Observable<boolean> {
    // In a real app, this would send a receipt via SMS/Email
    console.log(`Sending receipt to ${customer.name} (${customer.phone || customer.email}) for payment of ₹${amount}`);
    return of(true);
  }

  sendLowBalanceAlert(customer: Customer): Observable<boolean> {
    // In a real app, this would send an alert to the shop owner
    console.log(`Alert: Customer ${customer.name} has a high credit balance of ₹${customer.balance}`);
    return of(true);
  }
}
