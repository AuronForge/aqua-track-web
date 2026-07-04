import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SettingsCardTone } from './settings-card-tone.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-settings-card',
  standalone: true,
  templateUrl: './settings-card.component.html',
  styleUrl: './settings-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class SettingsCardComponent {
  readonly icon = input<string>('');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly tone = input<SettingsCardTone>('default');

  protected readonly hostClass = computed(() => `settings-card settings-card--${this.tone()}`);
}
