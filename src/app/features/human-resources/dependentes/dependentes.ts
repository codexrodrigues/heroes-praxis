import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dependentes',
  imports: [MatCardModule],
  templateUrl: './dependentes.html',
  styleUrl: './dependentes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dependentes {

}
