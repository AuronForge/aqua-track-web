import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChipComponent } from '../../../../shared/components/chip/chip.component';

@Component({
  selector: 'app-chip-showcase',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './chip-showcase.component.html',
  styleUrl: './chip-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipShowcaseComponent {}
