import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

@Component({
  standalone: true,
  imports: [SwitchComponent],
  template: `
    <aq-switch
      [checked]="checked()"
      [disabled]="disabled()"
      ariaLabel="Email Alerts"
      (checkedChange)="checked.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly checked = signal(false);
  readonly disabled = signal(false);
}

describe('SwitchComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getTrack(): HTMLButtonElement {
    return element.querySelector('.switch__track') as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should render role="switch" reflecting the checked state', () => {
    expect(getTrack().getAttribute('role')).toBe('switch');
    expect(getTrack().getAttribute('aria-checked')).toBe('false');
  });

  it('should expose the accessible label', () => {
    expect(getTrack().getAttribute('aria-label')).toBe('Email Alerts');
  });

  it('should emit checkedChange(true) when clicked while unchecked', () => {
    getTrack().click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.checked()).toBe(true);
    expect(getTrack().getAttribute('aria-checked')).toBe('true');
    expect(getTrack().classList).toContain('switch__track--checked');
  });

  it('should not emit when disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    getTrack().click();

    expect(hostFixture.componentInstance.checked()).toBe(false);
    expect(getTrack().disabled).toBe(true);
  });

  it('should not emit when toggle() is invoked directly while disabled', () => {
    hostFixture.componentInstance.disabled.set(true);
    hostFixture.detectChanges();

    const component = hostFixture.debugElement.children[0].componentInstance;
    component['toggle']();

    expect(hostFixture.componentInstance.checked()).toBe(false);
  });
});
