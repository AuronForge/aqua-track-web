import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';
import { AquariumSummaryCardComponent } from './aquarium-summary-card.component';

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const MOCK_AQUARIUM: AquariumSummaryCardViewModel = {
  id: 'aq-community',
  title: 'Aquario Comunitario',
  subtitle: 'Agua Doce',
  status: 'stable',
  statusLabel: 'Ativo',
  volumeLabel: '75L',
  installedLabel: 'Instalado',
  installedValue: '2 anos atras',
  recentParameters: [
    { key: 'ph', label: 'pH', icon: 'science', value: '7.2' },
    { key: 'temperature', label: 'Temp', icon: 'device_thermostat', value: '24 C' },
    { key: 'nitrate', label: 'NO3', icon: 'water_drop', value: '16' },
  ],
  hasRecentParameters: true,
};

async function createFixture(
  aquarium: AquariumSummaryCardViewModel = MOCK_AQUARIUM,
): Promise<ComponentFixture<AquariumSummaryCardComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumSummaryCardComponent],
    providers: [
      provideRouter([]),
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AquariumSummaryCardComponent);
  fixture.componentRef.setInput('aquarium', aquarium);
  fixture.detectChanges();
  return fixture;
}

describe('AquariumSummaryCardComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should render the aquarium name, subtitle and status', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Aquario Comunitario');
    expect(text).toContain('Agua Doce');
    expect(text).toContain('Ativo');
  });

  it('should render the volume and installed information', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Volume');
    expect(text).toContain('75L');
    expect(text).toContain('Instalado');
    expect(text).toContain('2 anos atras');
  });

  it('should render the three recent parameters with their values', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain(TRANSLATIONS.pt.aquariumListRecentParametersTitle);
    expect(text).toContain('pH');
    expect(text).toContain('Temp');
    expect(text).toContain('NO3');
    expect(text).toContain('7.2');
    expect(text).toContain('24 C');
    expect(text).toContain('16');
  });

  it('should expose an accessible label on the clickable card', async () => {
    const fixture = await createFixture();
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;

    expect(article.getAttribute('role')).toBe('link');
    expect(article.getAttribute('tabindex')).toBe('0');
    expect(article.getAttribute('aria-label')).toContain('Aquario Comunitario');
    expect(fixture.nativeElement.querySelector('a[aqbutton]')).toBeNull();
  });

  it('should navigate to details when clicking the card surface', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;

    article.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(navigateSpy).toHaveBeenCalledWith('/aquarium/aq-community');
  });

  it('should navigate to details from keyboard activation', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    article.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/aquarium/aq-community');
  });

  it('should navigate to details when pressing space on the card', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });

    article.dispatchEvent(event);

    expect(navigateSpy).toHaveBeenCalledWith('/aquarium/aq-community');
  });

  it('should ignore unrelated keyboard events', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    article.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should ignore card navigation when clicking interactive projected content', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const button = document.createElement('button');
    const component = fixture.componentInstance as AquariumSummaryCardComponent & {
      onCardClick: (event: MouseEvent) => void;
    };

    component.onCardClick({ target: button } as MouseEvent);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate when click target is not an element', async () => {
    const fixture = await createFixture();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const component = fixture.componentInstance as AquariumSummaryCardComponent & {
      onCardClick: (event: MouseEvent) => void;
    };

    component.onCardClick({ target: null } as MouseEvent);

    expect(navigateSpy).toHaveBeenCalledWith('/aquarium/aq-community');
  });

  it('should render the correct status label for other semantic states', async () => {
    const fixture = await createFixture({
      ...MOCK_AQUARIUM,
      status: 'critical',
      statusLabel: 'Arquivado',
    });

    expect(fixture.nativeElement.textContent).toContain('Arquivado');
  });

  it('should hide the recent parameters section when the API data does not include it', async () => {
    const fixture = await createFixture({
      ...MOCK_AQUARIUM,
      recentParameters: [],
      hasRecentParameters: false,
    });

    expect(fixture.nativeElement.textContent).not.toContain(
      TRANSLATIONS.pt.aquariumListRecentParametersTitle,
    );
  });
});
