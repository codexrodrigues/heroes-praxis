import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-enderecos',
  imports: [MatCardModule],
  templateUrl: './enderecos.html',
  styleUrl: './enderecos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Enderecos {

}
