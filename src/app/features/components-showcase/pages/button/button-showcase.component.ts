import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-button-showcase',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './button-showcase.component.html',
  styleUrl: './button-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonShowcaseComponent {}
