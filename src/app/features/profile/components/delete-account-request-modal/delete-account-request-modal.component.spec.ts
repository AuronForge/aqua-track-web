import { ComponentFixture, TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { RequestAccountDeletionDto } from '../../../../core/users/models/request-account-deletion.dto';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { ModalRef } from '../../../../shared/modal/modal-ref';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { DeleteAccountRequestModalComponent } from './delete-account-request-modal.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => {
  const selectedLanguage = signal<LanguageCode>(lang);

  return {
    selectedLanguage,
    translation: computed(() => TRANSLATIONS[selectedLanguage()]),
    setLanguage: jest.fn(),
  };
};

describe('DeleteAccountRequestModalComponent', () => {
  let fixture: ComponentFixture<DeleteAccountRequestModalComponent>;
  let component: DeleteAccountRequestModalComponent;
  let modalRef: { close: jest.Mock };
  let feedbackMessageService: { showSuccess: jest.Mock; showError: jest.Mock };
  let submitDeleteAccountRequest: jest.Mock;

  function createFixture(lang: LanguageCode = 'en') {
    modalRef = { close: jest.fn() };
    feedbackMessageService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };
    submitDeleteAccountRequest = jest.fn().mockReturnValue(of(void 0));

    TestBed.configureTestingModule({
      imports: [DeleteAccountRequestModalComponent],
      providers: [
        { provide: ModalRef, useValue: modalRef },
        { provide: FeedbackMessageService, useValue: feedbackMessageService },
        { provide: LanguageService, useValue: buildLanguageServiceMock(lang) },
      ],
    });

    fixture = TestBed.createComponent(DeleteAccountRequestModalComponent);
    fixture.componentRef.setInput('submitDeleteAccountRequest', submitDeleteAccountRequest);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  beforeEach(() => createFixture());

  it('should submit the optional reason trimmed and close on success', () => {
    const payloads: RequestAccountDeletionDto[] = [];
    submitDeleteAccountRequest.mockImplementation((payload: RequestAccountDeletionDto) => {
      payloads.push(payload);
      return of(void 0);
    });

    component['form'].controls.reason.setValue('  I no longer use the app.  ');
    fixture.detectChanges();

    component['submit']();

    expect(payloads).toEqual([{ reason: 'I no longer use the app.' }]);
    expect(feedbackMessageService.showSuccess).toHaveBeenCalledWith(
      'Your account deletion request has been sent.',
      { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
    );
    expect(modalRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'programmatic',
        data: { source: 'delete-account-request-success' },
      }),
    );
  });

  it('should send null when the reason is empty', () => {
    const payloads: RequestAccountDeletionDto[] = [];
    submitDeleteAccountRequest.mockImplementation((payload: RequestAccountDeletionDto) => {
      payloads.push(payload);
      return of(void 0);
    });

    component['form'].controls.reason.setValue('   ');
    component['submit']();

    expect(payloads).toEqual([{ reason: null }]);
  });

  it('should not submit again while a request is already in progress', () => {
    const pendingRequest = new Subject<void>();
    submitDeleteAccountRequest.mockReturnValue(pendingRequest);

    component['form'].controls.reason.setValue('Need to close my account');
    component['submit']();
    component['submit']();

    expect(submitDeleteAccountRequest).toHaveBeenCalledTimes(1);
    pendingRequest.complete();
  });

  it('should show an error and keep the modal open when submission fails', () => {
    submitDeleteAccountRequest.mockReturnValue(throwError(() => new Error('network error')));

    component['form'].controls.reason.setValue('Need to close my account');
    component['submit']();

    expect(component['submissionError']()).toBe(
      "We couldn't send your deletion request right now. Please try again.",
    );
    expect(modalRef.close).not.toHaveBeenCalled();
  });

  it('should clear the submission error when the reason changes', () => {
    submitDeleteAccountRequest.mockReturnValue(throwError(() => new Error('network error')));

    component['submit']();
    expect(component['submissionError']()).toBeTruthy();

    component['form'].controls.reason.setValue('Updated reason');

    expect(component['submissionError']()).toBeNull();
  });

  it('should close with the close-button reason when the header close button is clicked', () => {
    const closeButton = fixture.nativeElement.querySelector(
      '.delete-account-request-modal__close-button',
    ) as HTMLButtonElement;

    closeButton.click();

    expect(modalRef.close).toHaveBeenCalledWith({ reason: 'close-button' });
  });

  it('should close as a programmatic cancel when the cancel button is clicked', () => {
    const cancelButton = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Cancel'),
    ) as HTMLButtonElement;

    cancelButton.click();

    expect(modalRef.close).toHaveBeenCalledWith({
      reason: 'programmatic',
      data: { source: 'delete-account-request-cancel' },
    });
  });
});
