import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedControlOption } from './segmented-control-option.model';
import { SegmentedControlComponent } from './segmented-control.component';

const OPTIONS: SegmentedControlOption[] = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

@Component({
  standalone: true,
  imports: [SegmentedControlComponent],
  template: `
    <aq-segmented-control
      [options]="options()"
      [value]="value()"
      ariaLabel="Display temperature in"
      [disabled]="disabled()"
      (valueChange)="value.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly options = signal(OPTIONS);
  readonly value = signal('celsius');
  readonly disabled = signal(false);
}

describe('SegmentedControlComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getButtons(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('.segmented-control__option'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should render one button per option', () => {
    expect(getButtons()).toHaveLength(2);
    expect(getButtons()[0].textContent?.trim()).toBe('°C');
    expect(getButtons()[1].textContent?.trim()).toBe('°F');
  });

  it('should mark the selected option as checked', () => {
    expect(getButtons()[0].getAttribute('aria-checked')).toBe('true');
    expect(getButtons()[1].getAttribute('aria-checked')).toBe('false');
    expect(getButtons()[0].classList).toContain('segmented-control__option--selected');
  });

  it('should emit valueChange when a different option is clicked', () => {
    getButtons()[1].click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.value()).toBe('fahrenheit');
    expect(getButtons()[1].getAttribute('aria-checked')).toBe('true');
  });

  it('should not emit when clicking the already-selected option', () => {
    const spy = jest.spyOn(hostFixture.componentInstance.value, 'set');

    getButtons()[0].click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should move selection with ArrowRight', () => {
    getButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.value()).toBe('fahrenheit');
  });

  it('should move selection with ArrowLeft, wrapping around', () => {
    getButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.value()).toBe('fahrenheit');
  });

  it('should ignore keys other than ArrowLeft/ArrowRight', () => {
    getButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.value()).toBe('celsius');
  });

  it('should do nothing on ArrowRight when there are no options', () => {
    hostFixture.componentInstance.options.set([]);
    hostFixture.detectChanges();

    const component = hostFixture.debugElement.children[0].componentInstance;
    component['onKeydown'](new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.value()).toBe('celsius');
  });

  it('should disable all options and ignore clicks when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    expect(getButtons()[1].disabled).toBe(true);

    getButtons()[1].click();

    expect(hostFixture.componentInstance.value()).toBe('celsius');
  });
});
