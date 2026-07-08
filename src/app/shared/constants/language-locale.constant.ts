import { LanguageCode } from '../types/language-code.type';

export const LANGUAGE_LOCALE_MAP: Record<LanguageCode, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es',
};

export const LANGUAGE_API_LOCALE_MAP: Record<LanguageCode, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

export const API_LOCALE_LANGUAGE_CODE_MAP: Record<string, LanguageCode> = {
  'pt-BR': 'pt',
  'en-US': 'en',
  es: 'es',
  'es-ES': 'es',
};
