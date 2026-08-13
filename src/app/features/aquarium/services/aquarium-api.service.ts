import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  AquariumAquaticLifePageDto,
  AquariumAquaticLifeQuery,
  AquariumDetailResponseDto,
  AquariumListResponseDto,
  AquariumType,
  CreateAquariumPayload,
  UpdateAquariumPayload,
} from '../models/aquarium-api.dto';
import {
  ApplicationQuery,
  AquariumApplicationsPageDto,
  CreateAquariumApplicationRequestDto,
  CreateMeasurementRequestDto,
  MeasurementQuery,
  MeasurementsPageDto,
  WaterParameterDto,
} from '../models/aquarium-operational-api.dto';

export interface CreateAquariumResponse extends CreateAquariumPayload {
  readonly id: string;
  readonly ownerId: string;
  readonly primaryPhotoUrl: string | null;
  readonly photosCount: number;
  readonly status: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AquariumApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/aquariums`;

  listAquariums(filters?: {
    name?: string;
    type?: AquariumType | null;
  }): Observable<readonly AquariumListResponseDto[]> {
    return this.http.get<readonly AquariumListResponseDto[]>(this.baseUrl, {
      params: {
        ...(filters?.name ? { name: filters.name } : {}),
        ...(filters?.type ? { type: filters.type } : {}),
      },
    });
  }

  createAquarium(payload: CreateAquariumPayload): Observable<CreateAquariumResponse> {
    return this.http.post<CreateAquariumResponse>(this.baseUrl, payload);
  }

  getAquarium(aquariumId: string): Observable<AquariumDetailResponseDto> {
    return this.http.get<AquariumDetailResponseDto>(`${this.baseUrl}/${aquariumId}`);
  }

  updateAquarium(
    aquariumId: string,
    payload: UpdateAquariumPayload,
  ): Observable<AquariumDetailResponseDto> {
    return this.http.put<AquariumDetailResponseDto>(`${this.baseUrl}/${aquariumId}`, payload);
  }

  patchAquarium(
    aquariumId: string,
    payload: Partial<
      Pick<
        UpdateAquariumPayload,
        | 'name'
        | 'description'
        | 'type'
        | 'waterType'
        | 'volume'
        | 'volumeUnit'
        | 'setupDate'
        | 'aquaticLife'
      >
    >,
  ): Observable<AquariumDetailResponseDto> {
    return this.http.patch<AquariumDetailResponseDto>(`${this.baseUrl}/${aquariumId}`, payload);
  }

  listWaterParametersByAquarium(aquariumId: string): Observable<readonly WaterParameterDto[]> {
    return this.http.get<readonly WaterParameterDto[]>(
      `${environment.apiBaseUrl}/water-parameters/by-aquarium/${aquariumId}`,
    );
  }

  listAquariumAquaticLife(
    aquariumId: string,
    query: AquariumAquaticLifeQuery,
  ): Observable<AquariumAquaticLifePageDto> {
    return this.http.get<AquariumAquaticLifePageDto>(`${this.baseUrl}/${aquariumId}/aquatic-life`, {
      params: this.cleanParams(query),
    });
  }

  listAquariumMeasurements(
    aquariumId: string,
    query: MeasurementQuery,
  ): Observable<MeasurementsPageDto> {
    return this.http.get<MeasurementsPageDto>(`${this.baseUrl}/${aquariumId}/measurements`, {
      params: this.cleanParams(query),
    });
  }

  createAquariumMeasurement(
    aquariumId: string,
    payload: CreateMeasurementRequestDto,
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${aquariumId}/measurements`, payload);
  }

  listAquariumApplications(
    aquariumId: string,
    query: ApplicationQuery,
  ): Observable<AquariumApplicationsPageDto> {
    return this.http.get<AquariumApplicationsPageDto>(
      `${this.baseUrl}/${aquariumId}/applications`,
      {
        params: this.cleanParams(query),
      },
    );
  }

  createAquariumApplication(
    aquariumId: string,
    payload: CreateAquariumApplicationRequestDto,
  ): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${aquariumId}/applications`, payload);
  }

  uploadAquariumPhoto(aquariumId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<void>(`${this.baseUrl}/${aquariumId}/photos`, formData);
  }

  private cleanParams(query: object) {
    return Object.fromEntries(
      Object.entries(query as Record<string, string | number | boolean | null | undefined>)
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)]),
    );
  }
}
