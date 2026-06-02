import { DEFAULT_LANGUAGE } from '../constants/default-language.constant';
import { LANGUAGE_STORAGE_KEY } from '../constants/language-storage-key.constant';
import { LanguageCode } from '../types/language-code.type';

export function getInitialLanguage(): LanguageCode {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return storedLanguage === 'en' || storedLanguage === 'es' || storedLanguage === 'pt'
    ? storedLanguage
    : DEFAULT_LANGUAGE;
}
