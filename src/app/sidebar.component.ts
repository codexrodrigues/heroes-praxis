import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

export type SidebarItem = { label: string; path?: string };
// Allow top-level entries with direct paths (flat menu items)
export type SidebarGroup = { label: string; icon?: string; path?: string; children?: SidebarItem[] };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatTooltipModule, MatRippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('submenuExpand', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('150ms ease')),
    ]),
  ],
  template: `
    <aside class="app-sidenav" [class.collapsed]="collapsed" aria-label="Menu principal">
      <header class="sidenav-header">
        <h1 class="app-logo" [attr.aria-hidden]="collapsed">Heroes Praxis</h1>
        <button class="collapse-btn" type="button" (click)="toggleCollapse.emit()" [attr.aria-label]="collapsed ? 'Expandir menu' : 'Recolher menu'">
          <span class="material-symbols-outlined">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
        </button>
      </header>

      <nav class="menu" aria-label="Navegação principal">
        <a class="menu-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" #rlaHome="routerLinkActive"
           [attr.aria-current]="rlaHome.isActive ? 'page' : null"
           [matTooltip]="collapsed ? 'Dashboard' : ''" [matTooltipDisabled]="!collapsed" matTooltipPosition="right" [matTooltipShowDelay]="500" aria-label="Dashboard" matRipple [matRippleDisabled]="collapsed">
          <span class="menu-item-icon" aria-hidden="true">
            <span class="material-symbols-outlined">dashboard</span>
          </span>
          <span class="label">Dashboard</span>
        </a>

        <section class="menu-section" *ngFor="let group of menu">
          <!-- Render expandable group when it has children -->
          <ng-container *ngIf="group.children && group.children.length; else flatItem">
            <a class="menu-item menu-group-link" #rlaGroup="routerLinkActive"
               [routerLink]="defaultPath(group)"
               routerLinkActive="active"
               [attr.aria-current]="rlaGroup.isActive ? 'page' : null"
               [matTooltip]="collapsed ? group.label : ''" [matTooltipDisabled]="!collapsed" matTooltipPosition="right" [matTooltipShowDelay]="500"
               (click)="navigate($event, defaultPath(group), group.label)"
               [attr.aria-expanded]="isExpanded(group.label)" [attr.aria-controls]="'submenu-' + group.label"
               aria-haspopup="true" matRipple [matRippleDisabled]="collapsed">
              <span class="menu-item-icon" aria-hidden="true">
                <span class="material-symbols-outlined">{{ group.icon }}</span>
              </span>
              <span class="label">{{ group.label }}</span>
              <span class="chevron material-symbols-outlined" [class.expanded]="isExpanded(group.label)">chevron_right</span>
            </a>
            <div class="submenu" [@submenuExpand]="isExpanded(group.label) ? 'open' : 'closed'" [class.open]="isExpanded(group.label)" [id]="'submenu-' + group.label">
              <a class="submenu-item" *ngFor="let item of group.children" [routerLink]="item.path" routerLinkActive="active" #rlaSub="routerLinkActive"
                 [attr.aria-current]="rlaSub.isActive ? 'page' : null" aria-label="{{ item.label }}" matRipple>
                <span class="label">{{ item.label }}</span>
              </a>
            </div>
          </ng-container>
          <!-- Flat top-level item (no submenu) -->
          <ng-template #flatItem>
            <a class="menu-item" [routerLink]="group.path" routerLinkActive="active" #rlaFlat="routerLinkActive"
               [attr.aria-current]="rlaFlat.isActive ? 'page' : null"
               [matTooltip]="collapsed ? group.label : ''" [matTooltipDisabled]="!collapsed" matTooltipPosition="right" [matTooltipShowDelay]="500" aria-label="{{ group.label }}" matRipple [matRippleDisabled]="collapsed">
              <span class="menu-item-icon" aria-hidden="true">
                <span class="material-symbols-outlined">{{ group.icon }}</span>
              </span>
              <span class="label">{{ group.label }}</span>
            </a>
          </ng-template>
        </section>
      </nav>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    /* Layout do aside: coluna com header fixo e lista rolável */
    .app-sidenav { width: 100%; height: 100%; display: flex; flex-direction: column; min-height: 0; overflow: hidden; transition: width .25s ease; }
    .sidenav-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; }
    .app-logo {
      font-family: 'Poppins', 'Inter', sans-serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: .03em;
      margin: 0;
      /* Fallback gradient if color-mix is unsupported */
      background: linear-gradient(90deg, var(--md-sys-color-primary, #3FBCA5) 0%, #8BE3CC 100%);
      /* Dynamic gradient derived from primary color */
      --logo-mix: 34%;
      background: linear-gradient(
        90deg,
        var(--md-sys-color-primary, #3FBCA5) 0%,
        color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), white var(--logo-mix)) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      /* Cross-browser text gradient */
      color: transparent;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,.05));
      transition: background .3s ease;
    }
    :host-context(.theme-dark) .app-logo {
      /* Slightly brighter mix on dark backgrounds for contrast */
      --logo-mix: 46%;
    }
    .app-logo.glow {
      background: linear-gradient(
        90deg,
        var(--md-sys-color-primary, #3FBCA5) 0%,
        var(--md-sys-color-tertiary, #AB82D9) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 8px color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), transparent 70%);
    }
    .app-logo:hover {
      background: linear-gradient(
        90deg,
        var(--md-sys-color-tertiary, #AB82D9) 0%,
        var(--md-sys-color-primary, #3FBCA5) 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
    .collapse-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
      background: transparent; border: 0; color: var(--md-sys-color-on-surface, #3B3735);
      transition: background .15s ease, box-shadow .15s ease, transform .12s ease;
    }
    .collapse-btn:hover { background: color-mix(in oklab, var(--md-sys-color-on-surface, #2B2A28), transparent 88%); }
    .collapse-btn:focus-visible { outline: 2px solid var(--md-sys-color-primary, #3FBCA5); outline-offset: 2px; }
    .collapse-btn .material-symbols-outlined { color: var(--md-sys-color-on-surface, #3B3735); font-size: 22px; line-height: 1; }

    /* Lista rolável com padding e sem barra cinza colada */
    .menu { display: flex; flex-direction: column; gap: 8px; flex: 1 1 auto; overflow: auto; padding: 8px 8px 12px; }
    /* Rail: esconder trilha do scroll, mantendo rolagem por gesto/teclado */
    :host .app-sidenav.collapsed .menu {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE, Edge */
    }
    :host .app-sidenav.collapsed .menu::-webkit-scrollbar { display: none; /* Chrome, Safari */ }
    /* Certifique largura total para centragem matemática */
    :host .app-sidenav .menu .menu-item { width: 100%; }
    /* Pílula base: 56px de altura, 16px padding horizontal, ícone centralizado */
    :host .app-sidenav .menu .menu-item {
      position: relative; display: inline-flex; align-items: center; justify-content: flex-start; gap: 12px;
      padding-inline: 16px; min-height: 56px; border-radius: 16px; box-sizing: border-box;
      color: var(--md-sys-color-on-surface, #3B3735); text-decoration: none;
      transition: background .12s ease, box-shadow .12s ease, transform .12s ease, color .12s ease;
    }
    /* Estados: hover/focus/active/disabled (M3) */
    :host .app-sidenav .menu .menu-item:hover:not(.active):not([aria-disabled='true']) {
      background: color-mix(in oklab, var(--md-sys-color-on-surface, #2B2A28), transparent 92%);
    }
    /* Foco: pílula expandida */
    :host .app-sidenav:not(.collapsed) .menu .menu-item:focus-visible {
      outline: none; box-shadow: inset 0 0 0 2px color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), white 10%);
    }
    /* Foco: rail colapsado (apenas se não estiver ativo) */
    :host .app-sidenav.collapsed .menu .menu-item:focus-visible:not(.active) {
      outline: 2px solid var(--md-sys-color-primary, #3FBCA5);
      outline-offset: 2px;
      border-radius: 16px;
      background: color-mix(in oklab, var(--md-sys-color-on-surface, #2B2A28), transparent 92%);
    }
    :host .app-sidenav .menu .menu-item[aria-disabled='true'] { opacity: .5; pointer-events: none; }
    /* Selecionado: container tonal + borda sutil; ícone em primário */
    :host .app-sidenav .menu .menu-item.active {
      background: var(--mat-sys-surface-container, var(--md-sys-color-surface-container, #EDE6E1));
      border: 1px solid var(--md-sys-color-outline-variant, #E4DCD6);
      color: var(--md-sys-color-on-surface, #2B2A28);
      font-weight: 600;
      padding-inline: 16px; padding-block: 0;
    }
    :host .app-sidenav .menu .menu-item.active .material-symbols-outlined,
    :host .app-sidenav .menu .menu-item.active .mat-icon { color: var(--md-sys-color-primary, #3FBCA5); }
    .menu-group-link { width: 100%; }
    /* Ícone: 24px dentro de um container 40x40 centralizado */
    :host .app-sidenav .menu .menu-item .menu-item-icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 12px; flex: 0 0 44px;
      position: relative; z-index: 2; /* mantém o ícone acima de indicadores/efeitos */
    }
    :host .app-sidenav .menu .menu-item .menu-item-icon .material-symbols-outlined,
    :host .app-sidenav .menu .menu-item .menu-item-icon .mat-icon { font-size: 22px; line-height: 1; color: var(--md-sys-color-on-surface, #3B3735); }
    .chevron { margin-inline-start: auto; transition: transform .12s ease; display: inline-flex; align-items: center; color: var(--md-sys-color-outline, #7A7174); }
    .chevron.expanded { transform: rotate(180deg); }
    /* Submenu: alinhado ao texto (16 + 40 + 12 = 68) */
    .submenu {
      background: var(--md-sys-color-surface-container, #EDE6E1);
      border-radius: 12px;
      margin: 6px 12px 10px 68px;
      padding: 8px;
      border: 1px solid var(--md-sys-color-outline-variant, #E4DCD6);
    }
    :host-context([dir='rtl']) .submenu { margin: 6px 68px 10px 12px; }
    :host .app-sidenav .menu a.menu-group-link.menu-item.active { border-radius: 16px; }

    /* Modo colapsado (rail): esconder labels e chevron; centralizar ícones/pílula */
    .collapsed .label, .collapsed .app-logo { display: none; }
    .collapsed .menu { align-items: stretch; }
    .collapsed .menu-item { display: grid; place-items: center; padding: 0; min-height: 56px; width: 100%; border-radius: 16px; }
    .collapsed .menu-item .menu-item-icon { margin: 0 auto; }
    .collapsed .chevron { display: none; }
    /* Colapsado + ativo: indicador na borda e ícone destacado */
    :host .app-sidenav.collapsed .menu .menu-item.active {
      background: transparent; border: 0; box-shadow: none;
      /* Garante que o item ativo não mostre o fundo de foco/hover */
      background-color: transparent !important;
    }
    :host .app-sidenav.collapsed .menu .menu-item.active .material-symbols-outlined,
    :host .app-sidenav.collapsed .menu .menu-item.active .mat-icon { color: var(--md-sys-color-primary, #3FBCA5); }
    /* Realce sutil no ícone ativo */
    .collapsed .menu-item.active .menu-item-icon {
      background-color: color-mix(in oklab, var(--md-sys-color-primary), transparent 85%);
    }
    /* Indicador lateral */
    .collapsed .menu-item.active::before {
      content: '';
      position: absolute;
      /* Posicionado um pouco para dentro para evitar corte */
      left: 4px;
      top: 50%; transform: translateY(-50%);
      width: 4px; height: 24px; border-radius: 8px; background: var(--md-sys-color-primary, #3FBCA5);
      pointer-events: none; z-index: 1;
    }
    :host-context([dir='rtl']) .collapsed .menu-item.active::before { left: auto; right: 4px; }
    .collapsed .submenu { display: none; }
  `],
})
export class SidebarComponent {
  @Input() menu: SidebarGroup[] = [];
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private expanded = signal<string | null>(null);

  isExpanded(id: string) { return this.expanded() === id; }
  toggleSubmenu(id: string) { this.expanded.set(this.expanded() === id ? null : id); }

  constructor(private router: Router) {}

  // Quando colapsado: navega. Quando expandido: abre/fecha submenu.
  navigate(e: Event, path: string | undefined, id: string) {
    if (this.collapsed) {
      if (path) this.router.navigate([path]);
      return; // deixa o anchor navegar/controlar foco
    }
    // Expandido: evita navegação do anchor e apenas alterna o submenu
    e.preventDefault();
    this.toggleSubmenu(id);
  }

  // Caminho padrão de um grupo (primeiro filho)
  defaultPath(group: SidebarGroup): string | undefined {
    return group.children && group.children.length ? group.children[0]?.path : undefined;
  }

}
