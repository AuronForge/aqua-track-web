import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerComponent } from './datepicker.component';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

describe('DatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerComponent>;
  let component: DatepickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle()', () => {
    it('should open the panel when closed', () => {
      expect(component.isOpen()).toBe(false);
      component.toggle();
      expect(component.isOpen()).toBe(true);
    });

    it('should close the panel when open', () => {
      component.toggle();
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('should not toggle when disabled', () => {
      component.setDisabledState(true);
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('toggleView()', () => {
    it('should switch from days to months', () => {
      expect(component.viewMode()).toBe('days');
      component.toggleView();
      expect(component.viewMode()).toBe('months');
    });

    it('should switch from months to years', () => {
      component.toggleView();
      component.toggleView();
      expect(component.viewMode()).toBe('years');
    });

    it('should switch from years back to days', () => {
      component.toggleView();
      component.toggleView();
      component.toggleView();
      expect(component.viewMode()).toBe('days');
    });
  });

  describe('prevPage()', () => {
    it('should go to the previous month in days view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.prevPage();
      expect(component.viewDate().getMonth()).toBe(4);
      expect(component.viewDate().getFullYear()).toBe(2024);
    });

    it('should cross the year boundary when going back from January', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.prevPage();
      expect(component.viewDate().getMonth()).toBe(11);
      expect(component.viewDate().getFullYear()).toBe(2023);
    });

    it('should go to the previous year in months view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.toggleView();
      component.prevPage();
      expect(component.viewDate().getFullYear()).toBe(2023);
    });

    it('should go back 12 years in years view', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggleView();
      component.toggleView();
      component.prevPage();
      expect(component.viewDate().getFullYear()).toBe(2012);
    });
  });

  describe('nextPage()', () => {
    it('should go to the next month in days view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.nextPage();
      expect(component.viewDate().getMonth()).toBe(6);
      expect(component.viewDate().getFullYear()).toBe(2024);
    });

    it('should cross the year boundary when going forward from December', () => {
      component['viewDate'].set(new Date(2024, 11, 1));
      component.nextPage();
      expect(component.viewDate().getMonth()).toBe(0);
      expect(component.viewDate().getFullYear()).toBe(2025);
    });

    it('should go to the next year in months view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.toggleView();
      component.nextPage();
      expect(component.viewDate().getFullYear()).toBe(2025);
    });

    it('should go forward 12 years in years view', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggleView();
      component.toggleView();
      component.nextPage();
      expect(component.viewDate().getFullYear()).toBe(2036);
    });
  });

  describe('selectDay()', () => {
    it('should set the selected date', () => {
      const day: CalendarDay = {
        date: new Date(2000, 5, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(component.selectedDate()).toEqual(day.date);
    });

    it('should close the panel and reset the view mode to days', () => {
      component.toggle();
      component.toggleView();
      const day: CalendarDay = {
        date: new Date(2000, 5, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(component.isOpen()).toBe(false);
      expect(component.viewMode()).toBe('days');
    });

    it('should navigate to the day month when the day is not in the current month', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      const day: CalendarDay = {
        date: new Date(2024, 6, 1),
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(component.viewDate().getMonth()).toBe(6);
    });

    it('should call onChange with the ISO date string', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      const day: CalendarDay = {
        date: new Date(2000, 5, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(onChange).toHaveBeenCalledWith('2000-06-15');
    });

    it('should call onTouched after selecting a day', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      const day: CalendarDay = {
        date: new Date(2000, 5, 15),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(onTouched).toHaveBeenCalled();
    });

    it('should format single-digit month and day with padding', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      const day: CalendarDay = {
        date: new Date(2000, 0, 5),
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      };
      component.selectDay(day);
      expect(onChange).toHaveBeenCalledWith('2000-01-05');
    });
  });

  describe('selectMonth()', () => {
    it('should update the view month and switch to days view', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggleView();
      component.selectMonth(8);
      expect(component.viewDate().getMonth()).toBe(8);
      expect(component.viewMode()).toBe('days');
    });
  });

  describe('selectYear()', () => {
    it('should update the view year and switch to months view', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggleView();
      component.toggleView();
      component.selectYear(2010);
      expect(component.viewDate().getFullYear()).toBe(2010);
      expect(component.viewMode()).toBe('months');
    });
  });

  describe('writeValue()', () => {
    it('should set selectedDate when a valid date string is provided', () => {
      component.writeValue('2000-06-15');
      expect(component.selectedDate()?.getFullYear()).toBe(2000);
      expect(component.selectedDate()?.getMonth()).toBe(5);
      expect(component.selectedDate()?.getDate()).toBe(15);
    });

    it('should update viewDate to the selected date month and year', () => {
      component.writeValue('2000-06-15');
      expect(component.viewDate().getFullYear()).toBe(2000);
      expect(component.viewDate().getMonth()).toBe(5);
    });

    it('should set selectedDate to null when an empty string is provided', () => {
      component.writeValue('2000-06-15');
      component.writeValue('');
      expect(component.selectedDate()).toBeNull();
    });
  });

  describe('setDisabledState()', () => {
    it('should set isDisabled to true', () => {
      component.setDisabledState(true);
      expect(component.isDisabled()).toBe(true);
    });

    it('should set isDisabled back to false', () => {
      component.setDisabledState(true);
      component.setDisabledState(false);
      expect(component.isDisabled()).toBe(false);
    });
  });

  describe('onDocumentClick()', () => {
    it('should close the panel when clicking outside the component', () => {
      component.toggle();
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      component.onDocumentClick({ target: outsideElement } as unknown as MouseEvent);
      expect(component.isOpen()).toBe(false);
      document.body.removeChild(outsideElement);
    });

    it('should call onTouched when closing via outside click', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      component.toggle();
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      component.onDocumentClick({ target: outsideElement } as unknown as MouseEvent);
      expect(onTouched).toHaveBeenCalled();
      document.body.removeChild(outsideElement);
    });

    it('should not close the panel when clicking inside the component', () => {
      component.toggle();
      component.onDocumentClick({ target: fixture.nativeElement } as unknown as MouseEvent);
      expect(component.isOpen()).toBe(true);
    });

    it('should not do anything when the panel is already closed', () => {
      const outsideElement = document.createElement('div');
      component.onDocumentClick({ target: outsideElement } as unknown as MouseEvent);
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('onEscape()', () => {
    it('should close the panel when it is open', () => {
      component.toggle();
      component.onEscape();
      expect(component.isOpen()).toBe(false);
    });

    it('should reset the view mode to days when closing via Escape', () => {
      component.toggle();
      component.toggleView();
      component.onEscape();
      expect(component.viewMode()).toBe('days');
    });

    it('should not do anything when the panel is already closed', () => {
      component.onEscape();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('displayValue', () => {
    it('should return an empty string when no date is selected', () => {
      expect(component.displayValue()).toBe('');
    });

    it('should return a formatted date string when a date is selected', () => {
      component.writeValue('2000-06-15');
      const value = component.displayValue();
      expect(value).toBeTruthy();
      expect(value).toContain('2000');
    });
  });

  describe('navLabel', () => {
    it('should show month and year in days view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.toggle();
      fixture.detectChanges();
      const label = component.navLabel();
      expect(label).toMatch(/2024/);
    });

    it('should show the year in months view', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.toggleView();
      expect(component.navLabel()).toBe('2024');
    });

    it('should show a year range in years view', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggleView();
      component.toggleView();
      expect(component.navLabel()).toMatch(/\d+ – \d+/);
    });
  });

  describe('yearRangeStart', () => {
    it('should compute the start of the 12-year block', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      expect(component.yearRangeStart()).toBe(2016);
    });
  });

  describe('weekdays', () => {
    it('should build a weekdays array with 7 entries', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.weekdays().length).toBe(7);
    });
  });

  describe('calendarDays', () => {
    it('should build a grid with a multiple of 7 cells', () => {
      component.toggle();
      fixture.detectChanges();
      expect(component.calendarDays().length % 7).toBe(0);
    });

    it('should mark today in the calendar when viewing the current month', () => {
      const today = new Date();
      component['viewDate'].set(new Date(today.getFullYear(), today.getMonth(), 1));
      component.toggle();
      fixture.detectChanges();
      const todayDay = component.calendarDays().find((d) => d.isToday);
      expect(todayDay).toBeTruthy();
    });

    it('should mark the selected date in the calendar', () => {
      component.writeValue('2000-06-15');
      component.toggle();
      fixture.detectChanges();
      const selectedDay = component.calendarDays().find((d) => d.isSelected);
      expect(selectedDay).toBeTruthy();
      expect(selectedDay?.date.getDate()).toBe(15);
    });

    it('should include days from the previous month when the first day is not Sunday', () => {
      component['viewDate'].set(new Date(2024, 0, 1));
      component.toggle();
      fixture.detectChanges();
      const prevMonthDays = component.calendarDays().filter((d) => !d.isCurrentMonth);
      expect(prevMonthDays.length).toBeGreaterThan(0);
    });

    it('should mark days in the current month as isCurrentMonth', () => {
      component['viewDate'].set(new Date(2024, 5, 1));
      component.toggle();
      fixture.detectChanges();
      const currentMonthDays = component.calendarDays().filter((d) => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(30);
    });
  });

  describe('monthItems', () => {
    it('should build a months array with 12 entries', () => {
      component.toggleView();
      expect(component.monthItems().length).toBe(12);
    });

    it('should mark the current month when viewing the current year', () => {
      const today = new Date();
      component['viewDate'].set(new Date(today.getFullYear(), 0, 1));
      component.toggleView();
      const currentMonth = component.monthItems().find((m) => m.isCurrent);
      expect(currentMonth).toBeTruthy();
      expect(currentMonth?.index).toBe(today.getMonth());
    });

    it('should mark the selected month when a date is selected', () => {
      component.writeValue('2000-06-15');
      component['viewDate'].set(new Date(2000, 0, 1));
      component.toggleView();
      const selectedMonth = component.monthItems().find((m) => m.isSelected);
      expect(selectedMonth).toBeTruthy();
      expect(selectedMonth?.index).toBe(5);
    });
  });

  describe('yearItems', () => {
    it('should build a years array with 12 entries', () => {
      component.toggleView();
      component.toggleView();
      expect(component.yearItems().length).toBe(12);
    });

    it('should mark the current year', () => {
      const currentYear = new Date().getFullYear();
      component['viewDate'].set(new Date(currentYear, 0, 1));
      component.toggleView();
      component.toggleView();
      const currentYearItem = component.yearItems().find((y) => y.isCurrent);
      expect(currentYearItem).toBeTruthy();
      expect(currentYearItem?.value).toBe(currentYear);
    });

    it('should mark the selected year when a date is selected', () => {
      component.writeValue('2000-06-15');
      component['viewDate'].set(new Date(2000, 0, 1));
      component.toggleView();
      component.toggleView();
      const selectedYear = component.yearItems().find((y) => y.isSelected);
      expect(selectedYear).toBeTruthy();
      expect(selectedYear?.value).toBe(2000);
    });
  });
});
