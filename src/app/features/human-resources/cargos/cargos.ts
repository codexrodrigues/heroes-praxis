import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cargos',
  imports: [MatCardModule],
  templateUrl: './cargos.html',
  styleUrl: './cargos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cargos {

}
