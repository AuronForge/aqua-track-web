import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  DestroyRef,
  DoCheck,
  ElementRef,
  Injector,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { FormfieldErrorMessages } from '../formfields/formfield-error-messages.model';
import { CardSelectionChange } from './card-selection-change.model';
import { CardSelectionCompareWith } from './card-selection-compare-with.type';
import { CardSelectionContentContext } from './card-selection-content-context.model';
import { CardSelectionContentDirective } from './card-selection-content.directive';
import { CardSelectionIconPosition } from './card-selection-icon-position.type';
import { CardSelectionOption } from './card-selection-option.model';
import { CardSelectionValue } from './card-selection-value.type';

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Selecione uma opção.',
};
const defaultCompareWith = <T>(optionValue: T, selectedValue: T): boolean =>
  Object.is(optionValue, selectedValue);

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-card-selection',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './card-selection.component.html',
  styleUrl: './card-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardSelectionComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClass()',
  },
})
export class CardSelectionComponent<T> implements ControlValueAccessor, OnInit, DoCheck {
  readonly options = input<readonly CardSelectionOption<T>[]>([]);
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly hint = input<string>('');
  readonly errorMessage = input<string>('');
  readonly errorMessages = input<FormfieldErrorMessages>({});
  readonly id = input<string>();
  readonly columns = input<number | null>(null);
  readonly multiple = input(false);
  readonly compareWith = input<CardSelectionCompareWith<T>>(defaultCompareWith);
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });

  readonly selectionChange = output<CardSelectionChange<T>>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly projectedContent = contentChild<CardSelectionContentDirective<T>>(
    CardSelectionContentDirective,
  );
  private readonly optionInputs = viewChildren<ElementRef<HTMLInputElement>>('optionInput');
  private ngControl: NgControl | null = null;
  private lastControlStateSignature = '';

  protected readonly singleValue = signal<T | null>(null);
  protected readonly multipleValue = signal<readonly T[]>([]);
  protected readonly focused = signal(false);
  protected readonly cvaDisabled = signal(false);
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-card-selection-${nextUniqueId++}`;
  private readonly generatedName = `aq-card-selection-group-${nextUniqueId++}`;

  protected readonly groupId = computed(() => this.id() || this.generatedId);
  protected readonly groupName = computed(() => `${this.groupId()}-${this.generatedName}`);
  protected readonly inputType = computed(() => (this.multiple() ? 'checkbox' : 'radio'));
  protected readonly legendId = computed(() => `${this.groupId()}-legend`);
  protected readonly hintId = computed(() => `${this.groupId()}-hint`);
  protected readonly errorId = computed(() => `${this.groupId()}-error`);
  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  });
  protected readonly groupLabel = computed(() => this.label().trim() || this.ariaLabel().trim());
  protected readonly gridColumns = computed(() => {
    const columns = this.columns();
    return columns && columns > 0 ? String(columns) : null;
  });
  protected readonly selectedValues = computed<readonly T[]>(() => {
    if (this.multiple()) {
      return this.multipleValue();
    }

    const value = this.singleValue();
    return value === null ? [] : [value];
  });
  protected readonly hostClass = computed(() => {
    const classes = ['card-selection'];

    if (this.focused()) classes.push('card-selection--focused');
    if (this.showError()) classes.push('card-selection--invalid');
    if (this.isDisabled()) classes.push('card-selection--disabled');

    return classes.join(' ');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: CardSelectionValue<T>) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl, null, { self: true, optional: true });

    this.ngControl?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlStateVersion.update((version) => version + 1));
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

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.multipleValue.set(Array.isArray(value) ? [...(value as readonly T[])] : []);
      this.singleValue.set(null);
      return;
    }

    this.singleValue.set((value as T | null | undefined) ?? null);
    this.multipleValue.set([]);
  }

  registerOnChange(fn: (value: CardSelectionValue<T>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);

    if (isDisabled) {
      this.focused.set(false);
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
      return this.errorMessage();
    }

    const firstKey = Object.keys(errors)[0];

    return (
      ((this.errorMessages()[firstKey] ?? this.errorMessage()) ||
        FALLBACK_ERROR_MESSAGES[firstKey]) ??
      'Selecione uma opção válida.'
    );
  }

  protected isOptionSelected(option: CardSelectionOption<T>): boolean {
    return this.selectedValues().some((selectedValue) =>
      this.compareValues(option.value, selectedValue),
    );
  }

  protected isOptionDisabled(option: CardSelectionOption<T>): boolean {
    return this.isDisabled() || !!option.disabled;
  }

  protected onOptionChange(option: CardSelectionOption<T>): void {
    this.selectOption(option, true);
  }

  protected onOptionKeydown(event: KeyboardEvent, optionIndex: number): void {
    if (this.isDisabled() || this.options().length === 0) {
      return;
    }

    const enabledIndexes = this.getEnabledIndexes();

    if (enabledIndexes.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (this.multiple()) {
          this.moveFocus(optionIndex, 1, enabledIndexes);
        } else {
          this.moveSelection(optionIndex, 1, enabledIndexes);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (this.multiple()) {
          this.moveFocus(optionIndex, -1, enabledIndexes);
        } else {
          this.moveSelection(optionIndex, -1, enabledIndexes);
        }
        break;
      case 'Home':
        event.preventDefault();
        if (this.multiple()) {
          this.focusOption(enabledIndexes[0]);
        } else {
          this.focusAndSelect(enabledIndexes[0], true);
        }
        break;
      case 'End':
        event.preventDefault();
        if (this.multiple()) {
          this.focusOption(enabledIndexes[enabledIndexes.length - 1]);
        } else {
          this.focusAndSelect(enabledIndexes[enabledIndexes.length - 1], true);
        }
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.selectOption(this.options()[optionIndex] ?? null, true);
        break;
    }
  }

  protected onFocusIn(): void {
    this.focused.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const currentTarget = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;

    if (currentTarget?.contains(relatedTarget)) {
      return;
    }

    this.focused.set(false);
    this.controlStateVersion.update((version) => version + 1);
    this.onTouched();
  }

  protected optionCardClass(option: CardSelectionOption<T>): string {
    const classes = ['card-selection__option-card'];

    if (this.isOptionSelected(option)) classes.push('card-selection__option-card--selected');
    if (this.isOptionDisabled(option)) classes.push('card-selection__option-card--disabled');

    return classes.join(' ');
  }

  protected trackOption(option: CardSelectionOption<T>): string {
    const value = option.value;

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return [
      option.testId ?? '',
      option.ariaLabel ?? '',
      option.title,
      option.description ?? '',
      option.disabled ? 'disabled' : 'enabled',
    ].join('|');
  }

  protected buildProjectedContentContext(
    option: CardSelectionOption<T>,
    index: number,
  ): CardSelectionContentContext<T> {
    return {
      $implicit: option,
      option,
      index,
      selected: this.isOptionSelected(option),
      disabled: this.isOptionDisabled(option),
    };
  }

  protected hasOptionIcon(option: CardSelectionOption<T>): boolean {
    return !!option.iconName?.trim();
  }

  protected optionIconPosition(option: CardSelectionOption<T>): CardSelectionIconPosition {
    return option.iconPosition ?? 'start';
  }

  private moveFocus(optionIndex: number, direction: 1 | -1, enabledIndexes: number[]): void {
    const currentPosition = enabledIndexes.indexOf(optionIndex);
    const fallbackPosition = direction === 1 ? 0 : enabledIndexes.length - 1;
    const nextPosition =
      currentPosition === -1
        ? fallbackPosition
        : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;

    this.focusOption(enabledIndexes[nextPosition]);
  }

  private moveSelection(optionIndex: number, direction: 1 | -1, enabledIndexes: number[]): void {
    const currentPosition = enabledIndexes.indexOf(optionIndex);
    const fallbackPosition = direction === 1 ? 0 : enabledIndexes.length - 1;
    const nextPosition =
      currentPosition === -1
        ? fallbackPosition
        : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;

    this.focusAndSelect(enabledIndexes[nextPosition], true);
  }

  private focusAndSelect(optionIndex: number, markTouched: boolean): void {
    const option = this.options()[optionIndex] ?? null;

    if (!option) {
      return;
    }

    this.focusOption(optionIndex);
    this.selectOption(option, markTouched);
  }

  private focusOption(optionIndex: number): void {
    const input = this.optionInputs()[optionIndex];
    input?.nativeElement.focus();
  }

  private getEnabledIndexes(): number[] {
    return this.options()
      .map((option, index) => (this.isOptionDisabled(option) ? -1 : index))
      .filter((index) => index >= 0);
  }

  private selectOption(option: CardSelectionOption<T> | null, markTouched: boolean): void {
    if (!option || this.isOptionDisabled(option)) {
      if (markTouched) {
        this.onTouched();
      }
      return;
    }

    const nextValue = this.multiple()
      ? this.toggleOptionValue(option)
      : this.isOptionSelected(option)
        ? this.selectedValues()
        : [option.value];

    if (this.isSameSelection(nextValue)) {
      if (markTouched) {
        this.onTouched();
      }
      return;
    }

    const emittedValue = this.buildEmittedValue(nextValue);
    const selectedOptions = this.resolveSelectedOptions(nextValue);

    this.setInternalValue(emittedValue);
    this.onChange(emittedValue);
    this.controlStateVersion.update((version) => version + 1);

    if (markTouched) {
      this.onTouched();
    }

    this.selectionChange.emit({
      value: emittedValue,
      option,
      selected: nextValue.some((selectedValue) => this.compareValues(option.value, selectedValue)),
      selectedOptions,
    });
  }

  private toggleOptionValue(option: CardSelectionOption<T>): readonly T[] {
    const selectedValues = this.selectedValues();
    const isCurrentlySelected = selectedValues.some((selectedValue) =>
      this.compareValues(option.value, selectedValue),
    );

    if (isCurrentlySelected) {
      return selectedValues.filter(
        (selectedValue) => !this.compareValues(option.value, selectedValue),
      );
    }

    return [...selectedValues, option.value];
  }

  private buildEmittedValue(selectedValues: readonly T[]): Exclude<CardSelectionValue<T>, null> {
    if (this.multiple()) {
      return [...selectedValues] as Exclude<CardSelectionValue<T>, null>;
    }

    return selectedValues[0] as Exclude<CardSelectionValue<T>, null>;
  }

  private setInternalValue(value: Exclude<CardSelectionValue<T>, null>): void {
    if (this.multiple()) {
      this.multipleValue.set(value as readonly T[]);
      this.singleValue.set(null);
      return;
    }

    this.singleValue.set(value as T);
    this.multipleValue.set([]);
  }

  private resolveSelectedOptions(selectedValues: readonly T[]): readonly CardSelectionOption<T>[] {
    return this.options().filter((option) =>
      selectedValues.some((selectedValue) => this.compareValues(option.value, selectedValue)),
    );
  }

  private isSameSelection(nextSelectedValues: readonly T[]): boolean {
    const currentSelectedValues = this.selectedValues();

    if (currentSelectedValues.length !== nextSelectedValues.length) {
      return false;
    }

    return currentSelectedValues.every((selectedValue, index) =>
      this.compareValues(selectedValue, nextSelectedValues[index] ?? selectedValue),
    );
  }

  private compareValues(optionValue: T, selectedValue: T): boolean {
    return this.compareWith()(optionValue, selectedValue);
  }
}
