import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { InfoListComponent } from '../../../../shared/components/info-list/info-list.component';
import { InfoListEmptyState } from '../../../../shared/components/info-list/info-list-empty-state.model';
import { HomeDashboardFacade } from '../../facades/home-dashboard.facade';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [InfoCardComponent, InfoListComponent],
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

  ngOnInit(): void {
    this.pageTitleService.set('Dashboard', "Welcome back! Here's your aquarium overview");
    this.facade.loadDashboard();
  }

  protected onAquariumSelect(id: string): void {
    this.facade.selectAquarium(id);
  }
}
