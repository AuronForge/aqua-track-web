import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';

import { InfoListEmptyState } from './info-list-empty-state.model';
import { InfoListItemData } from './info-list-item-data.model';
import { InfoListPageChange } from './info-list-page-change.model';
import { InfoListComponent } from './info-list.component';

const ITEMS: InfoListItemData[] = [
  { title: 'Item 1', value: '1.0', badge: { label: 'Normal', status: 'normal' } },
  { title: 'Item 2', value: '2.0', badge: { label: 'Alto', status: 'danger' } },
  { title: 'Item 3', value: '3.0', badge: { label: 'Atencao', status: 'attention' } },
  { title: 'Item 4', value: '4.0' },
  { title: 'Item 5', value: '5.0' },
  { title: 'Item 6', value: '6.0' },
  { title: 'Item 7', value: '7.0' },
];

@Component({
  standalone: true,
  imports: [InfoListComponent],
  template: `
    <aq-info-list
      [items]="items()"
      [paginated]="paginated()"
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [loading]="loading()"
      [disabled]="disabled()"
      [emptyState]="emptyState()"
      [clickable]="clickable()"
      (pageChange)="onPageChange($event)"
      (itemClick)="onItemClick($event)"
    />
  `,
})
class TestHostComponent {
  readonly items = signal<InfoListItemData[]>(ITEMS);
  readonly paginated = signal(true);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly pageSizeOptions = signal([5, 10]);
  readonly loading = signal(false);
  readonly disabled = signal(false);
  readonly emptyState = signal<InfoListEmptyState | null>({ title: 'Nenhum item encontrado' });
  readonly clickable = signal(false);

  lastPageChange: InfoListPageChange | null = null;
  lastClickedItem: InfoListItemData | null = null;

  onPageChange(event: InfoListPageChange): void {
    this.lastPageChange = event;
  }

  onItemClick(item: InfoListItemData): void {
    this.lastClickedItem = item;
  }
}

describe('InfoListComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getList(): HTMLElement | null {
    return element.querySelector('aq-info-list');
  }

  function getComponent(): InfoListComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getItemElements(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.info-list__item');
  }

  function getListItems(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('aq-info-list-item');
  }

  function getEmptyState(): HTMLElement | null {
    return element.querySelector('.info-list__empty');
  }

  function getEmptyTitle(): HTMLElement | null {
    return element.querySelector('.info-list__empty-title');
  }

  function getEmptyDescription(): HTMLElement | null {
    return element.querySelector('.info-list__empty-description');
  }

  function getLoadingState(): HTMLElement | null {
    return element.querySelector('.info-list__loading');
  }

  function getPaginator(): HTMLElement | null {
    return element.querySelector('aq-paginator');
  }

  function getNextButton(): HTMLButtonElement | null {
    return element.querySelector('[aria-label="Ir para a proxima pagina"]');
  }

  function getPrevButton(): HTMLButtonElement | null {
    return element.querySelector('[aria-label="Ir para a pagina anterior"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  it('should always have the base info-list class', () => {
    expect(getList()!.classList).toContain('info-list');
  });

  it('should render only items of the current page', () => {
    expect(getItemElements().length).toBe(5);
  });

  it('should render all items when paginated is false', () => {
    hostFixture.componentInstance.paginated.set(false);
    hostFixture.detectChanges();

    expect(getItemElements().length).toBe(ITEMS.length);
  });

  it('should render items with correct title', () => {
    const titles = Array.from(element.querySelectorAll('.info-list-item__title')).map((item) =>
      item.textContent?.trim(),
    );

    expect(titles).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
  });

  it('should render second page items when pageIndex is 1', () => {
    hostFixture.componentInstance.pageIndex.set(1);
    hostFixture.detectChanges();

    const titles = Array.from(element.querySelectorAll('.info-list-item__title')).map((item) =>
      item.textContent?.trim(),
    );

    expect(titles).toEqual(['Item 6', 'Item 7']);
  });

  it('should use a semantic list element', () => {
    expect(element.querySelector('ul.info-list__items')).toBeTruthy();
    expect(element.querySelector('ul.info-list__items')?.getAttribute('role')).toBe('list');
  });

  it('should show paginator when paginated=true and totalItems > pageSize', () => {
    expect(getPaginator()).toBeTruthy();
  });

  it('should not show paginator when paginated=false', () => {
    hostFixture.componentInstance.paginated.set(false);
    hostFixture.detectChanges();

    expect(getPaginator()).toBeNull();
  });

  it('should not show paginator when totalItems <= pageSize', () => {
    hostFixture.componentInstance.items.set(ITEMS.slice(0, 3));
    hostFixture.detectChanges();

    expect(getPaginator()).toBeNull();
  });

  it('should show paginator exactly when totalItems equals pageSize + 1', () => {
    hostFixture.componentInstance.items.set(ITEMS.slice(0, 6));
    hostFixture.detectChanges();

    expect(getPaginator()).toBeTruthy();
  });

  it('should emit pageChange when next page is clicked', () => {
    getNextButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 1, pageSize: 5 });
  });

  it('should emit pageChange when previous page is clicked', () => {
    hostFixture.componentInstance.pageIndex.set(1);
    hostFixture.detectChanges();

    getPrevButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 0, pageSize: 5 });
  });

  it('should emit itemClick with the correct item when clickable=true', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getListItems()[0].click();

    expect(hostFixture.componentInstance.lastClickedItem).toEqual(ITEMS[0]);
  });

  it('should not emit itemClick when clickable=false', () => {
    getListItems()[0].click();

    expect(hostFixture.componentInstance.lastClickedItem).toBeNull();
  });

  it('should not emit itemClick when disabled=true', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    getListItems()[0].click();

    expect(hostFixture.componentInstance.lastClickedItem).toBeNull();
  });

  it('should show empty state when items is empty', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.detectChanges();

    expect(getEmptyState()).toBeTruthy();
  });

  it('should not show the list when items is empty', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.detectChanges();

    expect(element.querySelector('.info-list__items')).toBeNull();
  });

  it('should display the fallback empty state title when no emptyState is provided', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.componentInstance.emptyState.set(null);
    hostFixture.detectChanges();

    expect(getEmptyTitle()?.textContent?.trim()).toBeTruthy();
  });

  it('should display a custom empty state title', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.componentInstance.emptyState.set({ title: 'Sem registros' });
    hostFixture.detectChanges();

    expect(getEmptyTitle()?.textContent?.trim()).toBe('Sem registros');
  });

  it('should display the empty state description when provided', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.componentInstance.emptyState.set({
      title: 'Sem registros',
      description: 'Nenhuma medicao foi registrada ainda.',
    });
    hostFixture.detectChanges();

    expect(getEmptyDescription()?.textContent?.trim()).toBe(
      'Nenhuma medicao foi registrada ainda.',
    );
  });

  it('should not display the empty description when not provided', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.detectChanges();

    expect(getEmptyDescription()).toBeNull();
  });

  it('should show loading state when loading=true', () => {
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(getLoadingState()).toBeTruthy();
  });

  it('should not show the list when loading=true', () => {
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('.info-list__items')).toBeNull();
  });

  it('should not show empty state when loading=true even with empty items', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(getEmptyState()).toBeNull();
    expect(getLoadingState()).toBeTruthy();
  });

  it('should apply info-list--disabled class when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getList()!.classList).toContain('info-list--disabled');
  });

  it('should apply info-list--loading class when loading', () => {
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(getList()!.classList).toContain('info-list--loading');
  });

  it('should apply info-list--empty class when items is empty', () => {
    hostFixture.componentInstance.items.set([]);
    hostFixture.detectChanges();

    expect(getList()!.classList).toContain('info-list--empty');
  });

  it('should not apply modifier classes by default', () => {
    const classList = getList()!.classList;

    expect(classList).not.toContain('info-list--disabled');
    expect(classList).not.toContain('info-list--loading');
    expect(classList).not.toContain('info-list--empty');
  });

  it('should set aria-busy when loading', () => {
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(getList()!.getAttribute('aria-busy')).toBe('true');
  });

  it('should not set aria-busy when not loading', () => {
    expect(getList()!.getAttribute('aria-busy')).toBeNull();
  });
});
