import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeColor } from './badge-color.type';
import { BadgeSize } from './badge-size.type';
import { BadgeVariant } from './badge-variant.type';
import { BadgeComponent } from './badge.component';

@Component({
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <aq-badge [color]="color()" [size]="size()" [variant]="variant()" [disabled]="disabled()">
      {{ label() }}
    </aq-badge>
  `,
})
class TestHostComponent {
  readonly color = signal<BadgeColor>('primary');
  readonly size = signal<BadgeSize>('medium');
  readonly variant = signal<BadgeVariant>('filled');
  readonly disabled = signal<boolean>(false);
  readonly label = signal<string>('Pro Plan');
}

describe('BadgeComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getBadge(): HTMLElement {
    return element.querySelector('aq-badge') as HTMLElement;
  }

  function getComponent(): BadgeComponent {
    return hostFixture.debugElement.children[0].componentInstance;
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

  // ── Default state ─────────────────────────────────────────────────────────

  it('should always have the base badge class', () => {
    expect(getBadge().classList).toContain('badge');
  });

  it('should apply filled variant class by default', () => {
    expect(getBadge().classList).toContain('badge--filled');
  });

  it('should apply primary color class by default', () => {
    expect(getBadge().classList).toContain('badge--primary');
  });

  it('should apply medium size class by default', () => {
    expect(getBadge().classList).toContain('badge--medium');
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it('should apply outlined variant class', () => {
    hostFixture.componentInstance.variant.set('outlined');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--outlined');
  });

  it('should apply tinted variant class', () => {
    hostFixture.componentInstance.variant.set('tinted');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--tinted');
  });

  // ── Colors ────────────────────────────────────────────────────────────────

  it('should apply secondary color class', () => {
    hostFixture.componentInstance.color.set('secondary');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--secondary');
  });

  it('should apply tertiary color class', () => {
    hostFixture.componentInstance.color.set('tertiary');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--tertiary');
  });

  it('should apply success color class', () => {
    hostFixture.componentInstance.color.set('success');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--success');
  });

  it('should apply error color class', () => {
    hostFixture.componentInstance.color.set('error');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--error');
  });

  it('should apply warning color class', () => {
    hostFixture.componentInstance.color.set('warning');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--warning');
  });

  it('should apply information color class', () => {
    hostFixture.componentInstance.color.set('information');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--information');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('should apply small size class', () => {
    hostFixture.componentInstance.size.set('small');
    hostFixture.detectChanges();

    expect(getBadge().classList).toContain('badge--small');
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('should set aria-disabled when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getBadge().getAttribute('aria-disabled')).toBe('true');
  });

  it('should not set aria-disabled when not disabled', () => {
    expect(getBadge().getAttribute('aria-disabled')).toBeNull();
  });

  // ── Class composition ─────────────────────────────────────────────────────

  it('should combine all modifier classes in the host class', () => {
    hostFixture.componentInstance.variant.set('outlined');
    hostFixture.componentInstance.color.set('success');
    hostFixture.componentInstance.size.set('small');
    hostFixture.detectChanges();

    const classList = getBadge().classList;
    expect(classList).toContain('badge');
    expect(classList).toContain('badge--outlined');
    expect(classList).toContain('badge--success');
    expect(classList).toContain('badge--small');
  });

  // ── Content projection ────────────────────────────────────────────────────

  it('should project text content', () => {
    hostFixture.componentInstance.label.set('Free Tier');
    hostFixture.detectChanges();

    expect(getBadge().textContent?.trim()).toBe('Free Tier');
  });
});
