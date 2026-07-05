export interface UpdateUserPreferencesRequestDto {
  readonly temperatureUnit: string;
  readonly measurementUnit: string;
  readonly notificationsEnabled: boolean;
}
