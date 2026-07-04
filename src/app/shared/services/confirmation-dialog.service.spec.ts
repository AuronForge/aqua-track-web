import { Dialog } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;
  let closed$: Subject<boolean | undefined>;
  let openSpy: jest.Mock;

  beforeEach(() => {
    closed$ = new Subject();
    openSpy = jest.fn().mockReturnValue({ closed: closed$.asObservable() });

    TestBed.configureTestingModule({
      providers: [{ provide: Dialog, useValue: { open: openSpy } }],
    });

    service = TestBed.inject(ConfirmationDialogService);
  });

  it('should open the ConfirmationDialogComponent with the given data', () => {
    service
      .confirm({
        title: 'Delete Account',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete Account',
        cancelLabel: 'Cancel',
      })
      .subscribe();

    expect(openSpy).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      expect.objectContaining({
        data: expect.objectContaining({ title: 'Delete Account' }),
      }),
    );
  });

  it('should request the alertdialog role for danger tone', () => {
    service
      .confirm({
        title: 'Delete Account',
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete Account',
        cancelLabel: 'Cancel',
        tone: 'danger',
      })
      .subscribe();

    expect(openSpy).toHaveBeenCalledWith(
      ConfirmationDialogComponent,
      expect.objectContaining({ role: 'alertdialog' }),
    );
  });

  it('should emit true when the dialog closes with true', () => {
    let result: boolean | undefined;
    service
      .confirm({ title: 't', message: 'm', confirmLabel: 'c', cancelLabel: 'x' })
      .subscribe((value) => (result = value));

    closed$.next(true);

    expect(result).toBe(true);
  });

  it('should emit false when the dialog closes with undefined (e.g. backdrop click)', () => {
    let result: boolean | undefined;
    service
      .confirm({ title: 't', message: 'm', confirmLabel: 'c', cancelLabel: 'x' })
      .subscribe((value) => (result = value));

    closed$.next(undefined);

    expect(result).toBe(false);
  });
});
