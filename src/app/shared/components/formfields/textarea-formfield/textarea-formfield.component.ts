import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnInit,
  computed,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

import { FormfieldErrorMessages } from '../formfield-error-messages.model';

const FALLBACK_ERROR_MESSAGES: FormfieldErrorMessages = {
  required: 'Campo obrigatÃ³rio.',
  minlength: 'O valor informado Ã© muito curto.',
  maxlength: 'O valor informado Ã© muito longo.',
  pattern: 'Formato invÃ¡lido.',
};

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-textarea-formfield',
  standalone: true,
  templateUrl: './textarea-formfield.component.html',
  styleUrl: './textarea-formfield.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaFormfieldComponent),
      multi: true,
    },
  ],
})
export class TextareaFormfieldComponent implements ControlValueAccessor, OnInit {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly id = input<string>();
  readonly name = input<string>();
  readonly autocomplete = input<string>();
  readonly rows = input(4);
  readonly resize = input<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly readonlyState = input(false, { alias: 'readonly' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly requiredState = input(false, { alias: 'required' });
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });
  readonly errorMessages = input<FormfieldErrorMessages>({});

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private ngControl: NgControl | null = null;

  protected readonly value = signal('');
  protected readonly focused = signal(false);
  protected readonly cvaDisabled = signal(false);
  private readonly controlStateVersion = signal(0);
  private readonly generatedId = `aq-textarea-formfield-${nextUniqueId++}`;

  protected readonly inputId = computed(() => this.id() || this.generatedId);
  protected readonly hintId = computed(() => `${this.inputId()}-hint`);
  protected readonly errorId = computed(() => `${this.inputId()}-error`);
  protected readonly isDisabled = computed(() => this.disabledState() || this.cvaDisabled());
  protected readonly isFilled = computed(() => this.value().trim().length > 0);

  protected readonly describedBy = computed(() => {
    if (this.showError()) {
      return this.errorId();
    }

    return this.hint() ? this.hintId() : null;
  });

  protected readonly wrapperClass = computed(() => {
    const classes = ['textarea-formfield'];

    if (this.focused()) classes.push('textarea-formfield--focused');
    if (this.isFilled()) classes.push('textarea-formfield--filled');
    if (this.showError()) classes.push('textarea-formfield--invalid');
    if (this.isDisabled()) classes.push('textarea-formfield--disabled');
    if (this.readonlyState()) classes.push('textarea-formfield--readonly');

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

    return (
      this.errorMessages()[firstKey] ?? FALLBACK_ERROR_MESSAGES[firstKey] ?? 'Campo invÃ¡lido.'
    );
  }

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLTextAreaElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.controlStateVersion.update((version) => version + 1);
    this.onTouched();
  }
}
