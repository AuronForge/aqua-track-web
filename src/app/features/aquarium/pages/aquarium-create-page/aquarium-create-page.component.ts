import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { concatMap, of, startWith } from 'rxjs';

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
import { SwitchComponent } from '../../../../shared/components/switch/switch.component';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { mapAquariumWaterTypeOptions } from '../../constants/aquarium-water-type-options.constant';
import {
  ALL_DISPLAY_PARAMETER_KEYS,
  AquariumDisplayParameterKey,
  DEFAULT_DISPLAY_PARAMETER_KEYS,
  mapDisplayParameterOptions,
} from '../../constants/aquarium-display-parameter-options.constant';
import {
  isAquariumTypeAllowedForWaterType,
  mapAquariumTypeOptions,
} from '../../constants/aquarium-type-options.constant';
import { mapAquariumCreateFormToPayload } from '../../mappers/aquarium-create.mapper';
import { AquariumWaterType, CreateAquariumPayload } from '../../models/aquarium-api.dto';
import { SystemValueApiDto } from '../../models/system-value-api.dto';
import { AquariumTypeOptionId } from '../../models/aquarium-type-option.model';
import { AquariumApiService } from '../../services/aquarium-api.service';
import { SystemValuesApiService } from '../../services/system-values-api.service';
import {
  calculateAquariumVolumeLiters,
  parseLocalizedNumber,
} from '../../utils/aquarium-volume.util';
import { positiveNumberValidator } from '../../validators/positive-number.validator';
import { trimmedRequiredValidator } from '../../validators/trimmed-required.validator';
import { AquariumCreateFormValue } from '../../models/aquarium-create-form-value.model';

interface AlertParameterControls {
  enabled: FormControl<boolean>;
  minimumValue: FormControl<string>;
  maximumValue: FormControl<string>;
  targetValue: FormControl<string>;
}

type AlertParameterGroup = FormGroup<AlertParameterControls>;

type AlertParametersControls = Record<AquariumDisplayParameterKey, AlertParameterGroup>;

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
    SwitchComponent,
  ],
  templateUrl: './aquarium-create-page.component.html',
  styleUrl: './aquarium-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumCreatePageComponent implements OnInit {
  private readonly pageTitleService = inject(PageTitleService);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly systemValuesApiService = inject(SystemValuesApiService);
  private readonly aquariumApiService = inject(AquariumApiService);
  protected readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;
  protected readonly selectedPhotoName = signal<string | null>(null);
  protected readonly selectedPhotoFile = signal<File | null>(null);
  protected readonly lastPayload = signal<CreateAquariumPayload | null>(null);
  protected readonly aquariumTypeOptionsLoading = signal(true);
  protected readonly aquariumTypeOptionsError = signal(false);
  protected readonly waterTypeOptionsLoading = signal(true);
  protected readonly waterTypeOptionsError = signal(false);
  protected readonly isSubmitting = signal(false);
  private readonly aquariumTypeSystemValues = signal<readonly SystemValueApiDto[]>([]);
  private readonly waterTypeSystemValues = signal<readonly SystemValueApiDto[]>([]);

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [trimmedRequiredValidator()],
    }),
    aquariumType: new FormControl<AquariumTypeOptionId | null>(null, {
      validators: [Validators.required],
    }),
    waterType: new FormControl<AquariumWaterType | null>(null, {
      validators: [Validators.required],
    }),
    setupDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    usePhysicalDimensions: new FormControl(true, {
      nonNullable: true,
    }),
    lengthCm: new FormControl('', {
      nonNullable: true,
      validators: [],
    }),
    widthCm: new FormControl('', {
      nonNullable: true,
      validators: [],
    }),
    heightCm: new FormControl('', {
      nonNullable: true,
      validators: [],
    }),
    volume: new FormControl('', {
      nonNullable: true,
      validators: [],
    }),
    displayParameters: new FormControl<readonly AquariumDisplayParameterKey[]>(
      DEFAULT_DISPLAY_PARAMETER_KEYS,
      { nonNullable: true },
    ),
    alertChannels: new FormGroup({
      dashboard: new FormControl(true, { nonNullable: true }),
      email: new FormControl(false, { nonNullable: true }),
    }),
    alertParameters: this.buildAlertParametersGroup(),
    description: new FormControl('', { nonNullable: true }),
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue()), takeUntilDestroyed()),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly aquariumTypeOptions = computed<CardSelectionOption<AquariumTypeOptionId>[]>(
    () =>
      mapAquariumTypeOptions(
        this.aquariumTypeSystemValues(),
        this.t(),
        this.formValue().waterType ?? null,
      ),
  );
  protected readonly aquariumTypeHint = computed(() => {
    if (this.aquariumTypeOptionsLoading()) {
      return this.t().aquariumCreateTypeLoadingHint;
    }

    if (this.aquariumTypeOptionsError()) {
      return this.t().aquariumCreateTypeLoadErrorHint;
    }

    return this.t().aquariumCreateTypeHint;
  });
  protected readonly aquariumTypeDisabled = computed(
    () => this.aquariumTypeOptionsLoading() || this.aquariumTypeOptionsError(),
  );
  protected readonly aquariumWaterTypeOptions = computed<CardSelectionOption<AquariumWaterType>[]>(
    () => mapAquariumWaterTypeOptions(this.waterTypeSystemValues(), this.t()),
  );
  protected readonly aquariumWaterTypeHint = computed(() => {
    if (this.waterTypeOptionsLoading()) {
      return this.t().aquariumCreateWaterTypeLoadingHint;
    }

    if (this.waterTypeOptionsError()) {
      return this.t().aquariumCreateWaterTypeLoadErrorHint;
    }

    return this.t().aquariumCreateWaterTypeHint;
  });
  protected readonly displayParameterOptions = computed<
    CardSelectionOption<AquariumDisplayParameterKey>[]
  >(() => mapDisplayParameterOptions(this.t()));

  protected readonly volumeLiters = computed(() => {
    const value = this.formValue();
    const usePhysicalDimensions = value.usePhysicalDimensions ?? true;

    if (usePhysicalDimensions) {
      return calculateAquariumVolumeLiters(value.lengthCm, value.widthCm, value.heightCm);
    }

    const volume = parseLocalizedNumber(value.volume);

    return volume && volume > 0 ? volume : null;
  });

  protected readonly hasVolume = computed(() => this.volumeLiters() !== null);
  protected readonly usesPhysicalDimensions = computed(
    () => this.formValue().usePhysicalDimensions ?? true,
  );
  protected readonly volumeLabel = computed(() =>
    this.usesPhysicalDimensions()
      ? this.t().aquariumCreateVolumeCalculatedLabel
      : this.t().aquariumCreateVolumeProvidedLabel,
  );

  protected readonly requiredErrorMessages = computed(() => ({
    required: this.t().aquariumCreateRequiredError,
  }));

  protected readonly dimensionErrorMessages = computed(() => ({
    required: this.t().aquariumCreateRequiredError,
    number: this.t().aquariumCreateNumberError,
    positive: this.t().aquariumCreatePositiveNumberError,
  }));

  protected readonly alertValueErrorMessages = computed(() => ({
    required: this.t().aquariumCreateRequiredError,
    number: this.t().aquariumCreateNumberError,
    positive: this.t().aquariumCreatePositiveNumberError,
    alertMaximumRange: this.t().aquariumCreateAlertMaximumRangeError,
    alertTargetRange: this.t().aquariumCreateAlertTargetRangeError,
  }));

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().aquariumFormTitle);
    });

    effect(() => {
      const waterType = this.formValue().waterType ?? null;
      const aquariumType = this.formValue().aquariumType;

      if (!aquariumType || isAquariumTypeAllowedForWaterType(aquariumType, waterType)) {
        return;
      }

      this.form.controls.aquariumType.setValue(null);
    });

    effect(() => {
      this.syncDimensionValidators(this.formValue().usePhysicalDimensions ?? true);
    });

    effect(() => {
      this.formValue();
      this.syncAlertParameterStates();
      this.syncAlertThresholdErrors();
    });

    effect(() => {
      this.waterTypeOptionsLoading();
      this.waterTypeOptionsError();
      this.aquariumTypeOptionsLoading();
      this.aquariumTypeOptionsError();
      this.syncSelectorControlStates();
    });
  }

  ngOnInit(): void {
    this.loadAquariumTypeOptions();
    this.loadWaterTypeOptions();
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.syncDimensionValidators(this.form.getRawValue().usePhysicalDimensions);

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

    const payload = mapAquariumCreateFormToPayload(
      this.form.getRawValue() as AquariumCreateFormValue,
    );
    this.lastPayload.set(payload);
    this.isSubmitting.set(true);

    this.aquariumApiService
      .createAquarium(payload)
      .pipe(
        concatMap((aquarium) => {
          const selectedPhoto = this.selectedPhotoFile();

          if (!selectedPhoto) {
            return of(aquarium);
          }

          return this.aquariumApiService
            .uploadAquariumPhoto(aquarium.id, selectedPhoto)
            .pipe(concatMap(() => of(aquarium)));
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.feedbackMessageService.showSuccess(this.t().aquariumCreateSuccessMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this.router.navigate(['/home']);
        },
        error: () => {
          this.isSubmitting.set(false);
          this.feedbackMessageService.showError(this.t().aquariumCreateErrorMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
        },
      });
  }

  protected onCancel(): void {
    this.router.navigate(['/home']);
  }

  protected onPhotoSelected(file: File): void {
    this.selectedPhotoFile.set(file);
    this.selectedPhotoName.set(file.name);
  }

  protected onPhotoRejected(): void {
    this.selectedPhotoFile.set(null);
    this.selectedPhotoName.set(null);
  }

  protected onUsePhysicalDimensionsChange(checked: boolean): void {
    this.form.controls.usePhysicalDimensions.setValue(checked);
  }

  protected isDisplayParameterSelected(parameter: AquariumDisplayParameterKey): boolean {
    return this.form.controls.displayParameters.value.includes(parameter);
  }

  protected onDisplayParameterToggle(
    parameter: AquariumDisplayParameterKey,
    checked: boolean,
  ): void {
    const selectedParameters = this.form.controls.displayParameters.value;

    if (checked) {
      if (selectedParameters.includes(parameter)) {
        return;
      }

      this.form.controls.displayParameters.setValue([...selectedParameters, parameter]);
      return;
    }

    this.form.controls.displayParameters.setValue(
      selectedParameters.filter((selectedParameter) => selectedParameter !== parameter),
    );
  }

  protected isAlertParameterEnabled(parameter: AquariumDisplayParameterKey): boolean {
    return this.alertParameterGroup(parameter).controls.enabled.value;
  }

  protected onAlertParameterToggle(parameter: AquariumDisplayParameterKey, checked: boolean): void {
    this.alertParameterGroup(parameter).controls.enabled.setValue(checked);
  }

  protected isAlertChannelEnabled(channel: 'dashboard' | 'email'): boolean {
    return this.form.controls.alertChannels.controls[channel].value;
  }

  protected onAlertChannelToggle(channel: 'dashboard' | 'email', checked: boolean): void {
    this.form.controls.alertChannels.controls[channel].setValue(checked);
  }

  private loadAquariumTypeOptions(): void {
    this.aquariumTypeOptionsLoading.set(true);
    this.aquariumTypeOptionsError.set(false);

    this.systemValuesApiService
      .listAquariumTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (values) => {
          this.aquariumTypeSystemValues.set(values);
          this.aquariumTypeOptionsLoading.set(false);
        },
        error: () => {
          this.aquariumTypeSystemValues.set([]);
          this.aquariumTypeOptionsLoading.set(false);
          this.aquariumTypeOptionsError.set(true);
        },
      });
  }

  private loadWaterTypeOptions(): void {
    this.waterTypeOptionsLoading.set(true);
    this.waterTypeOptionsError.set(false);

    this.systemValuesApiService
      .listWaterTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (values) => {
          this.waterTypeSystemValues.set(values);
          this.waterTypeOptionsLoading.set(false);
        },
        error: () => {
          this.waterTypeSystemValues.set([]);
          this.waterTypeOptionsLoading.set(false);
          this.waterTypeOptionsError.set(true);
        },
      });
  }

  private focusFirstInvalidField(): void {
    queueMicrotask(() => {
      const invalidElement = this.elementRef.nativeElement.querySelector<HTMLElement>(
        '.ng-invalid input, .ng-invalid textarea, .card-selection--invalid input',
      );

      invalidElement?.focus();
    });
  }

  private syncSelectorControlStates(): void {
    this.setControlDisabledState(
      this.form.controls.waterType,
      this.waterTypeOptionsLoading() || this.waterTypeOptionsError(),
    );
    this.setControlDisabledState(
      this.form.controls.aquariumType,
      this.aquariumTypeOptionsLoading() || this.aquariumTypeOptionsError(),
    );
  }

  private setControlDisabledState<T>(control: FormControl<T>, shouldDisable: boolean): void {
    if (shouldDisable && control.enabled) {
      control.disable({ emitEvent: false });
      return;
    }

    if (!shouldDisable && control.disabled) {
      control.enable({ emitEvent: false });
    }
  }

  private syncDimensionValidators(usePhysicalDimensions: boolean): void {
    const requiredPositiveValidators = [Validators.required, positiveNumberValidator()];

    this.form.controls.lengthCm.setValidators(
      usePhysicalDimensions ? requiredPositiveValidators : [],
    );
    this.form.controls.widthCm.setValidators(
      usePhysicalDimensions ? requiredPositiveValidators : [],
    );
    this.form.controls.heightCm.setValidators(
      usePhysicalDimensions ? requiredPositiveValidators : [],
    );
    this.form.controls.volume.setValidators(
      usePhysicalDimensions ? [] : requiredPositiveValidators,
    );

    this.form.controls.lengthCm.updateValueAndValidity({ emitEvent: false });
    this.form.controls.widthCm.updateValueAndValidity({ emitEvent: false });
    this.form.controls.heightCm.updateValueAndValidity({ emitEvent: false });
    this.form.controls.volume.updateValueAndValidity({ emitEvent: false });
  }

  private buildAlertParametersGroup(): FormGroup {
    return new FormGroup<AlertParametersControls>(
      Object.fromEntries(
        ALL_DISPLAY_PARAMETER_KEYS.map((key) => [
          key,
          new FormGroup<AlertParameterControls>({
            enabled: new FormControl(false, { nonNullable: true }),
            minimumValue: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
            maximumValue: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
            targetValue: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
          }),
        ]),
      ) as AlertParametersControls,
    );
  }

  private alertParameterGroup(parameter: AquariumDisplayParameterKey): AlertParameterGroup {
    return this.form.controls.alertParameters.controls[parameter] as AlertParameterGroup;
  }

  private syncAlertParameterStates(): void {
    ALL_DISPLAY_PARAMETER_KEYS.forEach((parameter) => {
      const group = this.alertParameterGroup(parameter);
      const enabled = group.controls.enabled.value;
      const valueControls = [
        group.controls.minimumValue,
        group.controls.maximumValue,
        group.controls.targetValue,
      ];

      valueControls.forEach((control) => {
        control.setValidators(enabled ? [Validators.required, positiveNumberValidator()] : []);

        if (enabled) {
          control.enable({ emitEvent: false });
        } else {
          control.disable({ emitEvent: false });
          control.setErrors(null);
        }

        control.updateValueAndValidity({ emitEvent: false });
      });
    });
  }

  private syncAlertThresholdErrors(): void {
    ALL_DISPLAY_PARAMETER_KEYS.forEach((parameter) => {
      const group = this.alertParameterGroup(parameter);
      const enabled = group.controls.enabled.value;
      const minimumControl = group.controls.minimumValue;
      const maximumControl = group.controls.maximumValue;
      const targetControl = group.controls.targetValue;

      this.removeControlError(maximumControl, 'alertMaximumRange');
      this.removeControlError(targetControl, 'alertTargetRange');

      if (!enabled) {
        return;
      }

      const minimum = parseLocalizedNumber(minimumControl.value);
      const maximum = parseLocalizedNumber(maximumControl.value);
      const target = parseLocalizedNumber(targetControl.value);

      if (minimum === null || maximum === null || target === null) {
        return;
      }

      if (maximum <= minimum) {
        this.addControlError(maximumControl, 'alertMaximumRange');
      }

      if (target < minimum || target > maximum) {
        this.addControlError(targetControl, 'alertTargetRange');
      }
    });
  }

  private addControlError(
    control: FormControl<string>,
    key: 'alertMaximumRange' | 'alertTargetRange',
  ): void {
    const currentErrors = control.errors ?? {};

    if (currentErrors[key]) {
      return;
    }

    control.setErrors({ ...currentErrors, [key]: true });
  }

  private removeControlError(
    control: FormControl<string>,
    key: 'alertMaximumRange' | 'alertTargetRange',
  ): void {
    const currentErrors = control.errors;

    if (!currentErrors?.[key]) {
      return;
    }

    const { [key]: removedError, ...remainingErrors } = currentErrors;
    void removedError;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}
