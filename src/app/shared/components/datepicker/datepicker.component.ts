import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type ViewMode = 'days' | 'months' | 'years';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

interface MonthItem {
  index: number;
  label: string;
  isCurrent: boolean;
  isSelected: boolean;
}

interface YearItem {
  value: number;
  isCurrent: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-datepicker',
  standalone: true,
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  private readonly el = inject(ElementRef);

  readonly inputId = input<string>('datepicker');
  readonly locale = input<string>('pt-BR');
  readonly hasError = input<boolean>(false);

  readonly isOpen = signal(false);
  readonly viewMode = signal<ViewMode>('days');
  readonly selectedDate = signal<Date | null>(null);
  readonly viewDate = signal(new Date(new Date().getFullYear() - 25, 0, 1));
  readonly isDisabled = signal(false);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  readonly displayValue = computed(() => {
    const d = this.selectedDate();
    if (!d) return '';
    return new Intl.DateTimeFormat(this.locale(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  });

  readonly yearRangeStart = computed(() => Math.floor(this.viewDate().getFullYear() / 12) * 12);

  readonly navLabel = computed(() => {
    const v = this.viewDate();
    switch (this.viewMode()) {
      case 'days': {
        const raw = new Intl.DateTimeFormat(this.locale(), {
          month: 'long',
          year: 'numeric',
        }).format(v);
        return raw.charAt(0).toUpperCase() + raw.slice(1);
      }
      case 'months':
        return String(v.getFullYear());
      case 'years': {
        const start = this.yearRangeStart();
        return `${start} – ${start + 11}`;
      }
    }
  });

  readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(this.locale(), { weekday: 'narrow' }).format(
        new Date(2024, 0, 7 + i),
      ),
    ),
  );

  readonly calendarDays = computed<CalendarDay[]>(() => {
    const view = this.viewDate();
    const selected = this.selectedDate();
    const todayMs = this.startOfDay(new Date()).getTime();
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const toDay = (date: Date): CalendarDay => ({
      date,
      isCurrentMonth: date.getMonth() === month && date.getFullYear() === year,
      isToday: this.startOfDay(date).getTime() === todayMs,
      isSelected:
        !!selected && this.startOfDay(date).getTime() === this.startOfDay(selected).getTime(),
    });

    const days: CalendarDay[] = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(toDay(new Date(year, month, -i)));
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(toDay(new Date(year, month, d)));
    }
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
    for (let d = 1; days.length < totalCells; d++) {
      days.push(toDay(new Date(year, month + 1, d)));
    }
    return days;
  });

  readonly monthItems = computed<MonthItem[]>(() => {
    const viewYear = this.viewDate().getFullYear();
    const now = new Date();
    const selected = this.selectedDate();

    return Array.from({ length: 12 }, (_, i) => ({
      index: i,
      label: new Intl.DateTimeFormat(this.locale(), { month: 'short' }).format(
        new Date(2024, i, 1),
      ),
      isCurrent: i === now.getMonth() && viewYear === now.getFullYear(),
      isSelected: !!selected && i === selected.getMonth() && viewYear === selected.getFullYear(),
    }));
  });

  readonly yearItems = computed<YearItem[]>(() => {
    const start = this.yearRangeStart();
    const currentYear = new Date().getFullYear();
    const selectedYear = this.selectedDate()?.getFullYear();

    return Array.from({ length: 12 }, (_, i) => ({
      value: start + i,
      isCurrent: start + i === currentYear,
      isSelected: start + i === selectedYear,
    }));
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.el.nativeElement.contains(event.target as Node)) {
      this.closePanel();
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.closePanel();
  }

  toggle(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  toggleView(): void {
    switch (this.viewMode()) {
      case 'days':
        this.viewMode.set('months');
        break;
      case 'months':
        this.viewMode.set('years');
        break;
      case 'years':
        this.viewMode.set('days');
        break;
    }
  }

  prevPage(): void {
    const v = this.viewDate();
    switch (this.viewMode()) {
      case 'days':
        this.viewDate.set(new Date(v.getFullYear(), v.getMonth() - 1, 1));
        break;
      case 'months':
        this.viewDate.set(new Date(v.getFullYear() - 1, v.getMonth(), 1));
        break;
      case 'years':
        this.viewDate.set(new Date(v.getFullYear() - 12, v.getMonth(), 1));
        break;
    }
  }

  nextPage(): void {
    const v = this.viewDate();
    switch (this.viewMode()) {
      case 'days':
        this.viewDate.set(new Date(v.getFullYear(), v.getMonth() + 1, 1));
        break;
      case 'months':
        this.viewDate.set(new Date(v.getFullYear() + 1, v.getMonth(), 1));
        break;
      case 'years':
        this.viewDate.set(new Date(v.getFullYear() + 12, v.getMonth(), 1));
        break;
    }
  }

  selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) {
      this.viewDate.set(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
    this.selectedDate.set(day.date);
    this.onChange(this.toISODate(day.date));
    this.isOpen.set(false);
    this.viewMode.set('days');
    this.onTouched();
  }

  selectMonth(monthIndex: number): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(v.getFullYear(), monthIndex, 1));
    this.viewMode.set('days');
  }

  selectYear(year: number): void {
    const v = this.viewDate();
    this.viewDate.set(new Date(year, v.getMonth(), 1));
    this.viewMode.set('months');
  }

  writeValue(value: string): void {
    if (value) {
      const date = new Date(value + 'T00:00:00');
      this.selectedDate.set(date);
      this.viewDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  private closePanel(): void {
    this.isOpen.set(false);
    this.viewMode.set('days');
    this.onTouched();
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
