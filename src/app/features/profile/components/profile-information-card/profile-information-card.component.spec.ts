import { Component, computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ProfileInformationFormValue } from '../../models/profile-information-form-value.model';
import { ProfileUser } from '../../models/profile-user.model';
import { ProfileInformationCardComponent } from './profile-information-card.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const USER: ProfileUser = {
  id: 'user-id',
  fullName: 'John Doe',
  email: 'teste@gmail.com',
  phone: '(11) 99999-0000',
  birthDate: '1990-05-12',
  avatarUrl: null,
  initials: 'JD',
  memberSince: '2024-01-15T00:00:00.000Z',
};

@Component({
  standalone: true,
  imports: [ProfileInformationCardComponent],
  template: `
    <app-profile-information-card
      [user]="user()"
      [saving]="saving()"
      [saveSuccess]="saveSuccess()"
      [error]="error()"
      [avatarUploading]="avatarUploading()"
      [avatarUploadError]="avatarUploadError()"
      (saveProfile)="saved.set($event)"
      (avatarFileSelected)="selectedFile.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly user = signal<ProfileUser>(USER);
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly error = signal<string | null>(null);
  readonly avatarUploading = signal(false);
  readonly avatarUploadError = signal(false);
  readonly saved = signal<ProfileInformationFormValue | null>(null);
  readonly selectedFile = signal<File | null>(null);
}

describe('ProfileInformationCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getNameInput(): HTMLInputElement {
    return element.querySelector('#profile-full-name') as HTMLInputElement;
  }

  function getEmailInput(): HTMLInputElement {
    return element.querySelector('input[type=email]') as HTMLInputElement;
  }

  function getPhoneInput(): HTMLInputElement {
    return element.querySelector('input[type=tel]') as HTMLInputElement;
  }

  function getSaveButton(): HTMLButtonElement {
    return element.querySelector('[slot=actions]') as HTMLButtonElement;
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

  it('should render its labels in the current language', () => {
    expect(element.textContent).toContain('Profile Information');
    expect(element.textContent).toContain('Update your personal details');
    expect(element.textContent).toContain('Change Avatar');
  });

  it('should render its labels in Portuguese when the language is pt', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Informações do Perfil');
    expect(fixture.nativeElement.textContent).toContain('Trocar Avatar');
  });

  it('should format member since using the current language locale', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: LanguageService, useValue: buildLanguageServiceMock('pt') }],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.user.set({
      ...USER,
      memberSince: '2026-06-06T00:00:00.000Z',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date('2026-06-06T00:00:00.000Z')),
    );
  });

  it('should render the raw memberSince value when it is not a valid date', () => {
    hostFixture.componentInstance.user.set({
      ...USER,
      memberSince: 'not-a-date',
    });
    hostFixture.detectChanges();

    expect(element.textContent).toContain('not-a-date');
  });

  it('should initialize the form with the user data', () => {
    const component = hostFixture.debugElement.children[0].componentInstance;

    expect(getNameInput().value).toBe('John Doe');
    expect(getEmailInput().value).toBe('teste@gmail.com');
    expect(getPhoneInput().value).toBe('(11) 99999-0000');
    expect(component.form.controls.birthDate.value).toBe('1990-05-12');
  });

  it('should disable the save button while the form is pristine', () => {
    expect(getSaveButton().disabled).toBe(true);
  });

  it('should disable the save button when the name is cleared (invalid)', () => {
    getNameInput().value = '';
    getNameInput().dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should enable the save button after a valid change and emit saveProfile on click', () => {
    getNameInput().value = 'Jane Doe';
    getNameInput().dispatchEvent(new Event('input'));
    getEmailInput().value = 'jane@example.com';
    getEmailInput().dispatchEvent(new Event('input'));
    getPhoneInput().value = '+55 11 98888-7777';
    getPhoneInput().dispatchEvent(new Event('input'));
    const component = hostFixture.debugElement.children[0].componentInstance;
    component.form.controls.birthDate.setValue('1991-06-13');
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    getSaveButton().click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.saved()).toEqual({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+55 11 98888-7777',
      birthDate: '1991-06-13',
    });
  });

  it('should disable save when the email is invalid', () => {
    getEmailInput().value = 'email-invalido';
    getEmailInput().dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should disable save when the phone contains invalid characters', () => {
    getPhoneInput().value = 'phone#1';
    getPhoneInput().dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should disable the save button while saving', () => {
    getNameInput().value = 'Jane Doe';
    getNameInput().dispatchEvent(new Event('input'));
    const component = hostFixture.debugElement.children[0].componentInstance;
    component.form.controls.birthDate.setValue('1991-06-13');
    hostFixture.componentInstance.saving.set(true);
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should show an avatar validation error and not emit avatarFileSelected for an invalid file type', () => {
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    const invalidFile = new File(['data'], 'doc.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { value: [invalidFile] });

    input.dispatchEvent(new Event('change'));
    hostFixture.detectChanges();

    expect(element.querySelector('.profile-information-card__avatar-error')?.textContent).toContain(
      'JPG, PNG or GIF',
    );
    expect(hostFixture.componentInstance.selectedFile()).toBeNull();
  });

  it('should emit avatarFileSelected for a valid file', () => {
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    const validFile = new File(['data'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [validFile] });

    input.dispatchEvent(new Event('change'));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.selectedFile()).toBe(validFile);
    expect(element.querySelector('.profile-information-card__avatar-error')).toBeNull();
  });

  it('should show an avatar validation error for a file larger than 5MB', () => {
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    const oversizedFile = new File(['data'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: 6 * 1024 * 1024 });
    Object.defineProperty(input, 'files', { value: [oversizedFile] });

    input.dispatchEvent(new Event('change'));
    hostFixture.detectChanges();

    expect(element.querySelector('.profile-information-card__avatar-error')?.textContent).toContain(
      '5MB',
    );
    expect(hostFixture.componentInstance.selectedFile()).toBeNull();
  });

  it('should trigger the hidden file input when the avatar or "Change Avatar" button is clicked', () => {
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');

    (
      element.querySelector('.profile-information-card__avatar-button') as HTMLButtonElement
    ).click();
    (
      element.querySelector('.profile-information-card__change-avatar') as HTMLButtonElement
    ).click();

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('should mark the form as pristine again once saveSuccess becomes true', () => {
    getNameInput().value = 'Jane Doe';
    getNameInput().dispatchEvent(new Event('input'));
    const component = hostFixture.debugElement.children[0].componentInstance;
    component.form.controls.birthDate.setValue('1991-06-13');
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(false);

    hostFixture.componentInstance.saveSuccess.set(true);
    hostFixture.detectChanges();

    expect(getSaveButton().disabled).toBe(true);
  });

  it('should do nothing when the file input change fires without a selected file', () => {
    const input = element.querySelector('input[type=file]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: [] });

    input.dispatchEvent(new Event('change'));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.selectedFile()).toBeNull();
    expect(element.querySelector('.profile-information-card__avatar-error')).toBeNull();
  });

  it('should show a circular avatar once a preview URL is available', () => {
    hostFixture.componentInstance.user.set({ ...USER, avatarUrl: 'https://example.com/a.png' });
    hostFixture.detectChanges();

    expect(element.querySelector('.avatar--circular')).not.toBeNull();
  });

  it('should disable avatar controls while an upload is in progress', () => {
    hostFixture.componentInstance.avatarUploading.set(true);
    hostFixture.detectChanges();

    const avatarButton = element.querySelector(
      '.profile-information-card__avatar-button',
    ) as HTMLButtonElement;
    const changeAvatarButton = element.querySelector(
      '.profile-information-card__change-avatar',
    ) as HTMLButtonElement;
    const fileInput = element.querySelector('input[type=file]') as HTMLInputElement;

    expect(avatarButton.disabled).toBe(true);
    expect(changeAvatarButton.disabled).toBe(true);
    expect(fileInput.disabled).toBe(true);
  });

  it('should show the upload error message when avatarUploadError is true', () => {
    hostFixture.componentInstance.avatarUploadError.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('.profile-information-card__avatar-error')?.textContent).toContain(
      'Could not update avatar',
    );
  });

  it('should not emit saveProfile when submit() is invoked directly while invalid', () => {
    getNameInput().value = '';
    getNameInput().dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    const component = hostFixture.debugElement.children[0].componentInstance;
    component['submit']();

    expect(hostFixture.componentInstance.saved()).toBeNull();
  });
});
