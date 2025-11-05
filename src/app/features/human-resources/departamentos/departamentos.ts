import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-departamentos',
  imports: [MatCardModule],
  templateUrl: './departamentos.html',
  styleUrl: './departamentos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Departamentos {

}
