export interface UpdateUserPreferencesRequestDto {
  readonly language: string;
  readonly temperatureUnit: string;
  readonly concentrationUnit: string;
  readonly notificationsEnabled: boolean;
  readonly phAlertEnabled: boolean;
  readonly temperatureAlertEnabled: boolean;
  readonly ammoniaAlertEnabled: boolean;
  readonly nitriteAlertEnabled: boolean;
  readonly nitrateAlertEnabled: boolean;
}
