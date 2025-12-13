import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private readonly USER_KEY = 'kirana_udhar_user';

  constructor(private router: Router) {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: { email: string; password: string }): Observable<boolean> {
    // In a real app, this would be an HTTP request to your backend
    // For demo purposes, we'll simulate a successful login
    const user: User = {
      id: '1',
      name: 'Kirana Shop Owner',
      email: credentials.email,
      phone: '+919876543210',
      shopName: 'Smart Kirana Store',
      address: '123 Main Bazaar, City',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.currentUserSubject.next(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    return of(true);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
