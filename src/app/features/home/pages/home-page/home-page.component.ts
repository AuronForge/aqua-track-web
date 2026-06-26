import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { InfoListComponent } from '../../../../shared/components/info-list/info-list.component';
import { InfoListEmptyState } from '../../../../shared/components/info-list/info-list-empty-state.model';
import { InputSelectComponent } from '../../../../shared/components/select/input-select.component';
import { InputSelectChangeEvent } from '../../../../shared/components/select/input-select-change-event.model';
import { InputSelectOption } from '../../../../shared/components/select/input-select-option.model';
import { HomeDashboardFacade } from '../../facades/home-dashboard.facade';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [InfoCardComponent, InfoListComponent, InputSelectComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  protected readonly facade = inject(HomeDashboardFacade);
  private readonly pageTitleService = inject(PageTitleService);

  protected readonly measurementsEmptyState: InfoListEmptyState = {
    title: 'Nenhuma medição recente',
    description: 'As medições aparecerão aqui após os primeiros testes.',
  };

  protected readonly applicationsEmptyState: InfoListEmptyState = {
    title: 'Nenhuma aplicação recente',
    description: 'As aplicações de produtos aparecerão aqui.',
  };

  protected readonly aquariumSelectOptions = computed<InputSelectOption[]>(() =>
    this.facade.aquariumCards().map((c) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      icon: c.icon,
    })),
  );

  protected readonly selectedAquariumOption = computed<InputSelectOption | null>(
    () =>
      this.aquariumSelectOptions().find((o) => o.id === this.facade.selectedAquariumId()) ?? null,
  );

  ngOnInit(): void {
    this.pageTitleService.set('Dashboard', "Welcome back! Here's your aquarium overview");
    this.facade.loadDashboard();
  }

  protected onAquariumSelect(id: string): void {
    this.facade.selectAquarium(id);
  }

  protected onAquariumDropdownChange(event: InputSelectChangeEvent): void {
    this.facade.selectAquarium(event.option.id);
  }
}
