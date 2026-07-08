import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LANGUAGE_OPTIONS } from '../../../../shared/constants/language-options.constant';
import { InputSelectOption } from '../../../../shared/components/select/input-select-option.model';
import { SegmentedControlOption } from '../../../../shared/components/segmented-control/segmented-control-option.model';
import { SegmentedControlComponent } from '../../../../shared/components/segmented-control/segmented-control.component';
import { SettingsCardComponent } from '../../../../shared/components/settings-card/settings-card.component';
import { SwitchComponent } from '../../../../shared/components/switch/switch.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { LanguageCode } from '../../../../shared/types/language-code.type';
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

const LANGUAGE_OPTIONS_SEGMENTED: SegmentedControlOption[] = LANGUAGE_OPTIONS.map((language) => ({
  value: language.code,
  label: language.triggerLabel,
}));

type AlertControlName =
  | 'emailAlertsEnabled'
  | 'phAlertsEnabled'
  | 'temperatureAlertsEnabled'
  | 'ammoniaAlertsEnabled'
  | 'nitriteAlertsEnabled'
  | 'nitrateAlertsEnabled';

@Component({
  selector: 'app-preferences-card',
  standalone: true,
  imports: [ButtonComponent, SegmentedControlComponent, SettingsCardComponent, SwitchComponent],
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
  protected readonly languageOptions = LANGUAGE_OPTIONS_SEGMENTED;

  readonly form = new FormGroup({
    preferredLanguage: new FormControl<LanguageCode>('pt', { nonNullable: true }),
    temperatureUnit: new FormControl<TemperatureUnit>('celsius', { nonNullable: true }),
    concentrationUnit: new FormControl<ConcentrationUnit>('mgL', { nonNullable: true }),
    emailAlertsEnabled: new FormControl(false, { nonNullable: true }),
    phAlertsEnabled: new FormControl(false, { nonNullable: true }),
    temperatureAlertsEnabled: new FormControl(false, { nonNullable: true }),
    ammoniaAlertsEnabled: new FormControl(false, { nonNullable: true }),
    nitriteAlertsEnabled: new FormControl(false, { nonNullable: true }),
    nitrateAlertsEnabled: new FormControl(false, { nonNullable: true }),
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

  protected onPreferredLanguageChange(value: string): void {
    this.form.controls.preferredLanguage.setValue(value as LanguageCode);
    this.form.controls.preferredLanguage.markAsDirty();
  }

  protected onAlertToggleChange(controlName: AlertControlName, checked: boolean): void {
    this.form.controls[controlName].setValue(checked);
    this.form.controls[controlName].markAsDirty();
  }

  protected submit(): void {
    if (this.form.pristine) return;

    this.savePreferences.emit(this.form.getRawValue());
  }
}
