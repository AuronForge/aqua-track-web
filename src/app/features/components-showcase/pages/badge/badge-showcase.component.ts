import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-badge-showcase',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './badge-showcase.component.html',
  styleUrl: './badge-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeShowcaseComponent {}
