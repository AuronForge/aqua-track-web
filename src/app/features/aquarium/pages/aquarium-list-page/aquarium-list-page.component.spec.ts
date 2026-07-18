import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumListItemModel } from '../../models/aquarium-list-item.model';
import { AquariumListPageComponent } from './aquarium-list-page.component';

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const buildPageTitleMock = () => ({ set: jest.fn() });

async function createFixture(
  pageTitleMock = buildPageTitleMock(),
): Promise<ComponentFixture<AquariumListPageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumListPageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AquariumListPageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('AquariumListPageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create and set the page title', async () => {
    const pageTitleMock = buildPageTitleMock();
    const fixture = await createFixture(pageTitleMock);

    expect(fixture.componentInstance).toBeTruthy();
    expect(pageTitleMock.set).toHaveBeenCalledWith(
      TRANSLATIONS.pt.homeMyAquariums,
      TRANSLATIONS.pt.homeMyAquariumsSubtitle,
    );
  });

  it('should render only the add action in the page body header', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(text).toContain(TRANSLATIONS.pt.aquariumListAddAction);
    expect(section.getAttribute('aria-label')).toBe(TRANSLATIONS.pt.homeMyAquariums);
  });

  it('should render six aquarium summary cards in the mock order', async () => {
    const fixture = await createFixture();
    const cards = Array.from(
      fixture.nativeElement.querySelectorAll('app-aquarium-summary-card'),
    ) as HTMLElement[];

    expect(cards).toHaveLength(6);
    expect(cards[0].textContent).toContain('Aquário Comunitário');
    expect(cards[1].textContent).toContain('Paisagismo Plantado');
    expect(cards[5].textContent).toContain('Betta em Exposição');
  });

  it('should render the total aquarium count and combined volume', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total: 6 aquários');
    expect(text).toContain('Volume combinado: 610L');
  });

  it('should link the create action to the aquarium creation route', async () => {
    const fixture = await createFixture();
    const link = fixture.nativeElement.querySelector(
      '.aquarium-list-page__add-button',
    ) as HTMLAnchorElement;

    expect(link.getAttribute('href')).toContain('/aquariums/new');
  });

  it('should use the aquarium id in the details link', async () => {
    const fixture = await createFixture();
    const firstDetailsLink = fixture.nativeElement.querySelector(
      'app-aquarium-summary-card a[aqbutton]',
    ) as HTMLAnchorElement;

    expect(firstDetailsLink.getAttribute('href')).toContain('/aquariums/aq-community');
  });

  it('should render the empty state and hide totals when there are no aquariums', async () => {
    const fixture = await createFixture();
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumItems: { set: (value: readonly AquariumListItemModel[]) => void };
    };

    component.aquariumItems.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(TRANSLATIONS.pt.aquariumListEmptyTitle);
    expect(fixture.nativeElement.textContent).toContain(
      TRANSLATIONS.pt.aquariumListEmptyDescription,
    );
    expect(fixture.nativeElement.querySelector('.aquarium-list-page__footer')).toBeNull();
  });

  it('should recompute totals when the aquarium collection changes', async () => {
    const fixture = await createFixture();
    const component = fixture.componentInstance as AquariumListPageComponent & {
      aquariumItems: { set: (value: readonly AquariumListItemModel[]) => void };
      totalAquariums: () => number;
      combinedVolumeLiters: () => number;
    };

    component.aquariumItems.set([
      {
        id: 'aq-single',
        name: 'Teste',
        typeLabelKey: 'waterTypeFreshwater',
        waterType: 'FRESHWATER',
        volumeLiters: 30,
        installedAmount: 1,
        installedUnit: 'MONTH',
        status: 'UNKNOWN',
        recentParameters: [
          { key: 'ph', value: 7 },
          { key: 'temperature', value: 25 },
          { key: 'nitrate', value: 5 },
        ],
      },
    ]);
    fixture.detectChanges();

    expect(component.totalAquariums()).toBe(1);
    expect(component.combinedVolumeLiters()).toBe(30);
    expect(fixture.nativeElement.textContent).toContain('Total: 1 aquário');
  });
});
