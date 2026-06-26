import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HomeDashboardMapper } from '../mappers/home-dashboard.mapper';
import { HomeDashboardMockService } from '../services/home-dashboard-mock.service';
import { HomeDashboardViewModel } from '../models/home-dashboard-view.model';

@Injectable()
export class HomeDashboardFacade {
  private readonly mockService = inject(HomeDashboardMockService);
  private readonly mapper = inject(HomeDashboardMapper);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _data = signal<HomeDashboardViewModel | null>(null);
  private readonly _selectedAquariumId = signal<string | null>(null);

  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedAquariumId = this._selectedAquariumId.asReadonly();

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
  readonly recentMeasurements = computed(() => this._data()?.recentMeasurements ?? []);
  readonly recentApplications = computed(() => this._data()?.recentApplications ?? []);

  loadDashboard(): void {
    this._loading.set(true);
    this._error.set(null);

    this.mockService
      .getDashboard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dto) => {
          const vm = this.mapper.mapDashboardDtoToViewModel(dto);
          this._data.set(vm);
          this._selectedAquariumId.set(vm.selectedAquariumId);
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
