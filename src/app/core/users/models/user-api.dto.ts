export interface UserPreferencesDto {
  readonly id: string;
  readonly userId: string;
  readonly language: string;
  readonly timezone: string;
  readonly theme: string;
  readonly temperatureUnit: string;
  readonly measurementUnit: string;
  readonly notificationsEnabled: boolean;
  readonly phAlertEnabled: boolean;
  readonly temperatureAlertEnabled: boolean;
  readonly ammoniaAlertEnabled: boolean;
  readonly nitriteAlertEnabled: boolean;
  readonly nitrateAlertEnabled: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface UserApiDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone: string | null;
  readonly birthDate: string | null;
  readonly avatarUrl: string | null;
  readonly role: string;
  readonly plan: string;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
  readonly preferences: UserPreferencesDto;
}
