import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

export type SidebarItem = { label: string; path?: string };
export type SidebarGroup = { label: string; icon?: string; children?: SidebarItem[] };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="app-sidenav" [class.collapsed]="collapsed" role="navigation" aria-label="Menu principal">
      <header class="sidenav-header">
        <h1 class="app-logo" [attr.aria-hidden]="collapsed">Heroes Praxis</h1>
        <button class="collapse-btn" type="button" (click)="toggleCollapse.emit()" [attr.aria-label]="collapsed ? 'Expandir menu' : 'Recolher menu'">
          <span class="material-symbols-outlined">{{ collapsed ? 'chevron_right' : 'chevron_left' }}</span>
        </button>
      </header>

      <nav class="menu" role="menubar">
        <a class="menu-item" routerLink="/" routerLinkActive="active"
           [matTooltip]="collapsed ? 'Dashboard' : ''" matTooltipPosition="right" aria-label="Dashboard">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="label">Dashboard</span>
        </a>

        <section class="menu-section" *ngFor="let group of menu">
          <button class="menu-group" type="button" (click)="toggleSubmenu(group.label)"
                  [matTooltip]="collapsed ? group.label : ''" matTooltipPosition="right"
                  [attr.aria-expanded]="isExpanded(group.label)" [attr.aria-controls]="'submenu-' + group.label">
            <span class="material-symbols-outlined">{{ group.icon }}</span>
            <span class="label">{{ group.label }}</span>
            <span class="chevron" [class.expanded]="isExpanded(group.label)">›</span>
          </button>
          <div class="submenu" [class.open]="isExpanded(group.label)" [id]="'submenu-' + group.label" role="menu">
            <a class="submenu-item" *ngFor="let item of group.children" [routerLink]="item.path" routerLinkActive="active"
               [matTooltip]="collapsed ? item.label : ''" matTooltipPosition="right" aria-label="{{ item.label }}">
              <span class="label">{{ item.label }}</span>
            </a>
          </div>
        </section>
      </nav>
    </aside>
  `,
  styles: [`
    :host { display: block; }
    .app-sidenav { width: 100%; }
    .sidenav-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; }
    .app-logo { font: 600 14px/1.2 'Poppins', 'Inter', sans-serif; margin: 0; }
    .collapse-btn { background: none; border: 0; padding: 6px; border-radius: 8px; cursor: pointer; }

    .menu { display: flex; flex-direction: column; }
    .menu-group { display: inline-flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border-radius: 12px; background: transparent; border: 0; text-align: left; cursor: pointer; color: #3B3735; }
    .chevron { margin-left: auto; transition: transform .2s ease; display: inline-flex; align-items: center; }
    .chevron.expanded { transform: rotate(90deg); }

    /* Collapsed: esconder labels, centralizar ícones */
    .collapsed .label, .collapsed .app-logo { display: none; }
    .collapsed .menu-item, .collapsed .menu-group { justify-content: center; padding: 10px; }
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

}
