import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import { AquariumCreatePageComponent } from './aquarium-create-page.component';
import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import {
  ALL_DISPLAY_PARAMETER_KEYS,
  DEFAULT_DISPLAY_PARAMETER_KEYS,
} from '../../constants/aquarium-display-parameter-options.constant';
import { CreateAquariumPayload } from '../../models/aquarium-api.dto';
import { SystemValueApiDto } from '../../models/system-value-api.dto';
import { AquariumApiService } from '../../services/aquarium-api.service';
import { SystemValuesApiService } from '../../services/system-values-api.service';

const mockWaterTypes: SystemValueApiDto[] = [
  {
    id: '44444444-4444-4444-8444-444444444443',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'BRACKISH',
    description: 'Tipo de agua salobra.',
    displayValue: 'Brackish',
  },
  {
    id: '44444444-4444-4444-8444-444444444441',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'FRESHWATER',
    description: 'Tipo de agua doce.',
    displayValue: 'Freshwater',
  },
  {
    id: '44444444-4444-4444-8444-444444444442',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'SALTWATER',
    description: 'Tipo de agua salgada.',
    displayValue: 'Saltwater',
  },
];

const mockAquariumTypes: SystemValueApiDto[] = [
  {
    id: '11111111-1111-4111-8111-111111111121',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'BREEDING',
    description: 'Aquario de reproducao.',
    displayValue: 'Breeding',
  },
  {
    id: '11111111-1111-4111-8111-111111111122',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'COMMUNITY_TANK',
    description: 'Aquario com diferentes especies convivendo no mesmo ambiente.',
    displayValue: 'Community Tank',
  },
  {
    id: '11111111-1111-4111-8111-111111111124',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'HOSPITAL',
    description: 'Aquario para tratamento e observacao.',
    displayValue: 'Hospital',
  },
  {
    id: '11111111-1111-4111-8111-111111111125',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'REEF_TANK',
    description: 'Aquario marinho com foco em corais e organismos de recife.',
    displayValue: 'Reef Tank',
  },
  {
    id: '11111111-1111-4111-8111-111111111126',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'CRABS',
    description: 'Aquario dedicado a caranguejos.',
    displayValue: 'Crabs',
  },
  {
    id: '11111111-1111-4111-8111-111111111127',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'PALUDARIUM',
    description: 'Ambiente misto entre terra e agua.',
    displayValue: 'Paludarium',
  },
];

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const buildPageTitleMock = () => ({ set: jest.fn() });

const buildFeedbackMock = () => ({
  showError: jest.fn(),
  showInformation: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn(),
});

const buildSystemValuesApiServiceMock = ({
  waterTypesResponse = of(mockWaterTypes),
  aquariumTypesResponse = of(mockAquariumTypes),
}: {
  waterTypesResponse?: Observable<SystemValueApiDto[]>;
  aquariumTypesResponse?: Observable<SystemValueApiDto[]>;
} = {}) => ({
  listWaterTypes: jest.fn(() => waterTypesResponse),
  listAquariumTypes: jest.fn(() => aquariumTypesResponse),
});

const buildAquariumApiServiceMock = ({
  createResponse = of({
    id: 'aq-1',
    ownerId: 'user-1',
    name: 'Comunitario 60L',
    description: 'Plantado com neons',
    type: 'COMMUNITY',
    waterType: 'FRESHWATER' as const,
    volume: 102.38,
    volumeUnit: 'LITER' as const,
    setupDate: '2026-07-09T00:00:00.000Z',
    primaryPhotoUrl: null,
    photosCount: 0,
    displayPreferences: {
      displayPH: true,
      displayGH: false,
      displayKH: false,
      displayNitrate: false,
      displayNitrite: false,
      displayAmmonia: false,
      displayTemperature: true,
      displayTDS: false,
      displayCopper: false,
      displayPhosphate: false,
      displayIron: false,
      displayCO2: false,
      displayO2: false,
      displayCalcium: false,
      displaySilicates: false,
      displayDensitySalinity: false,
      displayMagnesium: false,
      displayIodine: false,
      displayMolybdenum: false,
      displayStrontium: false,
      displayPotassium: false,
    },
    alertParameters: {},
    status: 'ACTIVE',
    createdAt: '2026-07-16T19:20:03.239Z',
    updatedAt: '2026-07-16T19:20:03.239Z',
    deletedAt: null,
  }),
  uploadPhotoResponse = of(null),
}: {
  createResponse?: Observable<unknown>;
  uploadPhotoResponse?: Observable<unknown>;
} = {}) => ({
  createAquarium: jest.fn(() => createResponse),
  uploadAquariumPhoto: jest.fn(() => uploadPhotoResponse),
});

type AquariumCreateComponentTestApi = AquariumCreatePageComponent & {
  form: FormGroup;
  isSubmitting: () => boolean;
  lastPayload: () => CreateAquariumPayload | null;
  onSubmit: () => void;
};

async function createFixture(
  pageTitleMock = buildPageTitleMock(),
  feedbackMock = buildFeedbackMock(),
  systemValuesApiServiceMock = buildSystemValuesApiServiceMock(),
  aquariumApiServiceMock = buildAquariumApiServiceMock(),
): Promise<ComponentFixture<AquariumCreatePageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumCreatePageComponent],
    providers: [
      provideRouter([{ path: 'home', children: [] }]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
      { provide: FeedbackMessageService, useValue: feedbackMock },
      { provide: AquariumApiService, useValue: aquariumApiServiceMock },
      { provide: SystemValuesApiService, useValue: systemValuesApiServiceMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AquariumCreatePageComponent);
  fixture.detectChanges();
  return fixture;
}

function componentApi(fixture: ComponentFixture<AquariumCreatePageComponent>) {
  return fixture.componentInstance as AquariumCreateComponentTestApi;
}

function fillValidForm(component: AquariumCreateComponentTestApi): void {
  component.form.setValue({
    name: 'Comunitario 60L',
    aquariumType: 'COMMUNITY_TANK',
    waterType: 'FRESHWATER',
    setupDate: '2026-07-09',
    usePhysicalDimensions: true,
    lengthCm: '35',
    widthCm: '45',
    heightCm: '65',
    volume: '',
    displayParameters: DEFAULT_DISPLAY_PARAMETER_KEYS,
    alertChannels: {
      dashboard: true,
      email: false,
    },
    alertParameters: Object.fromEntries(
      ALL_DISPLAY_PARAMETER_KEYS.map((key) => [
        key,
        {
          enabled: key === 'displayPH',
          minimumValue: key === 'displayPH' ? '6.6' : '',
          maximumValue: key === 'displayPH' ? '7.2' : '',
          targetValue: key === 'displayPH' ? '7.0' : '',
        },
      ]),
    ),
    description: 'Plantado com neons',
  });
}

describe('AquariumCreatePageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create and set the page title', async () => {
    const pageTitleMock = buildPageTitleMock();
    const fixture = await createFixture(pageTitleMock);

    expect(fixture.componentInstance).toBeTruthy();
    expect(pageTitleMock.set).toHaveBeenCalledWith(TRANSLATIONS.pt.aquariumFormTitle);
  });

  it('renders the main form sections', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain(TRANSLATIONS.pt.aquariumCreateBasicInfoTitle);
    expect(text).toContain(TRANSLATIONS.pt.aquariumCreateDimensionsTitle);
    expect(text).toContain(TRANSLATIONS.pt.aquariumCreateDisplayParametersTitle);
    expect(text).toContain(TRANSLATIONS.pt.aquariumCreateAlertConfigurationTitle);
    expect(text).toContain(TRANSLATIONS.pt.aquariumCreateDetailsTitle);
    expect(text).toContain(TRANSLATIONS.pt.aquariumCreatePhotoTitle);
  });

  it('renders the basic information fields in the expected order', async () => {
    const fixture = await createFixture();
    const basicInfoSection = fixture.nativeElement.querySelector(
      '[aria-labelledby="aquarium-basic-info-title"]',
    ) as HTMLElement;
    const fieldOrder = Array.from(basicInfoSection.children)
      .map((element) => element.tagName.toLowerCase())
      .filter((tagName) => tagName !== 'div');

    expect(fieldOrder).toEqual([
      'aq-text-formfield',
      'aq-datepicker-formfield',
      'aq-card-selection',
      'aq-card-selection',
    ]);
  });

  it('shows the calculated volume when dimensions are valid', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture);

    component.form.patchValue({
      usePhysicalDimensions: true,
      lengthCm: '35',
      widthCm: '45',
      heightCm: '65',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('102.38 litros');
  });

  it('shows the informed volume when direct volume mode is selected', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture);

    component.form.patchValue({
      usePhysicalDimensions: false,
      volume: '72,5',
      lengthCm: '',
      widthCm: '',
      heightCm: '',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('72.5 litros');
  });

  it('marks the form, focuses the first invalid field and shows feedback', async () => {
    const feedbackMock = buildFeedbackMock();
    const fixture = await createFixture(buildPageTitleMock(), feedbackMock);
    const component = componentApi(fixture);
    const focus = jest.fn();
    jest
      .spyOn(fixture.nativeElement, 'querySelector')
      .mockReturnValue({ focus } as unknown as HTMLElement);

    component.onSubmit();
    await Promise.resolve();

    expect(component.form.touched).toBe(true);
    expect(focus).toHaveBeenCalled();
    expect(feedbackMock.showWarning).toHaveBeenCalledWith(
      'Revise os campos destacados antes de continuar.',
      expect.objectContaining({ hasIcon: true }),
    );
  });

  it('submits the payload to the API and navigates on success', async () => {
    const feedbackMock = buildFeedbackMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock();
    const fixture = await createFixture(
      buildPageTitleMock(),
      feedbackMock,
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fillValidForm(component);
    component.onSubmit();

    expect(component.lastPayload()).toMatchObject({
      name: 'Comunitario 60L',
      description: 'Plantado com neons',
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 102.38,
      volumeUnit: 'LITER',
      setupDate: '2026-07-09T00:00:00.000Z',
      displayPreferences: expect.objectContaining({
        displayPH: true,
        displayTemperature: true,
      }),
      alertParameters: {
        displayPH: {
          minimumValue: 6.6,
          maximumValue: 7.2,
          targetValue: 7,
        },
      },
    });
    expect(aquariumApiServiceMock.createAquarium).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Comunitario 60L',
        type: 'COMMUNITY',
        waterType: 'FRESHWATER',
      }),
    );
    expect(feedbackMock.showSuccess).toHaveBeenCalledWith(
      TRANSLATIONS.pt.aquariumCreateSuccessMessage,
      expect.objectContaining({ hasIcon: true }),
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('uploads the selected photo after creating the aquarium', async () => {
    const feedbackMock = buildFeedbackMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock();
    const fixture = await createFixture(
      buildPageTitleMock(),
      feedbackMock,
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onPhotoSelected: (file: File) => void;
    };
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const file = new File(['image'], 'aquarium.jpg', { type: 'image/jpeg' });

    fillValidForm(component);
    component.onPhotoSelected(file);
    component.onSubmit();

    expect(aquariumApiServiceMock.createAquarium).toHaveBeenCalledTimes(1);
    expect(aquariumApiServiceMock.uploadAquariumPhoto).toHaveBeenCalledWith('aq-1', file);
    expect(feedbackMock.showSuccess).toHaveBeenCalledWith(
      TRANSLATIONS.pt.aquariumCreateSuccessMessage,
      expect.objectContaining({ hasIcon: true }),
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    expect(component.isSubmitting()).toBe(false);
  });

  it('submits the payload using direct volume when dimensions mode is disabled', async () => {
    const feedbackMock = buildFeedbackMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock();
    const fixture = await createFixture(
      buildPageTitleMock(),
      feedbackMock,
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture);

    component.form.setValue({
      name: 'Marinho 120L',
      aquariumType: 'REEF_TANK',
      waterType: 'SALTWATER',
      setupDate: '2026-07-09',
      usePhysicalDimensions: false,
      lengthCm: '',
      widthCm: '',
      heightCm: '',
      volume: '120',
      displayParameters: ['displayPH', 'displayTemperature'],
      alertChannels: {
        dashboard: true,
        email: true,
      },
      alertParameters: Object.fromEntries(
        ALL_DISPLAY_PARAMETER_KEYS.map((key) => [
          key,
          {
            enabled: key === 'displayTemperature',
            minimumValue: key === 'displayTemperature' ? '24' : '',
            maximumValue: key === 'displayTemperature' ? '27' : '',
            targetValue: key === 'displayTemperature' ? '25' : '',
          },
        ]),
      ),
      description: 'Recife principal',
    });
    component.onSubmit();

    expect(component.lastPayload()).toMatchObject({
      name: 'Marinho 120L',
      description: 'Recife principal',
      type: 'REEF_TANK',
      waterType: 'SALTWATER',
      volume: 120,
      volumeUnit: 'LITER',
      setupDate: '2026-07-09T00:00:00.000Z',
      displayPreferences: expect.objectContaining({
        displayPH: true,
        displayTemperature: true,
        displayGH: false,
      }),
      alertParameters: {
        displayTemperature: {
          minimumValue: 24,
          maximumValue: 27,
          targetValue: 25,
        },
      },
    });
    expect(aquariumApiServiceMock.createAquarium).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Marinho 120L',
        type: 'REEF_TANK',
        waterType: 'SALTWATER',
        volume: 120,
      }),
    );
    expect(feedbackMock.showSuccess).toHaveBeenCalled();
  });

  it('shows an error message and clears loading when the API fails', async () => {
    const feedbackMock = buildFeedbackMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock({
      createResponse: throwError(() => new Error('create failed')),
    });
    const fixture = await createFixture(
      buildPageTitleMock(),
      feedbackMock,
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture);

    fillValidForm(component);
    component.onSubmit();

    expect(feedbackMock.showError).toHaveBeenCalledWith(
      TRANSLATIONS.pt.aquariumCreateErrorMessage,
      expect.objectContaining({ hasIcon: true }),
    );
    expect(component.isSubmitting()).toBe(false);
  });

  it('shows an error message when the photo upload fails after aquarium creation', async () => {
    const feedbackMock = buildFeedbackMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock({
      uploadPhotoResponse: throwError(() => new Error('upload failed')),
    });
    const fixture = await createFixture(
      buildPageTitleMock(),
      feedbackMock,
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onPhotoSelected: (file: File) => void;
    };
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fillValidForm(component);
    component.onPhotoSelected(new File(['image'], 'aquarium.jpg', { type: 'image/jpeg' }));
    component.onSubmit();

    expect(aquariumApiServiceMock.createAquarium).toHaveBeenCalledTimes(1);
    expect(aquariumApiServiceMock.uploadAquariumPhoto).toHaveBeenCalledTimes(1);
    expect(feedbackMock.showError).toHaveBeenCalledWith(
      TRANSLATIONS.pt.aquariumCreateErrorMessage,
      expect.objectContaining({ hasIcon: true }),
    );
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('keeps the submitting state until the create request completes', async () => {
    const pendingResponse = new Subject<unknown>();
    const aquariumApiServiceMock = buildAquariumApiServiceMock({
      createResponse: pendingResponse.asObservable(),
    });
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture);

    fillValidForm(component);
    component.onSubmit();

    expect(component.isSubmitting()).toBe(true);

    pendingResponse.next({});
    pendingResponse.complete();

    expect(component.isSubmitting()).toBe(false);
  });

  it('does not submit again while the create request is already in progress', async () => {
    const pendingResponse = new Subject<unknown>();
    const aquariumApiServiceMock = buildAquariumApiServiceMock({
      createResponse: pendingResponse.asObservable(),
    });
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock(),
      aquariumApiServiceMock,
    );
    const component = componentApi(fixture);

    fillValidForm(component);
    component.onSubmit();
    component.onSubmit();

    expect(aquariumApiServiceMock.createAquarium).toHaveBeenCalledTimes(1);
  });

  it('renders the alert configuration fields', async () => {
    const fixture = await createFixture();
    const section = fixture.nativeElement.querySelector(
      '[aria-labelledby="aquarium-alert-configuration-title"]',
    ) as HTMLElement;
    const toggles = Array.from(section.querySelectorAll('aq-switch'));

    expect(toggles).toHaveLength(ALL_DISPLAY_PARAMETER_KEYS.length + 2);
    expect(section.textContent).toContain(TRANSLATIONS.pt.aquariumCreateAlertConfigurationTitle);
    expect(section.textContent).toContain(TRANSLATIONS.pt.aquariumCreateAlertChannelsTitle);
    expect(section.textContent).toContain(TRANSLATIONS.pt.aquariumCreateAlertChannelDashboardLabel);
    expect(section.textContent).toContain(TRANSLATIONS.pt.aquariumCreateAlertChannelEmailLabel);
    expect(section.textContent).toContain(TRANSLATIONS.pt.paramNamePh);
    expect(section.textContent).toContain(TRANSLATIONS.pt.paramNameTemperature);
  });

  it('updates selected alert channels when toggles change', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onAlertChannelToggle: (channel: 'dashboard' | 'email', checked: boolean) => void;
    };

    component.onAlertChannelToggle('dashboard', false);
    component.onAlertChannelToggle('email', true);

    expect(component.form.controls.alertChannels.value).toEqual({
      dashboard: false,
      email: true,
    });
  });

  it('shows alert fields only after enabling a parameter alert', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onAlertParameterToggle: (parameter: string, checked: boolean) => void;
    };

    expect(
      fixture.nativeElement.querySelectorAll(
        '[aria-labelledby="aquarium-alert-configuration-title"] aq-text-formfield',
      ).length,
    ).toBe(0);

    component.onAlertParameterToggle('displayPH', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll(
        '[aria-labelledby="aquarium-alert-configuration-title"] aq-text-formfield',
      ).length,
    ).toBe(3);
  });

  it('marks alert fields as invalid when the configured range is inconsistent', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onAlertParameterToggle: (parameter: string, checked: boolean) => void;
    };

    const phGroup = component.form.controls.alertParameters.controls.displayPH;
    component.onAlertParameterToggle('displayPH', true);
    fixture.detectChanges();

    phGroup.patchValue({
      minimumValue: '7.5',
      maximumValue: '6.5',
      targetValue: '8',
    });
    fixture.detectChanges();

    expect(phGroup.controls.maximumValue.hasError('alertMaximumRange')).toBe(true);
    expect(phGroup.controls.targetValue.hasError('alertTargetRange')).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('loads dashboard display parameter options selected by default', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      displayParameterOptions: () => { value: string; title: string }[];
    };

    expect(component.displayParameterOptions()).toHaveLength(ALL_DISPLAY_PARAMETER_KEYS.length);
    expect(component.form.controls.displayParameters.value).toEqual(DEFAULT_DISPLAY_PARAMETER_KEYS);
  });

  it('renders dashboard parameters as toggles', async () => {
    const fixture = await createFixture();

    expect(
      fixture.nativeElement.querySelectorAll(
        '[aria-labelledby="aquarium-display-parameters-title"] aq-switch',
      ).length,
    ).toBe(ALL_DISPLAY_PARAMETER_KEYS.length);
    expect(
      fixture.nativeElement.querySelector(
        '[aria-labelledby="aquarium-display-parameters-title"] aq-card-selection',
      ),
    ).toBeNull();
  });

  it('updates selected dashboard parameters when toggles change', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      onDisplayParameterToggle: (parameter: string, checked: boolean) => void;
    };

    component.onDisplayParameterToggle('displayPH', false);
    component.onDisplayParameterToggle('displayCopper', true);

    expect(component.form.controls.displayParameters.value).not.toContain('displayPH');
    expect(component.form.controls.displayParameters.value).toContain('displayCopper');
  });

  it('renders water type selector before aquarium type selector', async () => {
    const fixture = await createFixture();
    const basicInfoSection = fixture.nativeElement.querySelector(
      '[aria-labelledby="aquarium-basic-info-title"]',
    ) as HTMLElement;
    const selectors = Array.from(basicInfoSection.querySelectorAll('aq-card-selection'));

    expect(selectors).toHaveLength(2);
    expect(selectors[0].getAttribute('formcontrolname')).toBe('waterType');
    expect(selectors[1].getAttribute('formcontrolname')).toBe('aquariumType');
  });

  it('loads water type options from the API', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumWaterTypeOptions: () => { value: string; title: string }[];
      waterTypeOptionsLoading: () => boolean;
      waterTypeOptionsError: () => boolean;
    };

    expect(component.waterTypeOptionsLoading()).toBe(false);
    expect(component.waterTypeOptionsError()).toBe(false);
    expect(component.aquariumWaterTypeOptions().map((option) => option.value)).toEqual([
      'BRACKISH',
      'FRESHWATER',
      'SALTWATER',
    ]);
    expect(component.aquariumWaterTypeOptions().map((option) => option.title)).toEqual([
      TRANSLATIONS.pt.waterTypeBrackish,
      TRANSLATIONS.pt.waterTypeFreshwater,
      TRANSLATIONS.pt.waterTypeSaltwater,
    ]);
  });

  it('loads all aquarium type options from the API disabled before selecting a water type', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeOptions: () => { value: string; title: string; disabled?: boolean }[];
      aquariumTypeOptionsLoading: () => boolean;
      aquariumTypeOptionsError: () => boolean;
    };

    expect(component.aquariumTypeOptionsLoading()).toBe(false);
    expect(component.aquariumTypeOptionsError()).toBe(false);
    expect(component.aquariumTypeOptions().map((option) => option.value)).toEqual([
      'BREEDING',
      'COMMUNITY_TANK',
      'HOSPITAL',
      'REEF_TANK',
      'CRABS',
      'PALUDARIUM',
    ]);
    expect(component.aquariumTypeOptions().every((option) => option.disabled === true)).toBe(true);
  });

  it('keeps aquarium type selector enabled after loading', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeHint: () => string;
      aquariumTypeDisabled: () => boolean;
    };

    expect(component.aquariumTypeDisabled()).toBe(false);
    expect(component.aquariumTypeHint()).toBe(TRANSLATIONS.pt.aquariumCreateTypeHint);
  });

  it('disables only incompatible aquarium types after selecting freshwater', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeOptions: () => { value: string; title: string; disabled?: boolean }[];
      aquariumTypeDisabled: () => boolean;
    };

    component.form.controls.waterType.setValue('FRESHWATER');
    fixture.detectChanges();

    expect(component.aquariumTypeDisabled()).toBe(false);
    expect(component.aquariumTypeOptions()).toEqual([
      expect.objectContaining({
        value: 'BREEDING',
        title: TRANSLATIONS.pt.aquariumCreateTypeBreeding,
        disabled: false,
      }),
      expect.objectContaining({
        value: 'COMMUNITY_TANK',
        title: TRANSLATIONS.pt.aquariumCreateTypeCommunityTank,
        disabled: false,
      }),
      expect.objectContaining({
        value: 'HOSPITAL',
        title: TRANSLATIONS.pt.aquariumCreateTypeHospital,
        disabled: false,
      }),
      expect.objectContaining({
        value: 'REEF_TANK',
        title: TRANSLATIONS.pt.aquariumCreateTypeReefTank,
        disabled: true,
      }),
      expect.objectContaining({
        value: 'CRABS',
        title: TRANSLATIONS.pt.aquariumCreateTypeCrabs,
        disabled: true,
      }),
      expect.objectContaining({
        value: 'PALUDARIUM',
        title: TRANSLATIONS.pt.aquariumCreateTypePaludarium,
        disabled: false,
      }),
    ]);
  });

  it('disables only incompatible aquarium types after selecting saltwater', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeOptions: () => { value: string; disabled?: boolean }[];
    };

    component.form.controls.waterType.setValue('SALTWATER');
    fixture.detectChanges();

    expect(component.aquariumTypeOptions()).toEqual([
      expect.objectContaining({ value: 'BREEDING', disabled: false }),
      expect.objectContaining({ value: 'COMMUNITY_TANK', disabled: false }),
      expect.objectContaining({ value: 'HOSPITAL', disabled: false }),
      expect.objectContaining({ value: 'REEF_TANK', disabled: false }),
      expect.objectContaining({ value: 'CRABS', disabled: true }),
      expect.objectContaining({ value: 'PALUDARIUM', disabled: true }),
    ]);
  });

  it('disables only incompatible aquarium types after selecting brackish', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeOptions: () => { value: string; disabled?: boolean }[];
    };

    component.form.controls.waterType.setValue('BRACKISH');
    fixture.detectChanges();

    expect(component.aquariumTypeOptions()).toEqual([
      expect.objectContaining({ value: 'BREEDING', disabled: false }),
      expect.objectContaining({ value: 'COMMUNITY_TANK', disabled: true }),
      expect.objectContaining({ value: 'HOSPITAL', disabled: false }),
      expect.objectContaining({ value: 'REEF_TANK', disabled: true }),
      expect.objectContaining({ value: 'CRABS', disabled: false }),
      expect.objectContaining({ value: 'PALUDARIUM', disabled: true }),
    ]);
  });

  it('clears the selected aquarium type when the water type changes to an incompatible one', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture);

    component.form.controls.waterType.setValue('FRESHWATER');
    component.form.controls.aquariumType.setValue('PALUDARIUM');
    fixture.detectChanges();

    component.form.controls.waterType.setValue('SALTWATER');
    fixture.detectChanges();

    expect(component.form.controls.aquariumType.value).toBeNull();
  });

  it('shows a loading hint while water type options are being fetched', async () => {
    const pendingResponse = new Subject<SystemValueApiDto[]>();
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock({ waterTypesResponse: pendingResponse.asObservable() }),
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumWaterTypeHint: () => string;
      waterTypeOptionsLoading: () => boolean;
      waterTypeOptionsError: () => boolean;
    };

    expect(component.waterTypeOptionsLoading()).toBe(true);
    expect(component.waterTypeOptionsError()).toBe(false);
    expect(component.aquariumWaterTypeHint()).toBe(
      TRANSLATIONS.pt.aquariumCreateWaterTypeLoadingHint,
    );
  });

  it('shows an error hint when water type loading fails', async () => {
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock({
        waterTypesResponse: throwError(() => new Error('load failed')),
      }),
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumWaterTypeHint: () => string;
      waterTypeOptionsLoading: () => boolean;
      waterTypeOptionsError: () => boolean;
    };

    expect(component.waterTypeOptionsLoading()).toBe(false);
    expect(component.waterTypeOptionsError()).toBe(true);
    expect(component.aquariumWaterTypeHint()).toBe(
      TRANSLATIONS.pt.aquariumCreateWaterTypeLoadErrorHint,
    );
  });

  it('shows a loading hint while aquarium type options are being fetched', async () => {
    const pendingResponse = new Subject<SystemValueApiDto[]>();
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock({ aquariumTypesResponse: pendingResponse.asObservable() }),
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeHint: () => string;
      aquariumTypeOptionsLoading: () => boolean;
      aquariumTypeOptionsError: () => boolean;
    };

    expect(component.aquariumTypeOptionsLoading()).toBe(true);
    expect(component.aquariumTypeOptionsError()).toBe(false);
    expect(component.aquariumTypeHint()).toBe(TRANSLATIONS.pt.aquariumCreateTypeLoadingHint);
  });

  it('shows an error hint when aquarium type loading fails', async () => {
    const fixture = await createFixture(
      buildPageTitleMock(),
      buildFeedbackMock(),
      buildSystemValuesApiServiceMock({
        aquariumTypesResponse: throwError(() => new Error('load failed')),
      }),
    );
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      aquariumTypeHint: () => string;
      aquariumTypeOptionsLoading: () => boolean;
      aquariumTypeOptionsError: () => boolean;
    };

    expect(component.aquariumTypeOptionsLoading()).toBe(false);
    expect(component.aquariumTypeOptionsError()).toBe(true);
    expect(component.aquariumTypeHint()).toBe(TRANSLATIONS.pt.aquariumCreateTypeLoadErrorHint);
  });

  it('navigates back to home when cancelling', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    componentApi(fixture).onCancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('tracks selected and rejected photo state locally', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture) as AquariumCreateComponentTestApi & {
      selectedPhotoName: () => string | null;
      selectedPhotoFile: () => File | null;
      onPhotoSelected: (file: File) => void;
      onPhotoRejected: () => void;
    };
    const file = new File(['image'], 'reef.webp', { type: 'image/webp' });

    component.onPhotoSelected(file);
    expect(component.selectedPhotoName()).toBe('reef.webp');
    expect(component.selectedPhotoFile()).toBe(file);

    component.onPhotoRejected();
    expect(component.selectedPhotoName()).toBeNull();
    expect(component.selectedPhotoFile()).toBeNull();
  });
});
