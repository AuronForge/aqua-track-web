import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MODAL_DATA } from '../../../../shared/modal/modal-data.token';
import { ModalRef } from '../../../../shared/modal/modal-ref';

@Component({
  selector: 'app-modal-showcase-dynamic-content',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './modal-showcase-dynamic-content.component.html',
  styleUrl: './modal-showcase-dynamic-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalShowcaseDynamicContentComponent {
  private readonly modalRef = inject(ModalRef);
  protected readonly modalData = inject(MODAL_DATA, { optional: true }) as { note?: string } | null;

  readonly heading = input.required<string>();
  readonly items = input<string[]>([]);

  protected closeFromContent(): void {
    this.modalRef.close({
      reason: 'programmatic',
      data: { source: 'dynamic-content' },
    });
  }
}
