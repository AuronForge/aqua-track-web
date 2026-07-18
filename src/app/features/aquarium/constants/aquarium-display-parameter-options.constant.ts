import { CardSelectionOption } from '../../../shared/components/card-selection';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import { AquariumDisplayPreferencesValues } from '../models/aquarium-api.dto';
import { DEFAULT_AQUARIUM_DISPLAY_PREFERENCES } from './aquarium-display-preferences.constant';

export type AquariumDisplayParameterKey = keyof AquariumDisplayPreferencesValues;

const DISPLAY_PARAMETER_LABELS: Record<
  AquariumDisplayParameterKey,
  (t: TranslationDictionary) => string
> = {
  displayPH: (t) => t.paramNamePh,
  displayGH: (t) => t.paramNameGh,
  displayKH: (t) => t.paramNameKh,
  displayNitrate: (t) => t.paramNameNitrate,
  displayNitrite: (t) => t.paramNameNitrite,
  displayAmmonia: (t) => t.paramNameAmmonia,
  displayTemperature: (t) => t.paramNameTemperature,
  displayTDS: (t) => t.paramNameTds,
  displayCopper: (t) => t.paramNameCopper,
  displayPhosphate: (t) => t.paramNamePhosphate,
  displayIron: (t) => t.paramNameIron,
  displayCO2: (t) => t.paramNameCo2,
  displayO2: (t) => t.paramNameO2,
  displayCalcium: (t) => t.paramNameCalcium,
  displaySilicates: (t) => t.paramNameSilicates,
  displayDensitySalinity: (t) => t.paramNameDensitySalinity,
  displayMagnesium: (t) => t.paramNameMagnesium,
  displayIodine: (t) => t.paramNameIodine,
  displayMolybdenum: (t) => t.paramNameMolybdenum,
  displayStrontium: (t) => t.paramNameStrontium,
  displayPotassium: (t) => t.paramNamePotassium,
};

const DISPLAY_PARAMETER_ICONS: Record<AquariumDisplayParameterKey, string> = {
  displayPH: 'science',
  displayGH: 'opacity',
  displayKH: 'water_drop',
  displayNitrate: 'biotech',
  displayNitrite: 'vaccines',
  displayAmmonia: 'warning_amber',
  displayTemperature: 'thermostat',
  displayTDS: 'blur_on',
  displayCopper: 'memory',
  displayPhosphate: 'grain',
  displayIron: 'hardware',
  displayCO2: 'air',
  displayO2: 'bubble_chart',
  displayCalcium: 'medication',
  displaySilicates: 'landscape',
  displayDensitySalinity: 'waves',
  displayMagnesium: 'bolt',
  displayIodine: 'flare',
  displayMolybdenum: 'hub',
  displayStrontium: 'radio_button_checked',
  displayPotassium: 'spa',
};

export const DEFAULT_DISPLAY_PARAMETER_KEYS = Object.entries(DEFAULT_AQUARIUM_DISPLAY_PREFERENCES)
  .filter(([, enabled]) => enabled)
  .map(([key]) => key as AquariumDisplayParameterKey);

export const ALL_DISPLAY_PARAMETER_KEYS = Object.keys(
  DEFAULT_AQUARIUM_DISPLAY_PREFERENCES,
) as AquariumDisplayParameterKey[];

export function mapDisplayParameterOptions(
  t: TranslationDictionary,
): CardSelectionOption<AquariumDisplayParameterKey>[] {
  return ALL_DISPLAY_PARAMETER_KEYS.map((key) => ({
    value: key,
    title: DISPLAY_PARAMETER_LABELS[key](t),
    iconName: DISPLAY_PARAMETER_ICONS[key],
  }));
}

export function mapDisplayParameterSelectionToPreferences(
  selectedKeys: readonly AquariumDisplayParameterKey[],
): AquariumDisplayPreferencesValues {
  const selectedKeySet = new Set(selectedKeys);

  return {
    displayPH: selectedKeySet.has('displayPH'),
    displayGH: selectedKeySet.has('displayGH'),
    displayKH: selectedKeySet.has('displayKH'),
    displayNitrate: selectedKeySet.has('displayNitrate'),
    displayNitrite: selectedKeySet.has('displayNitrite'),
    displayAmmonia: selectedKeySet.has('displayAmmonia'),
    displayTemperature: selectedKeySet.has('displayTemperature'),
    displayTDS: selectedKeySet.has('displayTDS'),
    displayCopper: selectedKeySet.has('displayCopper'),
    displayPhosphate: selectedKeySet.has('displayPhosphate'),
    displayIron: selectedKeySet.has('displayIron'),
    displayCO2: selectedKeySet.has('displayCO2'),
    displayO2: selectedKeySet.has('displayO2'),
    displayCalcium: selectedKeySet.has('displayCalcium'),
    displaySilicates: selectedKeySet.has('displaySilicates'),
    displayDensitySalinity: selectedKeySet.has('displayDensitySalinity'),
    displayMagnesium: selectedKeySet.has('displayMagnesium'),
    displayIodine: selectedKeySet.has('displayIodine'),
    displayMolybdenum: selectedKeySet.has('displayMolybdenum'),
    displayStrontium: selectedKeySet.has('displayStrontium'),
    displayPotassium: selectedKeySet.has('displayPotassium'),
  };
}
