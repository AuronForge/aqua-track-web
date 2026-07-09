import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FormfieldAction } from '../formfield-action.model';
import { TextFormfieldComponent } from './text-formfield.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextFormfieldComponent],
  template: `
    <form [formGroup]="form">
      <aq-text-formfield
        formControlName="name"
        label="Nome completo"
        placeholder="John Doe"
        hint="Use o nome visivel no perfil"
        prefixIcon="person"
        suffixIcon="badge"
        [actions]="nameActions"
        [errorMessages]="{
          required: 'Campo obrigatorio.',
          minlength: 'Informe pelo menos 3 caracteres.',
        }"
        (actionClick)="onAction($event)"
      />

      <aq-text-formfield
        formControlName="password"
        label="Senha"
        type="password"
        [passwordToggle]="true"
      />
    </form>

    <aq-text-formfield
      [formControl]="emailControl"
      label="Contato"
      hint="Use um e-mail valido"
      prefixText="+55"
      suffixText="ppm"
    />

    <aq-text-formfield [formControl]="emailFallbackControl" label="E-mail" type="email" />

    <aq-text-formfield [formControl]="genericErrorControl" label="Campo generico" />

    <aq-text-formfield [formControl]="readonlyControl" label="Somente leitura" [readonly]="true" />

    <aq-text-formfield [formControl]="disabledControl" label="Desabilitado" />

    <aq-text-formfield label="Livre" type="password" [passwordToggle]="true" />
  `,
})
class TestHostComponent {
  readonly nameActions: FormfieldAction[] = [
    {
      id: 'clear-name',
      icon: 'close',
      ariaLabel: 'Limpar nome',
    },
  ];

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly emailControl = new FormControl('', { nonNullable: true });
  readonly emailFallbackControl = new FormControl('invalido', {
    nonNullable: true,
    validators: [Validators.email],
  });
  readonly genericErrorControl = new FormControl('', { nonNullable: true });
  readonly readonlyControl = new FormControl('Aquario principal', { nonNullable: true });
  readonly disabledControl = new FormControl(
    { value: 'Campo bloqueado', disabled: true },
    { nonNullable: true },
  );

  lastAction: FormfieldAction | null = null;

  onAction(action: FormfieldAction): void {
    this.lastAction = action;
  }
}

describe('TextFormfieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getComponents(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('aq-text-formfield');
  }

  function getInputAt(index: number): HTMLInputElement {
    return getComponents()[index].querySelector('.text-formfield__input') as HTMLInputElement;
  }

  function getLabelAt(index: number): HTMLLabelElement {
    return getComponents()[index].querySelector('.text-formfield__label') as HTMLLabelElement;
  }

  function getHintAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.text-formfield__hint');
  }

  function getErrorAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.text-formfield__error');
  }

  function getActionButtonAt(index: number): HTMLButtonElement | null {
    return getComponents()[index].querySelector('.text-formfield__action') as HTMLButtonElement;
  }

  function getComponentInstanceAt(index: number): TextFormfieldComponent {
    return fixture.debugElement.queryAll(By.directive(TextFormfieldComponent))[index]
      .componentInstance as TextFormfieldComponent;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.emailFallbackControl.markAsTouched();
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and placeholder', () => {
    expect(getLabelAt(0).textContent).toContain('Nome completo');
    expect(getInputAt(0).placeholder).toBe('John Doe');
  });

  it('should render hint when there is no visible error', () => {
    expect(getHintAt(0)?.textContent).toContain('Use o nome visivel no perfil');
    expect(getErrorAt(0)).toBeNull();
  });

  it('should receive values from formControlName', () => {
    host.form.controls.name.setValue('Jose');
    fixture.detectChanges();

    expect(getInputAt(0).value).toBe('Jose');
  });

  it('should propagate values back to the parent form', () => {
    getInputAt(0).value = 'Marina';
    getInputAt(0).dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.name.value).toBe('Marina');
  });

  it('should mark the control as touched on blur', () => {
    expect(host.form.controls.name.touched).toBe(false);

    getInputAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(host.form.controls.name.touched).toBe(true);
  });

  it('should not show validation error before interaction', () => {
    expect(getErrorAt(0)).toBeNull();
    expect(getInputAt(0).getAttribute('aria-invalid')).toBeNull();
  });

  it('should show custom validation error after interaction', () => {
    getInputAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Campo obrigatorio.');
    expect(getInputAt(0).getAttribute('aria-invalid')).toBe('true');
  });

  it('should show minlength message when that is the first active error', () => {
    host.form.controls.name.setValue('Jo');
    host.form.controls.name.markAsTouched();
    host.form.controls.name.markAsDirty();
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Informe pelo menos 3 caracteres.');
  });

  it('should associate input and label with the same id', () => {
    expect(getInputAt(0).id).toBeTruthy();
    expect(getLabelAt(0).htmlFor).toBe(getInputAt(0).id);
  });

  it('should set aria-describedby to the hint id when hint is visible', () => {
    const hint = getHintAt(0);
    expect(getInputAt(0).getAttribute('aria-describedby')).toBe(hint?.id ?? null);
  });

  it('should render prefix and suffix text helpers', () => {
    expect(getComponents()[2].textContent).toContain('+55');
    expect(getComponents()[2].textContent).toContain('ppm');
  });

  it('should emit actionClick when clicking an action icon', () => {
    getActionButtonAt(0)?.click();
    fixture.detectChanges();

    expect(host.lastAction?.id).toBe('clear-name');
  });

  it('should toggle password visibility and aria-label', () => {
    const passwordInput = getInputAt(1);
    const toggleButton = getActionButtonAt(1);

    expect(passwordInput.type).toBe('password');
    expect(toggleButton?.getAttribute('aria-label')).toBe('Mostrar senha');

    toggleButton?.click();
    fixture.detectChanges();

    expect(passwordInput.type).toBe('text');
    expect(toggleButton?.getAttribute('aria-label')).toBe('Ocultar senha');
  });

  it('should support [formControl] bindings directly', () => {
    host.emailControl.setValue('contato@aquatrack.dev');
    fixture.detectChanges();

    expect(getInputAt(2).value).toBe('contato@aquatrack.dev');
  });

  it('should use fallback message for known validation errors without custom messages', () => {
    const component = getComponentInstanceAt(3) as unknown as {
      resolvedErrorMessage: () => string;
    };

    expect(component.resolvedErrorMessage()).toBe('Informe um e-mail válido.');
  });

  it('should use generic fallback message when the error key is unknown', () => {
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();

    const component = getComponentInstanceAt(4) as unknown as {
      resolvedErrorMessage: () => string;
    };

    expect(component.resolvedErrorMessage()).toBe('Campo inválido.');
  });

  it('should reflect readonly state', () => {
    expect(getInputAt(5).readOnly).toBe(true);
  });

  it('should reflect disabled state from the form control', () => {
    expect(getInputAt(6).disabled).toBe(true);
  });

  it('should not emit actionClick when the action is disabled', () => {
    const component = getComponentInstanceAt(0) as unknown as {
      onActionClick: (action: FormfieldAction) => void;
    };

    component.onActionClick({
      id: 'disabled-action',
      icon: 'block',
      ariaLabel: 'Acao desabilitada',
      disabled: true,
    });

    expect(host.lastAction?.id).not.toBe('disabled-action');
  });

  it('should ignore password toggle when disabled through CVA state', () => {
    const component = getComponentInstanceAt(7) as unknown as {
      setDisabledState: (isDisabled: boolean) => void;
      togglePasswordVisibility: () => void;
      resolvedInputType: () => string;
    };

    component.setDisabledState(true);
    component.togglePasswordVisibility();
    fixture.detectChanges();

    expect(component.resolvedInputType()).toBe('password');
  });

  it('should return no error state when used without NgControl', () => {
    const component = getComponentInstanceAt(7) as unknown as {
      showError: () => boolean;
      resolvedErrorMessage: () => string;
    };

    expect(component.showError()).toBe(false);
    expect(component.resolvedErrorMessage()).toBe('');
  });

  it('should convert null values to empty string in writeValue', () => {
    const component = getComponentInstanceAt(7);

    component.writeValue(null);
    fixture.detectChanges();

    expect(getInputAt(7).value).toBe('');
  });
});
