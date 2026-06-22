import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChipComponent } from '../../../../shared/components/chip/chip.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-chip-showcase',
  standalone: true,
  imports: [ChipComponent, CodeBlockComponent],
  templateUrl: './chip-showcase.component.html',
  styleUrl: './chip-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipShowcaseComponent {
  readonly codeTs = `import { ChipComponent } from '../../shared/components/chip/chip.component';`;

  readonly codeHtml = `<aq-chip variant="tinted" color="success">Estável</aq-chip>
<aq-chip variant="filled" color="error">Crítico</aq-chip>
<aq-chip variant="outlined" color="warning" size="medium">Atenção</aq-chip>

<!-- Desabilitado -->
<aq-chip variant="tinted" color="primary" [disabled]="true">Inativo</aq-chip>`;
}
