import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ButtonComponent } from '../button/button.component';
import { TextFormfieldComponent } from '../formfields/text-formfield/text-formfield.component';
import { ConfirmationDialogData } from './confirmation-dialog-data.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-confirmation-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, TextFormfieldComponent],
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly confirmControl = new FormControl('', { nonNullable: true });
  private readonly confirmText = signal('');

  protected readonly isConfirmDisabled = computed(() => {
    const requiredWord = this.data.confirmWord;
    return !!requiredWord && this.confirmText() !== requiredWord;
  });

  constructor() {
    this.confirmControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.confirmText.set(value));
  }

  protected confirm(): void {
    if (this.isConfirmDisabled()) return;
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
