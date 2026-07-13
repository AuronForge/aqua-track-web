import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CardSelectionChange } from './card-selection-change.model';
import { CardSelectionCompareWith } from './card-selection-compare-with.type';
import { CardSelectionContentDirective } from './card-selection-content.directive';
import { CardSelectionOption } from './card-selection-option.model';
import { CardSelectionComponent } from './card-selection.component';

enum AquariumType {
  Freshwater = 'freshwater',
  Planted = 'planted',
  Saltwater = 'saltwater',
}

interface AquariumProfile {
  id: number;
  label: string;
}

const PRIMITIVE_OPTIONS: CardSelectionOption<string>[] = [
  {
    value: 'freshwater',
    title: 'Agua Doce',
    description: 'Aquario padrao de agua doce',
    iconName: 'water_drop',
    testId: 'freshwater-option',
  },
  {
    value: 'planted',
    title: 'Plantado',
    description: 'Aquascaping com plantas vivas',
    iconName: 'psychiatry',
    iconPosition: 'end',
  },
  {
    value: 'saltwater',
    title: 'Agua Salgada',
  },
];

const ENUM_OPTIONS: CardSelectionOption<AquariumType>[] = [
  { value: AquariumType.Freshwater, title: 'Agua Doce' },
  { value: AquariumType.Planted, title: 'Plantado' },
  { value: AquariumType.Saltwater, title: 'Agua Salgada' },
];

const OBJECT_OPTIONS: CardSelectionOption<AquariumProfile>[] = [
  {
    value: { id: 1, label: 'Freshwater' },
    title: 'Agua Doce',
    description: 'Boa para iniciantes',
  },
  {
    value: { id: 2, label: 'Marine' },
    title: 'Agua Salgada',
    description: 'Aquario marinho ou de recife',
  },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CardSelectionComponent, CardSelectionContentDirective],
  template: `
    <form [formGroup]="form">
      <aq-card-selection
        formControlName="type"
        label="Tipo de aquario"
        hint="Selecione a configuracao principal."
        errorMessage="Selecione um tipo de aquario."
        [options]="primitiveOptions()"
        [required]="true"
        (selectionChange)="lastPrimitiveChange.set($event)"
      />
    </form>

    <aq-card-selection
      [formControl]="standaloneControl"
      label="Tipo secundario"
      [options]="primitiveOptions()"
      (selectionChange)="lastPrimitiveChange.set($event)"
    />

    <aq-card-selection
      [formControl]="enumControl"
      label="Tipo enum"
      [options]="enumOptions"
      (selectionChange)="lastEnumChange.set($event)"
    />

    <aq-card-selection
      [formControl]="objectControl"
      label="Tipo objeto"
      [options]="objectOptions()"
      [compareWith]="compareProfile"
      (selectionChange)="lastObjectChange.set($event)"
    />

    <aq-card-selection
      [formControl]="disabledControl"
      label="Grupo desabilitado"
      [options]="primitiveOptions()"
    />

    <aq-card-selection
      [formControl]="emptyControl"
      ariaLabel="Sem opcoes"
      [options]="emptyOptions()"
    />

    <aq-card-selection
      [formControl]="directDisabledOptionControl"
      label="Opcao bloqueada"
      [options]="disabledOptionList()"
    />

    <aq-card-selection
      ariaLabel="Grupo simples"
      errorMessage="Mensagem externa"
      [options]="compactOptions"
    />

    <aq-card-selection label="Todas bloqueadas" [options]="allDisabledOptions" />

    <aq-card-selection label="Template customizado" [options]="primitiveOptions()">
      <ng-template aqCardSelectionContent let-option let-selected="selected" let-index="index">
        <span class="projected-option">
          <strong class="projected-option__title">{{ index + 1 }}. {{ option.title }}</strong>
          @if (selected) {
            <span class="projected-option__badge">Selecionado</span>
          }
        </span>
      </ng-template>
    </aq-card-selection>

    <aq-card-selection
      [formControl]="multipleControl"
      label="Multiplas opcoes"
      [options]="primitiveOptions()"
      [multiple]="true"
      (selectionChange)="lastMultipleChange.set($event)"
    />

    <aq-card-selection
      [formControl]="multipleObjectControl"
      label="Multiplos objetos"
      [options]="objectOptions()"
      [compareWith]="compareProfile"
      [multiple]="true"
    />
  `,
})
class TestHostComponent {
  readonly primitiveOptions = signal<CardSelectionOption<string>[]>(PRIMITIVE_OPTIONS);
  readonly enumOptions = ENUM_OPTIONS;
  readonly objectOptions = signal<CardSelectionOption<AquariumProfile>[]>(OBJECT_OPTIONS);
  readonly emptyOptions = signal<CardSelectionOption<string>[]>([]);
  readonly disabledOptionList = signal<CardSelectionOption<string>[]>([
    ...PRIMITIVE_OPTIONS,
    {
      value: 'shrimp',
      title: 'Aquario de Camaroes',
      description: 'Temporariamente indisponivel',
      disabled: true,
    },
  ]);
  readonly compactOptions: CardSelectionOption<string>[] = PRIMITIVE_OPTIONS;
  readonly allDisabledOptions: CardSelectionOption<string>[] = [
    { value: 'alpha', title: 'Alpha', disabled: true },
    { value: 'beta', title: 'Beta', disabled: true },
  ];

  readonly form = new FormGroup({
    type: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  readonly standaloneControl = new FormControl<string | null>(null);
  readonly enumControl = new FormControl<AquariumType | null>(null);
  readonly objectControl = new FormControl<AquariumProfile | null>(null);
  readonly disabledControl = new FormControl<string | null>({
    value: 'planted',
    disabled: true,
  });
  readonly emptyControl = new FormControl<string | null>(null);
  readonly directDisabledOptionControl = new FormControl<string | null>(null);
  readonly multipleControl = new FormControl<readonly string[]>([]);
  readonly multipleObjectControl = new FormControl<readonly AquariumProfile[]>([]);

  readonly lastPrimitiveChange = signal<CardSelectionChange<string> | null>(null);
  readonly lastEnumChange = signal<CardSelectionChange<AquariumType> | null>(null);
  readonly lastObjectChange = signal<CardSelectionChange<AquariumProfile> | null>(null);
  readonly lastMultipleChange = signal<CardSelectionChange<string> | null>(null);

  readonly compareProfile: CardSelectionCompareWith<AquariumProfile> = (
    optionValue,
    selectedValue,
  ) => optionValue.id === selectedValue.id;
}

describe('CardSelectionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getComponents(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('aq-card-selection');
  }

  function getFieldsetAt(index: number): HTMLFieldSetElement {
    return getComponents()[index].querySelector('fieldset') as HTMLFieldSetElement;
  }

  function getInputsAt(index: number): HTMLInputElement[] {
    return Array.from(
      getComponents()[index].querySelectorAll('input[type="radio"], input[type="checkbox"]'),
    );
  }

  function getLabelsAt(index: number): HTMLLabelElement[] {
    return Array.from(getComponents()[index].querySelectorAll('.card-selection__option'));
  }

  function getCardsAt(index: number): HTMLElement[] {
    return Array.from(getComponents()[index].querySelectorAll('.card-selection__option-card'));
  }

  function getIconsAt(index: number): HTMLElement[] {
    return Array.from(getComponents()[index].querySelectorAll('.card-selection__option-icon'));
  }

  function getLegendAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.card-selection__legend');
  }

  function getHintAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.card-selection__hint');
  }

  function getErrorAt(index: number): HTMLElement | null {
    return getComponents()[index].querySelector('.card-selection__error');
  }

  function getComponentInstanceAt(index: number): CardSelectionComponent<unknown> {
    return fixture.debugElement.queryAll(By.directive(CardSelectionComponent))[index]
      .componentInstance as CardSelectionComponent<unknown>;
  }

  function getProjectedContentAt(index: number): HTMLElement[] {
    return Array.from(getComponents()[index].querySelectorAll('.projected-option'));
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

  it('should render all provided options preserving order', () => {
    const titles = Array.from(
      getComponents()[0].querySelectorAll('.card-selection__option-title'),
    ).map((title) => title.textContent?.trim());

    expect(titles).toEqual(['Agua Doce', 'Plantado', 'Agua Salgada']);
  });

  it('should render label and hint', () => {
    expect(getLegendAt(0)?.textContent).toContain('Tipo de aquario');
    expect(getHintAt(0)?.textContent).toContain('Selecione a configuracao principal.');
  });

  it('should support an option without description', () => {
    expect(getCardsAt(0)[2].textContent).toContain('Agua Salgada');
    expect(getCardsAt(0)[2].querySelector('.card-selection__option-description')).toBeNull();
  });

  it('should render icons in the configured positions', () => {
    expect(getCardsAt(0)[0].querySelector('.card-selection__option-icon')?.textContent).toContain(
      'water_drop',
    );
    expect(
      getCardsAt(0)[0]
        .querySelector('.card-selection__option-content')
        ?.classList.contains('card-selection__option-content--icon-end'),
    ).toBe(false);

    expect(getCardsAt(0)[1].querySelector('.card-selection__option-icon')?.textContent).toContain(
      'psychiatry',
    );
    expect(
      getCardsAt(0)[1]
        .querySelector('.card-selection__option-content')
        ?.classList.contains('card-selection__option-content--icon-end'),
    ).toBe(true);
  });

  it('should not render icons when the option does not declare one', () => {
    expect(getCardsAt(0)[2].querySelector('.card-selection__option-icon')).toBeNull();
    expect(getIconsAt(0)).toHaveLength(2);
  });

  it('should support projected content for the card body', () => {
    expect(getProjectedContentAt(9)).toHaveLength(3);
    expect(getProjectedContentAt(9)[0].textContent).toContain('1. Agua Doce');
    expect(getProjectedContentAt(9)[0].textContent).not.toContain('Selecionado');

    getLabelsAt(9)[1].click();
    fixture.detectChanges();

    expect(getProjectedContentAt(9)[1].textContent).toContain('2. Plantado');
    expect(getProjectedContentAt(9)[1].textContent).toContain('Selecionado');
  });

  it('should update the standalone form control when an option is clicked', () => {
    getLabelsAt(1)[1].click();
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('planted');
    expect(getInputsAt(1)[1].checked).toBe(true);
  });

  it('should support keyboard selection with ArrowRight', () => {
    getInputsAt(1)[0].focus();
    getInputsAt(1)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('planted');
    expect(document.activeElement).toBe(getInputsAt(1)[1]);
  });

  it('should support keyboard selection with Space', () => {
    getInputsAt(1)[2].focus();
    getInputsAt(1)[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('saltwater');
    expect(getInputsAt(1)[2].checked).toBe(true);
  });

  it('should support keyboard selection with Home and End', () => {
    getInputsAt(1)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('saltwater');

    getInputsAt(1)[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('freshwater');
  });

  it('should support keyboard selection with ArrowLeft', () => {
    getInputsAt(1)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('saltwater');
  });

  it('should integrate with formControlName', () => {
    host.form.controls.type.setValue('planted');
    fixture.detectChanges();

    expect(getInputsAt(0)[1].checked).toBe(true);
  });

  it('should support writeValue through ControlValueAccessor', () => {
    const component = getComponentInstanceAt(1) as CardSelectionComponent<string>;

    component.writeValue('saltwater');
    fixture.detectChanges();

    expect(getInputsAt(1)[2].checked).toBe(true);
  });

  it('should emit selectionChange only when the value changes', () => {
    const component = getComponentInstanceAt(1) as CardSelectionComponent<string>;
    const emitSpy = jest.spyOn(component.selectionChange, 'emit');

    getLabelsAt(1)[0].click();
    fixture.detectChanges();
    getLabelsAt(1)[0].click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(host.lastPrimitiveChange()?.value).toBe('freshwater');
  });

  it('should mark the selected state visually', () => {
    host.standaloneControl.setValue('planted');
    fixture.detectChanges();

    expect(getCardsAt(1)[1].classList).toContain('card-selection__option-card--selected');
  });

  it('should reset the reactive form value and visual selection', () => {
    host.form.controls.type.setValue('freshwater');
    fixture.detectChanges();

    host.form.reset();
    fixture.detectChanges();

    expect(host.form.controls.type.value).toBeNull();
    expect(getInputsAt(0).every((input) => !input.checked)).toBe(true);
  });

  it('should reflect disable and enable from the control', () => {
    expect(getFieldsetAt(4).disabled).toBe(true);

    host.disabledControl.enable();
    fixture.detectChanges();

    expect(getFieldsetAt(4).disabled).toBe(false);
  });

  it('should keep the group disabled when configured from the form control', () => {
    expect(getFieldsetAt(4).getAttribute('aria-disabled')).toBe('true');
    expect(getInputsAt(4).every((input) => input.disabled)).toBe(true);
  });

  it('should disable an individual option and block interaction', () => {
    const disabledOption = getInputsAt(6)[3];

    expect(disabledOption.disabled).toBe(true);

    getLabelsAt(6)[3].click();
    fixture.detectChanges();

    expect(host.directDisabledOptionControl.value).toBeNull();
  });

  it('should support enum values', () => {
    getLabelsAt(2)[2].click();
    fixture.detectChanges();

    expect(host.enumControl.value).toBe(AquariumType.Saltwater);
    expect(host.lastEnumChange()?.value).toBe(AquariumType.Saltwater);
  });

  it('should support object values with compareWith', () => {
    host.objectControl.setValue({ id: 2, label: 'Marine clone' });
    fixture.detectChanges();

    expect(getInputsAt(3)[1].checked).toBe(true);
  });

  it('should handle an empty list without errors', () => {
    expect(getInputsAt(5)).toHaveLength(0);
    expect(getFieldsetAt(5).getAttribute('aria-label')).toBe('Sem opcoes');
  });

  it('should ignore keyboard interaction when the list is empty', () => {
    const component = getComponentInstanceAt(5) as CardSelectionComponent<string>;

    component['onOptionKeydown'](new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);
    fixture.detectChanges();

    expect(getInputsAt(5)).toHaveLength(0);
  });

  it('should preserve selection when the option still exists after dynamic updates', () => {
    host.standaloneControl.setValue('planted');
    host.primitiveOptions.set([
      { value: 'freshwater', title: 'Agua Doce' },
      { value: 'planted', title: 'Plantado atualizado' },
      { value: 'saltwater', title: 'Agua Salgada' },
    ]);
    fixture.detectChanges();

    expect(getInputsAt(1)[1].checked).toBe(true);
  });

  it('should remove the visual selection when the current value no longer exists', () => {
    host.standaloneControl.setValue('planted');
    fixture.detectChanges();

    host.primitiveOptions.set([{ value: 'freshwater', title: 'Agua Doce' }]);
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('planted');
    expect(getInputsAt(1).every((input) => !input.checked)).toBe(true);
  });

  it('should remove the visual selection when the selected option is removed', () => {
    host.objectControl.setValue({ id: 1, label: 'Freshwater clone' });
    fixture.detectChanges();

    host.objectOptions.set([{ value: { id: 2, label: 'Marine' }, title: 'Agua Salgada' }]);
    fixture.detectChanges();

    expect(host.objectControl.value).toEqual({ id: 1, label: 'Freshwater clone' });
    expect(getInputsAt(3)[0].checked).toBe(false);
  });

  it('should expose ARIA relationships for label, hint and error', () => {
    const hintId = getHintAt(0)?.id ?? null;

    expect(getFieldsetAt(0).getAttribute('aria-labelledby')).toBe(getLegendAt(0)?.id ?? null);
    expect(getFieldsetAt(0).getAttribute('aria-describedby')).toBe(hintId);

    host.form.controls.type.markAsTouched();
    fixture.detectChanges();

    expect(getFieldsetAt(0).getAttribute('aria-describedby')).toBe(getErrorAt(0)?.id ?? null);
    expect(getFieldsetAt(0).getAttribute('aria-invalid')).toBe('true');
  });

  it('should return no error state when used without NgControl', () => {
    const component = getComponentInstanceAt(7) as CardSelectionComponent<string>;

    expect(component['showError']()).toBe(false);
    expect(component['resolvedErrorMessage']()).toBe('Mensagem externa');
  });

  it('should call onTouched when leaving the group', () => {
    expect(host.form.controls.type.touched).toBe(false);

    getFieldsetAt(0).dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: null }),
    );
    fixture.detectChanges();

    expect(host.form.controls.type.touched).toBe(true);
  });

  it('should expose required semantics and keep the card clickable area', () => {
    expect(getFieldsetAt(0).getAttribute('aria-required')).toBe('true');
    expect(getLegendAt(0)?.textContent).toContain('*');
    expect(getLabelsAt(0)[0].dataset['testid']).toBe('freshwater-option');
  });

  it('should support Enter on the focused radio', () => {
    getInputsAt(1)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(host.standaloneControl.value).toBe('planted');
  });

  it('should ignore disabled options during keyboard navigation', () => {
    getInputsAt(6)[2].focus();
    getInputsAt(6)[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(host.directDisabledOptionControl.value).toBe('freshwater');
  });

  it('should do nothing when all options are disabled', () => {
    const component = getComponentInstanceAt(8) as CardSelectionComponent<string>;

    component['onOptionKeydown'](new KeyboardEvent('keydown', { key: 'ArrowRight' }), 0);
    fixture.detectChanges();

    expect(getInputsAt(8).every((input) => input.checked === false)).toBe(true);
  });

  it('should tolerate focusAndSelect with an invalid index', () => {
    const component = getComponentInstanceAt(7) as CardSelectionComponent<string>;

    expect(() => component['focusAndSelect'](99, true)).not.toThrow();
  });

  it('should mark as touched when selectOption receives a null option', () => {
    const component = getComponentInstanceAt(7) as CardSelectionComponent<string>;
    const touchedSpy = jest.fn();

    component.registerOnTouched(touchedSpy);
    component['selectOption'](null, true);

    expect(touchedSpy).toHaveBeenCalled();
  });

  it('should not auto-select the first option on initial render', () => {
    expect(host.form.controls.type.value).toBeNull();
    expect(getInputsAt(0).every((input) => !input.checked)).toBe(true);
  });

  it('should render checkboxes when multiple is enabled', () => {
    expect(getInputsAt(10).every((input) => input.type === 'checkbox')).toBe(true);
  });

  it('should support multiple selection by click', () => {
    getLabelsAt(10)[0].click();
    fixture.detectChanges();
    getLabelsAt(10)[2].click();
    fixture.detectChanges();

    expect(host.multipleControl.value).toEqual(['freshwater', 'saltwater']);
    expect(getInputsAt(10)[0].checked).toBe(true);
    expect(getInputsAt(10)[2].checked).toBe(true);
    expect(host.lastMultipleChange()?.value).toEqual(['freshwater', 'saltwater']);
    expect(host.lastMultipleChange()?.selectedOptions.map((option) => option.value)).toEqual([
      'freshwater',
      'saltwater',
    ]);
  });

  it('should allow deselecting the same option in multiple mode', () => {
    getLabelsAt(10)[1].click();
    fixture.detectChanges();
    getLabelsAt(10)[1].click();
    fixture.detectChanges();

    expect(host.multipleControl.value).toEqual([]);
    expect(getInputsAt(10)[1].checked).toBe(false);
    expect(host.lastMultipleChange()?.selected).toBe(false);
    expect(host.lastMultipleChange()?.value).toEqual([]);
  });

  it('should move focus with arrows in multiple mode without toggling selection', () => {
    getInputsAt(10)[0].focus();
    getInputsAt(10)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(getInputsAt(10)[1]);
    expect(host.multipleControl.value).toEqual([]);
  });

  it('should move focus backwards with ArrowUp in multiple mode without toggling selection', () => {
    getInputsAt(10)[1].focus();
    getInputsAt(10)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(getInputsAt(10)[0]);
    expect(host.multipleControl.value).toEqual([]);
  });

  it('should move focus with Home and End in multiple mode without changing selection', () => {
    getInputsAt(10)[1].focus();
    getInputsAt(10)[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(getInputsAt(10)[0]);
    expect(host.multipleControl.value).toEqual([]);

    getInputsAt(10)[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();

    expect(document.activeElement).toBe(getInputsAt(10)[2]);
    expect(host.multipleControl.value).toEqual([]);
  });

  it('should toggle the focused checkbox with Space in multiple mode', () => {
    getInputsAt(10)[1].focus();
    getInputsAt(10)[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();

    expect(host.multipleControl.value).toEqual(['planted']);
    expect(getInputsAt(10)[1].checked).toBe(true);
  });

  it('should mark as touched without emitting when selecting the current single value again', () => {
    const component = getComponentInstanceAt(1) as CardSelectionComponent<string>;
    const touchedSpy = jest.fn();
    const changeSpy = jest.fn();

    host.standaloneControl.setValue('freshwater');
    fixture.detectChanges();

    component.registerOnTouched(touchedSpy);
    component.registerOnChange(changeSpy);
    component['selectOption'](PRIMITIVE_OPTIONS[0], true);

    expect(touchedSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).not.toHaveBeenCalled();
    expect(host.lastPrimitiveChange()?.value).not.toBe('freshwater');
  });

  it('should support object arrays with compareWith in multiple mode', () => {
    host.multipleObjectControl.setValue([{ id: 2, label: 'Marine clone' }]);
    fixture.detectChanges();

    expect(getInputsAt(11)[1].checked).toBe(true);
  });
});
