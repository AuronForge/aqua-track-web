import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextareaFormfieldComponent } from './textarea-formfield.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextareaFormfieldComponent],
  template: `
    <form [formGroup]="form">
      <aq-textarea-formfield
        formControlName="notes"
        label="Observações"
        placeholder="Descreva o aquário"
        hint="Esse texto ajuda a identificar o contexto do cadastro"
        [rows]="5"
        [errorMessages]="{
          required: 'Campo obrigatorio.',
          minlength: 'Informe pelo menos 10 caracteres.',
        }"
      />
    </form>

    <aq-textarea-formfield
      [formControl]="detailsControl"
      label="Detalhes"
      hint="Use esse campo para registrar contexto adicional"
    />

    <aq-textarea-formfield [formControl]="genericErrorControl" label="Campo generico" />

    <aq-textarea-formfield
      [formControl]="readonlyControl"
      label="Somente leitura"
      [readonly]="true"
    />

    <aq-textarea-formfield [formControl]="disabledControl" label="Desabilitado" />

    <aq-textarea-formfield label="Livre" />
  `,
})
class TestHostComponent {
  readonly form = new FormGroup({
    notes: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  readonly detailsControl = new FormControl('', { nonNullable: true });
  readonly genericErrorControl = new FormControl('', { nonNullable: true });
  readonly readonlyControl = new FormControl('Aquário plantado com troncos', {
    nonNullable: true,
  });
  readonly disabledControl = new FormControl(
    { value: 'Campo bloqueado', disabled: true },
    { nonNullable: true },
  );
}

describe('TextareaFormfieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getComponents(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('aq-textarea-formfield');
  }

  function getTextareaAt(index: number): HTMLTextAreaElement {
    return getComponents()[index].querySelector(
      '.textarea-formfield__input',
    ) as HTMLTextAreaElement;
  }

  function getLabelAt(index: number): HTMLLabelElement {
    return getComponents()[index].querySelector('.textarea-formfield__label') as HTMLLabelElement;
  }

  function getHintAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.textarea-formfield__hint');
  }

  function getErrorAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.textarea-formfield__error');
  }

  function getComponentInstanceAt(index: number): TextareaFormfieldComponent {
    return fixture.debugElement.queryAll(By.directive(TextareaFormfieldComponent))[index]
      .componentInstance as TextareaFormfieldComponent;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label, placeholder and rows', () => {
    expect(getLabelAt(0).textContent).toContain('Observações');
    expect(getTextareaAt(0).placeholder).toBe('Descreva o aquário');
    expect(getTextareaAt(0).rows).toBe(5);
  });

  it('should render hint when there is no visible error', () => {
    expect(getHintAt(0)?.textContent).toContain(
      'Esse texto ajuda a identificar o contexto do cadastro',
    );
    expect(getErrorAt(0)).toBeNull();
  });

  it('should receive values from formControlName', () => {
    host.form.controls.notes.setValue('Aquário amazônico com substrato fértil');
    fixture.detectChanges();

    expect(getTextareaAt(0).value).toBe('Aquário amazônico com substrato fértil');
  });

  it('should propagate values back to the parent form', () => {
    getTextareaAt(0).value = 'Aquário marinho em ciclagem';
    getTextareaAt(0).dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.notes.value).toBe('Aquário marinho em ciclagem');
  });

  it('should mark the control as touched on blur', () => {
    expect(host.form.controls.notes.touched).toBe(false);

    getTextareaAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(host.form.controls.notes.touched).toBe(true);
  });

  it('should show custom validation error after interaction', () => {
    getTextareaAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Campo obrigatorio.');
    expect(getTextareaAt(0).getAttribute('aria-invalid')).toBe('true');
  });

  it('should describe the textarea with the error id when validation is visible', () => {
    getTextareaAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const error = getErrorAt(0);
    expect(getTextareaAt(0).getAttribute('aria-describedby')).toBe(error?.id ?? null);
  });

  it('should show minlength message when that is the first active error', () => {
    host.form.controls.notes.setValue('Pouco');
    host.form.controls.notes.markAsTouched();
    host.form.controls.notes.markAsDirty();
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Informe pelo menos 10 caracteres.');
  });

  it('should associate textarea and label with the same id', () => {
    expect(getTextareaAt(0).id).toBeTruthy();
    expect(getLabelAt(0).htmlFor).toBe(getTextareaAt(0).id);
  });

  it('should set aria-describedby to the hint id when hint is visible', () => {
    const hint = getHintAt(0);
    expect(getTextareaAt(0).getAttribute('aria-describedby')).toBe(hint?.id ?? null);
  });

  it('should support [formControl] bindings directly', () => {
    host.detailsControl.setValue('Sem peixes nas primeiras duas semanas.');
    fixture.detectChanges();

    expect(getTextareaAt(1).value).toBe('Sem peixes nas primeiras duas semanas.');
  });

  it('should use generic fallback message when the error key is unknown', () => {
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();

    const component = getComponentInstanceAt(2) as unknown as {
      resolvedErrorMessage: () => string;
    };

    expect(component.resolvedErrorMessage()).toBe('Campo inválido.');
  });

  it('should add the focused class while the textarea has focus', () => {
    getTextareaAt(0).dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(getComponents()[0].querySelector('.textarea-formfield--focused')).not.toBeNull();
  });

  it('should reflect readonly state', () => {
    expect(getTextareaAt(3).readOnly).toBe(true);
  });

  it('should reflect disabled state from the form control', () => {
    expect(getTextareaAt(4).disabled).toBe(true);
  });

  it('should return no error state when used without NgControl', () => {
    const component = getComponentInstanceAt(5) as unknown as {
      showError: () => boolean;
      resolvedErrorMessage: () => string;
    };

    expect(component.showError()).toBe(false);
    expect(component.resolvedErrorMessage()).toBe('');
  });

  it('should not set aria-describedby when there is no hint or error', () => {
    expect(getTextareaAt(5).getAttribute('aria-describedby')).toBeNull();
  });

  it('should convert null values to empty string in writeValue', () => {
    const component = getComponentInstanceAt(5);

    component.writeValue(null);
    fixture.detectChanges();

    expect(getTextareaAt(5).value).toBe('');
  });
});
