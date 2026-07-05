import { ConcentrationUnit } from './concentration-unit.type';
import { TemperatureUnit } from './temperature-unit.type';

export interface ProfilePreferences {
  temperatureUnit: TemperatureUnit;
  concentrationUnit: ConcentrationUnit;
  defaultAquariumId: string | null;
  emailAlertsEnabled: boolean;
}
