import { Dialog } from '@angular/cdk/dialog';
import { Injectable, inject } from '@angular/core';

import { ModalComponent } from '../components/modal/modal.component';
import { ModalComponentData } from '../components/modal/modal-component-data.model';
import { ModalConfig } from '../components/modal/modal-config.model';
import { ModalCloseResult } from '../components/modal/modal-close-result.model';
import { ModalRef } from '../modal/modal-ref';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(Dialog);

  open(config: ModalConfig): ModalRef {
    const normalizedConfig = this.normalizeConfig(config);
    const modalRef = new ModalRef();
    const dialogRef = this.dialog.open<ModalCloseResult | undefined, ModalComponentData>(
      ModalComponent,
      {
        data: {
          config: normalizedConfig,
          modalRef,
        },
        role: normalizedConfig.role,
        ariaModal: true,
        disableClose: true,
        hasBackdrop: normalizedConfig.hasBackdrop,
        panelClass: ['modal-panel', `modal-panel--${normalizedConfig.size}`],
        backdropClass: normalizedConfig.hasBackdrop
          ? ['cdk-overlay-dark-backdrop', 'modal-backdrop']
          : undefined,
      },
    );

    modalRef.attachDialogRef(dialogRef);

    dialogRef.backdropClick.subscribe((event) => {
      modalRef.emitBackdropClicked(event);

      if (normalizedConfig.closeOnBackdropClick) {
        modalRef.close({ reason: 'backdrop' });
      }
    });

    dialogRef.keydownEvents.subscribe((event) => {
      if (event.key !== 'Escape' || !normalizedConfig.closeOnEscape) return;

      event.preventDefault();
      event.stopPropagation();
      modalRef.close({ reason: 'escape' });
    });

    return modalRef;
  }

  private normalizeConfig(config: ModalConfig): ModalConfig {
    return {
      size: 'medium',
      role: 'dialog',
      showCloseButton: false,
      closeOnBackdropClick: true,
      closeOnEscape: true,
      hasBackdrop: true,
      actions: [],
      contentComponentInputs: {},
      contentTemplateContext: {},
      ...config,
    };
  }
}
