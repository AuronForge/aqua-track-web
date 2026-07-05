import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { SegmentedControlOption } from './segmented-control-option.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-segmented-control',
  standalone: true,
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'segmented-control',
  },
})
export class SegmentedControlComponent {
  readonly options = input<SegmentedControlOption[]>([]);
  readonly value = input<string>('');
  readonly ariaLabel = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<string>();

  protected select(option: SegmentedControlOption): void {
    if (this.disabled() || option.value === this.value()) return;
    this.valueChange.emit(option.value);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    event.preventDefault();
    const options = this.options();
    if (options.length === 0) return;

    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + options.length) % options.length;
    this.select(options[nextIndex]);
  }
}
