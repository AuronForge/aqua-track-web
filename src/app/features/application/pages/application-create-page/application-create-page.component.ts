import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-application-create-page',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './application-create-page.component.html',
  styleUrl: './application-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationCreatePageComponent {
  private readonly pageTitleService = inject(PageTitleService);
  protected readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().applicationFormTitle);
    });
  }
}
