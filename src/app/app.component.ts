import { ChangeDetectionStrategy, Component, ViewChild, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
        RouterOutlet, RouterLink, RouterLinkActive,
        MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatExpansionModule, SidebarComponent,
    ],
    template: `
  <mat-sidenav-container class="app-shell app-bg">
    <mat-sidenav [mode]="isDesktop() ? 'side' : 'over'" [opened]="isDesktop()" class="app-drawer collapsible" [style.width.px]="collapsed() ? 64 : 240">
      <app-sidebar [menu]="menu()" [collapsed]="collapsed()" (toggleCollapse)="toggleCollapsed()"></app-sidebar>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar class="app-toolbar">
        @if (!isDesktop()) {
          <button mat-icon-button (click)="toggleSidenav()" aria-label="Abrir menu lateral">
            <span class="material-symbols-outlined">menu</span>
          </button>
        }
        <h1 class="app-title">Praxis HR</h1>
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
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected theme = signal<'light' | 'dark'>('light');
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
