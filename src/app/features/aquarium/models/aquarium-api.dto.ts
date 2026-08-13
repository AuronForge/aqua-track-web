import { AquariumOverviewDto } from './aquarium-operational-api.dto';

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

export type AquariumRecordStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

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

export interface AquariumAlertParameterPreferencesValues {
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly targetValue: number;
}

export type AquariumAlertParameterPreference = AquariumAlertParameterPreferencesValues | false;

export interface CreateAquariumPayload {
  readonly name: string;
  readonly description?: string | null;
  readonly type: AquariumType;
  readonly waterType: AquariumWaterType;
  readonly volume: number;
  readonly volumeUnit: AquariumVolumeUnit;
  readonly setupDate?: string | null;
  readonly displayPreferences: AquariumDisplayPreferencesValues;
  readonly alertParameters: Record<string, AquariumAlertParameterPreference>;
}

export interface AquariumListResponseDto extends CreateAquariumPayload {
  readonly id: string;
  readonly ownerId: string;
  readonly photoUrl?: string | null;
  readonly primaryPhotoUrl: string | null;
  readonly photosCount: number;
  readonly status: AquariumRecordStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

export interface AquariumPhotoDto {
  readonly id: string;
  readonly aquariumId: string;
  readonly url: string;
  readonly originalUrl: string;
  readonly mediumUrl: string;
  readonly thumbnailUrl: string;
  readonly contentType: string;
  readonly originalFileName: string | null;
  readonly caption: string | null;
  readonly altText: string | null;
  readonly takenAt: string | null;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

export interface AquariumDetailAquaticLifeDto {
  readonly category: 'FISH' | 'PLANT' | 'CORAL' | 'INVERTEBRATE' | 'OTHER';
  readonly commonName: string;
  readonly scientificName: string | null;
  readonly quantity: number;
  readonly introducedAt: string | null;
  readonly notes: string | null;
}

export interface AquariumDetailResponseDto extends AquariumListResponseDto {
  readonly aquaticLife?: readonly AquariumDetailAquaticLifeDto[];
  readonly coverPhoto: AquariumPhotoDto | null;
  readonly photos?: readonly AquariumPhotoDto[];
  readonly overview: AquariumOverviewDto;
}

export interface AquariumAquaticLifePageDto {
  readonly data: readonly AquariumDetailAquaticLifeDto[];
  readonly pagination: {
    readonly page: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
  };
}

export interface AquariumAquaticLifeQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly sort?: 'category' | 'commonName' | 'introducedAt' | 'quantity' | 'appliedAt';
  readonly direction?: 'asc' | 'desc';
}

export type UpdateAquariumPayload = CreateAquariumPayload & {
  readonly aquaticLife?: readonly AquariumDetailAquaticLifeDto[];
};
