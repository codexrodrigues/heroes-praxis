import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsPanelService } from '@praxisui/settings-panel';
import { HostGlobalConfigEditorComponent } from './host-global-config-editor.component';

@Component({
  selector: 'app-praxis-settings-route',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PraxisSettingsRoute {
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsPanelService);

  constructor() {
    const ref = this.settings.open({
      id: 'praxis-global-settings',
      title: 'Configurações do Praxis',
      titleIcon: 'tune',
      content: { component: HostGlobalConfigEditorComponent },
    });
    ref.closed$.subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
