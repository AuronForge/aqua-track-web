import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';
import { buildAquariumDetailsLink } from '../../utils/build-aquarium-details-link.util';

@Component({
  selector: 'app-aquarium-summary-card',
  standalone: true,
  imports: [InfoCardComponent, ButtonComponent, RouterLink],
  templateUrl: './aquarium-summary-card.component.html',
  styleUrl: './aquarium-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumSummaryCardComponent {
  readonly aquarium = input.required<AquariumSummaryCardViewModel>();

  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;

  protected readonly detailsLink = computed(() => buildAquariumDetailsLink(this.aquarium().id));
  protected readonly detailsAriaLabel = computed(() =>
    this.t().aquariumListDetailsActionAria.replace('{{name}}', this.aquarium().title),
  );
}
