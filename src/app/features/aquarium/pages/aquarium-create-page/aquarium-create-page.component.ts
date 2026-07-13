import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  CardSelectionComponent,
  CardSelectionContentDirective,
  CardSelectionOption,
} from '../../../../shared/components/card-selection';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { TextFormfieldComponent } from '../../../../shared/components/formfields/text-formfield/text-formfield.component';
import { TextareaFormfieldComponent } from '../../../../shared/components/formfields/textarea-formfield/textarea-formfield.component';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { buildAquariumTypeOptions } from '../../constants/aquarium-type-options.constant';
import { mapAquariumCreateFormToPayload } from '../../mappers/aquarium-create.mapper';
import { CreateAquariumPayload } from '../../models/aquarium-api.dto';
import { AquariumTypeOptionId } from '../../models/aquarium-type-option.model';
import { calculateAquariumVolumeLiters } from '../../utils/aquarium-volume.util';
import { positiveNumberValidator } from '../../validators/positive-number.validator';
import { trimmedRequiredValidator } from '../../validators/trimmed-required.validator';

@Component({
  selector: 'app-aquarium-create-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonComponent,
    CardSelectionComponent,
    CardSelectionContentDirective,
    DatepickerFormfieldComponent,
    TextFormfieldComponent,
    TextareaFormfieldComponent,
    PhotoUploadComponent,
  ],
  templateUrl: './aquarium-create-page.component.html',
  styleUrl: './aquarium-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumCreatePageComponent {
  private readonly pageTitleService = inject(PageTitleService);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly router = inject(Router);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;
  protected readonly selectedPhotoName = signal<string | null>(null);
  protected readonly lastPayload = signal<CreateAquariumPayload | null>(null);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [trimmedRequiredValidator()],
    }),
    aquariumType: new FormControl<AquariumTypeOptionId | null>(null, {
      validators: [Validators.required],
    }),
    setupDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lengthCm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, positiveNumberValidator()],
    }),
    widthCm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, positiveNumberValidator()],
    }),
    heightCm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, positiveNumberValidator()],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue()), takeUntilDestroyed()),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly aquariumTypeOptions = computed<CardSelectionOption<AquariumTypeOptionId>[]>(
    () => buildAquariumTypeOptions(this.t()),
  );

  protected readonly volumeLiters = computed(() => {
    const value = this.formValue();

    return calculateAquariumVolumeLiters(value.lengthCm, value.widthCm, value.heightCm);
  });

  protected readonly hasVolume = computed(() => this.volumeLiters() !== null);

  protected readonly requiredErrorMessages = computed(() => ({
    required: this.t().aquariumCreateRequiredError,
  }));

  protected readonly dimensionErrorMessages = computed(() => ({
    required: this.t().aquariumCreateRequiredError,
    number: this.t().aquariumCreateNumberError,
    positive: this.t().aquariumCreatePositiveNumberError,
  }));

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().aquariumFormTitle);
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalidField();
      this.feedbackMessageService.showWarning(this.t().aquariumCreateValidationSummary, {
        hasIcon: true,
        horizontalPosition: 'top',
        verticalPosition: 'end',
      });
      return;
    }

    const payload = mapAquariumCreateFormToPayload(this.form.getRawValue());
    this.lastPayload.set(payload);

    this.feedbackMessageService.showInformation(this.t().aquariumCreateApiDisabledMessage, {
      hasIcon: true,
      horizontalPosition: 'top',
      verticalPosition: 'end',
    });
  }

  protected onCancel(): void {
    this.router.navigate(['/home']);
  }

  protected onPhotoSelected(file: File): void {
    this.selectedPhotoName.set(file.name);
  }

  protected onPhotoRejected(): void {
    this.selectedPhotoName.set(null);
  }

  private focusFirstInvalidField(): void {
    queueMicrotask(() => {
      const invalidElement = this.elementRef.nativeElement.querySelector<HTMLElement>(
        '.ng-invalid input, .ng-invalid textarea, .card-selection--invalid input',
      );

      invalidElement?.focus();
    });
  }
}
