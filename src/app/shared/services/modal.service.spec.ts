import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { ModalComponent } from '../components/modal/modal.component';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;
  let closed$: Subject<unknown>;
  let backdropClick$: Subject<MouseEvent>;
  let keydownEvents$: Subject<KeyboardEvent>;
  let closeMock: jest.Mock;
  let openSpy: jest.Mock;

  beforeEach(() => {
    closed$ = new Subject();
    backdropClick$ = new Subject();
    keydownEvents$ = new Subject();
    closeMock = jest.fn();
    openSpy = jest.fn().mockReturnValue({
      closed: closed$.asObservable(),
      backdropClick: backdropClick$.asObservable(),
      keydownEvents: keydownEvents$.asObservable(),
      close: closeMock,
    } satisfies Partial<DialogRef<unknown>>);

    TestBed.configureTestingModule({
      providers: [{ provide: Dialog, useValue: { open: openSpy } }],
    });

    service = TestBed.inject(ModalService);
  });

  it('should open the ModalComponent with normalized defaults', () => {
    service.open({
      title: 'Modal title',
    });

    expect(openSpy).toHaveBeenCalledWith(
      ModalComponent,
      expect.objectContaining({
        role: 'dialog',
        ariaModal: true,
        disableClose: true,
        hasBackdrop: true,
        panelClass: ['modal-panel', 'modal-panel--medium'],
      }),
    );
  });

  it('should close with backdrop reason when clicking outside and closing is enabled', () => {
    const modalRef = service.open({
      closeOnBackdropClick: true,
    });
    let result: unknown;
    modalRef.afterClosed().subscribe((value) => (result = value));

    backdropClick$.next(new MouseEvent('click'));
    closed$.next({ reason: 'backdrop' });

    expect(closeMock).toHaveBeenCalledWith({ reason: 'backdrop' });
    expect(result).toEqual({ reason: 'backdrop' });
  });

  it('should not close on backdrop click when closing is disabled', () => {
    const modalRef = service.open({
      closeOnBackdropClick: false,
    });
    const backdropListener = jest.fn();
    modalRef.afterBackdropClicked().subscribe(backdropListener);

    backdropClick$.next(new MouseEvent('click'));

    expect(backdropListener).toHaveBeenCalled();
    expect(closeMock).not.toHaveBeenCalled();
  });

  it('should close with escape reason when escape is enabled', () => {
    service.open({
      closeOnEscape: true,
    });

    keydownEvents$.next(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeMock).toHaveBeenCalledWith({ reason: 'escape' });
  });

  it('should not close when a non-escape key is pressed', () => {
    service.open({
      closeOnEscape: true,
    });

    keydownEvents$.next(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(closeMock).not.toHaveBeenCalled();
  });

  it('should not close on escape when escape closing is disabled', () => {
    service.open({
      closeOnEscape: false,
    });

    keydownEvents$.next(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closeMock).not.toHaveBeenCalled();
  });

  it('should omit the backdrop class when the backdrop is disabled', () => {
    service.open({
      hasBackdrop: false,
    });

    expect(openSpy).toHaveBeenCalledWith(
      ModalComponent,
      expect.objectContaining({
        hasBackdrop: false,
        backdropClass: undefined,
      }),
    );
  });
});
