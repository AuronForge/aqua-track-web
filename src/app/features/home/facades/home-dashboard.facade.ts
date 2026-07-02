import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HomeDashboardMapper } from '../mappers/home-dashboard.mapper';
import { HomeDashboardApiService } from '../services/home-dashboard-api.service';
import { DashboardApiDto } from '../models';

@Injectable()
export class HomeDashboardFacade {
  private readonly apiService = inject(HomeDashboardApiService);
  private readonly mapper = inject(HomeDashboardMapper);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _rawDto = signal<DashboardApiDto | null>(null);
  private readonly _selectedAquariumId = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedAquariumId = this._selectedAquariumId.asReadonly();

  private readonly _data = computed(() => {
    const dto = this._rawDto();
    if (!dto) return null;
    return this.mapper.mapDashboardDtoToViewModel(dto);
  });

  readonly hasAquariums = computed(() => (this._data()?.aquariumCards.length ?? 0) > 0);

  readonly aquariumCards = computed(() => {
    const cards = this._data()?.aquariumCards ?? [];
    const selectedId = this._selectedAquariumId();
    return cards.map((c) => ({ ...c, selected: c.id === selectedId }));
  });

  readonly selectedAquariumName = computed(
    () => this.aquariumCards().find((c) => c.selected)?.title ?? null,
  );

  readonly waterParameters = computed(() => {
    const selectedId = this._selectedAquariumId();
    if (!selectedId) return [];
    return this._data()?.waterParametersByAquariumId[selectedId] ?? [];
  });

  readonly summaryParameters = computed(() => {
    const selectedId = this._selectedAquariumId();
    if (!selectedId) return [];
    return this._data()?.summaryParametersByAquariumId[selectedId] ?? [];
  });

  readonly recentMeasurements = computed(() =>
    (this._data()?.recentMeasurements ?? []).slice(0, 5),
  );

  readonly recentApplications = computed(() =>
    (this._data()?.recentApplications ?? []).slice(0, 5),
  );

  loadDashboard(): void {
    this._loading.set(true);
    this._error.set(null);

    this.apiService
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => {
          const initialId = dto.aquariums[0]?.id ?? null;
          this._rawDto.set(dto);
          this._selectedAquariumId.set(initialId);
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Não foi possível carregar o dashboard. Tente novamente.');
          this._loading.set(false);
        },
      });
  }

  selectAquarium(id: string): void {
    this._selectedAquariumId.set(id);
  }

  retry(): void {
    this.loadDashboard();
  }
}
