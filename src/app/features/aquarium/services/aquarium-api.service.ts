import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateAquariumPayload } from '../models/aquarium-api.dto';

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

  createAquarium(payload: CreateAquariumPayload): Observable<CreateAquariumResponse> {
    return this.http.post<CreateAquariumResponse>(this.baseUrl, payload);
  }

  uploadAquariumPhoto(aquariumId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<void>(`${this.baseUrl}/${aquariumId}/photos`, formData);
  }
}
