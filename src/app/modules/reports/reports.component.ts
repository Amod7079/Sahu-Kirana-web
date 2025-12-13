import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../core/services/transaction.service';
import { CustomerService } from '../../core/services/customer.service';
import { Transaction, TransactionType } from '../../core/models/transaction.model';
import { Customer } from '../../core/models/customer.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [DatePipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  todayCredit = 0;
  todayCollected = 0;
  topDebtors: Customer[] = [];

  constructor(
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.calculateStats();
    this.loadTopDebtors();
  }

  calculateStats(): void {
    this.transactionService.getAllTransactions().subscribe(transactions => {
      const today = new Date();

      // Calculate Today's Stats
      this.todayCredit = transactions
        .filter(t => this.isSameDate(new Date(t.date), today) && t.type === TransactionType.CREDIT)
        .reduce((sum, t) => sum + t.amount, 0);

      this.todayCollected = transactions
        .filter(t => this.isSameDate(new Date(t.date), today) && t.type === TransactionType.PAYMENT)
        .reduce((sum, t) => sum + t.amount, 0);
    });
  }

  loadTopDebtors(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.topDebtors = customers
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5);
    });
  }

  private isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}
