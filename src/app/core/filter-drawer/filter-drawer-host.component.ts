import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PraxisFilterForm } from '@praxisui/dynamic-form';

@Component({
  selector: 'app-filter-drawer-host',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, PraxisFilterForm],
  template: `
    <div class="drawer-header">
      <h3 class="title">{{ data.title || 'Filtro Avançado' }}</h3>
      <span class="spacer"></span>
      <button mat-icon-button (click)="close()" aria-label="Fechar filtro"><mat-icon>close</mat-icon></button>
    </div>
    <div class="drawer-content">
      <praxis-filter-form
        [formId]="data.formId"
        [resourcePath]="data.resourcePath"
        [config]="data.config"
        [mode]="'edit'"
        (valueChange)="onValue($event)"
        (validityChange)="onValidity($event)"
      ></praxis-filter-form>
    </div>
    <div class="drawer-actions">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="!valid" (click)="apply()">Aplicar</button>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; }
    .drawer-header { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,.08); }
    .title { margin: 0; font-weight: 600; }
    .spacer { flex: 1; }
    .drawer-content { flex: 1; overflow: auto; padding: 10px 12px; }
    .drawer-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 10px 12px; border-top: 1px solid rgba(0,0,0,.08); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerHostComponent {
  valid = true;
  private lastDto: Record<string, any> = {};
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { resourcePath: string; formId: string; config: any; title?: string; onSubmit(dto: any): void; onClose?(): void },
    private ref: MatDialogRef<FilterDrawerHostComponent>,
  ) {}
  onValue(ev: { formData: Record<string, any> }): void { this.lastDto = ev?.formData ?? {}; }
  onValidity(v: boolean): void { this.valid = v; }
  apply(): void { try { this.data.onSubmit(this.lastDto); } finally { this.ref.close(); } }
  close(): void { try { this.data.onClose?.(); } finally { this.ref.close(); } }
}
