import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';
import { buildAquariumDetailsLink } from '../../utils/build-aquarium-details-link.util';

@Component({
  selector: 'app-aquarium-summary-card',
  standalone: true,
  imports: [InfoCardComponent],
  templateUrl: './aquarium-summary-card.component.html',
  styleUrl: './aquarium-summary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumSummaryCardComponent {
  readonly aquarium = input.required<AquariumSummaryCardViewModel>();

  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;

  protected readonly detailsLink = computed(() => buildAquariumDetailsLink(this.aquarium().id));
  protected readonly detailsAriaLabel = computed(() =>
    this.t().aquariumListDetailsActionAria.replace('{{name}}', this.aquarium().title),
  );

  protected onCardClick(event: MouseEvent): void {
    if (this.isInteractiveTarget(event.target)) {
      return;
    }

    void this.navigateToDetails();
  }

  protected onCardKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    void this.navigateToDetails();
  }

  private navigateToDetails(): Promise<boolean> {
    return this.router.navigateByUrl(this.detailsLink());
  }

  private isInteractiveTarget(target: EventTarget | null): boolean {
    return (
      target instanceof Element && Boolean(target.closest('a, button, input, select, textarea'))
    );
  }
}
