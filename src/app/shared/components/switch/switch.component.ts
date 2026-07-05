import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'switch',
  },
})
export class SwitchComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input.required<string>();

  readonly checkedChange = output<boolean>();

  protected toggle(): void {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
