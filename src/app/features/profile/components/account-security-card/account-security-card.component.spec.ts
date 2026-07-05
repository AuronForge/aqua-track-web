import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ProfileSecurity } from '../../models/profile-security.model';
import { AccountSecurityCardComponent } from './account-security-card.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const SECURITY: ProfileSecurity = {
  passwordLastChangedAt: '2026-06-02T12:00:00.000Z',
  lastLoginAt: '2026-02-28T13:30:00.000Z',
};

@Component({
  standalone: true,
  imports: [AccountSecurityCardComponent],
  template: `
    <app-account-security-card
      [security]="security()"
      [passwordChangeUnavailable]="unavailable()"
      (changePasswordRequested)="requested.set(true)"
    />
  `,
})
class TestHostComponent {
  readonly security = signal<ProfileSecurity>(SECURITY);
  readonly unavailable = signal(false);
  readonly requested = signal(false);
}

describe('AccountSecurityCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock() }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should render the password last-changed date', () => {
    expect(element.textContent).toContain('Password');
    expect(element.textContent).toContain('June 2, 2026');
  });

  it('should render the last login date and time', () => {
    expect(element.textContent).toContain('Last Login');
    expect(element.textContent).toContain('Feb 28, 2026');
  });

  it('should render the password last-changed date in Portuguese when the language is pt', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('2 de junho de 2026');
  });

  it('should emit changePasswordRequested when the button is clicked', () => {
    const button = Array.from(element.querySelectorAll('button')).find((btn) =>
      btn.textContent?.includes('Change Password'),
    ) as HTMLButtonElement;

    button.click();

    expect(hostFixture.componentInstance.requested()).toBe(true);
  });

  it('should not show an unavailable notice by default', () => {
    expect(element.querySelector('.account-security-card__notice')).toBeNull();
  });

  it('should show an unavailable notice when passwordChangeUnavailable is true', () => {
    hostFixture.componentInstance.unavailable.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('.account-security-card__notice')).not.toBeNull();
  });

  it('should render its labels in Portuguese when the language is pt', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Segurança da Conta');
    expect(fixture.nativeElement.textContent).toContain('Alterar Senha');
  });
});
