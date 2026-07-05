import { Injectable } from '@angular/core';

import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { UpdateUserPreferencesRequestDto } from '../../../core/users/models/update-user-preferences-request.dto';
import { buildInitials } from '../../../shared/utils/build-initials.util';
import { ConcentrationUnit } from '../models/concentration-unit.type';
import { ProfilePreferences } from '../models/profile-preferences.model';
import { ProfilePreferencesFormValue } from '../models/profile-preferences-form-value.model';
import { ProfileUser } from '../models/profile-user.model';
import { TemperatureUnit } from '../models/temperature-unit.type';

const TEMPERATURE_UNIT_FROM_DTO: Record<string, TemperatureUnit> = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit',
};

const CONCENTRATION_UNIT_FROM_DTO: Record<string, ConcentrationUnit> = {
  MG_L: 'mgL',
  PPM: 'ppm',
};

const TEMPERATURE_UNIT_TO_DTO: Record<TemperatureUnit, string> = {
  celsius: 'CELSIUS',
  fahrenheit: 'FAHRENHEIT',
};

const CONCENTRATION_UNIT_TO_DTO: Record<ConcentrationUnit, string> = {
  mgL: 'MG_L',
  ppm: 'PPM',
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
      temperatureUnit: TEMPERATURE_UNIT_FROM_DTO[dto.preferences.temperatureUnit] ?? 'celsius',
      concentrationUnit: CONCENTRATION_UNIT_FROM_DTO[dto.preferences.measurementUnit] ?? 'mgL',
      defaultAquariumId: null,
      emailAlertsEnabled: dto.preferences.notificationsEnabled,
    };
  }

  mapPreferencesFormToRequest(value: ProfilePreferencesFormValue): UpdateUserPreferencesRequestDto {
    return {
      temperatureUnit: TEMPERATURE_UNIT_TO_DTO[value.temperatureUnit],
      measurementUnit: CONCENTRATION_UNIT_TO_DTO[value.concentrationUnit],
      notificationsEnabled: value.emailAlertsEnabled,
    };
  }
}
