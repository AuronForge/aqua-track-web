import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-aquarium-create-page',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './aquarium-create-page.component.html',
  styleUrl: './aquarium-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumCreatePageComponent {
  private readonly pageTitleService = inject(PageTitleService);
  protected readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().aquariumFormTitle);
    });
  }
}
