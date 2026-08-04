import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormfieldOption } from '../../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ProfilePreferences } from '../../models/profile-preferences.model';
import { ProfilePreferencesFormValue } from '../../models/profile-preferences-form-value.model';
import { PreferencesCardComponent } from './preferences-card.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const PREFERENCES: ProfilePreferences = {
  preferredLanguage: 'pt',
  temperatureUnit: 'celsius',
  concentrationUnit: 'mgL',
  emailAlertsEnabled: true,
  phAlertsEnabled: true,
  temperatureAlertsEnabled: true,
  ammoniaAlertsEnabled: true,
  nitriteAlertsEnabled: true,
  nitrateAlertsEnabled: true,
};

const AQUARIUM_OPTIONS: SelectFormfieldOption[] = [
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
  readonly aquariumOptions = signal<SelectFormfieldOption[]>(AQUARIUM_OPTIONS);
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal<ProfilePreferencesFormValue | null>(null);
}

describe('PreferencesCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getSegmentedControls(): HTMLElement[] {
    return Array.from(element.querySelectorAll('aq-segmented-control'));
  }

  function getSwitches(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('.switch__track')) as HTMLButtonElement[];
  }

  function getSaveButton(): HTMLButtonElement {
    return element.querySelector('[slot=actions]') as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock() }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should render its labels in the current language', () => {
    expect(element.textContent).toContain('Preferences');
    expect(element.textContent).toContain('Preferred Language');
    expect(element.textContent).toContain('Email Alerts');
    expect(element.textContent).toContain('pH Alerts');
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
    expect(fixture.nativeElement.textContent).toContain('Idioma Preferido');
    expect(fixture.nativeElement.textContent).toContain('Alertas de Nitrito');
  });

  it('should initialize the form from the preferences input', () => {
    const [languageControl, temperatureControl] = getSegmentedControls();

    expect(
      languageControl.querySelector('.segmented-control__option--selected')?.textContent?.trim(),
    ).toBe('BR');
    expect(
      temperatureControl.querySelector('.segmented-control__option--selected')?.textContent?.trim(),
    ).toBe('°C');
    expect(getSwitches()).toHaveLength(6);
    expect(
      getSwitches().every((switchButton) => switchButton.getAttribute('aria-checked') === 'true'),
    ).toBe(true);
  });

  it('should disable the save button while the form is pristine', () => {
    expect(getSaveButton().disabled).toBe(true);
  });

  it('should update the preferred language and enable save when changed', () => {
    const [, englishButton] = getSegmentedControls()[0].querySelectorAll(
      '.segmented-control__option',
    );

    (englishButton as HTMLButtonElement).click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ preferredLanguage: 'en' }),
    );
  });

  it('should update the temperature unit and enable save when changed', () => {
    const [, fahrenheitButton] = getSegmentedControls()[1].querySelectorAll(
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

  it('should toggle parameter alerts and emit the updated value on save', () => {
    const switches = getSwitches();
    switches[1].click();
    switches[3].click();
    hostFixture.detectChanges();

    expect(switches[1].getAttribute('aria-checked')).toBe('false');
    expect(switches[3].getAttribute('aria-checked')).toBe('false');

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({
        phAlertsEnabled: false,
        ammoniaAlertsEnabled: false,
      }),
    );
  });

  it('should update the concentration unit and enable save when changed', () => {
    const [, ppmButton] = getSegmentedControls()[2].querySelectorAll('.segmented-control__option');

    (ppmButton as HTMLButtonElement).click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();

    expect(hostFixture.componentInstance.saved()).toEqual(
      expect.objectContaining({ concentrationUnit: 'ppm' }),
    );
  });

  it('should mark the form as pristine again once saveSuccess becomes true', () => {
    getSwitches()[0].click();
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    hostFixture.componentInstance.saveSuccess.set(true);
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should disable the save button while saving', () => {
    getSwitches()[0].click();
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
