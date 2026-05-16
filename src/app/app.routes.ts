import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { animation: 'DashboardPage' }
      },
      {
        path: 'customers',
        loadComponent: () => import('./modules/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent),
        data: { animation: 'CustomersPage' }
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./modules/customers/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent),
        data: { animation: 'CustomerDetailsPage' }
      },
      {
        path: 'reports',
        loadComponent: () => import('./modules/reports/reports.component').then(m => m.ReportsComponent),
        data: { animation: 'ReportsPage' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent),
        data: { animation: 'SettingsPage' }
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./modules/legal/legal.component').then(m => m.LegalComponent),
        data: { animation: 'PrivacyPage' }
      },
      {
        path: 'terms-of-service',
        loadComponent: () => import('./modules/legal/legal.component').then(m => m.LegalComponent),
        data: { animation: 'TermsPage' }
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
