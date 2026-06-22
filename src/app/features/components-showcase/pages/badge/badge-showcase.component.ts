import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-badge-showcase',
  standalone: true,
  imports: [BadgeComponent, CodeBlockComponent],
  templateUrl: './badge-showcase.component.html',
  styleUrl: './badge-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeShowcaseComponent {
  readonly codeTs = `import { BadgeComponent } from '../../shared/components/badge/badge.component';`;

  readonly codeHtml = `<aq-badge variant="filled" color="primary">Pro Plan</aq-badge>

<!-- Com ícone -->
<aq-badge variant="tinted" color="success">
  <span class="material-icons">check_circle</span>
  Ativo
</aq-badge>`;
}
