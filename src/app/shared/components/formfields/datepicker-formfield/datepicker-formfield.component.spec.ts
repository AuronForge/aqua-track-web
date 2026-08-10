import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DatepickerRangeDirective, DatepickerRangeValue } from './datepicker-range.directive';
import { DatepickerFormfieldComponent } from './datepicker-formfield.component';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
}

const calendarDay = (date: Date, isCurrentMonth = true): CalendarDay => ({
  date,
  isCurrentMonth,
  isToday: false,
  isSelected: false,
  isRangeStart: false,
  isRangeEnd: false,
  isInRange: false,
});

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, DatepickerFormfieldComponent],
  template: `
    <form [formGroup]="form">
      <aq-datepicker-formfield
        formControlName="birthDate"
        label="Data de nascimento"
        hint="Use a mesma data cadastrada na sua conta."
        [errorMessages]="{ required: 'Campo obrigatorio.' }"
      />
    </form>

    <aq-datepicker-formfield label="Livre" />
  `,
})
class TestHostComponent {
  readonly form = new FormGroup({
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}

@Component({
  standalone: true,
  imports: [DatepickerFormfieldComponent, DatepickerRangeDirective, ReactiveFormsModule],
  template: `
    <aq-datepicker-formfield
      aqDateRange
      label="Período"
      placeholder="Início e fim"
      [formControl]="rangeControl"
    />
  `,
})
class RangeHostComponent {
  readonly rangeControl = new FormControl<string | DatepickerRangeValue | null>(null);
}

describe('DatepickerFormfieldComponent', () => {
  let fixture: ComponentFixture<DatepickerFormfieldComponent>;
  let component: DatepickerFormfieldComponent;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFormfieldComponent],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    fixture = TestBed.createComponent(DatepickerFormfieldComponent);
    fixture.componentRef.setInput('label', 'Data de nascimento');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the panel', () => {
    component['toggle']();
    fixture.detectChanges();
    expect(component['isOpen']()).toBe(true);
    expect(overlayContainerElement.querySelector('.datepicker-formfield__panel')).not.toBeNull();

    component['toggle']();
    fixture.detectChanges();
    expect(component['isOpen']()).toBe(false);
    expect(overlayContainerElement.querySelector('.datepicker-formfield__panel')).toBeNull();
  });

  it('should open on the current month without selecting a date', () => {
    const today = new Date();

    component.writeValue('');
    component['toggle']();
    fixture.detectChanges();

    expect(component['selectedDate']()).toBeNull();
    expect(component['viewDate']().getFullYear()).toBe(today.getFullYear());
    expect(component['viewDate']().getMonth()).toBe(today.getMonth());
  });

  it('should not toggle when disabled', () => {
    component.setDisabledState(true);

    component['toggle']();

    expect(component['isOpen']()).toBe(false);
  });

  it('should cycle between calendar views', () => {
    expect(component['viewMode']()).toBe('days');

    component['toggleView']();
    expect(component['viewMode']()).toBe('months');

    component['toggleView']();
    expect(component['viewMode']()).toBe('years');

    component['toggleView']();
    expect(component['viewMode']()).toBe('days');
  });

  it('should emit an ISO value when selecting a day', () => {
    const onChange = jest.fn();
    const onTouched = jest.fn();
    const day = calendarDay(new Date(2000, 0, 5));

    component.registerOnChange(onChange);
    component.registerOnTouched(onTouched);

    component['selectDay'](day);

    expect(onChange).toHaveBeenCalledWith('2000-01-05');
    expect(onTouched).toHaveBeenCalled();
    expect(component['selectedDate']()).toEqual(day.date);
    expect(component['isOpen']()).toBe(false);
  });

  it('should update the displayed value when writing a date', () => {
    component.writeValue('2000-06-15');

    expect(component['selectedDate']()?.getFullYear()).toBe(2000);
    expect(component['selectedDate']()?.getMonth()).toBe(5);
    expect(component['selectedDate']()?.getDate()).toBe(15);
    expect(component['viewDate']().getMonth()).toBe(5);
    expect(component['displayValue']()).toContain('2000');
  });

  it('should clear the selected date when writing an empty value', () => {
    component.writeValue('2000-06-15');
    component.writeValue('');

    expect(component['selectedDate']()).toBeNull();
  });

  it('should clear the selected date when writing a non-string value', () => {
    component.writeValue('2000-06-15');
    component.writeValue(null);

    expect(component['selectedDate']()).toBeNull();
  });

  it('should close the panel on backdrop click', () => {
    component['toggle']();
    fixture.detectChanges();
    overlayContainerElement.parentElement
      ?.querySelector('.cdk-overlay-backdrop')
      ?.dispatchEvent(new MouseEvent('click'));

    expect(component['isOpen']()).toBe(false);
  });

  it('should close the panel on escape', () => {
    component['toggle']();
    component['toggleView']();

    component.onEscape();

    expect(component['isOpen']()).toBe(false);
    expect(component['viewMode']()).toBe('days');
  });

  it('should prefer opening upwards when there is not enough space below', () => {
    jest.spyOn(component['elementRef'].nativeElement, 'getBoundingClientRect').mockReturnValue({
      top: 500,
      bottom: 560,
      left: 0,
      right: 320,
      width: 320,
      height: 60,
      x: 0,
      y: 500,
      toJSON: () => ({}),
    });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 640 });

    const positions = component['resolveOverlayPositions']();

    expect(positions[0].originY).toBe('top');
    expect(positions[0].overlayY).toBe('bottom');
  });

  it('should prefer opening downwards when there is enough space below', () => {
    jest.spyOn(component['elementRef'].nativeElement, 'getBoundingClientRect').mockReturnValue({
      top: 120,
      bottom: 180,
      left: 0,
      right: 320,
      width: 320,
      height: 60,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });

    const positions = component['resolveOverlayPositions']();

    expect(positions[0].originY).toBe('bottom');
    expect(positions[0].overlayY).toBe('top');
  });

  it('should cap the panel width on large screens', () => {
    Object.defineProperty(component['elementRef'].nativeElement, 'offsetWidth', {
      configurable: true,
      value: 1200,
    });

    expect(component['resolvePanelWidth']()).toBe(360);
  });

  it('should keep the panel width fluid on smaller screens', () => {
    Object.defineProperty(component['elementRef'].nativeElement, 'offsetWidth', {
      configurable: true,
      value: 320,
    });

    expect(component['resolvePanelWidth']()).toBe(320);
  });

  it('should update month and year navigation in all views', () => {
    component['viewDate'].set(new Date(2024, 5, 1));
    component['prevPage']();
    expect(component['viewDate']().getMonth()).toBe(4);

    component['toggleView']();
    component['nextPage']();
    expect(component['viewDate']().getFullYear()).toBe(2025);

    component['toggleView']();
    component['prevPage']();
    expect(component['viewDate']().getFullYear()).toBe(2013);
  });

  it('should select a month and return to days view', () => {
    component['toggleView']();

    component['selectMonth'](8);

    expect(component['viewDate']().getMonth()).toBe(8);
    expect(component['viewMode']()).toBe('days');
  });

  it('should select a year and return to months view', () => {
    component['toggleView']();
    component['toggleView']();

    component['selectYear'](2010);

    expect(component['viewDate']().getFullYear()).toBe(2010);
    expect(component['viewMode']()).toBe('months');
  });

  it('should move the calendar view when selecting a day from another month', () => {
    component['viewDate'].set(new Date(2024, 5, 1));

    component['selectDay'](calendarDay(new Date(2024, 6, 1), false));

    expect(component['viewDate']().getMonth()).toBe(6);
  });

  it('should compute calendar, month and year helper collections', () => {
    component.writeValue('2000-06-15');
    component['viewDate'].set(new Date(2000, 5, 1));

    expect(component['calendarDays']()).toHaveLength(42);
    expect(component['calendarDays']().some((day) => day.isSelected)).toBe(true);
    expect(component['monthItems']()).toHaveLength(12);
    expect(component['monthItems']().some((month) => month.isSelected)).toBe(true);
    expect(component['yearItems']()).toHaveLength(12);
    expect(component['yearItems']().some((year) => year.isSelected)).toBe(true);
  });

  it('should compute weekday labels and year range label', () => {
    component['viewDate'].set(new Date(2024, 0, 1));
    component['toggleView']();
    component['toggleView']();

    expect(component['weekdays']()).toHaveLength(7);
    expect(component['yearRangeStart']()).toBe(2016);
    expect(component['navLabel']()).toBe('2016 - 2027');
  });

  it('should expose empty error state without NgControl', () => {
    expect((component as unknown as { showError: () => boolean }).showError()).toBe(false);
    expect(
      (component as unknown as { resolvedErrorMessage: () => string }).resolvedErrorMessage(),
    ).toBe('');
  });

  it('should clear focus when disabling the component', () => {
    component['toggle']();

    component.setDisabledState(true);

    expect(component['isDisabled']()).toBe(true);
    expect(component['focused']()).toBe(false);
    expect(component['isOpen']()).toBe(false);
  });
});

describe('DatepickerFormfieldComponent with NgControl', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getBoundComponent(): DatepickerFormfieldComponent {
    return hostFixture.debugElement.query(By.directive(DatepickerFormfieldComponent))
      .componentInstance as DatepickerFormfieldComponent;
  }

  function getBoundTrigger(): HTMLButtonElement {
    return hostFixture.nativeElement.querySelector('.datepicker-formfield__trigger');
  }

  function getHint(): HTMLElement | null {
    return hostFixture.nativeElement.querySelector('.datepicker-formfield__hint');
  }

  function getError(): HTMLElement | null {
    return hostFixture.nativeElement.querySelector('.datepicker-formfield__error');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    host = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should show the hint before validation errors are visible', () => {
    expect(getHint()?.textContent).toContain('Use a mesma data cadastrada na sua conta.');
    expect(getError()).toBeNull();
    expect(getBoundTrigger().getAttribute('aria-describedby')).toBe(getHint()?.id ?? null);
  });

  it('should show the required error after the control is touched', () => {
    host.form.controls.birthDate.markAsTouched();
    (
      getBoundComponent() as unknown as {
        controlStateVersion: { update: (updater: (value: number) => number) => void };
      }
    ).controlStateVersion.update((value) => value + 1);
    hostFixture.detectChanges();

    expect(getError()?.textContent).toContain('Campo obrigatorio.');
    expect(getBoundTrigger().getAttribute('aria-invalid')).toBe('true');
  });

  it('should use generic fallback messages for unknown error keys', () => {
    host.form.controls.birthDate.setErrors({ custom: true });
    host.form.controls.birthDate.markAsTouched();
    (
      getBoundComponent() as unknown as {
        controlStateVersion: { update: (updater: (value: number) => number) => void };
      }
    ).controlStateVersion.update((value) => value + 1);
    hostFixture.detectChanges();

    expect(getBoundComponent()['resolvedErrorMessage']()).toBe('Campo invalido.');
  });

  it('should set the control as touched when a date is selected', () => {
    const boundComponent = getBoundComponent();

    boundComponent['selectDay'](calendarDay(new Date(2024, 0, 5)));
    hostFixture.detectChanges();

    expect(host.form.controls.birthDate.touched).toBe(true);
    expect(host.form.controls.birthDate.value).toBe('2024-01-05');
  });
});

describe('DatepickerFormfieldComponent with range directive', () => {
  let fixture: ComponentFixture<RangeHostComponent>;
  let host: RangeHostComponent;
  let component: DatepickerFormfieldComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeHostComponent);
    host = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(DatepickerFormfieldComponent))
      .componentInstance as DatepickerFormfieldComponent;
    fixture.detectChanges();
  });

  it('should display a written date range', () => {
    host.rangeControl.setValue({ start: '2026-08-01', end: '2026-08-10' });
    fixture.detectChanges();

    expect(component['isRangeMode']()).toBe(true);
    expect(component['selectedRangeStart']()?.getDate()).toBe(1);
    expect(component['selectedRangeEnd']()?.getDate()).toBe(10);
    expect(component['displayValue']()).toContain('01/08/2026');
    expect(component['displayValue']()).toContain('10/08/2026');
  });

  it('should select a range in chronological order and close after the end date', () => {
    component['toggle']();
    component['selectDay'](calendarDay(new Date(2026, 7, 10)));

    expect(host.rangeControl.value).toBe('2026-08-10');
    expect(component['selectedRangeStart']()?.getDate()).toBe(10);
    expect(component['selectedRangeEnd']()).toBeNull();
    expect(component['isOpen']()).toBe(true);

    component['selectDay'](calendarDay(new Date(2026, 7, 5)));
    fixture.detectChanges();

    expect(host.rangeControl.value).toEqual({ start: '2026-08-05', end: '2026-08-10' });
    expect(component['selectedRangeStart']()?.getDate()).toBe(5);
    expect(component['selectedRangeEnd']()?.getDate()).toBe(10);
    expect(component['isOpen']()).toBe(false);
  });

  it('should start a new range when selecting after a complete range', () => {
    host.rangeControl.setValue({ start: '2026-08-01', end: '2026-08-10' });
    fixture.detectChanges();

    component['selectDay'](calendarDay(new Date(2026, 7, 20)));

    expect(host.rangeControl.value).toBe('2026-08-20');
    expect(component['selectedRangeStart']()?.getDate()).toBe(20);
    expect(component['selectedRangeEnd']()).toBeNull();
  });

  it('should display a written single date as a range start', () => {
    host.rangeControl.setValue('2026-08-15');
    fixture.detectChanges();

    expect(component['selectedDate']()).toBeNull();
    expect(component['selectedRangeStart']()?.getDate()).toBe(15);
    expect(component['selectedRangeEnd']()).toBeNull();
    expect(component['displayValue']()).toContain('15/08/2026');
  });

  it('should mark calendar days inside the selected range', () => {
    host.rangeControl.setValue({ start: '2026-08-01', end: '2026-08-03' });
    component['viewDate'].set(new Date(2026, 7, 1));
    fixture.detectChanges();

    const days = component['calendarDays']();

    expect(days.find((day) => day.date.getDate() === 1 && day.isCurrentMonth)?.isRangeStart).toBe(
      true,
    );
    expect(days.find((day) => day.date.getDate() === 2 && day.isCurrentMonth)?.isInRange).toBe(
      true,
    );
    expect(days.find((day) => day.date.getDate() === 3 && day.isCurrentMonth)?.isRangeEnd).toBe(
      true,
    );
  });
});
