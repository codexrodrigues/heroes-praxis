import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PraxisDynamicForm } from '@praxisui/dynamic-form';
import { CrudPageHeaderComponent } from '@praxisui/crud';

/**
 * Página de formulário (rota) para Funcionários
 * - Abre em modo create quando a rota é /funcionarios/new
 * - Abre em modo edit quando a rota contém :id (/funcionarios/:id)
 * - Usa query param `returnTo` (injetado pelo CrudLauncherService) para o botão de voltar
 */
@Component({
  selector: 'app-funcionario-form-page',
  standalone: true,
  imports: [CommonModule, PraxisDynamicForm, CrudPageHeaderComponent],
  template: `
    <praxis-crud-page-header
      [title]="pageTitle()"
      [showBack]="true"
      variant="ghost"
      [sticky]="true"
      [divider]="true"
      [returnTo]="returnTo()"
    ></praxis-crud-page-header>

    <praxis-dynamic-form
      [formId]="'funcionarios-form'"
      [resourcePath]="resourcePath"
      [resourceId]="resourceId()"
      [mode]="mode()"
      (formSubmit)="onSubmit($event)"
    ></praxis-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuncionarioFormPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resourcePath = '/human-resources/funcionarios';
  private idParam = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  private returnToParam = signal<string | null>(this.route.snapshot.queryParamMap.get('returnTo'));

  mode = computed(() => (this.idParam() ? 'edit' : 'create') as 'create' | 'edit');
  resourceId = computed(() => (this.idParam() ? Number(this.idParam()) : null));
  returnTo = computed(() => this.returnToParam() || '/funcionarios');
  pageTitle = computed(() => (this.mode() === 'create' ? 'Novo Funcionário' : 'Editar Funcionário'));

  onSubmit(_ev: any): void {
    // Após salvar, volte para a lista (ou para a rota indicada por returnTo)
    try {
      const back = this.returnTo();
      this.router.navigateByUrl(back || '/funcionarios');
    } catch {}
  }
}
