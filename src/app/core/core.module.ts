import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { CustomerService } from './services/customer.service';
import { TransactionService } from './services/transaction.service';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    CustomerService,
    TransactionService,
    NotificationService
  ]
})
export class CoreModule { }
