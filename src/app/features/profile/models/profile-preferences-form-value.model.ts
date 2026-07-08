import { ConcentrationUnit } from './concentration-unit.type';
import { LanguageCode } from '../../../shared/types/language-code.type';
import { TemperatureUnit } from './temperature-unit.type';

export interface ProfilePreferencesFormValue {
  preferredLanguage: LanguageCode;
  temperatureUnit: TemperatureUnit;
  concentrationUnit: ConcentrationUnit;
  emailAlertsEnabled: boolean;
  phAlertsEnabled: boolean;
  temperatureAlertsEnabled: boolean;
  ammoniaAlertsEnabled: boolean;
  nitriteAlertsEnabled: boolean;
  nitrateAlertsEnabled: boolean;
}
