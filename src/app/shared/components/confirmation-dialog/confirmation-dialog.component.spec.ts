import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogData } from './confirmation-dialog-data.model';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let element: HTMLElement;
  let dialogRefMock: { close: jest.Mock };

  function createFixture(data: ConfirmationDialogData) {
    dialogRefMock = { close: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        { provide: DIALOG_DATA, useValue: data },
        { provide: DialogRef, useValue: dialogRefMock },
      ],
    });

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render the title and message', () => {
    createFixture({
      title: 'Delete Account',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete Account',
      cancelLabel: 'Cancel',
    });

    expect(element.textContent).toContain('Delete Account');
    expect(element.textContent).toContain('This action cannot be undone.');
  });

  it('should close with false when cancel is clicked', () => {
    createFixture({
      title: 'Delete Account',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete Account',
      cancelLabel: 'Cancel',
    });

    (element.querySelectorAll('button')[0] as HTMLButtonElement).click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when confirm is clicked and no confirm word is required', () => {
    createFixture({
      title: 'Change Password',
      message: 'Continue?',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });

    (element.querySelectorAll('button')[1] as HTMLButtonElement).click();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should disable confirm until the confirm word matches', () => {
    createFixture({
      title: 'Delete Account',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete Account',
      cancelLabel: 'Cancel',
      tone: 'danger',
      confirmWord: 'DELETE',
      confirmWordLabel: 'Type DELETE to confirm',
    });

    const confirmButton = element.querySelectorAll('button')[1] as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);

    const input = element.querySelector('.text-formfield__input') as HTMLInputElement;
    input.value = 'DELETE';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(confirmButton.disabled).toBe(false);

    confirmButton.click();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should not close when confirm() is invoked directly while disabled', () => {
    createFixture({
      title: 'Delete Account',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete Account',
      cancelLabel: 'Cancel',
      tone: 'danger',
      confirmWord: 'DELETE',
      confirmWordLabel: 'Type DELETE to confirm',
    });

    fixture.componentInstance['confirm']();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should not close when confirm is clicked with a wrong confirm word', () => {
    createFixture({
      title: 'Delete Account',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete Account',
      cancelLabel: 'Cancel',
      tone: 'danger',
      confirmWord: 'DELETE',
      confirmWordLabel: 'Type DELETE to confirm',
    });

    const input = element.querySelector('.text-formfield__input') as HTMLInputElement;
    input.value = 'wrong';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const confirmButton = element.querySelectorAll('button')[1] as HTMLButtonElement;
    confirmButton.click();

    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });
});
