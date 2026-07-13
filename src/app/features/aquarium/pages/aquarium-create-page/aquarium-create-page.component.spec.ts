import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';

import { AquariumCreatePageComponent } from './aquarium-create-page.component';
import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { CreateAquariumPayload } from '../../models/aquarium-api.dto';

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

type AquariumCreateComponentTestApi = AquariumCreatePageComponent & {
  form: FormGroup;
  lastPayload: () => CreateAquariumPayload | null;
  onSubmit: () => void;
};

async function createFixture(
  pageTitleMock = buildPageTitleMock(),
  feedbackMock = buildFeedbackMock(),
): Promise<ComponentFixture<AquariumCreatePageComponent>> {
  await TestBed.configureTestingModule({
    imports: [AquariumCreatePageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleMock },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
      { provide: FeedbackMessageService, useValue: feedbackMock },
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
    aquariumType: 'freshwater',
    setupDate: '2026-07-09',
    lengthCm: '35',
    widthCm: '45',
    heightCm: '65',
    description: 'Plantado com neons',
  });
}

describe('AquariumCreatePageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('should create and set the page title', async () => {
    const pageTitleMock = buildPageTitleMock();
    const fixture = await createFixture(pageTitleMock);

    expect(fixture.componentInstance).toBeTruthy();
    expect(pageTitleMock.set).toHaveBeenCalledWith('Adicionar Novo Aquário');
  });

  it('renders the main form sections', async () => {
    const fixture = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Informações Básicas');
    expect(text).toContain('Dimensões');
    expect(text).toContain('Detalhes Adicionais');
    expect(text).toContain('Foto do Aquário');
  });

  it('shows the calculated volume when dimensions are valid', async () => {
    const fixture = await createFixture();
    const component = componentApi(fixture);

    component.form.patchValue({ lengthCm: '35', widthCm: '45', heightCm: '65' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('102.38 litros');
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
    });
    expect(feedbackMock.showInformation).toHaveBeenCalledWith(
      'Payload gerado com sucesso. A integração com a API ainda não está habilitada.',
      expect.objectContaining({ hasIcon: true }),
    );
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
