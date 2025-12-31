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
import { TransactionService } from '../../../core/services/transaction.service';
import { SettingsService } from '../../../core/services/settings.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  providers: [DatePipe],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  displayedColumns: string[] = ['name', 'phone', 'balance', 'whatsapp', 'actions'];

  constructor(
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private settingsService: SettingsService,
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

  downloadPdf(customer: Customer): void {
    if (!customer.id) return;

    this.transactionService.getTransactionsByCustomer(customer.id).subscribe(transactions => {
      const doc = new jsPDF();
      const settings = this.settingsService.getShopSettings();
      const shopName = settings.shopName || 'Shivnarayan Sah Kirana Shop';
      const shopAddress = settings.address || '';
      const shopPhone = settings.phone || '';

      // Header
      doc.setFontSize(18);
      doc.text(shopName, 105, 15, { align: 'center' });

      doc.setFontSize(10);
      doc.text(shopAddress, 105, 22, { align: 'center' });
      doc.text(`Phone: ${shopPhone}`, 105, 27, { align: 'center' });

      doc.line(10, 30, 200, 30);

      // Customer Details
      doc.setFontSize(12);
      doc.text('Statement of Account', 14, 40);

      doc.setFontSize(10);
      doc.text(`Customer Name: ${customer.name}`, 14, 48);
      doc.text(`Phone: ${customer.phone}`, 14, 53);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 48);

      // Transactions Table
      const tableData = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.description || '',
        `Rs. ${t.amount}`
      ]);

      autoTable(doc, {
        head: [['Date', 'Type', 'Description', 'Amount']],
        body: tableData,
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [63, 81, 181] }
      });

      // Footer / Summary
      const finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.text(`Total Credit: Rs. ${customer.totalCredit}`, 14, finalY);
      doc.text(`Total Paid: Rs. ${customer.totalPaid}`, 14, finalY + 5);

      doc.setFontSize(12);
      doc.setTextColor(customer.balance > 0 ? 255 : 0, 0, 0); // Red if balance > 0
      doc.text(`Current Balance: Rs. ${customer.balance}`, 14, finalY + 12);

      // Signature
      const img = new Image();
      img.src = 'assets/signature.jpg';
      img.onload = () => {
        doc.addImage(img, 'JPEG', 140, finalY + 5, 40, 20);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Authorized Signatory', 140, finalY + 30);
        doc.save(`${customer.name.replace(/\s+/g, '_')}_Statement.pdf`);
      };

      img.onerror = () => {
        doc.save(`${customer.name.replace(/\s+/g, '_')}_Statement.pdf`);
      };
    });
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '95%',
      maxWidth: '400px'
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

