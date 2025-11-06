import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'funcionarios' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  // Rota opcional para abrir o painel de Configurações Globais do Praxis
  { path: 'settings/praxis', loadComponent: () => import('./settings/praxis-settings.route').then(m => m.PraxisSettingsRoute) },
  { path: 'funcionarios', loadComponent: () => import('./features/human-resources/funcionarios/funcionarios').then(m => m.Funcionarios) },
  { path: 'funcionarios/new', loadComponent: () => import('./features/human-resources/funcionarios/funcionario-form.page').then(m => m.FuncionarioFormPage) },
  { path: 'funcionarios/:id', loadComponent: () => import('./features/human-resources/funcionarios/funcionario-form.page').then(m => m.FuncionarioFormPage) },
  { path: 'cargos', loadComponent: () => import('./features/human-resources/cargos/cargos').then(m => m.Cargos) },
  { path: 'departamentos', loadComponent: () => import('./features/human-resources/departamentos/departamentos').then(m => m.Departamentos) },
  { path: 'enderecos', loadComponent: () => import('./features/human-resources/enderecos/enderecos').then(m => m.Enderecos) },
  { path: 'dependentes', loadComponent: () => import('./features/human-resources/dependentes/dependentes').then(m => m.Dependentes) },
  { path: 'folhas-pagamento', loadComponent: () => import('./features/human-resources/folhas-pagamento/folhas-pagamento').then(m => m.FolhasPagamento) },
  { path: 'ferias-afastamentos', loadComponent: () => import('./features/human-resources/ferias-afastamentos/ferias-afastamentos').then(m => m.FeriasAfastamentos) },
  { path: '**', redirectTo: 'funcionarios' },
];
