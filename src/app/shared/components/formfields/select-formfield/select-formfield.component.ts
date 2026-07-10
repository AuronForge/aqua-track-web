import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DoCheck,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { FormfieldErrorMessages } from '../formfield-error-messages.model';
import { SelectFormfieldChangeEvent } from './select-formfield-change-event.model';
import { SelectFormfieldOption } from './select-formfield-option.model';

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Campo obrigatorio.',
};

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-select-formfield',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './select-formfield.component.html',
  styleUrl: './select-formfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFormfieldComponent),
      multi: true,
    },
  ],
  host: {
    '[class]': 'hostClass()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SelectFormfieldComponent implements ControlValueAccessor, OnInit, OnDestroy, DoCheck {
  readonly label = input.required<string>();
  readonly options = input<SelectFormfieldOption[]>([]);
  readonly multiple = input(false);
  readonly placeholder = input<string>('Selecione uma opcao');
  readonly hint = input<string>('');
  readonly loading = input(false);
  readonly id = input<string>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });
  readonly errorMessages = input<FormfieldErrorMessages>({});

  readonly selectionChange = output<SelectFormfieldChangeEvent>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly dropdownTemplate = viewChild.required<TemplateRef<unknown>>('dropdownTemplate');

  private ngControl: NgControl | null = null;
  private overlayRef: OverlayRef | null = null;
  private lastControlStateSignature = '';

  protected readonly value = signal<string | string[] | null>(null);
  protected readonly focused = signal(false);
  protected readonly cvaDisabled = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly focusedIndex = signal(-1);
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-select-formfield-${nextUniqueId++}`;
  protected readonly listboxId = `select-formfield-listbox-${nextUniqueId++}`;

  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly selectedOptions = computed(() => {
    const value = this.value();

    if (this.multiple()) {
      const selectedIds = Array.isArray(value) ? value : [];
      return this.options().filter((option) => selectedIds.includes(option.id));
    }

    return this.options().filter((option) => option.id === value);
  });
  protected readonly isFilled = computed(() => this.selectedOptions().length > 0);
  protected readonly selectedOption = computed(() =>
    !this.multiple() ? (this.selectedOptions()[0] ?? null) : null,
  );
  protected readonly triggerLabel = computed(() => {
    const selectedOptions = this.selectedOptions();

    if (selectedOptions.length === 0) {
      return this.placeholder();
    }

    if (selectedOptions.length === 1) {
      return selectedOptions[0].title;
    }

    return `${selectedOptions.length} selecionados`;
  });
  protected readonly triggerIcon = computed(() => {
    const selectedOptions = this.selectedOptions();

    return selectedOptions.length === 1 ? (selectedOptions[0].icon ?? null) : null;
  });

  protected readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  });

  protected readonly hostClass = computed(() => {
    const classes = ['select-formfield'];

    if (this.focused()) classes.push('select-formfield--focused');
    if (this.isFilled()) classes.push('select-formfield--filled');
    if (this.showError()) classes.push('select-formfield--invalid');
    if (this.isDisabled()) classes.push('select-formfield--disabled');
    if (this.isOpen()) classes.push('select-formfield--open');

    return classes.join(' ');
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string | string[] | null) => void = () => {};
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

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.value.set(Array.isArray(value) ? value.map(String) : []);
      return;
    }

    this.value.set(value == null || value === '' ? null : String(value));
  }

  registerOnChange(fn: (value: string | string[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);

    if (isDisabled) {
      this.focused.set(false);
      this.closeDropdown(false);
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

  protected toggleDropdown(): void {
    if (this.isDisabled() || this.loading()) {
      return;
    }

    if (this.isOpen()) {
      this.closeDropdown();
      return;
    }

    this.openDropdown();
  }

  protected selectOption(option: SelectFormfieldOption): void {
    if (option.disabled) {
      return;
    }

    const previousSelectedOptions = this.selectedOptions();
    const nextSelectedOptions = this.multiple()
      ? this.toggleSelectedOption(option, previousSelectedOptions)
      : [option];
    const event: SelectFormfieldChangeEvent = {
      option,
      previousOption: this.selectedOption(),
      selectedOptions: nextSelectedOptions,
      previousSelectedOptions,
    };

    this.onSelectionChange(event);

    if (!this.multiple()) {
      this.closeDropdown();
    }
  }

  protected isSelected(option: SelectFormfieldOption): boolean {
    return this.selectedOptions().some((selectedOption) => selectedOption.id === option.id);
  }

  protected onSelectionChange(event: SelectFormfieldChangeEvent): void {
    const nextValue = this.multiple()
      ? event.selectedOptions.map((option) => option.id)
      : event.option.id;

    this.value.set(nextValue);
    this.onChange(nextValue);
    this.controlStateVersion.update((version) => version + 1);
    this.onTouched();
    this.selectionChange.emit(event);
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

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.openDropdown();
      }
      return;
    }

    const options = this.options();

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.shiftFocus(1, options);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.shiftFocus(-1, options);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const idx = this.focusedIndex();
        if (idx >= 0 && idx < options.length) {
          this.selectOption(options[idx]);
        }
        break;
      }
    }
  }

  private openDropdown(): void {
    this.disposeOverlay(false);

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ])
      .withPush(true)
      .withViewportMargin(16);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.elementRef.nativeElement.offsetWidth,
      minWidth: 200,
    });

    const portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.isOpen.set(true);

    const selectedId = this.selectedOptions()[0]?.id;
    const initialIndex = selectedId
      ? this.options().findIndex((option) => option.id === selectedId)
      : -1;
    this.focusedIndex.set(initialIndex);

    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());
    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.isOpen.set(false);
    });
  }

  private closeDropdown(restoreFocus = true): void {
    this.disposeOverlay(restoreFocus);
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
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

  private shiftFocus(direction: 1 | -1, options: SelectFormfieldOption[]): void {
    const enabledIndexes = options
      .map((option, index) => (option.disabled ? -1 : index))
      .filter((index) => index !== -1);

    if (enabledIndexes.length === 0) {
      return;
    }

    const current = this.focusedIndex();
    const currentPosition = enabledIndexes.indexOf(current);
    const nextPosition =
      currentPosition === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPosition + direction + enabledIndexes.length) % enabledIndexes.length;

    this.focusedIndex.set(enabledIndexes[nextPosition]);
  }

  private toggleSelectedOption(
    option: SelectFormfieldOption,
    previousSelectedOptions: SelectFormfieldOption[],
  ): SelectFormfieldOption[] {
    const alreadySelected = previousSelectedOptions.some(
      (selectedOption) => selectedOption.id === option.id,
    );

    if (alreadySelected) {
      return previousSelectedOptions.filter((selectedOption) => selectedOption.id !== option.id);
    }

    return [...previousSelectedOptions, option];
  }
}
