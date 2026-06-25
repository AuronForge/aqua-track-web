import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-avatar-showcase',
  standalone: true,
  imports: [AvatarComponent, CodeBlockComponent],
  templateUrl: './avatar-showcase.component.html',
  styleUrl: './avatar-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarShowcaseComponent {
  readonly codeTs = `import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';`;

  readonly codeHtml = `<!-- Iniciais -->
<app-avatar variant="initials" color="primary" size="normal" initials="JD" />

<!-- Imagem circular -->
<app-avatar variant="circular" src="https://..." alt="Foto de perfil" />

<!-- Ícone -->
<app-avatar variant="icon" icon="person" color="secondary" size="large" />`;
}
