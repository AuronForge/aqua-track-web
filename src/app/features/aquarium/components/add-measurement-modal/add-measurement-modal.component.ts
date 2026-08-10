import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { SelectFormfieldOption } from '../../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../../../../shared/components/formfields/select-formfield/select-formfield.component';
import { TextFormfieldComponent } from '../../../../shared/components/formfields/text-formfield/text-formfield.component';
import { TextareaFormfieldComponent } from '../../../../shared/components/formfields/textarea-formfield/textarea-formfield.component';
import { ModalRef } from '../../../../shared/modal/modal-ref';
import {
  AquariumDetailParameter,
  NewAquariumMeasurementPayload,
} from '../../models/aquarium-detail.model';

@Component({
  selector: 'app-add-measurement-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    DatepickerFormfieldComponent,
    ReactiveFormsModule,
    SelectFormfieldComponent,
    TextareaFormfieldComponent,
    TextFormfieldComponent,
  ],
  templateUrl: './add-measurement-modal.component.html',
  styleUrl: './add-measurement-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMeasurementModalComponent {
  readonly parameters = input.required<readonly AquariumDetailParameter[]>();
  readonly submitMeasurement =
    input.required<(payload: NewAquariumMeasurementPayload) => Observable<void>>();

  private readonly modalRef = inject(ModalRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly saving = signal(false);
  protected readonly submitError = signal(false);

  protected readonly form = new FormGroup({
    parameterKey: new FormControl<string | null>(null, { validators: [Validators.required] }),
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+(?:[,.]\d+)?$/)],
    }),
    date: new FormControl(this.todayIso(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    time: new FormControl(this.currentTime(), {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)],
    }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected readonly parameterOptions = computed<SelectFormfieldOption[]>(() =>
    this.parameters().map((parameter) => ({
      id: parameter.key,
      title: parameter.label,
      subtitle: parameter.unit ? `Unidade: ${parameter.unit}` : 'Sem unidade',
      icon: parameter.icon,
    })),
  );

  protected readonly selectedParameter = computed(() => {
    const selectedKey = this.form.controls.parameterKey.value;
    return this.parameters().find((parameter) => parameter.key === selectedKey) ?? null;
  });

  protected readonly valueSuffix = computed(() => this.selectedParameter()?.unit ?? '');

  protected cancel(): void {
    this.modalRef.close({ reason: 'action', actionId: 'cancel' });
  }

  protected save(): void {
    this.submitError.set(false);
    this.form.markAllAsTouched();

    if (this.form.invalid || this.saving()) {
      return;
    }

    const value = this.form.getRawValue();
    const parameterKey = value.parameterKey;

    if (!parameterKey) {
      return;
    }

    this.saving.set(true);
    this.submitMeasurement()({
      parameterKey,
      value: this.parseNumber(value.value),
      date: value.date,
      time: value.time,
      notes: value.notes.trim() || null,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.modalRef.close({ reason: 'action', actionId: 'save' });
        },
        error: () => {
          this.saving.set(false);
          this.submitError.set(true);
        },
      });
  }

  private parseNumber(value: string): number {
    return Number(value.replace(',', '.'));
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private currentTime(): string {
    return new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
