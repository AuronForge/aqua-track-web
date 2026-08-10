import {
  AfterContentInit,
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  output,
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-tabs',
  standalone: true,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit, AfterContentChecked {
  readonly activeTabId = input<string | null>(null);
  readonly ariaLabel = input('Seções');
  readonly activeTabChange = output<string>();

  protected readonly tabs = contentChildren(TabComponent);

  ngAfterContentInit(): void {
    this.syncActiveTab();
  }

  ngAfterContentChecked(): void {
    this.syncActiveTab();
  }

  protected selectTab(tab: TabComponent): void {
    if (tab.disabled() || tab.id() === this.resolvedActiveTabId()) {
      return;
    }

    this.activeTabChange.emit(tab.id());
  }

  protected resolvedActiveTabId(): string | null {
    return (
      this.activeTabId() ??
      this.tabs()
        .find((tab) => !tab.disabled())
        ?.id() ??
      null
    );
  }

  private syncActiveTab(): void {
    const activeId = this.resolvedActiveTabId();

    this.tabs().forEach((tab) => tab.active.set(tab.id() === activeId));
  }
}
