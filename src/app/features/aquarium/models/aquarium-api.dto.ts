export type AquariumType =
  | 'COMMUNITY'
  | 'SPECIES_ONLY'
  | 'PLANTED'
  | 'BREEDING'
  | 'HOSPITAL'
  | 'OTHER'
  | string;

export type AquariumWaterType = 'FRESHWATER' | 'SALTWATER' | 'BRACKISH';

export type AquariumVolumeUnit = 'LITER' | 'GALLON';

export interface AquariumDisplayPreferencesValues {
  readonly displayPH: boolean;
  readonly displayGH: boolean;
  readonly displayKH: boolean;
  readonly displayNitrate: boolean;
  readonly displayNitrite: boolean;
  readonly displayAmmonia: boolean;
  readonly displayTemperature: boolean;
  readonly displayTDS: boolean;
  readonly displayCopper: boolean;
  readonly displayPhosphate: boolean;
  readonly displayIron: boolean;
  readonly displayCO2: boolean;
  readonly displayO2: boolean;
  readonly displayCalcium: boolean;
  readonly displaySilicates: boolean;
  readonly displayDensitySalinity: boolean;
  readonly displayMagnesium: boolean;
  readonly displayIodine: boolean;
  readonly displayMolybdenum: boolean;
  readonly displayStrontium: boolean;
  readonly displayPotassium: boolean;
}

export interface CreateAquariumPayload {
  readonly name: string;
  readonly description?: string | null;
  readonly type: AquariumType;
  readonly waterType: AquariumWaterType;
  readonly volume: number;
  readonly volumeUnit: AquariumVolumeUnit;
  readonly setupDate: string;
  readonly displayPreferences: AquariumDisplayPreferencesValues;
}
