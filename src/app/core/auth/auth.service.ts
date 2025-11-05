import { Injectable, computed, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type LoginRequest = { username: string; password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionChecked = signal(false);
  private _loggedIn = signal(false);
  readonly loggedIn = computed(() => this._loggedIn());

  constructor(private http: HttpClient, private router: Router) {
    // Optional session check (no redirect; login is optional for public endpoints)
    this.refreshSession();
  }

  login(payload: LoginRequest) {
    return this.http.post<void>('/auth/login', payload, { observe: 'response' }).subscribe({
      next: () => { this._loggedIn.set(true); this.router.navigateByUrl('/'); },
      error: () => { this._loggedIn.set(false); }
    });
  }

  logout() {
    this.http.post<void>('/auth/logout', {}).subscribe({
      next: () => { this._loggedIn.set(false); this.router.navigateByUrl('/login'); },
      error: () => { this._loggedIn.set(false); this.router.navigateByUrl('/login'); }
    });
  }

  refreshSession() {
    this.http.get('/auth/session', { observe: 'response' }).subscribe({
      next: (res) => { this._loggedIn.set(res.status === 204 || res.status === 200); this.sessionChecked.set(true); },
      error: () => { this._loggedIn.set(false); this.sessionChecked.set(true); },
    });
  }
}
