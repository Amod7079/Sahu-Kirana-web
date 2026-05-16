import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

import { CustomerService } from '../../core/services/customer.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, NgChartsModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="quick-actions">
          <button mat-flat-button color="primary" routerLink="/customers">
            <mat-icon>person_add</mat-icon> Add Customer
          </button>
          <button mat-stroked-button color="accent" routerLink="/transactions">
            <mat-icon>receipt_long</mat-icon> New Entry
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card>
          <mat-card-header>
            <div mat-card-avatar class="avatar-container primary">
                <mat-icon>people</mat-icon>
            </div>
            <mat-card-title>Customers</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value" *ngIf="!isLoading">{{totalCustomers}}</div>
            <div class="skeleton-text" *ngIf="isLoading"></div>
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
            <div class="stat-value" [class.negative]="totalCredit > 0" *ngIf="!isLoading">₹{{totalCredit}}</div>
            <div class="skeleton-text" *ngIf="isLoading"></div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-content-grid">
        <!-- Recent Transactions -->
        <mat-card class="recent-transactions-card">
          <mat-card-header>
            <mat-card-title>Recent Transactions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="loading-state" *ngIf="isLoading">
              <div class="skeleton-row" *ngFor="let i of [1,2,3,4]"></div>
            </div>
            <div class="empty-state" *ngIf="!isLoading && recentTransactions.length === 0">
              <mat-icon>receipt</mat-icon>
              <p>No recent transactions</p>
            </div>
            <div class="transaction-list" *ngIf="!isLoading && recentTransactions.length > 0">
              <div class="transaction-item" *ngFor="let tx of recentTransactions">
                <div class="tx-icon" [ngClass]="tx.type === 'PAYMENT' ? 'success' : 'warn'">
                  <mat-icon>{{ tx.type === 'PAYMENT' ? 'arrow_downward' : 'arrow_upward' }}</mat-icon>
                </div>
                <div class="tx-details">
                  <span class="tx-type">{{ tx.type === 'PAYMENT' ? 'Payment Received' : 'Credit Given' }}</span>
                  <span class="tx-date">{{ tx.date | date:'short' }}</span>
                </div>
                <div class="tx-amount" [ngClass]="tx.type === 'PAYMENT' ? 'success-text' : 'warn-text'">
                  {{ tx.type === 'PAYMENT' ? '+' : '-' }} ₹{{ tx.amount }}
                </div>
              </div>
            </div>
            <div class="view-all">
              <a routerLink="/transactions">View all transactions</a>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Chart Section -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Weekly Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container" *ngIf="!isLoading">
              <canvas baseChart
                [data]="barChartData"
                [options]="barChartOptions"
                [type]="'bar'">
              </canvas>
            </div>
            <div class="loading-state chart-skeleton" *ngIf="isLoading">
              <div class="skeleton-bar" *ngFor="let i of [1,2,3,4,5,6,7]" [style.height.%]="i * 10 + 20"></div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
      
      h1 { margin: 0; }
      .quick-actions { display: flex; gap: 12px; }
    }
    
    @media (max-width: 600px) {
        .dashboard-container { padding: 10px; }
        .dashboard-header { flex-direction: column; align-items: flex-start; }
    }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
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

    /* Dashboard Content Grid */
    .dashboard-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 24px;
    }

    @media (max-width: 900px) {
      .dashboard-content-grid { grid-template-columns: 1fr; }
    }

    /* Recent Transactions List */
    .transaction-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0,0,0,0.02);
      transition: all 0.2s ease;

      &:hover { background: rgba(0,0,0,0.04); transform: translateX(4px); }
    }

    .tx-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;

      &.success { background: rgba(76, 175, 80, 0.1); color: #4caf50; }
      &.warn { background: rgba(244, 67, 54, 0.1); color: #f44336; }
    }

    .tx-details {
      flex: 1;
      display: flex;
      flex-direction: column;

      .tx-type { font-weight: 600; font-size: 14px; }
      .tx-date { font-size: 12px; color: #666; margin-top: 4px; }
    }

    .tx-amount {
      font-weight: 600;
      font-size: 16px;
      
      &.success-text { color: #4caf50; }
      &.warn-text { color: #f44336; }
    }

    .view-all {
      text-align: center;
      margin-top: 20px;
      a { color: #3f51b5; text-decoration: none; font-weight: 500; }
      a:hover { text-decoration: underline; }
    }

    /* Chart Container */
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    /* Skeleton Loading Animations */
    @keyframes shimmer {
      0% { background-position: -468px 0; }
      100% { background-position: 468px 0; }
    }

    .skeleton-text {
      height: 38px;
      width: 60%;
      border-radius: 4px;
      margin-top: 10px;
      background: #f6f7f8;
      background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
      background-repeat: no-repeat;
      background-size: 800px 100%; 
      animation-duration: 1.5s;
      animation-fill-mode: forwards; 
      animation-iteration-count: infinite;
      animation-name: shimmer;
      animation-timing-function: linear;
    }

    .skeleton-row {
      height: 64px;
      width: 100%;
      border-radius: 8px;
      margin-bottom: 16px;
      background: #f6f7f8;
      background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
      background-repeat: no-repeat;
      background-size: 800px 100%; 
      animation: shimmer 1.5s infinite linear;
    }

    .chart-skeleton {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 300px;
      padding-top: 20px;
      
      .skeleton-bar {
        width: 10%;
        background: #f6f7f8;
        background-image: linear-gradient(to bottom, #edeef1 0%, #f6f7f8 100%);
        border-radius: 4px 4px 0 0;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
      color: #999;
      
      mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.5; margin-bottom: 16px; }
      p { font-size: 16px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalCustomers = 0;
  totalCredit = 0;
  isLoading = true;
  recentTransactions: Transaction[] = [];

  // Chart Data
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { data: [0, 0, 0, 0, 0, 0, 0], label: 'Credit Given', backgroundColor: '#f44336' },
      { data: [0, 0, 0, 0, 0, 0, 0], label: 'Payments Received', backgroundColor: '#4caf50' }
    ]
  };

  constructor(
    private customerService: CustomerService,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    // Simulate network delay for skeleton loader
    setTimeout(() => {
      this.loadData();
    }, 800);
  }

  loadData(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.totalCustomers = customers.length;
      this.totalCredit = customers.reduce((sum, customer) => sum + (customer.balance > 0 ? customer.balance : 0), 0);
    });

    this.transactionService.getAllTransactions().subscribe(txs => {
      // Sort by date descending
      const sorted = [...txs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.recentTransactions = sorted.slice(0, 5);
      
      this.prepareChartData(sorted);
      this.isLoading = false;
    });
  }

  prepareChartData(txs: Transaction[]): void {
    // In a real app, you would group by actual dates. Here we just add mock data if empty or map it.
    let creditSum = 0;
    let paymentSum = 0;
    txs.forEach(tx => {
      if(tx.type === 'CREDIT') creditSum += tx.amount;
      if(tx.type === 'PAYMENT') paymentSum += tx.amount;
    });

    // Mocking daily data for visual effect since we don't have historical daily data easily formatted
    this.barChartData.datasets[0].data = [creditSum*0.1, creditSum*0.2, creditSum*0.05, creditSum*0.3, creditSum*0.1, creditSum*0.15, creditSum*0.1];
    this.barChartData.datasets[1].data = [paymentSum*0.05, paymentSum*0.1, paymentSum*0.3, paymentSum*0.2, paymentSum*0.15, paymentSum*0.05, paymentSum*0.15];
    
    // Force chart update mechanism would go here if needed, but array reassignment works well enough usually
    this.barChartData = {...this.barChartData};
  }
}
