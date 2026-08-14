import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChildren,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';

import { TabComponent } from './tab.component';

let nextUniqueTabsId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tabs',
  },
})
export class TabsComponent implements AfterViewChecked {
  readonly activeTabId = input<string>('');
  readonly ariaLabel = input<string>('Seções');

  readonly activeTabChange = output<string>();

  protected readonly tabs = contentChildren(TabComponent);
  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly internalActiveTabId = signal('');
  private readonly pendingFocusTabId = signal<string | null>(null);
  private readonly uniqueId = `aq-tabs-${nextUniqueTabsId++}`;

  protected readonly enabledTabs = computed(() => this.tabs().filter((tab) => !tab.disabled()));
  protected readonly selectedTab = computed(() => {
    const tabs = this.tabs();
    const requestedTabId = this.activeTabId() || this.internalActiveTabId();
    const requestedTab = tabs.find((tab) => tab.id() === requestedTabId && !tab.disabled());

    return requestedTab ?? this.enabledTabs()[0] ?? null;
  });
  protected readonly selectedTabId = computed(() => this.selectedTab()?.id() ?? '');

  ngAfterViewChecked(): void {
    const tabId = this.pendingFocusTabId();

    if (!tabId) {
      return;
    }

    this.pendingFocusTabId.set(null);
    this.focusTab(tabId);
  }

  protected isSelected(tab: TabComponent): boolean {
    return tab.id() === this.selectedTabId();
  }

  protected tabElementId(tab: TabComponent): string {
    return `${this.uniqueId}-${tab.uniqueId}-tab`;
  }

  protected panelElementId(tab: TabComponent): string {
    return `${this.uniqueId}-${tab.uniqueId}-panel`;
  }

  protected selectTab(tab: TabComponent, shouldFocus = false): void {
    if (tab.disabled() || this.isSelected(tab)) {
      if (shouldFocus && !tab.disabled()) {
        this.pendingFocusTabId.set(tab.id());
      }
      return;
    }

    const nextTabId = tab.id();

    this.internalActiveTabId.set(nextTabId);
    this.activeTabChange.emit(nextTabId);

    if (shouldFocus) {
      this.pendingFocusTabId.set(nextTabId);
    }
  }

  protected onTabKeydown(event: KeyboardEvent, tab: TabComponent): void {
    const enabledTabs = this.enabledTabs();

    if (enabledTabs.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        this.selectTab(this.getRelativeTab(tab, 1, enabledTabs), true);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.selectTab(this.getRelativeTab(tab, -1, enabledTabs), true);
        break;
      case 'Home':
        event.preventDefault();
        this.selectTab(enabledTabs[0], true);
        break;
      case 'End':
        event.preventDefault();
        this.selectTab(enabledTabs[enabledTabs.length - 1], true);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(tab);
        break;
    }
  }

  private getRelativeTab(
    tab: TabComponent,
    direction: 1 | -1,
    enabledTabs: readonly TabComponent[],
  ): TabComponent {
    const currentIndex = enabledTabs.findIndex((enabledTab) => enabledTab.id() === tab.id());
    const fallbackIndex = direction === 1 ? 0 : enabledTabs.length - 1;
    const nextIndex =
      currentIndex === -1
        ? fallbackIndex
        : (currentIndex + direction + enabledTabs.length) % enabledTabs.length;

    return enabledTabs[nextIndex];
  }

  private focusTab(tabId: string): void {
    const tabIndex = this.tabs().findIndex((tab) => tab.id() === tabId);
    const button = this.tabButtons()[tabIndex];

    button?.nativeElement.focus();
  }
}
