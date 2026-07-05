import { TemplateRef, Type } from '@angular/core';

import { TranslationDictionary } from '../../types/translation-dictionary.type';
import { ModalAction } from './modal-action.model';
import { ModalI18nLabels } from './modal-i18n-labels.model';
import { ModalSize } from './modal-size.type';

export interface ModalConfig {
  title?: string;
  titleKey?: keyof TranslationDictionary;
  description?: string;
  descriptionKey?: keyof TranslationDictionary;
  size?: ModalSize;
  role?: 'dialog' | 'alertdialog';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  hasBackdrop?: boolean;
  actions?: ModalAction[];
  data?: unknown;
  contentComponent?: Type<unknown>;
  contentComponentInputs?: Record<string, unknown>;
  contentTemplate?: TemplateRef<unknown>;
  contentTemplateContext?: Record<string, unknown>;
  i18nLabels?: ModalI18nLabels;
}
