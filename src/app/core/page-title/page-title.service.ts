import { Injectable, TemplateRef, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  readonly title = signal('');
  readonly subtitle = signal('');
  readonly toolbarContent = signal<TemplateRef<unknown> | null>(null);

  set(title: string, subtitle = ''): void {
    this.title.set(title);
    this.subtitle.set(subtitle);
  }

  setToolbarContent(template: TemplateRef<unknown> | null): void {
    this.toolbarContent.set(template);
  }
}
