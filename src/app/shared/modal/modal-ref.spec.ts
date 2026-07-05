import { Subject } from 'rxjs';

import { ModalRef } from './modal-ref';

describe('ModalRef', () => {
  it('should not throw when close is called without a dialog ref', () => {
    const modalRef = new ModalRef();

    expect(() => modalRef.close({ reason: 'programmatic' })).not.toThrow();
  });

  it('should complete immediately when afterClosed is used before attaching a dialog ref', () => {
    const modalRef = new ModalRef();
    const nextSpy = jest.fn();
    const completeSpy = jest.fn();

    modalRef.afterClosed().subscribe({
      next: nextSpy,
      complete: completeSpy,
    });

    expect(nextSpy).not.toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should proxy close and afterClosed once a dialog ref is attached', () => {
    const closed$ = new Subject<{ reason: string } | undefined>();
    const closeSpy = jest.fn();
    const modalRef = new ModalRef();

    modalRef.attachDialogRef({
      close: closeSpy,
      closed: closed$.asObservable(),
    } as never);

    const nextSpy = jest.fn();
    modalRef.afterClosed().subscribe(nextSpy);

    modalRef.close({ reason: 'programmatic' } as never);
    closed$.next({ reason: 'programmatic' });

    expect(closeSpy).toHaveBeenCalledWith({ reason: 'programmatic' });
    expect(nextSpy).toHaveBeenCalledWith({ reason: 'programmatic' });
  });
});
