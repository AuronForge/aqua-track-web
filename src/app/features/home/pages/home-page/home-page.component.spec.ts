import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { HomePageComponent } from './home-page.component';
import { HomeDashboardFacade } from '../../facades/home-dashboard.facade';
import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { AquariumCardViewModel } from '../../models/aquarium-card-view.model';

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

const buildPageTitleMock = () => ({ set: jest.fn() });

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
      { provide: HomeDashboardFacade, useValue: facadeMock },
      { provide: PageTitleService, useValue: buildPageTitleMock() },
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
        { provide: HomeDashboardFacade, useValue: buildFacadeMock() },
        { provide: PageTitleService, useValue: pageTitleMock },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    expect(pageTitleMock.set).toHaveBeenCalledWith(
      'Dashboard',
      expect.stringContaining('Welcome back'),
    );
  });

  it('should render "Meus Aquários" section title', async () => {
    const fixture = await createFixture(buildFacadeMock());
    expect(fixture.nativeElement.textContent).toContain('Meus Aquários');
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
      expect(fixture.nativeElement.textContent).toContain('Nenhum aquário cadastrado');
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

    it('should expose select options derived from aquarium cards', () => {
      expect(fixture.componentInstance['aquariumSelectOptions']()).toEqual(
        MOCK_CARDS.map(({ id, title, subtitle, icon }) => ({ id, title, subtitle, icon })),
      );
    });

    it('should expose the selected aquarium option', () => {
      expect(fixture.componentInstance['selectedAquariumOption']()).toEqual({
        id: MOCK_CARDS[0].id,
        title: MOCK_CARDS[0].title,
        subtitle: MOCK_CARDS[0].subtitle,
        icon: MOCK_CARDS[0].icon,
      });
    });

    it('should call selectAquarium when dropdown selection changes', () => {
      fixture.componentInstance['onAquariumDropdownChange']({
        option: { id: 'aq-2', title: 'Paisagismo Plantado' },
        previousOption: null,
      });

      expect(facade.selectAquarium).toHaveBeenCalledWith('aq-2');
    });

    it('should call selectAquarium when onAquariumSelect is invoked directly', () => {
      fixture.componentInstance['onAquariumSelect']('aq-2');
      expect(facade.selectAquarium).toHaveBeenCalledWith('aq-2');
    });
  });

  it('should return null when selected aquarium option cannot be found', async () => {
    const fixture = await createFixture(
      buildFacadeMock({
        hasAquariums: signal(true),
        aquariumCards: signal(MOCK_CARDS),
        selectedAquariumId: signal('missing-id'),
      }),
    );

    expect(fixture.componentInstance['selectedAquariumOption']()).toBeNull();
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
