import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * RouteIntroCardComponent
 *
 * Pequeno cartão reutilizável para padronizar a apresentação das rotas
 * (título + ícone/emoji + descrição com toque de humor e subdescrição/CTA).
 *
 * Objetivo: dar contexto imediato ao usuário e servir como exemplo claro
 * de como compor elementos visuais de apresentação SEM acoplar regras de negócio.
 *
 * Como usar em outras rotas:
 * - importar o componente standalone na rota desejada;
 * - preencher `title`, `icon` (ou `emoji`), `description` e `subDescription`.
 * - conteúdo adicional pode ser passado via <ng-content> (ex.: botões).
 */
@Component({
  selector: 'app-route-intro-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="route-intro">
      <div class="intro-header">
        <div class="intro-icon" aria-hidden="true">
          @if (emoji) { <span class="emoji">{{ emoji }}</span> }
          @else { <mat-icon>{{ icon || 'info' }}</mat-icon> }
        </div>
        <div class="intro-texts">
          <div class="intro-title typ-title-large">{{ title }}</div>
          @if (description) {
            <div class="intro-desc typ-body-medium">{{ description }}</div>
          }
          @if (subDescription) {
            <div class="intro-sub typ-body-small">{{ subDescription }}</div>
          }
        </div>
      </div>
      <ng-content />
    </mat-card>
  `,
  styles: [`
    .route-intro { margin: 0 0 12px; padding: 14px; border-radius: 14px; }
    .intro-header { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
    .intro-icon { display:flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:12px;
      background: color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), transparent 88%);
      box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--md-sys-color-primary, #3FBCA5), transparent 70%);
    }
    .intro-icon .emoji { font-size: 22px; line-height: 1; }
    .intro-icon mat-icon { color: var(--md-sys-color-primary, #3FBCA5); }
    .intro-title { font-weight: 700; }
    .intro-desc { color: var(--app-text, #2B2A28); opacity: .9; }
    .intro-sub { color: var(--app-text-variant, #7A7174); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteIntroCardComponent {
  @Input() title = '';
  @Input() icon?: string;
  @Input() emoji?: string;
  @Input() description?: string;
  @Input() subDescription?: string;
}
