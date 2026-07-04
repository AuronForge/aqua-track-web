import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputSelectChangeEvent } from '../../../../shared/components/select/input-select-change-event.model';
import { InputSelectComponent } from '../../../../shared/components/select/input-select.component';
import { InputSelectOption } from '../../../../shared/components/select/input-select-option.model';
import { SegmentedControlOption } from '../../../../shared/components/segmented-control/segmented-control-option.model';
import { SegmentedControlComponent } from '../../../../shared/components/segmented-control/segmented-control.component';
import { SettingsCardComponent } from '../../../../shared/components/settings-card/settings-card.component';
import { SwitchComponent } from '../../../../shared/components/switch/switch.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { ConcentrationUnit } from '../../models/concentration-unit.type';
import { ProfilePreferences } from '../../models/profile-preferences.model';
import { ProfilePreferencesFormValue } from '../../models/profile-preferences-form-value.model';
import { TemperatureUnit } from '../../models/temperature-unit.type';

const TEMPERATURE_OPTIONS: SegmentedControlOption[] = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

const CONCENTRATION_OPTIONS: SegmentedControlOption[] = [
  { value: 'mgL', label: 'mg/L' },
  { value: 'ppm', label: 'ppm' },
];

@Component({
  selector: 'app-preferences-card',
  standalone: true,
  imports: [
    ButtonComponent,
    InputSelectComponent,
    SegmentedControlComponent,
    SettingsCardComponent,
    SwitchComponent,
  ],
  templateUrl: './preferences-card.component.html',
  styleUrl: './preferences-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesCardComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;

  readonly preferences = input.required<ProfilePreferences>();
  readonly aquariumOptions = input<InputSelectOption[]>([]);
  readonly saving = input<boolean>(false);
  readonly saveSuccess = input<boolean>(false);
  readonly error = input<string | null>(null);

  readonly savePreferences = output<ProfilePreferencesFormValue>();

  protected readonly temperatureOptions = TEMPERATURE_OPTIONS;
  protected readonly concentrationOptions = CONCENTRATION_OPTIONS;

  readonly form = new FormGroup({
    temperatureUnit: new FormControl<TemperatureUnit>('celsius', { nonNullable: true }),
    concentrationUnit: new FormControl<ConcentrationUnit>('mgL', { nonNullable: true }),
    defaultAquariumId: new FormControl<string | null>(null),
    emailAlertsEnabled: new FormControl(false, { nonNullable: true }),
  });

  protected readonly selectedAquariumOption = computed<InputSelectOption | null>(() => {
    const id = this.form.controls.defaultAquariumId.value;
    return this.aquariumOptions().find((option) => option.id === id) ?? null;
  });

  constructor() {
    effect(() => {
      const preferences = this.preferences();
      this.form.patchValue(preferences, { emitEvent: false });
      this.form.markAsPristine();
    });

    effect(() => {
      if (this.saveSuccess()) {
        this.form.markAsPristine();
      }
    });
  }

  protected onTemperatureUnitChange(value: string): void {
    this.form.controls.temperatureUnit.setValue(value as TemperatureUnit);
    this.form.controls.temperatureUnit.markAsDirty();
  }

  protected onConcentrationUnitChange(value: string): void {
    this.form.controls.concentrationUnit.setValue(value as ConcentrationUnit);
    this.form.controls.concentrationUnit.markAsDirty();
  }

  protected onDefaultAquariumChange(event: InputSelectChangeEvent): void {
    this.form.controls.defaultAquariumId.setValue(event.option.id);
    this.form.controls.defaultAquariumId.markAsDirty();
  }

  protected onEmailAlertsChange(checked: boolean): void {
    this.form.controls.emailAlertsEnabled.setValue(checked);
    this.form.controls.emailAlertsEnabled.markAsDirty();
  }

  protected submit(): void {
    if (this.form.pristine) return;

    this.savePreferences.emit(this.form.getRawValue());
  }
}
