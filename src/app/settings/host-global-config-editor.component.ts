import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalConfigAdminService } from '@praxisui/settings-panel';
import { SETTINGS_PANEL_REF, SettingsPanelRef, SettingsValueProvider } from '@praxisui/settings-panel';

@Component({
  selector: 'app-host-global-config-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  template: `
  <div class="cfg-editor">
    <mat-accordion multi>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title>CRUD</mat-panel-title>
          <mat-panel-description>Políticas globais de abertura, back e header</mat-panel-description>
        </mat-expansion-panel-header>

        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Modo padrão (global)</mat-label>
            <mat-select [formControl]="form.controls.crud.controls.openMode">
              <mat-option value="route">Rota</mat-option>
              <mat-option value="modal">Modal</mat-option>
              <mat-option value="drawer">Drawer</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-slide-toggle [formControl]="form.controls.crud.controls.rememberLastState">
            Modal: lembrar último estado (tamanho/maximizado)
          </mat-slide-toggle>
        </div>

        <h4 class="sub">Por ação</h4>
        <div class="grid three">
          <mat-form-field appearance="outline">
            <mat-label>Create: openMode</mat-label>
            <mat-select [formControl]="form.controls.crud.controls.actions.controls.create.controls.openMode">
              <mat-option [value]="null">(herdar)</mat-option>
              <mat-option value="route">Rota</mat-option>
              <mat-option value="modal">Modal</mat-option>
              <mat-option value="drawer">Drawer</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Create: route</mat-label>
            <input matInput placeholder="/funcionarios/new" [formControl]="form.controls.crud.controls.actions.controls.create.controls.route">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Create: formId</mat-label>
            <input matInput placeholder="ex.: funcionarios-form" [formControl]="form.controls.crud.controls.actions.controls.create.controls.formId">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>View: openMode</mat-label>
            <mat-select [formControl]="form.controls.crud.controls.actions.controls.view.controls.openMode">
              <mat-option [value]="null">(herdar)</mat-option>
              <mat-option value="route">Rota</mat-option>
              <mat-option value="modal">Modal</mat-option>
              <mat-option value="drawer">Drawer</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>View: route</mat-label>
            <input matInput placeholder="/funcionarios/:id" [formControl]="form.controls.crud.controls.actions.controls.view.controls.route">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>View: formId</mat-label>
            <input matInput placeholder="ex.: funcionarios-form" [formControl]="form.controls.crud.controls.actions.controls.view.controls.formId">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Edit: openMode</mat-label>
            <mat-select [formControl]="form.controls.crud.controls.actions.controls.edit.controls.openMode">
              <mat-option [value]="null">(herdar)</mat-option>
              <mat-option value="route">Rota</mat-option>
              <mat-option value="modal">Modal</mat-option>
              <mat-option value="drawer">Drawer</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Edit: route</mat-label>
            <input matInput placeholder="/funcionarios/:id" [formControl]="form.controls.crud.controls.actions.controls.edit.controls.route">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Edit: formId</mat-label>
            <input matInput placeholder="ex.: funcionarios-form" [formControl]="form.controls.crud.controls.actions.controls.edit.controls.formId">
          </mat-form-field>
        </div>
      </mat-expansion-panel>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>Tabela</mat-panel-title>
          <mat-panel-description>Defaults de paginação e densidade</mat-panel-description>
        </mat-expansion-panel-header>
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Tamanho da página</mat-label>
            <input matInput type="number" min="5" step="1" [formControl]="form.controls.table.controls.pageSize">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Densidade</mat-label>
            <mat-select [formControl]="form.controls.table.controls.density">
              <mat-option value="comfortable">comfortable</mat-option>
              <mat-option value="cozy">cozy</mat-option>
              <mat-option value="compact">compact</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Filtro Avançado: modo</mat-label>
            <mat-select [formControl]="form.controls.table.controls.advancedOpenMode">
              <mat-option value="overlay">overlay</mat-option>
              <mat-option value="modal">modal</mat-option>
              <mat-option value="drawer">drawer</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
  </div>
  `,
  styles: [`
    .cfg-editor { padding: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0 16px; }
    .grid.three { grid-template-columns: 1fr 1fr 1fr; }
    .sub { margin: 8px 0 4px; font-weight: 600; opacity: .8; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostGlobalConfigEditorComponent implements OnInit, SettingsValueProvider {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(GlobalConfigAdminService);
  private readonly snack = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly panelRef = inject<SettingsPanelRef>(SETTINGS_PANEL_REF);

  // Streams exigidas pelo SettingsPanel
  readonly isDirty$ = new BehaviorSubject<boolean>(false);
  readonly isValid$ = new BehaviorSubject<boolean>(true);
  readonly isBusy$ = new BehaviorSubject<boolean>(false);

  // Form model
  readonly form = this.fb.nonNullable.group({
    crud: this.fb.nonNullable.group({
      openMode: this.fb.control<'route' | 'modal' | 'drawer'>('route', { validators: [Validators.required] }),
      rememberLastState: this.fb.control<boolean>(false),
      actions: this.fb.nonNullable.group({
        create: this.fb.group({ openMode: this.fb.control<'route' | 'modal' | 'drawer' | null>(null), route: this.fb.control<string | null>(null), formId: this.fb.control<string | null>(null) }),
        view: this.fb.group({ openMode: this.fb.control<'route' | 'modal' | 'drawer' | null>(null), route: this.fb.control<string | null>(null), formId: this.fb.control<string | null>(null) }),
        edit: this.fb.group({ openMode: this.fb.control<'route' | 'modal' | 'drawer' | null>(null), route: this.fb.control<string | null>(null), formId: this.fb.control<string | null>(null) }),
      }),
    }),
    table: this.fb.nonNullable.group({
      pageSize: this.fb.control<number>(20, { validators: [Validators.min(1)] }),
      density: this.fb.control<'comfortable' | 'cozy' | 'compact'>('comfortable'),
      advancedOpenMode: this.fb.control<'overlay' | 'modal' | 'drawer'>('overlay'),
    }),
  });

  private baseline: any = null;

  ngOnInit(): void {
    const cfg = this.admin.getEffectiveConfig();
    const crud = cfg.crud || {} as any;
    const def = crud.defaults || {};
    const modal = def.modal || {};
    const acts = crud.actionDefaults || {};
    const table = cfg.table || {} as any;
    const pagination = table.behavior?.pagination || {};
    const appearance = table.appearance || {};
    const filteringUi = table.filteringUi || {};

    const initial = {
      crud: {
        openMode: def.openMode ?? 'route',
        rememberLastState: !!modal.rememberLastState,
        actions: {
          create: {
            openMode: acts.create?.openMode ?? null,
            route: acts.create?.route ?? null,
            formId: acts.create?.formId ?? null,
          },
          view: {
            openMode: acts.view?.openMode ?? null,
            route: acts.view?.route ?? null,
            formId: acts.view?.formId ?? null,
          },
          edit: {
            openMode: acts.edit?.openMode ?? null,
            route: acts.edit?.route ?? null,
            formId: acts.edit?.formId ?? null,
          },
        },
      },
      table: {
        pageSize: pagination.pageSize ?? 20,
        density: appearance.density ?? 'comfortable',
        advancedOpenMode: filteringUi.advancedOpenMode ?? 'overlay',
      },
    } as const;

    this.form.reset(initial, { emitEvent: false });
    this.baseline = initial;
    // Track dirtiness/validity
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isValid$.next(this.form.valid);
      this.isDirty$.next(!this.shallowEqual(this.form.getRawValue(), this.baseline));
    });

    // Persist on Apply events as well
    this.panelRef.applied$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
      try {
        this.admin.save(val);
        this.snack.open('Configurações aplicadas', undefined, { duration: 2000 });
      } catch {}
    });
  }

  // SettingsValueProvider impl
  getSettingsValue() {
    const v = this.form.getRawValue();
    const action = (a: any) => ({
      ...(a.openMode != null ? { openMode: a.openMode } : {}),
      ...(a.route ? { route: a.route } : {}),
      ...(a.formId ? { formId: a.formId } : {}),
    });
    const partial = {
      crud: {
        defaults: {
          openMode: v.crud.openMode,
          modal: { rememberLastState: !!v.crud.rememberLastState },
        },
        actionDefaults: {
          create: action(v.crud.actions.create),
          view: action(v.crud.actions.view),
          edit: action(v.crud.actions.edit),
        },
      },
      table: {
        behavior: { pagination: { pageSize: v.table.pageSize } },
        appearance: { density: v.table.density },
        filteringUi: { advancedOpenMode: v.table.advancedOpenMode },
      },
    } as any;
    return partial;
  }

  onSave() {
    const partial = this.getSettingsValue();
    try {
      this.admin.save(partial);
      this.baseline = this.form.getRawValue();
      this.isDirty$.next(false);
      this.snack.open('Configurações salvas', undefined, { duration: 2000 });
    } catch {}
    return partial;
  }

  reset() {
    this.form.reset(this.baseline);
    this.isDirty$.next(false);
  }

  // Helpers
  private shallowEqual(a: any, b: any) {
    try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
  }
}

