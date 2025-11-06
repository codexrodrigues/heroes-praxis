# Guia de Integração (Praxis UI) — Heroes

Este documento lista apenas o que foi necessário ajustar no projeto Heroes (host Angular) para integrar com o Praxis UI. Não cobre alterações internas nas bibliotecas.

## 1) Providers e HTTP (src/main.ts)

- API base: `{ provide: API_URL, useValue: ({ default: { baseUrl: '/api' } }) }`
- Providers Praxis: `providePraxisDynamicFields()`, `providePraxisTableMetadata()`, `providePraxisDynamicFormMetadata()`, `providePraxisCrudMetadata()`, `providePraxisListMetadata()`
- Interceptores: `withCredentialsInterceptor`, `csrfInterceptor`, `authInterceptor`
- Cabeçalhos para `fetchWithETag`:
  ```ts
  provideEnvironmentInitializer(() => () => {
    (globalThis as any).PAX_FETCH_HEADERS = () => ({
      Authorization: `Bearer ${localStorage.getItem('pax.api.token') || ''}`,
      'X-Tenant': localStorage.getItem('pax.api.tenant') || 'demo',
      'Accept-Language': navigator.language || 'pt-BR',
    });
  })
  ```
- Filtro em gaveta (drawer) como padrão global:
  ```ts
  provideGlobalConfigSeed({ table: { filteringUi: { advancedOpenMode: 'drawer' } } })
  ```
- Adapter do drawer do filtro:
  ```ts
  { provide: FILTER_DRAWER_ADAPTER, useClass: HostFilterDrawerAdapter }
  ```

## 2) Proxy de dev/WSL (proxy.conf.js)

- Contextos com proxy: `/api`, `/api/auth`, `/schemas`, `/auth`
- Fixar alvo quando necessário:
  - API no WSL: `PAX_PROXY_TARGET=http://127.0.0.1:8088 ng serve`
  - API no Windows: executar Spring em `0.0.0.0` e manter a heurística do proxy

Back‑end (Windows):
- `SERVER_ADDRESS=0.0.0.0`, `SPRING_PROFILES_ACTIVE=dev`, `CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200`

## 3) CRUD — Funcionários

Arquivo: `src/app/features/human-resources/funcionarios/funcionarios.html`

- Metadados do `praxis-crud` usados no Heroes:
  ```ts
  {
    component: 'praxis-crud',
    resource: { path: '/human-resources/funcionarios', idField: 'id' },
    table: {
      toolbar: { visible: true, position: 'top' },
      behavior: { filtering: { advancedFilters: { enabled: true } } }
    },
    actions: [
      { action: 'create', label: 'Novo', openMode: 'route', route: '/funcionarios/new' },
      { action: 'view', openMode: 'modal', formId: 'funcionarios-form' },
      { action: 'edit', openMode: 'route', route: '/funcionarios/:id', params: [{ from: 'id', to: 'routeParam', name: 'id' }] }
    ]
  }
  ```

Rotas do formulário (create/edit): `src/app/app.routes.ts`
```ts
{ path: 'funcionarios/new', loadComponent: () => import('./features/human-resources/funcionarios/funcionario-form.page').then(m => m.FuncionarioFormPage) },
{ path: 'funcionarios/:id', loadComponent: () => import('./features/human-resources/funcionarios/funcionario-form.page').then(m => m.FuncionarioFormPage) }
```

Página de formulário (rota): `src/app/features/human-resources/funcionarios/funcionario-form.page.ts`
- Define `mode` por presença de `:id`
- Lê `returnTo` da query para o botão Voltar e navegação pós‑submit

## 4) Filtro Avançado em Gaveta (direita)

- Adapter do host e componente host:
  - `src/app/core/filter-drawer/host-filter-drawer.adapter.ts`
  - `src/app/core/filter-drawer/filter-drawer-host.component.ts`
- CSS do container do “drawer” (dialogo à direita): `src/styles.scss`
  ```scss
  .mat-mdc-dialog-container.filter-right-drawer {
    border-radius: 0;
    height: 100vh;
    padding: 0;
  }
  ```

## 5) Ajustes visuais no host (opcional)

- Centralização dos botões icônicos no header do modal do CRUD: `src/styles.scss`
  ```scss
  .pfx-dialog-pane .dialog-header .mat-mdc-icon-button { display:inline-flex; align-items:center; justify-content:center; height:40px; width:40px; }
  .pfx-dialog-pane .dialog-header .mat-mdc-icon-button .mat-icon { font-size:24px; height:24px; width:24px; line-height:1; display:inline-flex; align-items:center; justify-content:center; }
  ```

- Tokens M3 exigidos pelo visual da tabela: defina `--md-sys-color-surface-container-highest` no tema (claro/escuro), pois a tabela utiliza esse token para a superfície do grid. No Heroes, adicionamos em `src/theme-neo-soft.scss`:
  ```scss
  :root, .theme-light { --md-sys-color-surface-container-highest: #F5F3F1; }
  @media (prefers-color-scheme: dark) { :root:not(.theme-light):not(.theme-dark) { --md-sys-color-surface-container-highest: #2F2B2A; } }
  .theme-dark { --md-sys-color-surface-container-highest: #2F2B2A; }
  ```

## 6) Diagnóstico rápido

- API em 500 (schemas/filter): verifique DB/seed e envs.
- Verifique o alvo do proxy (`[proxy] target=...`) ao iniciar `ng serve`.
- Testes: `http://localhost:4200/api/actuator/health` e `http://localhost:4200/schemas/filtered?...`.
