import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';

@Component({
  selector: 'app-avatar-showcase',
  standalone: true,
  imports: [AvatarComponent],
  templateUrl: './avatar-showcase.component.html',
  styleUrl: './avatar-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarShowcaseComponent {}
