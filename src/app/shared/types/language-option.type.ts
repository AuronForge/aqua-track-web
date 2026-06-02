import { LanguageCode } from './language-code.type';

export interface LanguageOption {
  readonly code: LanguageCode;
  readonly triggerLabel: string;
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
}
