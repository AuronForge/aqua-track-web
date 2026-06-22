import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-button-showcase',
  standalone: true,
  imports: [ButtonComponent, CodeBlockComponent],
  templateUrl: './button-showcase.component.html',
  styleUrl: './button-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonShowcaseComponent {
  readonly codeTs = `import { ButtonComponent } from '../../shared/components/button/button.component';`;

  readonly codeHtml = `<button aqButton variant="flat" color="primary" size="medium">Salvar</button>
<button aqButton variant="stroked" color="secondary" size="medium">Cancelar</button>

<!-- Icon button -->
<button aqButton variant="icon" color="error" size="medium">
  <span class="material-icons">delete</span>
</button>

<!-- Com ícone e texto -->
<button aqButton variant="flat" color="primary" size="medium">
  <span class="material-icons">add</span>
  Novo item
</button>`;
}
