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

import { FormfieldAction } from '../formfield-action.model';
import { FormfieldErrorMessages } from '../formfield-error-messages.model';
import { FormfieldInputType } from '../formfield-input-type.type';

const DEFAULT_ICON_FAMILY = 'material-icons-outlined';

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Campo obrigatório.',
  email: 'Informe um e-mail válido.',
  minlength: 'O valor informado é muito curto.',
  maxlength: 'O valor informado é muito longo.',
  pattern: 'Formato inválido.',
};

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-text-formfield',
  standalone: true,
  templateUrl: './text-formfield.component.html',
  styleUrl: './text-formfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFormfieldComponent),
      multi: true,
    },
  ],
})
export class TextFormfieldComponent implements ControlValueAccessor, OnInit {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly type = input<FormfieldInputType>('text');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly autocomplete = input<string>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly readonlyState = input(false, { alias: 'readonly' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });

  readonly prefixText = input<string>();
  readonly suffixText = input<string>();
  readonly prefixIcon = input<string>();
  readonly suffixIcon = input<string>();
  readonly prefixIconFamily = input<string>(DEFAULT_ICON_FAMILY);
  readonly suffixIconFamily = input<string>(DEFAULT_ICON_FAMILY);

  readonly passwordToggle = input(false);
  readonly hideErrorMessage = input(false);
  readonly errorMessages = input<FormfieldErrorMessages>({});
  readonly actions = input<FormfieldAction[]>([]);

  readonly actionClick = output<FormfieldAction>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private ngControl: NgControl | null = null;
  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  protected readonly value = signal('');
  protected readonly focused = signal(false);
  protected readonly passwordVisible = signal(false);
  protected readonly cvaDisabled = signal(false);
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-text-formfield-${nextUniqueId++}`;

  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);

  protected readonly prefixActions = computed(() =>
    this.actions().filter((action) => (action.position ?? 'suffix') === 'prefix' && !action.hidden),
  );

  protected readonly suffixActions = computed(() =>
    this.actions().filter((action) => (action.position ?? 'suffix') === 'suffix' && !action.hidden),
  );

  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly isFilled = computed(() => this.value().length > 0);
  protected readonly showPasswordToggle = computed(
    () => this.type() === 'password' && this.passwordToggle(),
  );

  protected readonly resolvedInputType = computed<FormfieldInputType | 'text'>(() => {
    if (!this.showPasswordToggle()) {
      return this.type();
    }

    return this.passwordVisible() ? 'text' : 'password';
  });

  protected readonly hasPrefix = computed(
    () => !!this.prefixText() || !!this.prefixIcon() || this.prefixActions().length > 0,
  );

  protected readonly hasSuffix = computed(
    () =>
      !!this.suffixText() ||
      !!this.suffixIcon() ||
      this.suffixActions().length > 0 ||
      this.showPasswordToggle(),
  );

  protected readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  });

  protected readonly wrapperClass = computed(() => {
    const classes = ['text-formfield'];

    if (this.focused()) classes.push('text-formfield--focused');
    if (this.isFilled()) classes.push('text-formfield--filled');
    if (this.showError()) classes.push('text-formfield--invalid');
    if (this.isDisabled()) classes.push('text-formfield--disabled');
    if (this.readonlyState()) classes.push('text-formfield--readonly');
    if (this.hasPrefix()) classes.push('text-formfield--with-prefix');
    if (this.hasSuffix()) classes.push('text-formfield--with-suffix');
    if (this.type() === 'password') classes.push('text-formfield--password');

    return classes.join(' ');
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

    return this.errorMessages()[firstKey] ?? FALLBACK_ERROR_MESSAGES[firstKey] ?? 'Campo inválido.';
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

  protected onActionClick(action: FormfieldAction): void {
    if (this.isDisabled() || action.disabled) {
      return;
    }

    this.actionClick.emit(action);
  }

  protected togglePasswordVisibility(): void {
    if (this.isDisabled()) {
      return;
    }

    this.passwordVisible.update((visible) => !visible);
  }

  protected passwordToggleAriaLabel(): string {
    return this.passwordVisible() ? 'Ocultar senha' : 'Mostrar senha';
  }

  protected passwordToggleIcon(): string {
    return this.passwordVisible() ? 'visibility_off' : 'visibility';
  }

  protected iconClass(iconFamily: string | undefined): string {
    return `text-formfield__icon ${iconFamily ?? DEFAULT_ICON_FAMILY}`;
  }

  protected actionIconClass(iconFamily: string | undefined): string {
    return `text-formfield__action-icon ${iconFamily ?? DEFAULT_ICON_FAMILY}`;
  }

  focus(): void {
    if (this.isDisabled()) {
      return;
    }

    this.inputElement().nativeElement.focus();
  }
}
