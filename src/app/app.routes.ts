import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard'; // Ensure this import path is correct

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'auth/login',
        loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'customers',
        loadComponent: () => import('./modules/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent),
        canActivate: [authGuard]
    },
    {
        path: 'customers/:id',
        loadComponent: () => import('./modules/customers/customer-details/customer-details.component').then(m => m.CustomerDetailsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'reports',
        loadComponent: () => import('./modules/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: 'dashboard' }
];
