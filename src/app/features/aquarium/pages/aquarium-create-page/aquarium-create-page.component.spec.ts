import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AquariumCreatePageComponent } from './aquarium-create-page.component';
import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';

const buildLanguageServiceMock = (lang: 'pt' | 'en' | 'es' = 'pt') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const buildPageTitleMock = () => ({ set: jest.fn() });

async function createFixture(
  pageTitleMock: ReturnType<typeof buildPageTitleMock>,
): Promise<ComponentFixture<AquariumCreatePageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumCreatePageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(AquariumCreatePageComponent);
  fixture.detectChanges();
  return fixture;
}

describe('AquariumCreatePageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create', async () => {
    const fixture = await createFixture(buildPageTitleMock());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set the page title', async () => {
    const pageTitleMock = buildPageTitleMock();
    await createFixture(pageTitleMock);
    expect(pageTitleMock.set).toHaveBeenCalledWith('Cadastrar Aquário');
  });

  it('should render the coming soon message', async () => {
    const fixture = await createFixture(buildPageTitleMock());
    expect(fixture.nativeElement.textContent).toContain(
      'O formulário de cadastro de aquário estará disponível em breve.',
    );
  });

  it('should render a link back to the dashboard', async () => {
    const fixture = await createFixture(buildPageTitleMock());
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a[aqButton]');
    expect(link.getAttribute('href')).toBe('/home');
  });
});
