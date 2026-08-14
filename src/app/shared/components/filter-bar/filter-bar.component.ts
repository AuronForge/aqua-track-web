import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '../button/button.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'form[aqFilterBar], section[aqFilterBar]',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[style.--aq-filter-bar-columns]': 'columns()',
  },
})
export class FilterBarComponent {
  readonly caption = input.required<string>();
  readonly columns = input('repeat(3, minmax(0, 1fr))');
  readonly clearLabel = input('Limpar filtros');
  readonly clearDisabled = input(false);

  readonly clearFilters = output<void>();

  protected readonly hostClass = computed(() => 'filter-bar');

  protected onClearFilters(): void {
    if (this.clearDisabled()) {
      return;
    }

    this.clearFilters.emit();
  }
}
