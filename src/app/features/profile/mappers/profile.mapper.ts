import { Injectable } from '@angular/core';

import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { UpdateUserPreferencesRequestDto } from '../../../core/users/models/update-user-preferences-request.dto';
import { API_LOCALE_LANGUAGE_CODE_MAP } from '../../../shared/constants/language-locale.constant';
import { buildInitials } from '../../../shared/utils/build-initials.util';
import { ConcentrationUnit } from '../models/concentration-unit.type';
import { ProfilePreferences } from '../models/profile-preferences.model';
import { ProfilePreferencesFormValue } from '../models/profile-preferences-form-value.model';
import { ProfileUser } from '../models/profile-user.model';
import { TemperatureUnit } from '../models/temperature-unit.type';

const TEMPERATURE_UNIT_FROM_DTO: Record<string, TemperatureUnit> = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
  celsius: 'celsius',
  fahrenheit: 'fahrenheit',
};

const CONCENTRATION_UNIT_FROM_DTO: Record<string, ConcentrationUnit> = {
  MG_L: 'mgL',
  PPM: 'ppm',
  mgL: 'mgL',
  ppm: 'ppm',
};

const TEMPERATURE_UNIT_TO_DTO: Record<TemperatureUnit, string> = {
  celsius: 'celsius',
  fahrenheit: 'fahrenheit',
};

const CONCENTRATION_UNIT_TO_DTO: Record<ConcentrationUnit, string> = {
  mgL: 'mg/ml',
  ppm: 'ppm',
};

@Injectable({ providedIn: 'root' })
export class ProfileMapper {
  mapUserToProfileUser(dto: UserApiDto): ProfileUser {
    return {
      id: dto.id,
      fullName: dto.name,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      avatarUrl: dto.avatarUrl,
      initials: buildInitials(dto.name),
      memberSince: dto.createdAt,
    };
  }

  mapUserToProfilePreferences(dto: UserApiDto): ProfilePreferences {
    return {
      preferredLanguage: API_LOCALE_LANGUAGE_CODE_MAP[dto.preferences.language] ?? 'pt',
      temperatureUnit: TEMPERATURE_UNIT_FROM_DTO[dto.preferences.temperatureUnit] ?? 'celsius',
      concentrationUnit: CONCENTRATION_UNIT_FROM_DTO[dto.preferences.concentrationUnit] ?? 'mgL',
      emailAlertsEnabled: dto.preferences.notificationsEnabled,
      phAlertsEnabled: dto.preferences.phAlertEnabled,
      temperatureAlertsEnabled: dto.preferences.temperatureAlertEnabled,
      ammoniaAlertsEnabled: dto.preferences.ammoniaAlertEnabled,
      nitriteAlertsEnabled: dto.preferences.nitriteAlertEnabled,
      nitrateAlertsEnabled: dto.preferences.nitrateAlertEnabled,
    };
  }

  mapPreferencesFormToRequest(
    value: ProfilePreferencesFormValue,
    language: string,
  ): UpdateUserPreferencesRequestDto {
    return {
      language,
      temperatureUnit: TEMPERATURE_UNIT_TO_DTO[value.temperatureUnit],
      concentrationUnit: CONCENTRATION_UNIT_TO_DTO[value.concentrationUnit],
      notificationsEnabled: value.emailAlertsEnabled,
      phAlertEnabled: value.phAlertsEnabled,
      temperatureAlertEnabled: value.temperatureAlertsEnabled,
      ammoniaAlertEnabled: value.ammoniaAlertsEnabled,
      nitriteAlertEnabled: value.nitriteAlertsEnabled,
      nitrateAlertEnabled: value.nitrateAlertsEnabled,
    };
  }
}
