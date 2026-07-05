import { TestBed } from '@angular/core/testing';

import { LANGUAGE_STORAGE_KEY } from '../constants/language-storage-key.constant';
import { TRANSLATIONS } from '../constants/translations.constant';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  it('should expose the translation dictionary for the selected language', () => {
    service.setLanguage('es');

    expect(service.translation()).toBe(TRANSLATIONS.es);
  });

  it('should update the selected language and persist it to localStorage', () => {
    service.setLanguage('pt');

    expect(service.selectedLanguage()).toBe('pt');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pt');
  });
});
