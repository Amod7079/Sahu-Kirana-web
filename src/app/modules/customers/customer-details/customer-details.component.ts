import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { Customer } from '../../../core/models/customer.model';
import { Transaction, TransactionType } from '../../../core/models/transaction.model';
import { CustomerService } from '../../../core/services/customer.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { AddTransactionDialogComponent } from '../../transactions/add-transaction-dialog/add-transaction-dialog.component';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent implements OnInit {
  customer: Customer | undefined;
  transactions: Transaction[] = [];
  displayedColumns: string[] = ['date', 'type', 'description', 'amount', 'balance'];
  TransactionType = TransactionType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.loadCustomerData(customerId);
    } else {
      this.router.navigate(['/customers']);
    }
  }

  loadCustomerData(customerId: string): void {
    this.customerService.getCustomerById(customerId).subscribe(customer => {
      this.customer = customer;
      if (customer) {
        this.loadTransactions(customer.id!);
      }
    });
  }

  loadTransactions(customerId: string): void {
    this.transactionService.getTransactionsByCustomer(customerId).subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  openAddTransactionDialog(): void {
    if (!this.customer) return;

    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      width: '95%',
      maxWidth: '400px',
      data: { customerName: this.customer.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.addTransaction(
          this.customer!.id!,
          result.amount,
          result.type,
          result.description
        ).subscribe(() => {
          this.loadCustomerData(this.customer!.id!);
        });
      }
    });
  }
}
