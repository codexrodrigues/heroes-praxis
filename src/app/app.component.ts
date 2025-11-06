import { ChangeDetectionStrategy, Component, ViewChild, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './core/auth/auth.service';
import { map } from 'rxjs/operators';
import { SidebarComponent, SidebarGroup } from './sidebar.component';

type MenuItem = {
    label: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
};

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet, RouterLink,
        MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatExpansionModule, SidebarComponent,
    ],
    template: `
  <mat-sidenav-container class="app-shell app-bg" autosize>
    <mat-sidenav [mode]="isDesktop() ? 'side' : 'over'" [opened]="isDesktop()" class="app-drawer collapsible" [style.width.px]="collapsed() ? 80 : 240">
      <app-sidebar [menu]="menu()" [collapsed]="collapsed()" (toggleCollapse)="toggleCollapsed()"></app-sidebar>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar class="app-toolbar">
        @if (!isDesktop()) {
          <button mat-icon-button (click)="toggleSidenav()" aria-label="Abrir menu lateral">
            <span class="material-symbols-outlined">menu</span>
          </button>
        }
        <a class="brand-link" routerLink="/" aria-label="Ir para o Dashboard">
          <h1 class="app-title typ-title-large"><span class="brand-gradient">Praxis HR</span></h1>
        </a>
        @if (tenantLabel()) {
          <span class="env-pill" title="Ambiente/Tenant">{{ tenantLabel() }}</span>
        }
        <span class="spacer"></span>
        <button mat-icon-button (click)="toggleTheme()" aria-label="Alternar tema claro/escuro">
          <span class="material-symbols-outlined">{{ themeIcon() }}</span>
        </button>
        @if (auth.loggedIn()) {
          <button mat-button (click)="logout()" aria-label="Sair">Sair</button>
        }
      </mat-toolbar>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer-floating">
        The Tour of Heroes... reimagined for the enterprise — powered by Praxis.
      </footer>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
    styles: [`
    .app-shell { height: 100vh; }
    .app-drawer { box-shadow: none; }
    .app-nav-item { color: inherit; }
    .brand-link { display: inline-flex; align-items: center; text-decoration: none; color: inherit; }
    .app-title { margin: 0; line-height: 1.1; }
    .brand-gradient {
      background: linear-gradient(90deg, var(--md-sys-color-primary, #3FBCA5) 0%, color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), white 36%) 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent;
      text-shadow: 0 1px 0 rgba(0,0,0,.04);
    }
    :host-context(.theme-dark) .brand-gradient {
      background: linear-gradient(90deg, var(--md-sys-color-primary, #64D0B8) 0%, color-mix(in oklab, var(--md-sys-color-primary, #64D0B8), white 48%) 100%);
    }
    .env-pill { margin-left: 10px; padding: 2px 8px; border-radius: 999px; font: 600 11px/1 'Inter', sans-serif; letter-spacing: .04em;
      color: var(--md-sys-color-on-secondary, #1B1B1B); background: color-mix(in oklab, var(--md-sys-color-secondary, #9ADCCB), white 30%);
      border: 1px solid color-mix(in oklab, var(--md-sys-color-outline-variant, #D8D3CF), transparent 35%);
    }
    .brand-link:focus-visible { outline: none; box-shadow: 0 0 0 3px color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), white 30%); border-radius: 8px; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected theme = signal<'light' | 'dark'>('light');
    protected tenantLabel = signal<string | null>(null);
    protected themeIcon = computed(() => this.theme() === 'dark' ? 'light_mode' : 'dark_mode');
    protected readonly menu = signal<SidebarGroup[]>([
        {
            label: 'Funcionários', icon: 'people', children: [
                { label: 'Listar/Visualizar Funcionários', path: '/funcionarios' },
                { label: 'Criar Novo Funcionário', path: '/funcionarios/new' },
                { label: 'Histórico de Mudanças', path: '/funcionarios/history' },
            ]
        },
        { label: 'Cargos e Departamentos', icon: 'account_tree', children: [
                { label: 'Gerenciar Cargos', path: '/cargos' },
                { label: 'Gerenciar Departamentos', path: '/departamentos' },
            ]},
        { label: 'Endereços e Dependentes', icon: 'home', children: [
                { label: 'Gerenciar Endereços', path: '/enderecos' },
                { label: 'Gerenciar Dependentes', path: '/dependentes' },
            ]},
        { label: 'Folhas de Pagamento', icon: 'request_quote', children: [
                { label: 'Listar Folhas', path: '/folhas-pagamento' },
                { label: 'Gerar Nova Folha', path: '/folhas-pagamento/new' },
            ]},
        { label: 'Férias e Afastamentos', icon: 'beach_access', children: [
                { label: 'Solicitar Férias', path: '/ferias-afastamentos/new' },
                { label: 'Registrar Afastamentos', path: '/ferias-afastamentos' },
            ]},
        { label: 'Compliance', icon: 'gavel', children: [
                { label: 'Incidentes & Acordos', path: '/compliance' },
            ]},
    ]);

    private breakpointObserver = inject(BreakpointObserver);
    protected isDesktop = signal(true);
    protected collapsed = signal(false);
    @ViewChild(MatSidenav) sidenav?: MatSidenav;

    constructor(public auth: AuthService) {
        this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
            .pipe(map(result => !result.matches))
            .subscribe(isDesktop => this.isDesktop.set(isDesktop));
        // inicializa o tema a partir do localStorage ou classe no <html>
        this.theme.set(this.getInitialTheme());
        // inicializa estado colapsado
        this.collapsed.set(this.getInitialCollapsed());
        // ambiente/tenant (opcional)
        try {
            const t = localStorage.getItem('pax.api.tenant') || 'demo';
            const env = (localStorage.getItem('pax.api.env') || '').trim();
            this.tenantLabel.set(env ? `${env}:${t}` : t);
        } catch {}
    }

    toggleSidenav() { this.sidenav?.toggle(); }

    private getInitialCollapsed(): boolean {
        try {
            const saved = localStorage.getItem('sidenav-collapsed');
            if (saved === 'true' || saved === 'false') return saved === 'true';
        } catch {}
        return false;
    }

    toggleCollapsed() {
        const next = !this.collapsed();
        this.collapsed.set(next);
        try { localStorage.setItem('sidenav-collapsed', String(next)); } catch {}
    }

    @HostListener('document:keydown', ['$event'])
    onKeydown(e: KeyboardEvent) {
        if (e.altKey && (e.key === 'm' || e.key === 'M')) {
            this.toggleCollapsed();
            e.preventDefault();
        }
    }

    private getInitialTheme(): 'light' | 'dark' {
        try {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
        } catch {}
        const root = document.documentElement;
        return root.classList.contains('theme-dark') ? 'dark' : 'light';
    }

    toggleTheme() {
        const root = document.documentElement;
        const isDark = this.theme() === 'dark';
        const next: 'light' | 'dark' = isDark ? 'light' : 'dark';
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(`theme-${next}`);
        try { localStorage.setItem('theme', next); } catch {}
        this.theme.set(next);
    }

    logout() {
        this.auth.logout();
    }
}
