import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipColor } from './chip-color.type';
import { ChipSize } from './chip-size.type';
import { ChipVariant } from './chip-variant.type';
import { ChipComponent } from './chip.component';

@Component({
  standalone: true,
  imports: [ChipComponent],
  template: `
    <aq-chip [color]="color()" [size]="size()" [variant]="variant()" [disabled]="disabled()">
      {{ label() }}
    </aq-chip>
  `,
})
class TestHostComponent {
  readonly color = signal<ChipColor>('primary');
  readonly size = signal<ChipSize>('small');
  readonly variant = signal<ChipVariant>('tinted');
  readonly disabled = signal<boolean>(false);
  readonly label = signal<string>('Estável');
}

describe('ChipComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getChip(): HTMLElement {
    return element.querySelector('aq-chip') as HTMLElement;
  }

  function getDot(): HTMLElement {
    return element.querySelector('.chip__dot') as HTMLElement;
  }

  function getComponent(): ChipComponent {
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

  it('should always have the base chip class', () => {
    expect(getChip().classList).toContain('chip');
  });

  it('should apply tinted variant class by default', () => {
    expect(getChip().classList).toContain('chip--tinted');
  });

  it('should apply primary color class by default', () => {
    expect(getChip().classList).toContain('chip--primary');
  });

  it('should apply small size class by default', () => {
    expect(getChip().classList).toContain('chip--small');
  });

  // ── Dot indicator ─────────────────────────────────────────────────────────

  it('should render the dot indicator element', () => {
    expect(getDot()).toBeTruthy();
  });

  it('should mark dot as aria-hidden', () => {
    expect(getDot().getAttribute('aria-hidden')).toBe('true');
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it('should apply filled variant class', () => {
    hostFixture.componentInstance.variant.set('filled');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--filled');
  });

  it('should apply outlined variant class', () => {
    hostFixture.componentInstance.variant.set('outlined');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--outlined');
  });

  // ── Colors ────────────────────────────────────────────────────────────────

  it('should apply secondary color class', () => {
    hostFixture.componentInstance.color.set('secondary');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--secondary');
  });

  it('should apply tertiary color class', () => {
    hostFixture.componentInstance.color.set('tertiary');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--tertiary');
  });

  it('should apply success color class', () => {
    hostFixture.componentInstance.color.set('success');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--success');
  });

  it('should apply error color class', () => {
    hostFixture.componentInstance.color.set('error');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--error');
  });

  it('should apply warning color class', () => {
    hostFixture.componentInstance.color.set('warning');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--warning');
  });

  it('should apply information color class', () => {
    hostFixture.componentInstance.color.set('information');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--information');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('should apply medium size class', () => {
    hostFixture.componentInstance.size.set('medium');
    hostFixture.detectChanges();

    expect(getChip().classList).toContain('chip--medium');
  });

  // ── Disabled state ────────────────────────────────────────────────────────

  it('should set aria-disabled when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getChip().getAttribute('aria-disabled')).toBe('true');
  });

  it('should not set aria-disabled when not disabled', () => {
    expect(getChip().getAttribute('aria-disabled')).toBeNull();
  });

  // ── Class composition ─────────────────────────────────────────────────────

  it('should combine all modifier classes in the host class', () => {
    hostFixture.componentInstance.variant.set('outlined');
    hostFixture.componentInstance.color.set('success');
    hostFixture.componentInstance.size.set('medium');
    hostFixture.detectChanges();

    const classList = getChip().classList;
    expect(classList).toContain('chip');
    expect(classList).toContain('chip--outlined');
    expect(classList).toContain('chip--success');
    expect(classList).toContain('chip--medium');
  });

  // ── Content projection ────────────────────────────────────────────────────

  it('should project text content', () => {
    hostFixture.componentInstance.label.set('Crítico');
    hostFixture.detectChanges();

    expect(getChip().textContent?.trim()).toBe('Crítico');
  });
});
