import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';

import { PaginatorChange } from './paginator-change.model';
import { PaginatorComponent } from './paginator.component';

@Component({
  standalone: true,
  imports: [PaginatorComponent],
  template: `
    <aq-paginator
      [pageIndex]="pageIndex()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [totalItems]="totalItems()"
      [disabled]="disabled()"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly pageSizeOptions = signal([5, 10, 20]);
  readonly totalItems = signal(12);
  readonly disabled = signal(false);

  lastPageChange: PaginatorChange | null = null;

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

  function getInfo(): HTMLElement | null {
    return element.querySelector('.paginator__info');
  }

  function getPrevButton(): HTMLButtonElement | null {
    return element.querySelector('[aria-label="Página anterior"]');
  }

  function getNextButton(): HTMLButtonElement | null {
    return element.querySelector('[aria-label="Próxima página"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  // ── Base class ────────────────────────────────────────────────────────────

  it('should always have the base paginator class', () => {
    expect(element.querySelector('aq-paginator')!.classList).toContain('paginator');
  });

  // ── Page info ─────────────────────────────────────────────────────────────

  it('should display correct page info on first page', () => {
    expect(getInfo()?.textContent?.trim()).toBe('1–5 de 12');
  });

  it('should display correct page info on second page', () => {
    hostFixture.componentInstance.pageIndex.set(1);
    hostFixture.detectChanges();

    expect(getInfo()?.textContent?.trim()).toBe('6–10 de 12');
  });

  it('should display correct page info on last partial page', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    expect(getInfo()?.textContent?.trim()).toBe('11–12 de 12');
  });

  it('should display 0–0 de 0 when totalItems is 0', () => {
    hostFixture.componentInstance.totalItems.set(0);
    hostFixture.detectChanges();

    expect(getInfo()?.textContent?.trim()).toBe('0–0 de 0');
  });

  it('should have aria-live on the info element', () => {
    expect(getInfo()?.getAttribute('aria-live')).toBe('polite');
  });

  // ── Previous button ───────────────────────────────────────────────────────

  it('should disable the previous button on the first page', () => {
    expect(getPrevButton()?.disabled).toBe(true);
  });

  it('should enable the previous button when not on the first page', () => {
    hostFixture.componentInstance.pageIndex.set(1);
    hostFixture.detectChanges();

    expect(getPrevButton()?.disabled).toBe(false);
  });

  it('should emit pageChange with decremented pageIndex when previous is clicked', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    getPrevButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 1, pageSize: 5 });
  });

  it('should not emit pageChange when previous is clicked on first page', () => {
    getPrevButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toBeNull();
  });

  it('should not emit pageChange when onPrevious is called on the first page', () => {
    getComponent()['onPrevious']();

    expect(hostFixture.componentInstance.lastPageChange).toBeNull();
  });

  // ── Next button ───────────────────────────────────────────────────────────

  it('should enable the next button when there are more pages', () => {
    expect(getNextButton()?.disabled).toBe(false);
  });

  it('should disable the next button on the last page', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    expect(getNextButton()?.disabled).toBe(true);
  });

  it('should emit pageChange with incremented pageIndex when next is clicked', () => {
    getNextButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 1, pageSize: 5 });
  });

  it('should not emit pageChange when next is clicked on the last page', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    getNextButton()?.click();

    expect(hostFixture.componentInstance.lastPageChange).toBeNull();
  });

  it('should not emit pageChange when onNext is called on the last page', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    getComponent()['onNext']();

    expect(hostFixture.componentInstance.lastPageChange).toBeNull();
  });

  // ── Page size change ──────────────────────────────────────────────────────

  it('should reset pageIndex to 0 when page size changes', () => {
    hostFixture.componentInstance.pageIndex.set(2);
    hostFixture.detectChanges();

    getComponent()['onSizeChange']({ option: { id: '10', title: '10' }, previousOption: null });

    expect(hostFixture.componentInstance.lastPageChange).toEqual({ pageIndex: 0, pageSize: 10 });
  });

  it('should map page size options to select options', () => {
    hostFixture.componentInstance.pageSizeOptions.set([15, 30, 60]);
    hostFixture.detectChanges();

    expect(getComponent()['pageSizeSelectOptions']()).toEqual([
      { id: '15', title: '15' },
      { id: '30', title: '30' },
      { id: '60', title: '60' },
    ]);
  });

  it('should expose the selected page size option', () => {
    expect(getComponent()['selectedSizeOption']()).toEqual({ id: '5', title: '5' });
  });

  it('should return null when the selected page size is not in the options', () => {
    hostFixture.componentInstance.pageSize.set(99);
    hostFixture.detectChanges();

    expect(getComponent()['selectedSizeOption']()).toBeNull();
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('should apply paginator--disabled class when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('aq-paginator')!.classList).toContain('paginator--disabled');
  });

  it('should not apply paginator--disabled class when not disabled', () => {
    expect(element.querySelector('aq-paginator')!.classList).not.toContain('paginator--disabled');
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('should have aria-label on the previous button', () => {
    expect(getPrevButton()?.getAttribute('aria-label')).toBe('Página anterior');
  });

  it('should have aria-label on the next button', () => {
    expect(getNextButton()?.getAttribute('aria-label')).toBe('Próxima página');
  });
});
