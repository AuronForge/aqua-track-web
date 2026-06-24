import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoListItemBadge } from './info-list-item-badge.model';
import { InfoListItemStatus } from './info-list-item-status.type';
import { InfoListItemComponent } from './info-list-item.component';

@Component({
  standalone: true,
  imports: [InfoListItemComponent],
  template: `
    <aq-info-list-item
      [title]="title()"
      [subtitle]="subtitle()"
      [value]="value()"
      [metadata]="metadata()"
      [badge]="badge()"
      [clickable]="clickable()"
      [disabled]="disabled()"
      [selected]="selected()"
      (itemClick)="onItemClick()"
    />
  `,
})
class TestHostComponent {
  readonly title = signal<string>('pH');
  readonly subtitle = signal<string>('');
  readonly value = signal<string>('7.2');
  readonly metadata = signal<string>('');
  readonly badge = signal<InfoListItemBadge | null>(null);
  readonly clickable = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);
  readonly selected = signal<boolean>(false);
  clickCount = 0;

  onItemClick(): void {
    this.clickCount += 1;
  }
}

describe('InfoListItemComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getItem(): HTMLElement {
    return element.querySelector('aq-info-list-item') as HTMLElement;
  }

  function getComponent(): InfoListItemComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getTitle(): HTMLElement | null {
    return element.querySelector('.info-list-item__title');
  }

  function getSubtitle(): HTMLElement | null {
    return element.querySelector('.info-list-item__subtitle');
  }

  function getValue(): HTMLElement | null {
    return element.querySelector('.info-list-item__value');
  }

  function getMetadata(): HTMLElement | null {
    return element.querySelector('.info-list-item__metadata');
  }

  function getBadge(): HTMLElement | null {
    return element.querySelector('aq-badge');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
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

  it('should always have the base info-list-item class', () => {
    expect(getItem().classList).toContain('info-list-item');
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it('should render the title', () => {
    expect(getTitle()?.textContent?.trim()).toBe('pH');
  });

  it('should update the title when input changes', () => {
    hostFixture.componentInstance.title.set('Nitrato (NO3)');
    hostFixture.detectChanges();

    expect(getTitle()?.textContent?.trim()).toBe('Nitrato (NO3)');
  });

  // ── Subtitle ──────────────────────────────────────────────────────────────

  it('should not render subtitle when empty', () => {
    expect(getSubtitle()).toBeNull();
  });

  it('should render subtitle when provided', () => {
    hostFixture.componentInstance.subtitle.set('Aquário Comunitário');
    hostFixture.detectChanges();

    expect(getSubtitle()?.textContent?.trim()).toBe('Aquário Comunitário');
  });

  it('should hide subtitle when cleared', () => {
    hostFixture.componentInstance.subtitle.set('Aquário Comunitário');
    hostFixture.detectChanges();

    hostFixture.componentInstance.subtitle.set('');
    hostFixture.detectChanges();

    expect(getSubtitle()).toBeNull();
  });

  // ── Value ─────────────────────────────────────────────────────────────────

  it('should render the value', () => {
    expect(getValue()?.textContent?.trim()).toBe('7.2');
  });

  it('should update the value when input changes', () => {
    hostFixture.componentInstance.value.set('25 ppm');
    hostFixture.detectChanges();

    expect(getValue()?.textContent?.trim()).toBe('25 ppm');
  });

  // ── Metadata ──────────────────────────────────────────────────────────────

  it('should not render metadata when empty', () => {
    expect(getMetadata()).toBeNull();
  });

  it('should render metadata when provided', () => {
    hostFixture.componentInstance.metadata.set('09:30');
    hostFixture.detectChanges();

    expect(getMetadata()?.textContent?.trim()).toBe('09:30');
  });

  it('should hide metadata when cleared', () => {
    hostFixture.componentInstance.metadata.set('09:30');
    hostFixture.detectChanges();

    hostFixture.componentInstance.metadata.set('');
    hostFixture.detectChanges();

    expect(getMetadata()).toBeNull();
  });

  // ── Badge ─────────────────────────────────────────────────────────────────

  it('should not render badge when null', () => {
    expect(getBadge()).toBeNull();
  });

  it('should render badge when provided', () => {
    hostFixture.componentInstance.badge.set({ label: 'Normal', status: 'normal' });
    hostFixture.detectChanges();

    expect(getBadge()).toBeTruthy();
  });

  it('should display the badge label', () => {
    hostFixture.componentInstance.badge.set({ label: 'Normal', status: 'normal' });
    hostFixture.detectChanges();

    expect(getBadge()?.textContent?.trim()).toBe('Normal');
  });

  it('should hide badge when set back to null', () => {
    hostFixture.componentInstance.badge.set({ label: 'Normal', status: 'normal' });
    hostFixture.detectChanges();

    hostFixture.componentInstance.badge.set(null);
    hostFixture.detectChanges();

    expect(getBadge()).toBeNull();
  });

  it.each<[InfoListItemStatus, string]>([
    ['normal', 'badge--success'],
    ['attention', 'badge--warning'],
    ['danger', 'badge--error'],
    ['neutral', 'badge--tertiary'],
  ])('should apply %s badge color class for status "%s"', (status, expectedClass) => {
    hostFixture.componentInstance.badge.set({ label: 'Status', status });
    hostFixture.detectChanges();

    expect(getBadge()?.classList).toContain(expectedClass);
  });

  // ── Modifier classes ──────────────────────────────────────────────────────

  it('should not apply modifier classes by default', () => {
    expect(getItem().classList).not.toContain('info-list-item--clickable');
    expect(getItem().classList).not.toContain('info-list-item--disabled');
    expect(getItem().classList).not.toContain('info-list-item--selected');
  });

  it('should apply clickable modifier when clickable is true', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    expect(getItem().classList).toContain('info-list-item--clickable');
  });

  it('should apply disabled modifier when disabled is true', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getItem().classList).toContain('info-list-item--disabled');
  });

  it('should apply selected modifier when selected is true', () => {
    hostFixture.componentInstance.selected.set(true);
    hostFixture.detectChanges();

    expect(getItem().classList).toContain('info-list-item--selected');
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('should not have role or tabindex by default', () => {
    expect(getItem().getAttribute('role')).toBeNull();
    expect(getItem().getAttribute('tabindex')).toBeNull();
  });

  it('should expose button semantics when clickable', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    expect(getItem().getAttribute('role')).toBe('button');
    expect(getItem().getAttribute('tabindex')).toBe('0');
  });

  it('should remove tabindex when clickable and disabled', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getItem().getAttribute('tabindex')).toBeNull();
    expect(getItem().getAttribute('aria-disabled')).toBe('true');
  });

  it('should not set aria-disabled when not clickable', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getItem().getAttribute('aria-disabled')).toBeNull();
  });

  // ── Interaction ───────────────────────────────────────────────────────────

  it('should emit itemClick when clickable and clicked', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getItem().click();

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should not emit itemClick when not clickable', () => {
    getItem().click();

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });

  it('should not emit itemClick when clickable but disabled', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    getItem().click();

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });

  it('should emit itemClick on Enter when clickable', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getItem().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should emit itemClick on Space when clickable', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getItem().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should not emit itemClick on other keys when clickable', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getItem().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });

  it('should not emit itemClick on Enter when disabled', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    getItem().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });
});
