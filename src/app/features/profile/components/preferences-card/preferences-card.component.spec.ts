import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { InputSelectOption } from '../../../../shared/components/select/input-select-option.model';
import { ProfilePreferences } from '../../models/profile-preferences.model';
import { ProfilePreferencesFormValue } from '../../models/profile-preferences-form-value.model';
import { PreferencesCardComponent } from './preferences-card.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const PREFERENCES: ProfilePreferences = {
  temperatureUnit: 'celsius',
  concentrationUnit: 'mgL',
  defaultAquariumId: null,
  emailAlertsEnabled: true,
};

const AQUARIUM_OPTIONS: InputSelectOption[] = [
  { id: 'aquarium-1', title: 'Reef Tank' },
  { id: 'aquarium-2', title: 'Betta Tank' },
];

@Component({
  standalone: true,
  imports: [PreferencesCardComponent],
  template: `
    <app-preferences-card
      [preferences]="preferences()"
      [aquariumOptions]="aquariumOptions()"
      [saving]="saving()"
      [saveSuccess]="saveSuccess()"
      [error]="error()"
      (savePreferences)="saved.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly preferences = signal<ProfilePreferences>(PREFERENCES);
  readonly aquariumOptions = signal<InputSelectOption[]>(AQUARIUM_OPTIONS);
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal<ProfilePreferencesFormValue | null>(null);
}

describe('PreferencesCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  function getSegmentedControls(): HTMLElement[] {
    return Array.from(element.querySelectorAll('aq-segmented-control'));
  }

  function getSwitch(): HTMLButtonElement {
    return element.querySelector('.switch__track') as HTMLButtonElement;
  }

  function getSaveButton(): HTMLButtonElement {
    return element.querySelector('[slot=actions]') as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock() }],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should render its labels in the current language', () => {
    expect(element.textContent).toContain('Preferences');
    expect(element.textContent).toContain('Default Aquarium');
    expect(element.textContent).toContain('Email Alerts');
  });

  it('should render its labels in Portuguese when the language is pt', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Preferências');
    expect(fixture.nativeElement.textContent).toContain('Aquário Padrão');
  });

  it('should initialize the form from the preferences input', () => {
    const [temperatureControl] = getSegmentedControls();
    expect(
      temperatureControl.querySelector('.segmented-control__option--selected')?.textContent?.trim(),
    ).toBe('°C');
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
  });

  it('should disable the save button while the form is pristine', () => {
    expect(getSaveButton().disabled).toBe(true);
  });

  it('should update the temperature unit and enable save when changed', () => {
    const [, fahrenheitButton] = getSegmentedControls()[0].querySelectorAll(
      '.segmented-control__option',
    );

    (fahrenheitButton as HTMLButtonElement).click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ temperatureUnit: 'fahrenheit' }),
    );
  });

  it('should toggle email alerts and emit the updated value on save', () => {
    getSwitch().click();
    hostFixture.detectChanges();

    expect(getSwitch().getAttribute('aria-checked')).toBe('false');

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ emailAlertsEnabled: false }),
    );
  });

  it('should update the default aquarium selection through aq-input-select', () => {
    const trigger = element.querySelector('.input-select__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const option = overlayEl.querySelector('.input-select__option') as HTMLElement;
    option.click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ defaultAquariumId: 'aquarium-1' }),
    );
  });

  it('should update the concentration unit and enable save when changed', () => {
    const [, ppmButton] = getSegmentedControls()[1].querySelectorAll('.segmented-control__option');

    (ppmButton as HTMLButtonElement).click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ concentrationUnit: 'ppm' }),
    );
  });

  it('should mark the form as pristine again once saveSuccess becomes true', () => {
    getSwitch().click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    hostFixture.componentInstance.saveSuccess.set(true);
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should disable the save button while saving', () => {
    getSwitch().click();
    hostFixture.componentInstance.saving.set(true);
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should not emit savePreferences when submit() is invoked directly while pristine', () => {
    const component = hostFixture.debugElement.children[0].componentInstance;

    component['submit']();

    expect(hostFixture.componentInstance.saved()).toBeNull();
  });
});
