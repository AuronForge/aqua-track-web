import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectFormfieldOption } from './select-formfield-option.model';
import { SelectFormfieldComponent } from './select-formfield.component';

const AQUARIUM_TYPE_OPTIONS: SelectFormfieldOption[] = [
  { id: 'freshwater', title: 'Agua doce', subtitle: 'Tetras, lebistes e plantas' },
  { id: 'marine', title: 'Marinho', subtitle: 'Corais e peixes de recife' },
  { id: 'disabled', title: 'Desabilitado', disabled: true },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SelectFormfieldComponent],
  template: `
    <form [formGroup]="form">
      <aq-select-formfield
        formControlName="aquariumType"
        label="Tipo do aquario"
        placeholder="Selecione o tipo"
        hint="Essa informacao ajuda a adaptar sugestoes e parametros."
        [options]="options"
        [errorMessages]="{ required: 'Campo obrigatorio.' }"
      />
    </form>

    <aq-select-formfield
      [formControl]="secondaryControl"
      label="Aquario principal"
      [options]="options"
    />

    <aq-select-formfield
      [formControl]="multipleControl"
      label="Fauna"
      [options]="options"
      [multiple]="true"
    />

    <aq-select-formfield
      [formControl]="genericErrorControl"
      label="Campo generico"
      [options]="options"
    />

    <aq-select-formfield [formControl]="disabledControl" label="Desabilitado" [options]="options" />

    <aq-select-formfield label="Livre" [options]="options" />
  `,
})
class TestHostComponent {
  readonly options = AQUARIUM_TYPE_OPTIONS;

  readonly form = new FormGroup({
    aquariumType: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  readonly secondaryControl = new FormControl<string | null>(null);
  readonly multipleControl = new FormControl<string[]>([]);
  readonly genericErrorControl = new FormControl<string | null>(null);
  readonly disabledControl = new FormControl<string | null>({ value: 'marine', disabled: true });
}

describe('SelectFormfieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  function getComponents(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('aq-select-formfield');
  }

  function getTriggerAt(index: number): HTMLButtonElement {
    return getComponents()[index].querySelector('.select-formfield__trigger') as HTMLButtonElement;
  }

  function getLabelAt(index: number): HTMLLabelElement {
    return getComponents()[index].querySelector('.select-formfield__label') as HTMLLabelElement;
  }

  function getHintAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.select-formfield__hint');
  }

  function getErrorAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.select-formfield__error');
  }

  function getControlAt(index: number): HTMLElement {
    return getComponents()[index].querySelector('.select-formfield__control') as HTMLElement;
  }

  function getComponentInstanceAt(index: number): SelectFormfieldComponent {
    return fixture.debugElement.queryAll(By.directive(SelectFormfieldComponent))[index]
      .componentInstance as SelectFormfieldComponent;
  }

  function getDropdown(): HTMLElement | null {
    return overlayEl.querySelector('.select-formfield__dropdown');
  }

  function getOverlayOptions(): NodeListOf<HTMLElement> {
    return overlayEl.querySelectorAll('.select-formfield__option');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and placeholder', () => {
    expect(getLabelAt(0).textContent).toContain('Tipo do aquario');
    expect(getTriggerAt(0).textContent).toContain('Selecione o tipo');
  });

  it('should render hint when there is no visible error', () => {
    expect(getHintAt(0)?.textContent).toContain(
      'Essa informacao ajuda a adaptar sugestoes e parametros.',
    );
    expect(getErrorAt(0)).toBeNull();
  });

  it('should receive values from formControlName', () => {
    host.form.controls.aquariumType.setValue('marine');
    fixture.detectChanges();

    expect(getTriggerAt(0).textContent).toContain('Marinho');
  });

  it('should propagate selected ids back to the parent form', () => {
    const component = getComponentInstanceAt(0) as unknown as {
      onSelectionChange: (event: {
        option: SelectFormfieldOption;
        previousOption: SelectFormfieldOption | null;
        selectedOptions: SelectFormfieldOption[];
        previousSelectedOptions: SelectFormfieldOption[];
      }) => void;
    };

    component.onSelectionChange({
      option: AQUARIUM_TYPE_OPTIONS[0],
      previousOption: null,
      selectedOptions: [AQUARIUM_TYPE_OPTIONS[0]],
      previousSelectedOptions: [],
    });
    fixture.detectChanges();

    expect(host.form.controls.aquariumType.value).toBe('freshwater');
  });

  it('should mark the control as touched on focusout', () => {
    expect(host.form.controls.aquariumType.touched).toBe(false);

    getControlAt(0).dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: null }),
    );
    fixture.detectChanges();

    expect(host.form.controls.aquariumType.touched).toBe(true);
  });

  it('should show custom validation error after interaction', () => {
    getControlAt(0).dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: null }),
    );
    fixture.detectChanges();

    expect(getErrorAt(0)?.textContent).toContain('Campo obrigatorio.');
    expect(getTriggerAt(0).getAttribute('aria-invalid')).toBe('true');
  });

  it('should associate trigger and label with the same id', () => {
    expect(getTriggerAt(0).id).toBeTruthy();
    expect(getLabelAt(0).htmlFor).toBe(getTriggerAt(0).id);
  });

  it('should set aria-describedby to the hint id when hint is visible', () => {
    const hint = getHintAt(0);
    expect(getTriggerAt(0).getAttribute('aria-describedby')).toBe(hint?.id ?? null);
  });

  it('should support [formControl] bindings directly', () => {
    host.secondaryControl.setValue('freshwater');
    fixture.detectChanges();

    expect(getTriggerAt(1).textContent).toContain('Agua doce');
  });

  it('should support multiple selected ids through [formControl]', () => {
    host.multipleControl.setValue(['freshwater', 'marine']);
    fixture.detectChanges();

    expect(getTriggerAt(2).textContent).toContain('2 selecionados');
  });

  it('should propagate multiple selected ids back to the parent form', () => {
    const component = getComponentInstanceAt(2) as unknown as {
      onSelectionChange: (event: {
        option: SelectFormfieldOption;
        previousOption: SelectFormfieldOption | null;
        selectedOptions: SelectFormfieldOption[];
        previousSelectedOptions: SelectFormfieldOption[];
      }) => void;
    };

    component.onSelectionChange({
      option: AQUARIUM_TYPE_OPTIONS[1],
      previousOption: null,
      selectedOptions: [AQUARIUM_TYPE_OPTIONS[0], AQUARIUM_TYPE_OPTIONS[1]],
      previousSelectedOptions: [AQUARIUM_TYPE_OPTIONS[0]],
    });
    fixture.detectChanges();

    expect(host.multipleControl.value).toEqual(['freshwater', 'marine']);
  });

  it('should use generic fallback message when the error key is unknown', () => {
    host.genericErrorControl.setErrors({ server: true });
    host.genericErrorControl.markAsTouched();
    fixture.detectChanges();

    const component = getComponentInstanceAt(3) as unknown as {
      resolvedErrorMessage: () => string;
    };

    expect(component.resolvedErrorMessage()).toContain('Campo');
  });

  it('should reflect disabled state from the form control', () => {
    expect(getTriggerAt(4).disabled).toBe(true);
  });

  it('should return no error state when used without NgControl', () => {
    const component = getComponentInstanceAt(5) as unknown as {
      showError: () => boolean;
      resolvedErrorMessage: () => string;
    };

    expect(component.showError()).toBe(false);
    expect(component.resolvedErrorMessage()).toBe('');
  });

  it('should convert empty values to null in writeValue', () => {
    const component = getComponentInstanceAt(5);

    component.writeValue('');
    fixture.detectChanges();

    expect(getTriggerAt(5).textContent).toContain('Selecione');
  });

  it('should coerce non-array values to empty arrays in multiple mode', () => {
    const component = getComponentInstanceAt(2);

    component.writeValue('marine');
    fixture.detectChanges();

    expect(getTriggerAt(2).textContent).toContain('Selecione');
  });

  it('should open the dropdown on trigger click', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    expect(getDropdown()).toBeTruthy();
  });

  it('should close the dropdown when the trigger is clicked twice', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();
    getTriggerAt(0).click();
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should render all options when open', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    expect(getOverlayOptions()).toHaveLength(AQUARIUM_TYPE_OPTIONS.length);
  });

  it('should apply selected state to the current option in the overlay', () => {
    host.secondaryControl.setValue('marine');
    fixture.detectChanges();

    getTriggerAt(1).click();
    fixture.detectChanges();

    expect(getOverlayOptions()[1].classList).toContain('select-formfield__option--selected');
  });

  it('should close the dropdown after selecting an option in single mode', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    getOverlayOptions()[0].click();
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should keep the dropdown open in multiple mode after selecting an option', () => {
    getTriggerAt(2).click();
    fixture.detectChanges();

    getOverlayOptions()[1].click();
    fixture.detectChanges();

    expect(getDropdown()).toBeTruthy();
    expect(host.multipleControl.value).toEqual(['marine']);
  });

  it('should remove an already selected option in multiple mode', () => {
    host.multipleControl.setValue(['freshwater']);
    fixture.detectChanges();

    getTriggerAt(2).click();
    fixture.detectChanges();

    getOverlayOptions()[0].click();
    fixture.detectChanges();

    expect(host.multipleControl.value).toEqual([]);
  });

  it('should keep the dropdown closed when the control is disabled', () => {
    getTriggerAt(4).click();
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should not open the dropdown when loading is true', () => {
    const component = getComponentInstanceAt(5) as unknown as {
      loading: () => boolean;
      toggleDropdown: () => void;
    };

    component.loading = () => true;
    component.toggleDropdown();
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should navigate options with the keyboard and select the focused option', () => {
    const componentElement = getComponents()[0];

    getTriggerAt(0).click();
    fixture.detectChanges();

    componentElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    fixture.detectChanges();
    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.form.controls.aquariumType.value).toBe('freshwater');
    expect(getDropdown()).toBeNull();
  });

  it('should close the dropdown with Escape', () => {
    const componentElement = getComponents()[0];

    getTriggerAt(0).click();
    fixture.detectChanges();

    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should move focus backwards with ArrowUp when open', () => {
    const component = getComponentInstanceAt(0) as unknown as {
      focusedIndex: () => number;
    };
    const componentElement = getComponents()[0];

    getTriggerAt(0).click();
    fixture.detectChanges();

    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();

    expect(component.focusedIndex()).toBe(1);
  });

  it('should open the dropdown with Enter when closed', () => {
    const componentElement = getComponents()[0];

    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(getDropdown()).toBeTruthy();
  });

  it('should open the dropdown with Space when closed', () => {
    const componentElement = getComponents()[0];

    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(getDropdown()).toBeTruthy();
  });

  it('should not select an option when Enter is pressed with no focused option', () => {
    const componentElement = getComponents()[0];

    getTriggerAt(0).click();
    fixture.detectChanges();

    componentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.form.controls.aquariumType.value).toBeNull();
  });

  it('should ignore disabled options when clicked', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    getOverlayOptions()[2].click();
    fixture.detectChanges();

    expect(host.form.controls.aquariumType.value).toBeNull();
  });

  it('should preserve focus when focus moves inside the control', () => {
    const component = getComponentInstanceAt(0) as unknown as {
      focused: () => boolean;
      onFocusIn: () => void;
      onFocusOut: (event: FocusEvent) => void;
    };
    const control = getControlAt(0);
    const child = document.createElement('button');
    control.appendChild(child);

    component.onFocusIn();
    component.onFocusOut({
      currentTarget: control,
      relatedTarget: child,
    } as unknown as FocusEvent);

    expect(component.focused()).toBe(true);

    control.removeChild(child);
  });

  it('should close the dropdown on backdrop click', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    (overlayEl.querySelector('.cdk-overlay-backdrop') as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    fixture.detectChanges();

    expect(getDropdown()).toBeNull();
  });

  it('should return early when all options are disabled during keyboard focus shift', () => {
    const component = getComponentInstanceAt(0) as unknown as {
      focusedIndex: () => number;
      shiftFocus: (direction: 1 | -1, options: SelectFormfieldOption[]) => void;
    };

    component.shiftFocus(1, [{ id: 'only-disabled', title: 'Disabled', disabled: true }]);

    expect(component.focusedIndex()).toBe(-1);
  });

  it('should restore focus to the trigger when closing the dropdown', () => {
    getTriggerAt(0).click();
    fixture.detectChanges();

    (getComponentInstanceAt(0) as unknown as { toggleDropdown: () => void }).toggleDropdown();
    fixture.detectChanges();

    expect(document.activeElement).toBe(getTriggerAt(0));
  });
});
