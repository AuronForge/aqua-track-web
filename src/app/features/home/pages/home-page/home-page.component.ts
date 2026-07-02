import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { InfoListComponent } from '../../../../shared/components/info-list/info-list.component';
import { InfoListEmptyState } from '../../../../shared/components/info-list/info-list-empty-state.model';
import { LanguageService } from '../../../../shared/services/language.service';
import { HomeDashboardFacade } from '../../facades/home-dashboard.facade';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [InfoCardComponent, InfoListComponent, ButtonComponent, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  protected readonly facade = inject(HomeDashboardFacade);
  private readonly pageTitleService = inject(PageTitleService);
  protected readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;

  protected readonly measurementsEmptyState = computed<InfoListEmptyState>(() => ({
    title: this.t().homeMeasurementsEmptyTitle,
    description: this.t().homeMeasurementsEmptyDesc,
  }));

  protected readonly applicationsEmptyState = computed<InfoListEmptyState>(() => ({
    title: this.t().homeApplicationsEmptyTitle,
    description: this.t().homeApplicationsEmptyDesc,
  }));

  constructor() {
    effect(() => {
      this.pageTitleService.set('Dashboard', this.t().homePageSubtitle);
    });
  }

  ngOnInit(): void {
    this.facade.loadDashboard();
  }

  protected onAquariumSelect(id: string): void {
    this.facade.selectAquarium(id);
  }
}
