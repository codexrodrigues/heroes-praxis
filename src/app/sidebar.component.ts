import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';

export type SidebarItem = { label: string; path?: string };
export type SidebarGroup = { label: string; icon?: string; children?: SidebarItem[] };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatTooltipModule, MatRippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('submenuExpand', [
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', animate('250ms ease')),
    ]),
  ],
  template: `
    <aside class="app-sidenav" [class.collapsed]="collapsed" role="navigation" aria-label="Menu principal">
      <header class="sidenav-header">
        <h1 class="app-logo" [attr.aria-hidden]="collapsed">Heroes Praxis</h1>
        <button class="collapse-btn" type="button" (click)="toggleCollapse.emit()" [attr.aria-label]="collapsed ? 'Expandir menu' : 'Recolher menu'">
          <span class="material-symbols-outlined">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
        </button>
      </header>

      <nav class="menu" role="menubar">
        <a class="menu-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" #rlaHome="routerLinkActive"
           [attr.aria-current]="rlaHome.isActive ? 'page' : null"
           [matTooltip]="collapsed ? 'Dashboard' : ''" matTooltipPosition="right" [matTooltipShowDelay]="500" aria-label="Dashboard" matRipple>
          <span class="menu-item-icon">
            <span class="material-symbols-outlined">dashboard</span>
          </span>
          <span class="label">Dashboard</span>
        </a>

        <section class="menu-section" *ngFor="let group of menu">
          <a class="menu-item menu-group-link" #rlaGroup="routerLinkActive"
             [routerLink]="defaultPath(group)"
             routerLinkActive="active"
             [attr.aria-current]="rlaGroup.isActive ? 'page' : null"
             [matTooltip]="collapsed ? group.label : ''" matTooltipPosition="right" [matTooltipShowDelay]="500"
             (click)="navigate($event, defaultPath(group), group.label)"
             [attr.aria-expanded]="isExpanded(group.label)" [attr.aria-controls]="'submenu-' + group.label"
             aria-haspopup="true" matRipple>
            <span class="menu-item-icon">
              <span class="material-symbols-outlined">{{ group.icon }}</span>
            </span>
            <span class="label">{{ group.label }}</span>
            <span class="chevron material-symbols-outlined" [class.expanded]="isExpanded(group.label)">chevron_right</span>
          </a>
          <div class="submenu" [@submenuExpand]="isExpanded(group.label) ? 'open' : 'closed'" [class.open]="isExpanded(group.label)" [id]="'submenu-' + group.label" role="menu">
            <a class="submenu-item" *ngFor="let item of group.children" [routerLink]="item.path" routerLinkActive="active" #rlaSub="routerLinkActive"
               [attr.aria-current]="rlaSub.isActive ? 'page' : null"
               [matTooltip]="collapsed ? item.label : ''" matTooltipPosition="right" [matTooltipShowDelay]="500" aria-label="{{ item.label }}" matRipple>
              <span class="label">{{ item.label }}</span>
            </a>
          </div>
        </section>
      </nav>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    .app-sidenav { width: 100%; transition: width .25s ease; }
    .sidenav-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; }
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
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
      background: transparent; border: 0; color: #3B3735;
      transition: all .2s ease;
    }
    .collapse-btn:hover { background: color-mix(in oklab, var(--md-sys-color-on-surface, #2B2A28), transparent 88%); }
    .collapse-btn:focus-visible { outline: 2px solid var(--md-sys-color-primary, #3FBCA5); outline-offset: 2px; }
    .collapse-btn .material-symbols-outlined { color: var(--md-sys-color-on-surface, #3B3735); font-size: 22px; line-height: 1; }

    .menu { display: flex; flex-direction: column; }
    .menu-item { position: relative; display: inline-flex; align-items: center; gap: 12px; padding: 0 16px; min-height: 56px; border-radius: 12px; color: var(--md-sys-color-on-surface, #3B3735); text-decoration: none; }
    /* Sidebar focus: use inner ring to avoid overflow and double outlines */
    .menu-item:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--md-sys-color-primary, #3FBCA5); border-radius: 12px; }
    .menu-item:hover:not(.active) { background: color-mix(in oklab, var(--md-sys-color-on-surface, #2B2A28), transparent 92%); }
    /* Active (scoped) — keep card-like highlight, not oversized pill */
    :host .app-sidenav .menu .menu-item.active {
      background: var(--md-sys-color-primary, #3FBCA5);
      color: var(--md-sys-color-on-primary, #FFFFFF);
      border-radius: 12px;
      padding: 0 16px; /* avoid layout jump from global rule */
      box-shadow: 0 1px 2px rgba(0,0,0,.08);
      font-weight: 600;
    }
    :host .app-sidenav .menu .menu-item.active .material-symbols-outlined,
    :host .app-sidenav .menu .menu-item.active .mat-icon {
      color: var(--md-sys-color-on-primary, #FFFFFF);
    }
    .menu-group-link { width: 100%; }
    .menu-item-icon { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; font-size: 22px; color: var(--md-sys-color-on-surface, #3B3735); border-radius: 999px; }
    /* Ensure icon color stays readable (override global idle gray) */
    :host .app-sidenav .menu .menu-item .menu-item-icon .material-symbols-outlined,
    :host .app-sidenav .menu .menu-item .menu-item-icon .mat-icon {
      color: var(--md-sys-color-on-surface, #3B3735);
    }
    .chevron { margin-left: auto; transition: transform .2s ease; display: inline-flex; align-items: center; color: var(--md-sys-color-outline, #7A7174); }
    .chevron.expanded { transform: rotate(180deg); }
    /* Submenu container aligned to the label start (16 + 40 + 12 = 68px) */
    .submenu {
      background: var(--md-sys-color-surface-container, #EDE6E1);
      border-radius: 12px;
      margin: 6px 12px 10px 68px;
      padding: 8px;
      border: 1px solid var(--md-sys-color-outline-variant, #E4DCD6);
    }
    /* Ensure the group active style matches container rounding and padding */
    :host .app-sidenav .menu a.menu-group-link.menu-item.active { border-radius: 12px; padding: 0 16px; }

    /* Collapsed: esconder labels, centralizar ícones */
    .collapsed .label, .collapsed .app-logo { display: none; }
    .collapsed .menu-item { justify-content: center; padding: 0; min-height: 56px; }
    .collapsed .chevron { display: none; }
    /* Collapsed: no teal pill background — only slim indicator bar */
    :host .app-sidenav.collapsed .menu .menu-item.active {
      background: transparent;
      color: var(--md-sys-color-on-surface, #3B3735);
      box-shadow: none;
    }
    :host .app-sidenav.collapsed .menu .menu-item.active .material-symbols-outlined,
    :host .app-sidenav.collapsed .menu .menu-item.active .mat-icon {
      color: var(--md-sys-color-on-surface, #3B3735);
    }
    .collapsed .menu-item.active::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 24px;
      border-radius: 8px;
      background: var(--md-sys-color-primary, #3FBCA5);
    }
    .collapsed .submenu { display: none; }
  `]
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
