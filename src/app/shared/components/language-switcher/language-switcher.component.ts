import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { LANGUAGE_OPTIONS } from '../../constants/language-options.constant';
import { LanguageCode } from '../../types/language-code.type';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly label = input.required<string>();
  readonly selectedLanguage = input.required<LanguageCode>();
  readonly languageChange = output<LanguageCode>();

  readonly languages = LANGUAGE_OPTIONS;
  readonly isMenuOpen = signal(false);
  readonly selectedLanguageOption = computed(
    () => this.languages.find((lang) => lang.code === this.selectedLanguage()) ?? this.languages[0],
  );

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isMenuOpen.set(false);
    }
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen.update((isOpen) => !isOpen);
  }

  selectLanguage(code: LanguageCode, event: Event): void {
    event.stopPropagation();
    this.languageChange.emit(code);
    this.isMenuOpen.set(false);
  }
}
