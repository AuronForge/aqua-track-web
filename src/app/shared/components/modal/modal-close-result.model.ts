import { ModalAction } from './modal-action.model';

export interface ModalCloseResult {
  reason: 'close-button' | 'backdrop' | 'action' | 'escape' | 'programmatic';
  actionId?: string;
  action?: ModalAction;
  data?: unknown;
}
