import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SearchFormfieldComponent } from './search-formfield.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SearchFormfieldComponent],
  template: `
    <div (keydown.escape)="escapeBubbleCount = escapeBubbleCount + 1">
      <form [formGroup]="form" (ngSubmit)="submitCount = submitCount + 1">
        <aq-search-formfield
          formControlName="query"
          label="Buscar aquarios"
          placeholder="Buscar aquarios por nome"
          hint="Digite parte do nome para filtrar"
          [required]="true"
          [loading]="loading()"
          [errorMessages]="{
            required: 'Campo obrigatorio.',
            minlength: 'Informe pelo menos 3 caracteres.',
          }"
          (cleared)="clearCount = clearCount + 1"
        />
      </form>
    </div>

    <aq-search-formfield
      [formControl]="ariaOnlyControl"
      ariaLabel="Buscar especies"
      placeholder="Buscar especies"
    />

    <aq-search-formfield
      [formControl]="readonlyControl"
      label="Somente leitura"
      [readonly]="true"
      (cleared)="readonlyClearCount = readonlyClearCount + 1"
    />

    <aq-search-formfield
      [formControl]="disabledControl"
      label="Desabilitado"
      (cleared)="disabledClearCount = disabledClearCount + 1"
    />

    <aq-search-formfield [formControl]="freeControl" [loading]="freeLoading()" />
  `,
})
class TestHostComponent {
  readonly loading = signal(false);
  readonly freeLoading = signal(false);

  readonly form = new FormGroup({
    query: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  readonly ariaOnlyControl = new FormControl('neon tetra', { nonNullable: true });
  readonly readonlyControl = new FormControl('aquario principal', { nonNullable: true });
  readonly disabledControl = new FormControl(
    { value: 'bloqueado', disabled: true },
    { nonNullable: true },
  );
  readonly freeControl = new FormControl('', { nonNullable: true });

  clearCount = 0;
  readonlyClearCount = 0;
  disabledClearCount = 0;
  escapeBubbleCount = 0;
  submitCount = 0;
}

describe('SearchFormfieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getComponents(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('aq-search-formfield');
  }

  function getInputAt(index: number): HTMLInputElement {
    return getComponents()[index].querySelector('.search-formfield__input') as HTMLInputElement;
  }

  function getLabelAt(index: number): HTMLLabelElement | null {
    return getComponents()[index].querySelector('.search-formfield__label');
  }

  function getHintAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.search-formfield__hint');
  }

  function getErrorAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.search-formfield__error');
  }

  function getClearButtonAt(index: number): HTMLButtonElement | null {
    return getComponents()[index].querySelector('.search-formfield__action');
  }

  function getLoadingStatusAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.search-formfield__sr-only');
  }

  function getForm(): HTMLFormElement {
    return fixture.nativeElement.querySelector('form') as HTMLFormElement;
  }

  function getComponentInstanceAt(index: number): SearchFormfieldComponent {
    return fixture.debugElement.queryAll(By.directive(SearchFormfieldComponent))[index]
      .componentInstance as SearchFormfieldComponent;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label, placeholder and hint', () => {
    expect(getLabelAt(0)?.textContent).toContain('Buscar aquarios');
    expect(getInputAt(0).placeholder).toBe('Buscar aquarios por nome');
    expect(getHintAt(0)?.textContent).toContain('Digite parte do nome para filtrar');
  });

  it('should associate input and label with the same id', () => {
    expect(getInputAt(0).id).toBeTruthy();
    expect(getLabelAt(0)?.htmlFor).toBe(getInputAt(0).id);
  });

  it('should use aria-label when there is no visible label', () => {
    expect(getLabelAt(1)).toBeNull();
    expect(getInputAt(1).getAttribute('aria-label')).toBe('Buscar especies');
  });

  it('should use the translated fallback aria-label when no label is provided', () => {
    expect(getInputAt(4).getAttribute('aria-label')).toBe('Buscar');
  });

  it('should receive values from formControlName', () => {
    host.form.controls.query.setValue('tetra');
    fixture.detectChanges();

    expect(getInputAt(0).value).toBe('tetra');
  });

  it('should propagate values back to the parent form', () => {
    getInputAt(0).value = 'guppy';
    getInputAt(0).dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.query.value).toBe('guppy');
  });

  it('should mark the control as touched on blur', () => {
    expect(host.form.controls.query.touched).toBe(false);

    getInputAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(host.form.controls.query.touched).toBe(true);
  });

  it('should show a validation error only after interaction', () => {
    expect(getErrorAt(0)).toBeNull();

    getInputAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Campo obrigatorio.');
    expect(getInputAt(0).getAttribute('aria-invalid')).toBe('true');
  });

  it('should resolve the first active validation message', () => {
    host.form.controls.query.setValue('ab');
    host.form.controls.query.markAsTouched();
    host.form.controls.query.markAsDirty();
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Informe pelo menos 3 caracteres.');
  });

  it('should set aria-describedby to the hint when there is no visible error', () => {
    expect(getInputAt(0).getAttribute('aria-describedby')).toBe(getHintAt(0)?.id ?? null);
  });

  it('should set aria-describedby to the error when validation is visible', () => {
    getInputAt(0).dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(getInputAt(0).getAttribute('aria-describedby')).toBe(getErrorAt(0)?.id ?? null);
  });

  it('should show the clear button only when there is a value', () => {
    expect(getClearButtonAt(0)).toBeNull();

    host.form.controls.query.setValue('tetra');
    fixture.detectChanges();

    expect(getClearButtonAt(0)).not.toBeNull();
  });

  it('should clear the value on button click and keep focus on the input', async () => {
    host.form.controls.query.setValue('betta');
    fixture.detectChanges();

    getInputAt(0).focus();
    getClearButtonAt(0)?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.form.controls.query.value).toBe('');
    expect(host.clearCount).toBe(1);
    expect(document.activeElement).toBe(getInputAt(0));
  });

  it('should clear the value with Escape when the input has content', async () => {
    host.form.controls.query.setValue('coral');
    fixture.detectChanges();

    getInputAt(0).focus();
    getInputAt(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.form.controls.query.value).toBe('');
    expect(host.clearCount).toBe(1);
    expect(host.escapeBubbleCount).toBe(0);
    expect(document.activeElement).toBe(getInputAt(0));
  });

  it('should allow Escape to bubble when the input is already empty', () => {
    getInputAt(0).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(host.escapeBubbleCount).toBe(1);
  });

  it('should not clear when readonly', () => {
    expect(getClearButtonAt(2)).toBeNull();

    getInputAt(2).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(host.readonlyControl.value).toBe('aquario principal');
    expect(host.readonlyClearCount).toBe(0);
  });

  it('should not clear when disabled', () => {
    expect(getClearButtonAt(3)).toBeNull();
    expect(getInputAt(3).disabled).toBe(true);
    expect(host.disabledClearCount).toBe(0);
  });

  it('should reflect loading state without removing the current value', () => {
    host.form.controls.query.setValue('oscar');
    host.loading.set(true);
    fixture.detectChanges();

    expect(getInputAt(0).value).toBe('oscar');
    expect(getInputAt(0).getAttribute('aria-busy')).toBe('true');
    expect(getLoadingStatusAt(0)?.textContent).toContain('Buscando');
    expect(getClearButtonAt(0)).not.toBeNull();
  });

  it('should expose the translated loading label for free instances', () => {
    host.freeLoading.set(true);
    fixture.detectChanges();

    expect(getLoadingStatusAt(4)?.textContent).toContain('Buscando');
  });

  it('should keep the input editable while loading', () => {
    host.loading.set(true);
    fixture.detectChanges();

    expect(getInputAt(0).disabled).toBe(false);
    expect(getInputAt(0).readOnly).toBe(false);
  });

  it('should support direct [formControl] bindings', () => {
    host.ariaOnlyControl.setValue('ciclideos');
    fixture.detectChanges();

    expect(getInputAt(1).value).toBe('ciclideos');
  });

  it('should reset correctly through the parent form', () => {
    host.form.controls.query.setValue('molly');
    fixture.detectChanges();

    host.form.reset();
    fixture.detectChanges();

    expect(getInputAt(0).value).toBe('');
    expect(getClearButtonAt(0)).toBeNull();
  });

  it('should set aria-required when required', () => {
    expect(getInputAt(0).getAttribute('aria-required')).toBe('true');
  });

  it('should not prevent Enter on the input', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    const dispatchResult = getInputAt(0).dispatchEvent(event);

    expect(dispatchResult).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should work inside a native form submit flow without duplicate clear events', () => {
    host.form.controls.query.setValue('tetra');
    fixture.detectChanges();

    getForm().requestSubmit();
    fixture.detectChanges();

    expect(host.submitCount).toBe(1);
    expect(host.clearCount).toBe(0);
  });

  it('should convert null values to empty string in writeValue', () => {
    const component = getComponentInstanceAt(4);

    component.writeValue(null);
    fixture.detectChanges();

    expect(getInputAt(4).value).toBe('');
  });

  it('should expose an empty error state without NgControl', () => {
    const component = getComponentInstanceAt(4) as unknown as {
      showError: () => boolean;
      resolvedErrorMessage: () => string;
    };

    expect(component.showError()).toBe(false);
    expect(component.resolvedErrorMessage()).toBe('');
  });

  it('should focus programmatically through the public method', () => {
    const component = getComponentInstanceAt(0);

    component.focus();

    expect(document.activeElement).toBe(getInputAt(0));
  });
});
