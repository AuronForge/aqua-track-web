import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { LanguageService } from '../../../services/language.service';
import { FormfieldErrorMessages } from '../formfield-error-messages.model';

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Campo obrigatorio.',
  minlength: 'O valor informado e muito curto.',
  maxlength: 'O valor informado e muito longo.',
  pattern: 'Formato invalido.',
};

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-search-formfield',
  standalone: true,
  templateUrl: './search-formfield.component.html',
  styleUrl: './search-formfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFormfieldComponent),
      multi: true,
    },
  ],
})
export class SearchFormfieldComponent implements ControlValueAccessor, OnInit {
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly autocomplete = input<string>('off');
  readonly showClearButton = input(true);
  readonly loading = input(false);
  readonly loadingLabel = input<string>('');
  readonly clearAriaLabel = input<string>('');
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly readonlyState = input(false, { alias: 'readonly' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });
  readonly hideErrorMessage = input(false);
  readonly errorMessages = input<FormfieldErrorMessages>({});

  readonly cleared = output<void>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly ngControl = signal<NgControl | null>(null);
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-search-formfield-${nextUniqueId++}`;

  protected readonly t = this.languageService.translation;
  protected readonly value = signal('');
  protected readonly focused = signal(false);
  protected readonly cvaDisabled = signal(false);
  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly loadingStatusId = computed(() => `${this.inputId()}-loading-status`);
  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly isFilled = computed(() => this.value().length > 0);
  protected readonly canClear = computed(
    () => this.showClearButton() && this.isFilled() && !this.isDisabled() && !this.readonlyState(),
  );
  protected readonly hasSuffix = computed(() => this.loading() || this.canClear());
  protected readonly resolvedClearAriaLabel = computed(
    () => this.clearAriaLabel().trim() || this.t().searchFormfieldClearLabel,
  );
  protected readonly resolvedLoadingLabel = computed(
    () => this.loadingLabel().trim() || this.t().searchFormfieldLoadingLabel,
  );
  protected readonly resolvedAriaLabel = computed(
    () => this.ariaLabel().trim() || this.t().searchFormfieldAriaLabel,
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    const control = this.injector.get(NgControl, null, { self: true, optional: true });
    this.ngControl.set(control);

    control?.control?.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.controlStateVersion.update((version) => version + 1));
  }

  writeValue(value: unknown): void {
    this.value.set(value == null ? '' : String(value));
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
    }
  }

  protected showError(): boolean {
    this.controlStateVersion();

    const control = this.ngControl()?.control;

    if (!control) {
      return false;
    }

    return control.invalid && (control.touched || control.dirty);
  }

  protected describedBy(): string | null {
    if (this.showError() && !this.hideErrorMessage()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  }

  protected wrapperClass(): string {
    const classes = ['search-formfield'];

    if (this.focused()) classes.push('search-formfield--focused');
    if (this.isFilled()) classes.push('search-formfield--filled');
    if (this.showError()) classes.push('search-formfield--invalid');
    if (this.isDisabled()) classes.push('search-formfield--disabled');
    if (this.readonlyState()) classes.push('search-formfield--readonly');
    if (this.loading()) classes.push('search-formfield--loading');
    if (this.hasSuffix()) classes.push('search-formfield--with-suffix');

    return classes.join(' ');
  }

  protected resolvedErrorMessage(): string {
    this.controlStateVersion();

    const errors = this.ngControl()?.control?.errors;

    if (!errors) {
      return '';
    }

    const firstKey = Object.keys(errors)[0];

    return this.errorMessages()[firstKey] ?? FALLBACK_ERROR_MESSAGES[firstKey] ?? 'Campo invalido.';
  }

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.canClear()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.clearValue();
  }

  protected onClearClick(): void {
    if (!this.canClear()) {
      return;
    }

    this.clearValue();
  }

  focus(): void {
    if (this.isDisabled()) {
      return;
    }

    this.inputElement().nativeElement.focus();
  }

  private clearValue(): void {
    this.value.set('');
    this.onChange('');
    this.onTouched();
    this.controlStateVersion.update((version) => version + 1);
    this.cleared.emit();

    queueMicrotask(() => this.focus());
  }
}
