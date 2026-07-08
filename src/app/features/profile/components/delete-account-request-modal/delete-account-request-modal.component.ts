import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { RequestAccountDeletionDto } from '../../../../core/users/models/request-account-deletion.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ModalRef } from '../../../../shared/modal/modal-ref';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-delete-account-request-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './delete-account-request-modal.component.html',
  styleUrl: './delete-account-request-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccountRequestModalComponent implements AfterViewInit {
  private readonly modalRef = inject(ModalRef);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitDeleteAccountRequest =
    input.required<(payload: RequestAccountDeletionDto) => Observable<void>>();

  private readonly reasonInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('reasonInput');

  protected readonly t = this.languageService.translation;
  protected readonly isSubmitting = signal(false);
  protected readonly submissionError = signal<string | null>(null);

  protected readonly form = new FormGroup({
    reason: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.submissionError.set(null);
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.reasonInput().nativeElement.focus());
  }

  protected close(reason: 'cancel' | 'close-button'): void {
    this.resetState();
    this.modalRef.close(
      reason === 'close-button'
        ? { reason: 'close-button' }
        : { reason: 'programmatic', data: { source: 'delete-account-request-cancel' } },
    );
  }

  protected submit(): void {
    if (this.isSubmitting()) return;

    const reason = this.form.controls.reason.getRawValue().trim();

    this.isSubmitting.set(true);
    this.submissionError.set(null);
    this.form.disable({ emitEvent: false });

    this.submitDeleteAccountRequest()({
      reason: reason || null,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.form.enable({ emitEvent: false });
          this.feedbackMessageService.showSuccess(this.t().deleteAccountRequestSuccessMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this.resetState();
          this.modalRef.close({
            reason: 'programmatic',
            data: { source: 'delete-account-request-success' },
          });
        },
        error: () => {
          this.isSubmitting.set(false);
          this.form.enable({ emitEvent: false });
          this.submissionError.set(this.t().deleteAccountRequestErrorMessage);
        },
      });
  }

  private resetState(): void {
    this.form.reset(
      {
        reason: '',
      },
      { emitEvent: false },
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.enable({ emitEvent: false });
    this.isSubmitting.set(false);
    this.submissionError.set(null);
  }
}
