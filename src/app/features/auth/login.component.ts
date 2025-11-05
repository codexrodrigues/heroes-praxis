import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <div style="display:flex; justify-content:center; align-items:center; min-height: 70vh;">
    <mat-card style="width: 360px;">
      <h2>Entrar</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Usuário</mat-label>
          <input matInput name="username" [(ngModel)]="username" required />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%;">
          <mat-label>Senha</mat-label>
          <input matInput type="password" name="password" [(ngModel)]="password" required />
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" style="width:100%;">Entrar</button>
      </form>
      <div style="margin-top:8px; font-size:12px; opacity:.7;">
        Dica dev: admin / changeMe!
      </div>
    </mat-card>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  username = '';
  password = '';
  constructor(private auth: AuthService) {}
  submit() { this.auth.login({ username: this.username, password: this.password }); }
}

