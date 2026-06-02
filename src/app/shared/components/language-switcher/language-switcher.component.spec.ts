import { Component, WritableSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageCode } from '../../types/language-code.type';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  standalone: true,
  imports: [LanguageSwitcherComponent],
  template: `
    <app-language-switcher
      label="Select language"
      [selectedLanguage]="selectedLanguage()"
      (languageChange)="onLanguageChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly selectedLanguage = signal<LanguageCode>('pt');
  lastEmittedLanguage: LanguageCode | null = null;

  onLanguageChange(lang: LanguageCode): void {
    this.selectedLanguage.set(lang);
    this.lastEmittedLanguage = lang;
  }
}

describe('LanguageSwitcherComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getSwitcher(): LanguageSwitcherComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should create', () => {
    expect(getSwitcher()).toBeTruthy();
  });

  it('should display the trigger label for the selected language', () => {
    expect(element.querySelector('.language-switcher__trigger-text')?.textContent?.trim()).toBe(
      'BR',
    );
  });

  it('should open the menu when the trigger is clicked', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu')).toBeTruthy();
  });

  it('should close the menu when the trigger is clicked again', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    trigger.click();
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should emit languageChange when an option is clicked', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click(); // English
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastEmittedLanguage).toBe('en');
  });

  it('should update the trigger label after a language is selected', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click(); // English
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__trigger-text')?.textContent?.trim()).toBe(
      'EN',
    );
  });

  it('should close the menu after selecting a language', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click();
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should close the menu when clicking outside the component', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    getSwitcher().onDocumentClick(new MouseEvent('click'));
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should not close the menu when clicking inside the component', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const insideClick = new MouseEvent('click');
    Object.defineProperty(insideClick, 'target', { value: trigger });
    getSwitcher().onDocumentClick(insideClick);
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu')).toBeTruthy();
  });

  it('should mark the active language option', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const activeOptions = element.querySelectorAll('.language-switcher__option--active');
    expect(activeOptions.length).toBe(1);
    expect(activeOptions[0].textContent).toContain('Português');
  });

  it('should have the menu closed on initial render', () => {
    expect(getSwitcher().isMenuOpen()).toBe(false);
    expect(element.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should add the --open modifier class to the container when the menu is open', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher--open')).toBeTruthy();
  });

  it('should set aria-expanded to true on the trigger when the menu is open', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set aria-expanded to false on the trigger when the menu is closed', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();
    trigger.click();
    hostFixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should render the label as the menu title', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__menu-title')?.textContent?.trim()).toBe(
      'Select language',
    );
  });

  it('should render all three language options in the menu', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll('.language-switcher__option');
    expect(options.length).toBe(3);
  });

  it('should emit languageChange and close menu when the Spanish option is selected', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[2].click(); // Spanish
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastEmittedLanguage).toBe('es');
    expect(element.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should render the check mark only for the active language option', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const checks = element.querySelectorAll('.language-switcher__option-check');
    expect(checks.length).toBe(1);
  });

  it('should fall back to the first language option when selectedLanguage does not match any option', () => {
    (hostFixture.componentInstance.selectedLanguage as WritableSignal<string>).set('fr');
    hostFixture.detectChanges();

    expect(element.querySelector('.language-switcher__trigger-text')?.textContent?.trim()).toBe(
      'BR',
    );
  });

  it('should stop propagation when the trigger is clicked', () => {
    const event = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    getSwitcher().toggleMenu(event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should stop propagation when a language option is selected', () => {
    const event = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    getSwitcher().selectLanguage('en', event);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
