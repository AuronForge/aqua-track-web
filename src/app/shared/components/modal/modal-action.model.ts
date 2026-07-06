import { ButtonColor } from '../button/button-color.type';
import { ButtonVariant } from '../button/button-variant.type';
import { TranslationDictionary } from '../../types/translation-dictionary.type';
import { ModalIconPosition } from './modal-icon-position.type';

export interface ModalAction {
  id: string;
  label?: string;
  labelKey?: keyof TranslationDictionary;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
  closeOnClick?: boolean;
  iconName?: string;
  iconPosition?: ModalIconPosition;
}
