import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PraxisCrudComponent } from '@praxisui/crud';
import { RouteIntroCardComponent } from '../../../shared/route-intro-card.component';

/**
 * Página de exemplo — Funcionários
 *
 * Mostra o uso mínimo (e recomendado) do componente @praxisui/crud:
 * - `resource.path` aponta para a rota do recurso na API (sem o prefixo /api);
 * - `actions` definem como abrir os formulários (neste exemplo, em modal);
 * - `table.toolbar.visible` ativa a barra de ferramentas e, com `actions`, a lib
 *   injeta automaticamente o botão "Novo".
 *
 * Observações importantes para quem for replicar:
 * - `idField` deve bater com o identificador no DTO (a API Quickstart usa `id`).
 * - `formId` precisa ser estável por recurso para que preferências do formulário
 *   sejam persistidas corretamente (layout, back/return, etc.).
 * - Para abrir por rota em vez de modal, defina `openMode: 'route'` e informe `route`.
 */
@Component({
  selector: 'app-funcionarios',
  imports: [PraxisCrudComponent, RouteIntroCardComponent],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Funcionarios {

}
