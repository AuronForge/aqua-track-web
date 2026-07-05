import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { DangerZoneCardComponent } from './danger-zone-card.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

@Component({
  standalone: true,
  imports: [DangerZoneCardComponent],
  template: `
    <app-danger-zone-card
      [unavailable]="unavailable()"
      (deleteAccountRequested)="requested.set(true)"
    />
  `,
})
class TestHostComponent {
  readonly unavailable = signal(false);
  readonly requested = signal(false);
}

describe('DangerZoneCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getDeleteButton(): HTMLButtonElement {
    return element.querySelector('.danger-zone-card__delete-btn') as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock() }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should render its labels in Portuguese when the language is pt', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Zona de Perigo');
    expect(fixture.nativeElement.textContent).toContain('Excluir Conta');
  });

  it('should render the danger copy', () => {
    expect(element.textContent).toContain('Delete Account');
    expect(element.textContent).toContain('This action cannot be undone.');
  });

  it('should render the settings card with the danger tone', () => {
    expect(element.querySelector('aq-settings-card')?.classList).toContain('settings-card--danger');
  });

  it('should emit deleteAccountRequested when the delete button is clicked, without deleting anything itself', () => {
    getDeleteButton().click();

    expect(hostFixture.componentInstance.requested()).toBe(true);
  });

  it('should not show the unavailable notice by default', () => {
    expect(element.querySelector('.danger-zone-card__notice')).toBeNull();
  });

  it('should show the unavailable notice when unavailable is true', () => {
    hostFixture.componentInstance.unavailable.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('.danger-zone-card__notice')).not.toBeNull();
  });
});
