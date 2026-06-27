import { Injectable, computed, signal } from '@angular/core';

import { LANGUAGE_STORAGE_KEY } from '../constants/language-storage-key.constant';
import { TRANSLATIONS } from '../constants/translations.constant';
import { LanguageCode } from '../types/language-code.type';
import { TranslationDictionary } from '../types/translation-dictionary.type';
import { getInitialLanguage } from '../utils/get-initial-language.util';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly selectedLanguage = signal<LanguageCode>(getInitialLanguage());
  readonly translation = computed<TranslationDictionary>(
    () => TRANSLATIONS[this.selectedLanguage()],
  );

  setLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }
}
