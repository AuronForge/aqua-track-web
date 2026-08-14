import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumListResponseDto } from '../../models/aquarium-api.dto';
import { SystemValueApiDto } from '../../models/system-value-api.dto';
import { AquariumApiService } from '../../services/aquarium-api.service';
import { SystemValuesApiService } from '../../services/system-values-api.service';
import { AquariumListPageComponent } from './aquarium-list-page.component';

const aquariumTypesResponse: SystemValueApiDto[] = [
  {
    id: '1',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'COMMUNITY_TANK',
    description: 'AquÃ¡rios com vÃ¡rias espÃ©cies.',
    displayValue: 'Community Tank',
  },
  {
    id: '2',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'REEF_TANK',
    description: 'Corais e invertebrados.',
    displayValue: 'Reef Tank',
  },
];

const aquariumListResponse: AquariumListResponseDto[] = [
  {
    id: 'aq-community',
    ownerId: 'user-1',
    name: 'AquÃ¡rio ComunitÃ¡rio',
    description: 'Sala',
    type: 'COMMUNITY_TANK',
    waterType: 'FRESHWATER',
    volume: 75,
    volumeUnit: 'LITER',
    setupDate: '2024-01-10T00:00:00.000Z',
    primaryPhotoUrl: null,
    photosCount: 0,
    displayPreferences: {
      displayPH: true,
      displayGH: true,
      displayKH: true,
      displayNitrate: true,
      displayNitrite: true,
      displayAmmonia: true,
      displayTemperature: true,
      displayTDS: true,
      displayCopper: false,
      displayPhosphate: false,
      displayIron: false,
      displayCO2: true,
      displayO2: true,
      displayCalcium: false,
      displaySilicates: false,
      displayDensitySalinity: false,
      displayMagnesium: false,
      displayIodine: false,
      displayMolybdenum: false,
      displayStrontium: false,
      displayPotassium: true,
    },
    alertParameters: {},
    status: 'ACTIVE',
    createdAt: '2026-07-10T12:00:00.000Z',
    updatedAt: '2026-07-20T12:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'aq-reef',
    ownerId: 'user-1',
    name: 'AquÃ¡rio de Recife',
    description: 'EscritÃ³rio',
    type: 'REEF_TANK',
    waterType: 'SALTWATER',
    volume: 200,
    volumeUnit: 'LITER',
    setupDate: '2025-07-01T00:00:00.000Z',
    primaryPhotoUrl: null,
    photosCount: 0,
    displayPreferences: {
      displayPH: true,
      displayGH: true,
      displayKH: true,
      displayNitrate: true,
      displayNitrite: true,
      displayAmmonia: true,
      displayTemperature: true,
      displayTDS: true,
      displayCopper: false,
      displayPhosphate: false,
      displayIron: false,
      displayCO2: true,
      displayO2: true,
      displayCalcium: false,
      displaySilicates: false,
      displayDensitySalinity: false,
      displayMagnesium: false,
      displayIodine: false,
      displayMolybdenum: false,
      displayStrontium: false,
      displayPotassium: true,
    },
    alertParameters: {},
    status: 'INACTIVE',
    createdAt: '2026-07-10T12:00:00.000Z',
    updatedAt: '2026-07-20T12:00:00.000Z',
    deletedAt: null,
  },
];

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const buildPageTitleMock = () => ({
  set: jest.fn(),
  setToolbarContent: jest.fn(),
});

const buildSystemValuesApiServiceMock = (
  aquariumTypes$ = of(aquariumTypesResponse),
): Pick<SystemValuesApiService, 'listAquariumTypes'> => ({
  listAquariumTypes: jest.fn(() => aquariumTypes$),
});

const buildAquariumApiServiceMock = (
  aquariums$ = of(aquariumListResponse),
): Pick<AquariumApiService, 'listAquariums'> => ({
  listAquariums: jest.fn(() => aquariums$),
});

async function createFixture({
  pageTitleMock = buildPageTitleMock(),
  systemValuesApiServiceMock = buildSystemValuesApiServiceMock(),
  aquariumApiServiceMock = buildAquariumApiServiceMock(),
}: {
  pageTitleMock?: ReturnType<typeof buildPageTitleMock>;
  systemValuesApiServiceMock?: Pick<SystemValuesApiService, 'listAquariumTypes'>;
  aquariumApiServiceMock?: Pick<AquariumApiService, 'listAquariums'>;
} = {}): Promise<ComponentFixture<AquariumListPageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumListPageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
      { provide: SystemValuesApiService, useValue: systemValuesApiServiceMock },
      { provide: AquariumApiService, useValue: aquariumApiServiceMock },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AquariumListPageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('AquariumListPageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create, set the page title, and load aquarium types from the API service', async () => {
    const pageTitleMock = buildPageTitleMock();
    const systemValuesApiServiceMock = buildSystemValuesApiServiceMock();
    const aquariumApiServiceMock = buildAquariumApiServiceMock();
    const fixture = await createFixture({
      pageTitleMock,
      systemValuesApiServiceMock,
      aquariumApiServiceMock,
    });

    expect(fixture.componentInstance).toBeTruthy();
    expect(pageTitleMock.set).toHaveBeenCalledWith(
      TRANSLATIONS.pt.homeMyAquariums,
      TRANSLATIONS.pt.homeMyAquariumsSubtitle,
    );
    expect(pageTitleMock.setToolbarContent).toHaveBeenCalledWith(expect.anything());
    expect(systemValuesApiServiceMock.listAquariumTypes).toHaveBeenCalledWith({
      forceRefresh: false,
    });
    expect(aquariumApiServiceMock.listAquariums).toHaveBeenCalledWith({
      name: undefined,
      type: null,
    });
  });

  it('should register toolbar content and keep the page landmark label', async () => {
    const pageTitleMock = buildPageTitleMock();
    const fixture = await createFixture({ pageTitleMock });
    const text = fixture.nativeElement.textContent;
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(section.getAttribute('aria-label')).toBe(TRANSLATIONS.pt.homeMyAquariums);
    expect(text).toContain('Aquário Comunitário');
    expect(pageTitleMock.setToolbarContent).toHaveBeenCalledWith(expect.anything());
  });

  it('should clear the toolbar content when the page is destroyed', async () => {
    const pageTitleMock = buildPageTitleMock();
    const fixture = await createFixture({ pageTitleMock });

    fixture.destroy();

    expect(pageTitleMock.setToolbarContent).toHaveBeenLastCalledWith(null);
  });

  it('should render the filters in the main content before the listing', async () => {
    const fixture = await createFixture();
    const filters = fixture.nativeElement.querySelector('.aquarium-list-page__filters');
    const cardsGrid = fixture.nativeElement.querySelector('.aquarium-list-page__grid');

    expect(filters).toBeTruthy();
    expect(fixture.nativeElement.querySelector('aq-search-formfield')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('aq-select-formfield')).toBeTruthy();
    expect(filters.compareDocumentPosition(cardsGrid) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(
      0,
    );
  });

  it('should render aquarium summary cards from the API response', async () => {
    const fixture = await createFixture();
    const cards = Array.from(
      fixture.nativeElement.querySelectorAll('app-aquarium-summary-card'),
    ) as HTMLElement[];

    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toContain('Aquário Comunitário');
    expect(cards[1].textContent).toContain('Aquário de Recife');
    expect(fixture.nativeElement.textContent).toContain('Community Tank');
    expect(fixture.nativeElement.textContent).toContain('Reef Tank');
  });

  it('should render skeleton cards while loading aquariums', async () => {
    const pendingResponse = new Subject<AquariumListResponseDto[]>();
    const fixture = await createFixture({
      aquariumApiServiceMock: buildAquariumApiServiceMock(pendingResponse.asObservable()),
    });
    const loadingGrid = fixture.nativeElement.querySelector(
      '.aquarium-list-page__grid[aria-busy="true"]',
    ) as HTMLElement;
    const skeletons = fixture.nativeElement.querySelectorAll('.aquarium-list-page__skeleton-card');

    expect(loadingGrid).toBeTruthy();
    expect(loadingGrid.getAttribute('aria-label')).toBe(TRANSLATIONS.pt.homeLoadingAquariums);
    expect(skeletons).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('app-aquarium-summary-card')).toBeNull();
    expect(fixture.nativeElement.querySelector('.aquarium-list-page__empty-state')).toBeNull();
  });

  it('should render the total aquarium count and combined volume', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total: 2 aquários');
    expect(text).toContain('Volume combinado: 275L');
  });

  it('should request filtered aquariums by name and type when the form changes', async () => {
    const aquariumApiServiceMock = buildAquariumApiServiceMock();
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    component.filtersForm.controls.search.setValue('recife');
    component.filtersForm.controls.aquariumType.setValue('REEF_TANK');
    fixture.detectChanges();

    expect(aquariumApiServiceMock.listAquariums).toHaveBeenLastCalledWith({
      name: 'recife',
      type: 'REEF_TANK',
    });
  });

  it('should disable the aquarium type filter and show the loading hint while loading the catalog', async () => {
    const pendingResponse = new Subject<SystemValueApiDto[]>();
    const fixture = await createFixture({
      systemValuesApiServiceMock: buildSystemValuesApiServiceMock(pendingResponse.asObservable()),
    });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumTypeOptionsLoading: () => boolean;
      aquariumTypeHint: () => string;
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    expect(component.aquariumTypeOptionsLoading()).toBe(true);
    expect(component.aquariumTypeHint()).toBe(TRANSLATIONS.pt.aquariumListTypeLoadingHint);
    expect(component.filtersForm.controls.aquariumType.disabled).toBe(true);
  });

  it('should re-enable the aquarium type filter after the catalog finishes loading', async () => {
    const pendingResponse = new Subject<SystemValueApiDto[]>();
    const fixture = await createFixture({
      systemValuesApiServiceMock: buildSystemValuesApiServiceMock(pendingResponse.asObservable()),
    });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    expect(component.filtersForm.controls.aquariumType.disabled).toBe(true);

    pendingResponse.next(aquariumTypesResponse);
    pendingResponse.complete();
    fixture.detectChanges();

    expect(component.filtersForm.controls.aquariumType.disabled).toBe(false);
  });

  it('should clear the aquarium type hint after the catalog loads successfully', async () => {
    const fixture = await createFixture();
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumTypeHint: () => string;
    };

    expect(component.aquariumTypeHint()).toBe('');
  });

  it('should keep the type filter usable when loading the catalog fails and retry successfully', async () => {
    const systemValuesApiServiceMock = {
      listAquariumTypes: jest
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('boom')))
        .mockReturnValueOnce(of(aquariumTypesResponse)),
    } satisfies Pick<SystemValuesApiService, 'listAquariumTypes'>;
    const fixture = await createFixture({ systemValuesApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      retryAquariumTypes: () => void;
      aquariumTypeOptionsError: () => boolean;
    };

    fixture.detectChanges();

    expect(component.aquariumTypeOptionsError()).toBe(true);

    component.retryAquariumTypes();
    fixture.detectChanges();

    expect(systemValuesApiServiceMock.listAquariumTypes).toHaveBeenLastCalledWith({
      forceRefresh: true,
    });
    expect(component.aquariumTypeOptionsError()).toBe(false);
  });

  it('should expose the error hint when loading aquarium types fails', async () => {
    const fixture = await createFixture({
      systemValuesApiServiceMock: buildSystemValuesApiServiceMock(
        throwError(() => new Error('boom')),
      ),
    });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumTypeHint: () => string;
    };

    fixture.detectChanges();

    expect(component.aquariumTypeHint()).toBe(TRANSLATIONS.pt.aquariumListTypeLoadErrorHint);
  });

  it('should keep only the all-types option when the API returns an empty catalog', async () => {
    const fixture = await createFixture({
      systemValuesApiServiceMock: buildSystemValuesApiServiceMock(of([])),
    });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumTypeOptions: () => { id: string | null; title: string }[];
    };

    expect(component.aquariumTypeOptions()).toEqual([
      {
        id: null,
        title: TRANSLATIONS.pt.homeAquariumFiltersTypePlaceholder,
      },
    ]);
  });

  it('should clear a selected type when it no longer exists in the catalog', async () => {
    const fixture = await createFixture({
      systemValuesApiServiceMock: buildSystemValuesApiServiceMock(of([aquariumTypesResponse[0]])),
    });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    component.filtersForm.controls.aquariumType.setValue('LEGACY_TYPE');
    fixture.detectChanges();

    expect(component.filtersForm.controls.aquariumType.getRawValue()).toBeNull();
  });

  it('should render the API load error state and retry the request', async () => {
    const aquariumApiServiceMock = {
      listAquariums: jest
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('boom')))
        .mockReturnValueOnce(of(aquariumListResponse)),
    } satisfies Pick<AquariumApiService, 'listAquariums'>;
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      retryAquariums: () => void;
      aquariumsError: () => boolean;
    };

    fixture.detectChanges();

    expect(component.aquariumsError()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(TRANSLATIONS.pt.aquariumListLoadErrorTitle);

    component.retryAquariums();
    fixture.detectChanges();

    expect(aquariumApiServiceMock.listAquariums).toHaveBeenCalledTimes(2);
    expect(component.aquariumsError()).toBe(false);
  });

  it('should set the error state when retryAquariums fails', async () => {
    const aquariumApiServiceMock = {
      listAquariums: jest
        .fn()
        .mockReturnValueOnce(of(aquariumListResponse))
        .mockReturnValueOnce(throwError(() => new Error('retry failed'))),
    } satisfies Pick<AquariumApiService, 'listAquariums'>;
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      retryAquariums: () => void;
      aquariumsError: () => boolean;
      aquariumsLoading: () => boolean;
    };

    component.retryAquariums();
    fixture.detectChanges();

    expect(component.aquariumsError()).toBe(true);
    expect(component.aquariumsLoading()).toBe(false);
  });

  it('should render the empty state for active filters when the API returns no results', async () => {
    const aquariumApiServiceMock = buildAquariumApiServiceMock(of([]));
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    component.filtersForm.controls.search.setValue('inexistente');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      TRANSLATIONS.pt.homeAquariumFiltersEmptyTitle,
    );
    expect(fixture.nativeElement.textContent).toContain(
      TRANSLATIONS.pt.homeAquariumFiltersEmptyDesc,
    );
    expect(fixture.nativeElement.querySelector('.aquarium-list-page__footer')).toBeNull();
  });

  it('should treat aquarium type selection alone as an active filter', async () => {
    const aquariumApiServiceMock = buildAquariumApiServiceMock(of([]));
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    component.filtersForm.controls.aquariumType.setValue('REEF_TANK');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      TRANSLATIONS.pt.homeAquariumFiltersEmptyTitle,
    );
    expect(aquariumApiServiceMock.listAquariums).toHaveBeenLastCalledWith({
      name: undefined,
      type: 'REEF_TANK',
    });
  });

  it('should keep the registration empty state when the search contains only whitespace', async () => {
    const aquariumApiServiceMock = buildAquariumApiServiceMock(of([]));
    const fixture = await createFixture({ aquariumApiServiceMock });
    const component = fixture.componentInstance as AquariumListPageComponent & {
      filtersForm: AquariumListPageComponent['filtersForm'];
    };

    component.filtersForm.controls.search.setValue('   ');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(TRANSLATIONS.pt.aquariumListEmptyTitle);
    expect(aquariumApiServiceMock.listAquariums).toHaveBeenLastCalledWith({
      name: undefined,
      type: null,
    });
  });

  it('should render the registration empty state when the user has no aquariums yet', async () => {
    const fixture = await createFixture({
      aquariumApiServiceMock: buildAquariumApiServiceMock(of([])),
    });

    expect(fixture.nativeElement.textContent).toContain(TRANSLATIONS.pt.aquariumListEmptyTitle);
    expect(fixture.nativeElement.textContent).toContain(
      TRANSLATIONS.pt.aquariumListEmptyDescription,
    );
  });

  it('should render the singular total label when there is exactly one aquarium', async () => {
    const fixture = await createFixture({
      aquariumApiServiceMock: buildAquariumApiServiceMock(of([aquariumListResponse[0]])),
    });

    expect(fixture.nativeElement.textContent).toContain('Total: 1 aquário');
    expect(fixture.nativeElement.textContent).toContain('Volume combinado: 75L');
  });

  it('should render aquarium cards as clickable links without the details button', async () => {
    const fixture = await createFixture();
    const firstCard = fixture.nativeElement.querySelector(
      'app-aquarium-summary-card article',
    ) as HTMLElement;

    expect(firstCard.getAttribute('role')).toBe('link');
    expect(firstCard.getAttribute('data-aquarium-id')).toBe('aq-community');
    expect(fixture.nativeElement.textContent).not.toContain(
      TRANSLATIONS.pt.aquariumListDetailsAction,
    );
  });
});
