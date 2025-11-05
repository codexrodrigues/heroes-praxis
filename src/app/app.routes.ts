import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'funcionarios' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'funcionarios', loadComponent: () => import('./features/human-resources/funcionarios/funcionarios').then(m => m.Funcionarios) },
  { path: 'cargos', loadComponent: () => import('./features/human-resources/cargos/cargos').then(m => m.Cargos) },
  { path: 'departamentos', loadComponent: () => import('./features/human-resources/departamentos/departamentos').then(m => m.Departamentos) },
  { path: 'enderecos', loadComponent: () => import('./features/human-resources/enderecos/enderecos').then(m => m.Enderecos) },
  { path: 'dependentes', loadComponent: () => import('./features/human-resources/dependentes/dependentes').then(m => m.Dependentes) },
  { path: '**', redirectTo: 'funcionarios' },
];
