import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HomeDashboardMapper } from '../mappers/home-dashboard.mapper';
import { HomeDashboardMockService } from '../services/home-dashboard-mock.service';
import { DashboardApiDto } from '../models';
import { RecentMeasurementViewModel } from '../models/recent-measurement-view.model';

@Injectable()
export class HomeDashboardFacade {
  private readonly mockService = inject(HomeDashboardMockService);
  private readonly mapper = inject(HomeDashboardMapper);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _rawDto = signal<DashboardApiDto | null>(null);
  private readonly _selectedAquariumId = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedAquariumId = this._selectedAquariumId.asReadonly();

  // Re-mapped automatically when language or raw data changes
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

  readonly waterParameters = computed(() => this._data()?.waterParameters ?? []);

  readonly recentMeasurements = computed(() => {
    const selectedId = this._selectedAquariumId();
    return (this._data()?.recentMeasurements ?? [])
      .filter((m) => m.aquariumId === selectedId)
      .slice(0, 5);
  });

  readonly recentApplications = computed(() => {
    const selectedId = this._selectedAquariumId();
    return (this._data()?.recentApplications ?? [])
      .filter((a) => a.aquariumId === selectedId)
      .slice(0, 5);
  });

  readonly measurementsByParamKey = computed(
    (): Partial<Record<string, RecentMeasurementViewModel[]>> => {
      const selectedId = this._selectedAquariumId();
      const result: Record<string, RecentMeasurementViewModel[]> = {};
      for (const m of this._data()?.recentMeasurements ?? []) {
        if (m.aquariumId !== selectedId) continue;
        if (!result[m.parameterKey]) result[m.parameterKey] = [];
        if (result[m.parameterKey].length < 3) {
          result[m.parameterKey].push({ ...m, metadata: this.formatDate(m.measuredAt) });
        }
      }
      return result;
    },
  );

  private formatDate(isoTimestamp: string): string {
    try {
      return new Date(isoTimestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  }

  loadDashboard(): void {
    this._loading.set(true);
    this._error.set(null);

    this.mockService
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => {
          const initialId = dto.selectedAquarium?.id ?? dto.aquariums[0]?.id ?? null;
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
