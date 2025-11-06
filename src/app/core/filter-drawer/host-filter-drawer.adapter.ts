import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FILTER_DRAWER_ADAPTER, FilterDrawerAdapter, FilterDrawerOpenConfig } from '@praxisui/table';
import { FilterDrawerHostComponent } from './filter-drawer-host.component';

@Injectable({ providedIn: 'root' })
export class HostFilterDrawerAdapter implements FilterDrawerAdapter {
  private dialog = inject(MatDialog);
  async open(config: FilterDrawerOpenConfig): Promise<void> {
    const ref = this.dialog.open(FilterDrawerHostComponent, {
      panelClass: ['filter-right-drawer'],
      backdropClass: 'cdk-overlay-dark-backdrop',
      width: '520px',
      maxWidth: '95vw',
      height: '100vh',
      position: { right: '0' },
      autoFocus: false,
      restoreFocus: true,
      data: config,
    });
    await ref.afterClosed().toPromise();
  }
}

export const FILTER_DRAWER_ADAPTER_PROVIDER = { provide: FILTER_DRAWER_ADAPTER, useClass: HostFilterDrawerAdapter } as const;

