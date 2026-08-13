import { OverlayModule } from '@angular/cdk/overlay';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqPaginationChange, PaginatorChange } from './paginator-change.model';
import { PaginatorComponent } from './paginator.component';

@Component({
  standalone: true,
  imports: [PaginatorComponent],
  template: `
    <aq-paginator
      [page]="page()"
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [totalItems]="totalItems()"
      [disabled]="disabled()"
      [loading]="loading()"
      [showFirstLastButtons]="showFirstLastButtons()"
      [showPageSizeSelector]="showPageSizeSelector()"
      (paginationChange)="onPaginationChange($event)"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly page = signal<number | null>(1);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly pageSizeOptions = signal<readonly number[]>([5, 10, 20]);
  readonly totalItems = signal(12);
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly showFirstLastButtons = signal(true);
  readonly showPageSizeSelector = signal(true);

  lastPaginationChange: AqPaginationChange | null = null;
  lastPageChange: PaginatorChange | null = null;

  onPaginationChange(event: AqPaginationChange): void {
    this.lastPaginationChange = event;
  }

  onPageChange(event: PaginatorChange): void {
    this.lastPageChange = event;
  }
}

describe('PaginatorComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getComponent(): PaginatorComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getNav(): HTMLElement | null {
    return element.querySelector('nav');
  }

  function getPageSummary(): HTMLElement | null {
    return element.querySelector('.paginator__page');
  }

  function getRangeSummary(): HTMLElement | null {
    return element.querySelector('.paginator__range');
  }

  function getButton(label: string): HTMLButtonElement | null {
    return element.querySelector(`[aria-label="${label}"]`);
  }

  function getPageSizeTrigger(): HTMLButtonElement | null {
    return element.querySelector('.paginator__size-field .select-formfield__trigger');
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

  it('should expose the normalized state', () => {
    expect(getComponent()['state']()).toEqual({
      page: 1,
      pageSize: 5,
      totalItems: 12,
      totalPages: 3,
    });
  });

  it('should display only the current item range and total', () => {
    expect(getPageSummary()).toBeNull();
    expect(getRangeSummary()?.textContent?.trim()).toBe('1-5 de 12 itens');
  });

  it('should calculate total pages with exact division', () => {
    hostFixture.componentInstance.totalItems.set(10);
    hostFixture.detectChanges();

    expect(getComponent()['totalPages']()).toBe(2);
  });

  it('should calculate total pages with non exact division', () => {
    expect(getComponent()['totalPages']()).toBe(3);
  });

  it('should calculate one page when total is lower than page size', () => {
    hostFixture.componentInstance.totalItems.set(4);
    hostFixture.detectChanges();

    expect(getComponent()['totalPages']()).toBe(1);
    expect(getRangeSummary()?.textContent?.trim()).toBe('1-4 de 4 itens');
  });

  it('should display a stable empty state when there are no items', () => {
    hostFixture.componentInstance.totalItems.set(0);
    hostFixture.detectChanges();

    expect(getComponent()['state']()).toEqual({
      page: 0,
      pageSize: 5,
      totalItems: 0,
      totalPages: 0,
    });
    expect(getRangeSummary()?.textContent?.trim()).toBe('0 de 0 itens');
  });

  it('should calculate the last partial range', () => {
    hostFixture.componentInstance.page.set(3);
    hostFixture.detectChanges();

    expect(getRangeSummary()?.textContent?.trim()).toBe('11-12 de 12 itens');
  });

  it('should clamp page lower than one', () => {
    hostFixture.componentInstance.page.set(-3);
    hostFixture.detectChanges();

    expect(getComponent()['currentPage']()).toBe(1);
  });

  it('should clamp page greater than total pages', () => {
    hostFixture.componentInstance.page.set(99);
    hostFixture.detectChanges();

    expect(getComponent()['currentPage']()).toBe(3);
    expect(getRangeSummary()?.textContent?.trim()).toBe('11-12 de 12 itens');
  });

  it('should normalize invalid page size and total items', () => {
    hostFixture.componentInstance.pageSize.set(0);
    hostFixture.componentInstance.totalItems.set(-1);
    hostFixture.detectChanges();

    expect(getComponent()['state']()).toEqual({
      page: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });
  });

  it('should include the current page size in sanitized options', () => {
    hostFixture.componentInstance.pageSize.set(15);
    hostFixture.componentInstance.pageSizeOptions.set([10, 10, -1, 0, 20]);
    hostFixture.detectChanges();

    expect(getComponent()['pageSizeSelectOptions']()).toEqual([
      { id: '10', title: '10' },
      { id: '15', title: '15' },
      { id: '20', title: '20' },
    ]);
  });

  it('should disable first and previous buttons on the first page', () => {
    expect(getButton('Ir para a primeira pagina')?.disabled).toBe(true);
    expect(getButton('Ir para a pagina anterior')?.disabled).toBe(true);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(false);
    expect(getButton('Ir para a ultima pagina')?.disabled).toBe(false);
  });

  it('should enable all navigation buttons on an intermediate page', () => {
    hostFixture.componentInstance.page.set(2);
    hostFixture.detectChanges();

    expect(getButton('Ir para a primeira pagina')?.disabled).toBe(false);
    expect(getButton('Ir para a pagina anterior')?.disabled).toBe(false);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(false);
    expect(getButton('Ir para a ultima pagina')?.disabled).toBe(false);
  });

  it('should disable next and last buttons on the last page', () => {
    hostFixture.componentInstance.page.set(3);
    hostFixture.detectChanges();

    expect(getButton('Ir para a primeira pagina')?.disabled).toBe(false);
    expect(getButton('Ir para a pagina anterior')?.disabled).toBe(false);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(true);
    expect(getButton('Ir para a ultima pagina')?.disabled).toBe(true);
  });

  it('should disable all navigation buttons on a single page', () => {
    hostFixture.componentInstance.totalItems.set(5);
    hostFixture.detectChanges();

    expect(getButton('Ir para a primeira pagina')?.disabled).toBe(true);
    expect(getButton('Ir para a pagina anterior')?.disabled).toBe(true);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(true);
    expect(getButton('Ir para a ultima pagina')?.disabled).toBe(true);
  });

  it('should emit consolidated and legacy events when going to previous page', () => {
    hostFixture.componentInstance.page.set(2);
    hostFixture.detectChanges();

    getButton('Ir para a pagina anterior')?.click();

    expect(hostFixture.componentInstance.lastPaginationChange).toEqual({ page: 1, pageSize: 5 });
    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 0, pageSize: 5 });
  });

  it('should emit consolidated and legacy events when going to next page', () => {
    getButton('Ir para a proxima pagina')?.click();

    expect(hostFixture.componentInstance.lastPaginationChange).toEqual({ page: 2, pageSize: 5 });
    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 1, pageSize: 5 });
  });

  it('should emit when going to the first page', () => {
    hostFixture.componentInstance.page.set(3);
    hostFixture.detectChanges();

    getButton('Ir para a primeira pagina')?.click();

    expect(hostFixture.componentInstance.lastPaginationChange).toEqual({ page: 1, pageSize: 5 });
  });

  it('should emit when going to the last page', () => {
    getButton('Ir para a ultima pagina')?.click();

    expect(hostFixture.componentInstance.lastPaginationChange).toEqual({ page: 3, pageSize: 5 });
  });

  it('should not emit when disabled navigation is clicked', () => {
    getButton('Ir para a primeira pagina')?.click();
    getButton('Ir para a pagina anterior')?.click();

    expect(hostFixture.componentInstance.lastPaginationChange).toBeNull();
  });

  it('should reset to page one when page size changes', () => {
    hostFixture.componentInstance.page.set(3);
    hostFixture.detectChanges();

    getComponent()['onSizeChange']({ option: { id: '10', title: '10' } });

    expect(hostFixture.componentInstance.lastPaginationChange).toEqual({ page: 1, pageSize: 10 });
    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 0, pageSize: 10 });
  });

  it('should not emit when selecting the current page size', () => {
    getComponent()['onSizeChange']({ option: { id: '5', title: '5' } });

    expect(hostFixture.componentInstance.lastPaginationChange).toBeNull();
  });

  it('should sync the page size control with the pageSize input', () => {
    expect(getComponent()['pageSizeControl'].value).toBe('5');

    hostFixture.componentInstance.pageSize.set(20);
    hostFixture.detectChanges();

    expect(getComponent()['pageSizeControl'].value).toBe('20');
  });

  it('should render the current page size in the select trigger', () => {
    expect(getPageSizeTrigger()?.textContent).toContain('5');
  });

  it('should hide the page size selector when configured', () => {
    hostFixture.componentInstance.showPageSizeSelector.set(false);
    hostFixture.detectChanges();

    expect(getPageSizeTrigger()).toBeNull();
  });

  it('should hide first and last buttons when configured', () => {
    hostFixture.componentInstance.showFirstLastButtons.set(false);
    hostFixture.detectChanges();

    expect(getButton('Ir para a primeira pagina')).toBeNull();
    expect(getButton('Ir para a ultima pagina')).toBeNull();
    expect(getButton('Ir para a pagina anterior')).toBeTruthy();
    expect(getButton('Ir para a proxima pagina')).toBeTruthy();
  });

  it('should disable interactions while disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('aq-paginator')!.classList).toContain('paginator--disabled');
    expect(getPageSizeTrigger()?.disabled).toBe(true);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(true);

    getComponent()['onNext']();

    expect(hostFixture.componentInstance.lastPaginationChange).toBeNull();
  });

  it('should disable interactions and expose aria-busy while loading', () => {
    hostFixture.componentInstance.loading.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('aq-paginator')!.classList).toContain('paginator--loading');
    expect(getNav()?.getAttribute('aria-busy')).toBe('true');
    expect(getPageSizeTrigger()?.disabled).toBe(true);
    expect(getButton('Ir para a proxima pagina')?.disabled).toBe(true);

    getComponent()['onNext']();

    expect(hostFixture.componentInstance.lastPaginationChange).toBeNull();
  });

  it('should use a semantic labelled navigation region', () => {
    expect(getNav()?.getAttribute('aria-label')).toBe('Paginacao dos resultados');
  });

  it('should keep icons decorative', () => {
    const icon = element.querySelector('.paginator__button .material-icons-outlined');

    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should support the legacy zero based pageIndex API', () => {
    hostFixture.componentInstance.page.set(null);
    hostFixture.componentInstance.pageIndex.set(1);
    hostFixture.detectChanges();

    expect(getComponent()['currentPage']()).toBe(2);
    expect(getRangeSummary()?.textContent?.trim()).toBe('6-10 de 12 itens');
  });
});
