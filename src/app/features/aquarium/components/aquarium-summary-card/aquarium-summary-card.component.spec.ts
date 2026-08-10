import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardComponent } from './aquarium-summary-card.component';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const MOCK_AQUARIUM: AquariumSummaryCardViewModel = {
  id: 'aq-community',
  title: 'AquÃ¡rio ComunitÃ¡rio',
  subtitle: 'Ãgua Doce',
  status: 'stable',
  statusLabel: 'Ativo',
  volumeLabel: '75L',
  installedLabel: 'Instalado',
  installedValue: '2 anos atrÃ¡s',
  recentParameters: [
    { key: 'ph', label: 'pH', icon: 'science', value: '7.2' },
    { key: 'temperature', label: 'Temp', icon: 'device_thermostat', value: '24Â°C' },
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

    expect(text).toContain('AquÃ¡rio ComunitÃ¡rio');
    expect(text).toContain('Ãgua Doce');
    expect(text).toContain('Ativo');
  });

  it('should render the volume and installed information', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Volume');
    expect(text).toContain('75L');
    expect(text).toContain('Instalado');
    expect(text).toContain('2 anos atrÃ¡s');
  });

  it('should render the three recent parameters with their values', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Parâmetros recentes');
    expect(text).toContain('pH');
    expect(text).toContain('Temp');
    expect(text).toContain('NO3');
    expect(text).toContain('7.2');
    expect(text).toContain('24Â°C');
    expect(text).toContain('16');
  });

  it('should expose an accessible label and details link with the aquarium id', async () => {
    const fixture = await createFixture();
    const link = fixture.nativeElement.querySelector('a[aqbutton]') as HTMLAnchorElement;

    expect(link.getAttribute('aria-label')).toBe('Ver detalhes do aquário AquÃ¡rio ComunitÃ¡rio');
    expect(link.getAttribute('href')).toContain('/aquarium/aq-community');
  });

  it('should keep aq-info-card non-interactive when the details action is present', async () => {
    const fixture = await createFixture();
    const card = fixture.nativeElement.querySelector('aq-info-card');

    expect(card.getAttribute('role')).toBeNull();
    expect(card.getAttribute('tabindex')).toBeNull();
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

    expect(fixture.nativeElement.textContent).not.toContain('ParÃ¢metros recentes');
  });
});
