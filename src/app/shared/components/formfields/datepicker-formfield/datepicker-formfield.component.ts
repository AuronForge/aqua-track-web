import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DoCheck,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConnectedPosition, Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { FormfieldErrorMessages } from '../formfield-error-messages.model';

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

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Campo obrigatorio.',
};
const DATEPICKER_PANEL_MIN_WIDTH = 280;
const DATEPICKER_PANEL_MAX_WIDTH = 360;

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-datepicker-formfield',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './datepicker-formfield.component.html',
  styleUrl: './datepicker-formfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerFormfieldComponent),
      multi: true,
    },
  ],
})
export class DatepickerFormfieldComponent
  implements ControlValueAccessor, OnInit, OnDestroy, DoCheck
{
  readonly label = input.required<string>();
  readonly placeholder = input<string>('Selecione uma data');
  readonly hint = input<string>('');
  readonly id = input<string>();
  readonly locale = input<string>('pt-BR');
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });
  readonly errorMessages = input<FormfieldErrorMessages>({});

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  private ngControl: NgControl | null = null;
  private overlayRef: OverlayRef | null = null;
  private lastControlStateSignature = '';

  protected readonly isOpen = signal(false);
  protected readonly focused = signal(false);
  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly viewMode = signal<ViewMode>('days');
  protected readonly viewDate = signal(new Date(new Date().getFullYear() - 25, 0, 1));
  protected readonly cvaDisabled = signal(false);
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-datepicker-formfield-${nextUniqueId++}`;

  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly isFilled = computed(() => !!this.selectedDate());

  protected readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  });

  protected readonly wrapperClass = computed(() => {
    const classes = ['datepicker-formfield'];

    if (this.focused()) classes.push('datepicker-formfield--focused');
    if (this.isFilled()) classes.push('datepicker-formfield--filled');
    if (this.showError()) classes.push('datepicker-formfield--invalid');
    if (this.isDisabled()) classes.push('datepicker-formfield--disabled');
    if (this.isOpen()) classes.push('datepicker-formfield--open');

    return classes.join(' ');
  });

  protected readonly displayValue = computed(() => {
    const date = this.selectedDate();

    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(this.locale(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  });

  protected readonly yearRangeStart = computed(
    () => Math.floor(this.viewDate().getFullYear() / 12) * 12,
  );

  protected readonly navLabel = computed(() => {
    const view = this.viewDate();

    switch (this.viewMode()) {
      case 'days': {
        const raw = new Intl.DateTimeFormat(this.locale(), {
          month: 'long',
          year: 'numeric',
        }).format(view);

        return raw.charAt(0).toUpperCase() + raw.slice(1);
      }
      case 'months':
        return String(view.getFullYear());
      case 'years': {
        const start = this.yearRangeStart();
        return `${start} - ${start + 11}`;
      }
    }
  });

  protected readonly weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(this.locale(), { weekday: 'narrow' }).format(
        new Date(2024, 0, 7 + index),
      ),
    ),
  );

  protected readonly calendarDays = computed<CalendarDay[]>(() => {
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

    for (let index = firstDayOfWeek - 1; index >= 0; index--) {
      days.push(toDay(new Date(year, month, -index)));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(toDay(new Date(year, month, day)));
    }

    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

    for (let day = 1; days.length < totalCells; day++) {
      days.push(toDay(new Date(year, month + 1, day)));
    }

    return days;
  });

  protected readonly monthItems = computed<MonthItem[]>(() => {
    const viewYear = this.viewDate().getFullYear();
    const now = new Date();
    const selected = this.selectedDate();

    return Array.from({ length: 12 }, (_, index) => ({
      index,
      label: new Intl.DateTimeFormat(this.locale(), { month: 'short' }).format(
        new Date(2024, index, 1),
      ),
      isCurrent: index === now.getMonth() && viewYear === now.getFullYear(),
      isSelected:
        !!selected && index === selected.getMonth() && viewYear === selected.getFullYear(),
    }));
  });

  protected readonly yearItems = computed<YearItem[]>(() => {
    const start = this.yearRangeStart();
    const currentYear = new Date().getFullYear();
    const selectedYear = this.selectedDate()?.getFullYear();

    return Array.from({ length: 12 }, (_, index) => ({
      value: start + index,
      isCurrent: start + index === currentYear,
      isSelected: start + index === selectedYear,
    }));
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });

    this.ngControl?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlStateVersion.update((version) => version + 1));
  }

  ngOnDestroy(): void {
    this.disposeOverlay(false);
  }

  ngDoCheck(): void {
    const control = this.ngControl?.control;

    if (!control) {
      return;
    }

    const signature = JSON.stringify({
      touched: control.touched,
      dirty: control.dirty,
      invalid: control.invalid,
      errors: control.errors,
    });

    if (signature !== this.lastControlStateSignature) {
      this.lastControlStateSignature = signature;
      this.controlStateVersion.update((version) => version + 1);
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.closePanel();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen() && this.overlayRef) {
      this.overlayRef.updatePositionStrategy(this.buildPositionStrategy());
      this.overlayRef.updatePosition();
    }
  }

  writeValue(value: unknown): void {
    if (typeof value === 'string' && value) {
      const date = new Date(`${value}T00:00:00`);
      this.selectedDate.set(date);
      this.viewDate.set(new Date(date.getFullYear(), date.getMonth(), 1));
      return;
    }

    this.selectedDate.set(null);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);

    if (isDisabled) {
      this.focused.set(false);
      this.closePanel(false);
    }
  }

  protected showError(): boolean {
    this.controlStateVersion();

    const control = this.ngControl?.control;

    if (!control) {
      return false;
    }

    return control.invalid && (control.touched || control.dirty);
  }

  protected resolvedErrorMessage(): string {
    this.controlStateVersion();

    const errors = this.ngControl?.control?.errors;

    if (!errors) {
      return '';
    }

    const firstKey = Object.keys(errors)[0];

    return this.errorMessages()[firstKey] ?? FALLBACK_ERROR_MESSAGES[firstKey] ?? 'Campo invalido.';
  }

  protected toggle(): void {
    if (this.isDisabled()) {
      return;
    }

    this.focused.set(true);

    if (this.isOpen()) {
      this.closePanel();
      return;
    }

    this.openPanel();
  }

  protected toggleView(): void {
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

  protected prevPage(): void {
    const view = this.viewDate();

    switch (this.viewMode()) {
      case 'days':
        this.viewDate.set(new Date(view.getFullYear(), view.getMonth() - 1, 1));
        break;
      case 'months':
        this.viewDate.set(new Date(view.getFullYear() - 1, view.getMonth(), 1));
        break;
      case 'years':
        this.viewDate.set(new Date(view.getFullYear() - 12, view.getMonth(), 1));
        break;
    }
  }

  protected nextPage(): void {
    const view = this.viewDate();

    switch (this.viewMode()) {
      case 'days':
        this.viewDate.set(new Date(view.getFullYear(), view.getMonth() + 1, 1));
        break;
      case 'months':
        this.viewDate.set(new Date(view.getFullYear() + 1, view.getMonth(), 1));
        break;
      case 'years':
        this.viewDate.set(new Date(view.getFullYear() + 12, view.getMonth(), 1));
        break;
    }
  }

  protected selectDay(day: CalendarDay): void {
    if (!day.isCurrentMonth) {
      this.viewDate.set(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }

    this.selectedDate.set(day.date);
    this.onChange(this.toISODate(day.date));
    this.controlStateVersion.update((version) => version + 1);
    this.closePanel();
  }

  protected selectMonth(monthIndex: number): void {
    const view = this.viewDate();
    this.viewDate.set(new Date(view.getFullYear(), monthIndex, 1));
    this.viewMode.set('days');
  }

  protected selectYear(year: number): void {
    const view = this.viewDate();
    this.viewDate.set(new Date(year, view.getMonth(), 1));
    this.viewMode.set('months');
  }

  private openPanel(): void {
    this.disposeOverlay(false);
    const selected = this.selectedDate();

    if (!selected) {
      const today = new Date();
      this.viewDate.set(new Date(today.getFullYear(), today.getMonth(), 1));
    }

    this.overlayRef = this.overlay.create({
      positionStrategy: this.buildPositionStrategy(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.resolvePanelWidth(),
    });

    const portal = new TemplatePortal(this.panelTemplate(), this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.isOpen.set(true);

    this.overlayRef.backdropClick().subscribe(() => this.closePanel());
    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.isOpen.set(false);
    });
  }

  private buildPositionStrategy() {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.resolveOverlayPositions())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withViewportMargin(16);
  }

  private resolveOverlayPositions(): ConnectedPosition[] {
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportPadding = 16;
    const estimatedPanelHeight = 344;
    const spaceBelow = window.innerHeight - hostRect.bottom - viewportPadding;
    const spaceAbove = hostRect.top - viewportPadding;
    const preferTop = spaceBelow < estimatedPanelHeight && spaceAbove > spaceBelow;

    const bottomPosition: ConnectedPosition = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 6,
    };
    const topPosition: ConnectedPosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -6,
    };

    return preferTop ? [topPosition, bottomPosition] : [bottomPosition, topPosition];
  }

  private resolvePanelWidth(): number {
    const hostWidth = this.elementRef.nativeElement.offsetWidth;

    return Math.max(DATEPICKER_PANEL_MIN_WIDTH, Math.min(hostWidth, DATEPICKER_PANEL_MAX_WIDTH));
  }

  private closePanel(markAsTouched = true): void {
    this.disposeOverlay(markAsTouched);
    this.isOpen.set(false);
    this.focused.set(false);
    this.viewMode.set('days');

    if (markAsTouched) {
      this.controlStateVersion.update((version) => version + 1);
      this.onTouched();
    }
  }

  private disposeOverlay(restoreFocus: boolean): void {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.dispose();
    this.overlayRef = null;

    if (restoreFocus) {
      this.triggerRef().nativeElement.focus();
    }
  }

  private startOfDay(date: Date): Date {
    const nextDate = new Date(date);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
