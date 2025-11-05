import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PraxisCrudComponent } from '@praxisui/crud';

@Component({
  selector: 'app-funcionarios',
  imports: [PraxisCrudComponent],
  template: `
    <praxis-crud
      [metadata]="{ resource: { path: '/human-resources/funcionarios' } }"
    />
  `,
  styleUrl: './funcionarios.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Funcionarios {

}
