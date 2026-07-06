import { DialogRef } from '@angular/cdk/dialog';
import { EMPTY, Observable, Subject } from 'rxjs';

import { ModalAction } from '../components/modal/modal-action.model';
import { ModalCloseResult } from '../components/modal/modal-close-result.model';

export class ModalRef {
  private readonly actionClickedSubject = new Subject<ModalAction>();
  private readonly backdropClickedSubject = new Subject<MouseEvent>();

  private dialogRef?: DialogRef<ModalCloseResult | undefined>;

  constructor(dialogRef?: DialogRef<ModalCloseResult | undefined>) {
    this.dialogRef = dialogRef;
  }

  attachDialogRef(dialogRef: DialogRef<ModalCloseResult | undefined>): void {
    this.dialogRef = dialogRef;
  }

  close(result?: ModalCloseResult): void {
    this.dialogRef?.close(result);
  }

  afterClosed(): Observable<ModalCloseResult | undefined> {
    return this.dialogRef?.closed ?? EMPTY;
  }

  afterActionClicked(): Observable<ModalAction> {
    return this.actionClickedSubject.asObservable();
  }

  afterBackdropClicked(): Observable<MouseEvent> {
    return this.backdropClickedSubject.asObservable();
  }

  emitActionClicked(action: ModalAction): void {
    this.actionClickedSubject.next(action);
  }

  emitBackdropClicked(event: MouseEvent): void {
    this.backdropClickedSubject.next(event);
  }
}
