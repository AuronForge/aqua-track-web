import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { HomeDashboardFacade } from '../../facades/home-dashboard.facade';
import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { AquariumCardViewModel } from '../../models/aquarium-card-view.model';

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const buildFacadeMock = (overrides: Record<string, unknown> = {}) => ({
  loading: signal(false),
  error: signal<string | null>(null),
  hasAquariums: signal(false),
  selectedAquariumId: signal<string | null>(null),
  selectedAquariumName: signal<string | null>(null),
  aquariumCards: signal<AquariumCardViewModel[]>([]),
  waterParameters: signal([]),
  recentMeasurements: signal([]),
  recentApplications: signal([]),
  loadDashboard: jest.fn(),
  selectAquarium: jest.fn(),
  retry: jest.fn(),
  ...overrides,
});

const buildPageTitleMock = () => ({ set: jest.fn(), setToolbarContent: jest.fn() });

const MOCK_CARDS: AquariumCardViewModel[] = [
  {
    id: 'aq-1',
    title: 'Aquário Comunitário',
    subtitle: 'Água Doce • 75L',
    status: 'stable',
    statusLabel: 'Estável',
    metrics: [
      { label: 'Nível de pH', value: '7.2' },
      { label: 'Temp', value: '24°C' },
    ],
    icon: 'water_drop',
    selected: true,
  },
  {
    id: 'aq-2',
    title: 'Paisagismo Plantado',
    subtitle: 'Água Doce • 120L',
    status: 'attention',
    statusLabel: 'Atenção',
    metrics: [],
    icon: 'water_drop',
    selected: false,
  },
];

async function createFixture(
  facadeMock: ReturnType<typeof buildFacadeMock>,
): Promise<ComponentFixture<HomePageComponent>> {
  await TestBed.configureTestingModule({
    imports: [HomePageComponent],
    providers: [
      provideRouter([]),
      { provide: HomeDashboardFacade, useValue: facadeMock },
      { provide: PageTitleService, useValue: buildPageTitleMock() },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(HomePageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('HomePageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    const fixture = await createFixture(buildFacadeMock());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call loadDashboard on init', async () => {
    const facade = buildFacadeMock();
    await createFixture(facade);
    expect(facade.loadDashboard).toHaveBeenCalledTimes(1);
  });

  it('should set page title on init', async () => {
    const pageTitleMock = buildPageTitleMock();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: HomeDashboardFacade, useValue: buildFacadeMock() },
        { provide: PageTitleService, useValue: pageTitleMock },
        { provide: LanguageService, useValue: buildLanguageServiceMock('en') },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(pageTitleMock.set).toHaveBeenCalledWith(
      'Dashboard',
      expect.stringContaining('Welcome back'),
    );
  });

  it('should set page title using current language translation', async () => {
    const pageTitleMock = buildPageTitleMock();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: HomeDashboardFacade, useValue: buildFacadeMock() },
        { provide: PageTitleService, useValue: pageTitleMock },
        { provide: LanguageService, useValue: buildLanguageServiceMock('pt') },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(pageTitleMock.set).toHaveBeenCalledWith(
      'Dashboard',
      expect.stringContaining('Bem-vindo'),
    );
  });

  it('should register toolbar content on init and clear it on destroy', async () => {
    const pageTitleMock = buildPageTitleMock();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: HomeDashboardFacade, useValue: buildFacadeMock() },
        { provide: PageTitleService, useValue: pageTitleMock },
        { provide: LanguageService, useValue: buildLanguageServiceMock('pt') },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(pageTitleMock.setToolbarContent).toHaveBeenCalledWith(expect.anything());

    fixture.destroy();

    expect(pageTitleMock.setToolbarContent).toHaveBeenLastCalledWith(null);
  });

  it('should fallback to null toolbar content when the toolbar template is unavailable', async () => {
    const pageTitleMock = buildPageTitleMock();
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: HomeDashboardFacade, useValue: buildFacadeMock() },
        { provide: PageTitleService, useValue: pageTitleMock },
        { provide: LanguageService, useValue: buildLanguageServiceMock('pt') },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);

    Object.defineProperty(fixture.componentInstance, 'toolbarContentTemplate', {
      value: () => undefined,
    });

    fixture.componentInstance.ngAfterViewInit();

    expect(pageTitleMock.setToolbarContent).toHaveBeenCalledTimes(1);
    expect(pageTitleMock.setToolbarContent).toHaveBeenCalledWith(null);
  });

  it('should keep the aquarium section accessible without rendering a visible title block', async () => {
    const fixture = await createFixture(buildFacadeMock());
    const section: HTMLElement | null = fixture.nativeElement.querySelector('.home-page__section');
    const title = fixture.nativeElement.querySelector('#aquariums-title');
    const subtitle = fixture.nativeElement.querySelector('.home-page__section-subtitle');
    const addButton = fixture.nativeElement.querySelector('.home-page__add-aquarium-btn');

    expect(section?.getAttribute('aria-label')).toBe(TRANSLATIONS.pt.homeMyAquariums);
    expect(title).toBeNull();
    expect(subtitle).toBeNull();
    expect(addButton).toBeNull();
  });

  describe('loading state', () => {
    let fixture: ComponentFixture<HomePageComponent>;

    beforeEach(async () => {
      fixture = await createFixture(buildFacadeMock({ loading: signal(true) }));
    });

    it('should render skeleton cards when loading', () => {
      const skeletons = fixture.nativeElement.querySelectorAll('.home-page__skeleton-card');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should not render aquarium info-cards when loading', () => {
      const cards = fixture.nativeElement.querySelectorAll('aq-info-card');
      expect(cards.length).toBe(0);
    });
  });

  describe('error state', () => {
    let fixture: ComponentFixture<HomePageComponent>;
    let facade: ReturnType<typeof buildFacadeMock>;

    beforeEach(async () => {
      facade = buildFacadeMock({ error: signal('Erro ao carregar') });
      fixture = await createFixture(facade);
    });

    it('should render error message', () => {
      expect(fixture.nativeElement.textContent).toContain('Erro ao carregar');
    });

    it('should call retry when retry button clicked', () => {
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.home-page__retry-btn');
      btn.click();
      expect(facade.retry).toHaveBeenCalledTimes(1);
    });
  });

  describe('empty state', () => {
    it('should render empty message when no aquariums', async () => {
      const fixture = await createFixture(buildFacadeMock({ hasAquariums: signal(false) }));
      expect(fixture.nativeElement.textContent).toContain(TRANSLATIONS.pt.homeNoAquariums);
    });
  });

  describe('with aquariums', () => {
    let fixture: ComponentFixture<HomePageComponent>;
    let facade: ReturnType<typeof buildFacadeMock>;

    beforeEach(async () => {
      facade = buildFacadeMock({
        hasAquariums: signal(true),
        aquariumCards: signal(MOCK_CARDS),
        selectedAquariumId: signal('aq-1'),
      });
      fixture = await createFixture(facade);
    });

    it('should render one aq-info-card per aquarium', () => {
      const cards = fixture.nativeElement.querySelectorAll('aq-info-card');
      expect(cards.length).toBe(MOCK_CARDS.length);
    });

    it('should render "Parâmetros da Água" section', () => {
      expect(fixture.nativeElement.textContent).toContain('Parâmetros da Água');
    });

    it('should render "Medições Recentes" section', () => {
      expect(fixture.nativeElement.textContent).toContain('Medições Recentes');
    });

    it('should render "Aplicações Recentes" section', () => {
      expect(fixture.nativeElement.textContent).toContain('Aplicações Recentes');
    });

    it('should call selectAquarium when card is clicked', () => {
      const cards = fixture.nativeElement.querySelectorAll('aq-info-card');
      (cards[1] as HTMLElement).click();
      expect(facade.selectAquarium).toHaveBeenCalledWith('aq-2');
    });

    it('should call selectAquarium when onAquariumSelect is invoked directly', () => {
      fixture.componentInstance['onAquariumSelect']('aq-2');
      expect(facade.selectAquarium).toHaveBeenCalledWith('aq-2');
    });
  });

  describe('no charts in v1', () => {
    let fixture: ComponentFixture<HomePageComponent>;

    beforeEach(async () => {
      fixture = await createFixture(buildFacadeMock());
    });

    it('should not render canvas elements', () => {
      const canvases = fixture.nativeElement.querySelectorAll('canvas');
      expect(canvases.length).toBe(0);
    });

    it('should not render apx-chart or chart elements', () => {
      const charts = fixture.nativeElement.querySelectorAll(
        'apx-chart, .apexcharts-canvas, [data-chart]',
      );
      expect(charts.length).toBe(0);
    });
  });
});
