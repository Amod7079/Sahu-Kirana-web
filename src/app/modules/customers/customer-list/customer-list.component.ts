import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { AddCustomerDialogComponent } from '../add-customer-dialog/add-customer-dialog.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  displayedColumns: string[] = ['name', 'phone', 'balance', 'whatsapp', 'actions'];

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomer(customer: Customer): void {
    if (!customer.id) return;

    if (confirm(`Are you sure you want to delete ${customer.name}? This cannot be undone.`)) {
      this.customerService.deleteCustomer(customer.id).subscribe(success => {
        if (success) {
          this.loadCustomers();
        }
      });
    }
  }

  openWhatsApp(customer: Customer): void {
    if (!customer.phone) return;

    // Basic cleaning of phone number
    let phone = customer.phone.replace(/\D/g, '');

    // Default to India +91 if length is 10
    if (phone.length === 10) {
      phone = '91' + phone;
    }

    const message = `Hello ${customer.name}, your current balance is ₹${customer.balance}. Please pay soon.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  }

  viewCustomer(customerId: string): void {
    if (customerId) {
      this.router.navigate(['/customers', customerId]);
    }
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Map form result to Customer object (excluding logic handled by service)
        const newCustomer: any = {
          name: result.name,
          phone: result.phoneNumber,
          email: result.email,
          address: result.address
        };

        this.customerService.addCustomer(newCustomer).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }
}

