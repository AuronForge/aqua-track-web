export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: 'default' | 'danger';
  confirmWord?: string;
  confirmWordLabel?: string;
}
