import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { ButtonComponent } from '../button/button.component';
import { ConfirmationDialogData } from './confirmation-dialog-data.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-confirmation-dialog',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'confirmation-dialog',
  },
})
export class ConfirmationDialogComponent {
  protected readonly data = inject<ConfirmationDialogData>(DIALOG_DATA);
  private readonly dialogRef = inject(DialogRef<boolean>);

  protected readonly confirmText = signal('');

  protected readonly isConfirmDisabled = computed(() => {
    const requiredWord = this.data.confirmWord;
    return !!requiredWord && this.confirmText() !== requiredWord;
  });

  protected onConfirmTextInput(event: Event): void {
    this.confirmText.set((event.target as HTMLInputElement).value);
  }

  protected confirm(): void {
    if (this.isConfirmDisabled()) return;
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
