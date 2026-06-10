import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonColor } from './button-color.type';
import { ButtonSize } from './button-size.type';
import { ButtonVariant } from './button-variant.type';
import { ButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <button aqButton [variant]="variant()" [color]="color()" [size]="size()">
      {{ label() }}
    </button>
  `,
})
class TestHostComponent {
  readonly variant = signal<ButtonVariant>('flat');
  readonly color = signal<ButtonColor>('primary');
  readonly size = signal<ButtonSize>('medium');
  readonly label = signal<string>('Click me');
}

describe('ButtonComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getButton(): HTMLButtonElement {
    return element.querySelector('button') as HTMLButtonElement;
  }

  function getComponent(): ButtonComponent {
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

  it('should apply flat variant class by default', () => {
    expect(getButton().classList).toContain('btn--flat');
  });

  it('should apply primary color class by default', () => {
    expect(getButton().classList).toContain('btn--primary');
  });

  it('should apply medium size class by default', () => {
    expect(getButton().classList).toContain('btn--medium');
  });

  it('should always have the base btn class', () => {
    expect(getButton().classList).toContain('btn');
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it('should apply stroked variant class', () => {
    hostFixture.componentInstance.variant.set('stroked');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--stroked');
  });

  it('should apply basic variant class', () => {
    hostFixture.componentInstance.variant.set('basic');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--basic');
  });

  it('should apply icon variant class', () => {
    hostFixture.componentInstance.variant.set('icon');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--icon');
  });

  // ── Colors ────────────────────────────────────────────────────────────────

  it('should apply secondary color class', () => {
    hostFixture.componentInstance.color.set('secondary');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--secondary');
  });

  it('should apply tertiary color class', () => {
    hostFixture.componentInstance.color.set('tertiary');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--tertiary');
  });

  it('should apply success color class', () => {
    hostFixture.componentInstance.color.set('success');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--success');
  });

  it('should apply error color class', () => {
    hostFixture.componentInstance.color.set('error');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--error');
  });

  it('should apply warning color class', () => {
    hostFixture.componentInstance.color.set('warning');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--warning');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('should apply small size class', () => {
    hostFixture.componentInstance.size.set('small');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--small');
  });

  it('should apply large size class', () => {
    hostFixture.componentInstance.size.set('large');
    hostFixture.detectChanges();

    expect(getButton().classList).toContain('btn--large');
  });

  // ── Class composition ─────────────────────────────────────────────────────

  it('should combine all modifier classes in the host class', () => {
    hostFixture.componentInstance.variant.set('stroked');
    hostFixture.componentInstance.color.set('error');
    hostFixture.componentInstance.size.set('large');
    hostFixture.detectChanges();

    const classList = getButton().classList;
    expect(classList).toContain('btn');
    expect(classList).toContain('btn--stroked');
    expect(classList).toContain('btn--error');
    expect(classList).toContain('btn--large');
  });

  // ── Content projection ────────────────────────────────────────────────────

  it('should project text content', () => {
    hostFixture.componentInstance.label.set('Save');
    hostFixture.detectChanges();

    expect(getButton().textContent?.trim()).toBe('Save');
  });
});
