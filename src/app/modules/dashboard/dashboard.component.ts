import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <mat-card>
          <mat-card-header>
            <div mat-card-avatar class="avatar-container primary">
                <mat-icon>people</mat-icon>
            </div>
            <mat-card-title>Customers</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{totalCustomers}}</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card>
          <mat-card-header>
            <div mat-card-avatar class="avatar-container warn">
                <mat-icon>money_off</mat-icon>
            </div>
            <mat-card-title>Total Credit (Udhar)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value" [class.negative]="totalCredit > 0">₹{{totalCredit}}</div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
    .stat-value { font-size: 32px; font-weight: 500; margin-top: 10px; }
    .stat-value.negative { color: #f44336; }
    
    .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
    }
    .avatar-container.primary { background-color: rgba(63, 81, 181, 0.1); color: #3f51b5; }
    .avatar-container.warn { background-color: rgba(244, 67, 54, 0.1); color: #f44336; }
  `]
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalCredit = 0;

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.totalCustomers = customers.length;
      this.totalCredit = customers.reduce((sum, customer) => sum + (customer.balance > 0 ? customer.balance : 0), 0);
    });
  }
}
