import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  readonly title = signal('');
  readonly subtitle = signal('');

  set(title: string, subtitle = ''): void {
    this.title.set(title);
    this.subtitle.set(subtitle);
  }
}
