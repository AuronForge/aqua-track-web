import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AvatarColor } from './avatar-color.type';
import { AvatarSize } from './avatar-size.type';
import { AvatarVariant } from './avatar-variant.type';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly variant = input<AvatarVariant>('initials');
  readonly color = input<AvatarColor>('primary');
  readonly size = input<AvatarSize>('normal');
  readonly initials = input<string>('');
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly icon = input<string>('');

  readonly avatarClass = computed(
    () => `avatar avatar--${this.variant()} avatar--${this.color()} avatar--${this.size()}`,
  );

  readonly truncatedInitials = computed(() => this.initials().slice(0, 3).toUpperCase());
}
