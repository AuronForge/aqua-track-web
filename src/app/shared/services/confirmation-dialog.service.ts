import { Dialog } from '@angular/cdk/dialog';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../components/confirmation-dialog/confirmation-dialog-data.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  private readonly dialog = inject(Dialog);

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open<boolean, ConfirmationDialogData>(
      ConfirmationDialogComponent,
      {
        data,
        role: data.tone === 'danger' ? 'alertdialog' : 'dialog',
        ariaModal: true,
      },
    );

    return dialogRef.closed.pipe(map((result) => result ?? false));
  }
}
