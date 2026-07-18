import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardComponent } from '../../components/aquarium-summary-card/aquarium-summary-card.component';
import { AquariumSummaryCardMapper } from '../../mappers/aquarium-summary-card.mapper';
import { AquariumListItemModel } from '../../models/aquarium-list-item.model';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';
import { AQUARIUM_LIST_MOCK } from '../../mocks/aquarium-list.mock';

@Component({
  selector: 'app-aquarium-list-page',
  standalone: true,
  imports: [AquariumSummaryCardComponent, ButtonComponent, RouterLink],
  templateUrl: './aquarium-list-page.component.html',
  styleUrl: './aquarium-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumListPageComponent {
  private readonly pageTitleService = inject(PageTitleService);
  private readonly languageService = inject(LanguageService);
  private readonly mapper = inject(AquariumSummaryCardMapper);

  protected readonly t = this.languageService.translation;
  protected readonly aquariumItems = signal<readonly AquariumListItemModel[]>(AQUARIUM_LIST_MOCK);

  protected readonly aquariums = computed<readonly AquariumSummaryCardViewModel[]>(() =>
    this.aquariumItems().map((aquarium) => this.mapper.mapListItem(aquarium, this.t())),
  );
  protected readonly hasAquariums = computed(() => this.aquariums().length > 0);
  protected readonly totalAquariums = computed(() => this.aquariumItems().length);
  protected readonly combinedVolumeLiters = computed(() =>
    this.aquariumItems().reduce((total, aquarium) => total + aquarium.volumeLiters, 0),
  );
  protected readonly totalAquariumsLabel = computed(() => {
    const count = this.totalAquariums();
    const aquariumLabel =
      count === 1 ? this.t().aquariumListAquariumSingular : this.t().aquariumListAquariumPlural;

    return `${this.t().aquariumListTotalLabel}: ${count} ${aquariumLabel}`;
  });
  protected readonly combinedVolumeLabel = computed(
    () => `${this.t().aquariumListCombinedVolumeLabel}: ${this.combinedVolumeLiters()}L`,
  );

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().homeMyAquariums, this.t().homeMyAquariumsSubtitle);
    });
  }
}
