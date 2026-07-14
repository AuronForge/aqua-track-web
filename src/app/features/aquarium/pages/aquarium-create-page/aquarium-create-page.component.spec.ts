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
  showInformation: jest.fn(),
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

type AquariumCreateComponentTestApi = AquariumCreatePageComponent & {
  form: FormGroup;
  lastPayload: () => CreateAquariumPayload | null;
  onSubmit: () => void;
};

async function createFixture(
  pageTitleMock = buildPageTitleMock(),
  feedbackMock = buildFeedbackMock(),
  systemValuesApiServiceMock = buildSystemValuesApiServiceMock(),
): Promise<ComponentFixture<AquariumCreatePageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumCreatePageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
      { provide: FeedbackMessageService, useValue: feedbackMock },
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

  it('generates the payload locally without calling an API', async () => {
    const feedbackMock = buildFeedbackMock();
    const fixture = await createFixture(buildPageTitleMock(), feedbackMock);
    const component = componentApi(fixture);

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
    });
    expect(feedbackMock.showInformation).toHaveBeenCalledWith(
      TRANSLATIONS.pt.aquariumCreateApiDisabledMessage,
      expect.objectContaining({ hasIcon: true }),
    );
  });

  it('generates the payload using direct volume when dimensions mode is disabled', async () => {
    const feedbackMock = buildFeedbackMock();
    const fixture = await createFixture(buildPageTitleMock(), feedbackMock);
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
    });
    expect(feedbackMock.showInformation).toHaveBeenCalled();
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
      onPhotoSelected: (file: File) => void;
      onPhotoRejected: () => void;
    };

    component.onPhotoSelected(new File(['image'], 'reef.webp', { type: 'image/webp' }));
    expect(component.selectedPhotoName()).toBe('reef.webp');

    component.onPhotoRejected();
    expect(component.selectedPhotoName()).toBeNull();
  });
});
