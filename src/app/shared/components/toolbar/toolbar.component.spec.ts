import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarColor } from '../../ui/avatar/avatar-color.type';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
import { DropdownMenuItem } from '../../ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../ui/dropdown-menu/dropdown-menu.component';
import { LanguageCode } from '../../types/language-code.type';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ToolbarComponent } from './toolbar.component';

const STUB_MENU_ITEMS: DropdownMenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: 'person' },
  { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
];

@Component({
  standalone: true,
  imports: [ToolbarComponent],
  template: `
    <app-toolbar
      [pageTitle]="pageTitle()"
      [pageSubtitle]="pageSubtitle()"
      [userName]="userName()"
      [userEmail]="userEmail()"
      [userInitials]="userInitials()"
      [userAvatarUrl]="userAvatarUrl()"
      [userAvatarColor]="userAvatarColor()"
      [selectedLanguage]="selectedLanguage()"
      [userMenuItems]="userMenuItems()"
      (languageChange)="onLanguageChange($event)"
      (userMenuItemClick)="onUserMenuItemClick($event)"
    />
  `,
})
class TestHostComponent {
  readonly pageTitle = signal<string>('Dashboard');
  readonly pageSubtitle = signal<string>('Welcome back!');
  readonly userName = signal<string>('Admin AquaTrack');
  readonly userEmail = signal<string>('admin@aquatrack.com');
  readonly userInitials = signal<string>('AA');
  readonly userAvatarUrl = signal<string | null>(null);
  readonly userAvatarColor = signal<AvatarColor>('primary');
  readonly selectedLanguage = signal<LanguageCode>('pt');
  readonly userMenuItems = signal<DropdownMenuItem[]>(STUB_MENU_ITEMS);

  lastLanguage: LanguageCode | null = null;
  lastMenuItem: DropdownMenuItem | null = null;

  onLanguageChange(code: LanguageCode): void {
    this.lastLanguage = code;
  }

  onUserMenuItemClick(item: DropdownMenuItem): void {
    this.lastMenuItem = item;
  }
}

describe('ToolbarComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getComponent(): ToolbarComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getLangSwitcher(): LanguageSwitcherComponent {
    return hostFixture.debugElement.query((de) => de.name === 'app-language-switcher')
      .componentInstance as LanguageSwitcherComponent;
  }

  function getDropdownMenu(): DropdownMenuComponent {
    return hostFixture.debugElement.query((de) => de.name === 'app-dropdown-menu')
      .componentInstance as DropdownMenuComponent;
  }

  function getTriggerAvatar(): AvatarComponent {
    return hostFixture.debugElement.query((de) => de.name === 'app-avatar')
      .componentInstance as AvatarComponent;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  // ── Brand ─────────────────────────────────────────────────────────────────

  it('should render the brand logo container', () => {
    expect(element.querySelector('.toolbar__logo')).toBeTruthy();
  });

  it('should render the brand logo SVG', () => {
    expect(element.querySelector('.toolbar__logo-icon')).toBeTruthy();
  });

  it('should render the brand name as AquaTrack', () => {
    const brandName = element.querySelector('.toolbar__brand-name');
    expect(brandName?.textContent?.trim()).toBe('AquaTrack');
  });

  // ── Page info ─────────────────────────────────────────────────────────────

  it('should render the page title', () => {
    const title = element.querySelector('.toolbar__page-title');
    expect(title?.textContent?.trim()).toBe('Dashboard');
  });

  it('should render the page subtitle when provided', () => {
    const subtitle = element.querySelector('.toolbar__page-subtitle');
    expect(subtitle?.textContent?.trim()).toBe('Welcome back!');
  });

  it('should not render the page subtitle when empty', () => {
    hostFixture.componentInstance.pageSubtitle.set('');
    hostFixture.detectChanges();

    expect(element.querySelector('.toolbar__page-subtitle')).toBeNull();
  });

  it('should update the page title when the input changes', () => {
    hostFixture.componentInstance.pageTitle.set('Aquariums');
    hostFixture.detectChanges();

    const title = element.querySelector('.toolbar__page-title');
    expect(title?.textContent?.trim()).toBe('Aquariums');
  });

  it('should update the page subtitle when the input changes', () => {
    hostFixture.componentInstance.pageSubtitle.set('Manage your tanks');
    hostFixture.detectChanges();

    const subtitle = element.querySelector('.toolbar__page-subtitle');
    expect(subtitle?.textContent?.trim()).toBe('Manage your tanks');
  });

  // ── User info ─────────────────────────────────────────────────────────────

  it('should render the user name in the dropdown trigger', () => {
    const userName = element.querySelector('.toolbar__user-name');
    expect(userName?.textContent?.trim()).toBe('Admin AquaTrack');
  });

  it('should render the user email in the dropdown trigger', () => {
    const userEmail = element.querySelector('.toolbar__user-email');
    expect(userEmail?.textContent?.trim()).toBe('admin@aquatrack.com');
  });

  it('should update the user name when the input changes', () => {
    hostFixture.componentInstance.userName.set('João Silva');
    hostFixture.detectChanges();

    const userName = element.querySelector('.toolbar__user-name');
    expect(userName?.textContent?.trim()).toBe('João Silva');
  });

  it('should update the user email when the input changes', () => {
    hostFixture.componentInstance.userEmail.set('joao@example.com');
    hostFixture.detectChanges();

    const userEmail = element.querySelector('.toolbar__user-email');
    expect(userEmail?.textContent?.trim()).toBe('joao@example.com');
  });

  it('should render initials avatars when there is no avatar url', () => {
    const triggerAvatar = getTriggerAvatar();

    expect(triggerAvatar.variant()).toBe('initials');
  });

  it('should render circular avatars when an avatar url is provided', () => {
    hostFixture.componentInstance.userAvatarUrl.set('https://cdn.example.com/avatar.png');
    hostFixture.detectChanges();

    const triggerAvatar = getTriggerAvatar();

    expect(triggerAvatar.variant()).toBe('circular');
    expect(triggerAvatar.src()).toBe('https://cdn.example.com/avatar.png');
  });

  // ── Actions section ───────────────────────────────────────────────────────

  it('should render the actions section', () => {
    expect(element.querySelector('.toolbar__actions')).toBeTruthy();
  });

  // ── Language switcher ─────────────────────────────────────────────────────

  it('should render the language switcher', () => {
    expect(element.querySelector('app-language-switcher')).toBeTruthy();
  });

  it('should forward languageChange event from language switcher to parent', () => {
    const trigger = element.querySelector('.language-switcher__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const options = element.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click(); // English
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastLanguage).toBe('en');
  });

  it('should pass selectedLanguage to language switcher', () => {
    hostFixture.componentInstance.selectedLanguage.set('en');
    hostFixture.detectChanges();

    expect(getLangSwitcher().selectedLanguage()).toBe('en');
  });

  // ── User dropdown ─────────────────────────────────────────────────────────

  it('should render the user dropdown menu', () => {
    expect(element.querySelector('app-dropdown-menu')).toBeTruthy();
  });

  it('should pass userMenuItems to the dropdown menu', () => {
    expect(getDropdownMenu().items()).toEqual(STUB_MENU_ITEMS);
  });

  it('should forward userMenuItemClick event from dropdown to parent', () => {
    const trigger = element.querySelector('.dropdown-menu__trigger') as HTMLButtonElement;
    trigger.click();
    hostFixture.detectChanges();

    const items = element.querySelectorAll('.dropdown-menu__item') as NodeListOf<HTMLButtonElement>;
    items[0].click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastMenuItem).toEqual(STUB_MENU_ITEMS[0]);
  });

  it('should use bottom-right placement for the user dropdown', () => {
    expect(getDropdownMenu().placement()).toBe('bottom-right');
  });

  // ── Semantic structure ────────────────────────────────────────────────────

  it('should render a header element with role banner', () => {
    const header = element.querySelector('header.toolbar');
    expect(header).toBeTruthy();
    expect(header?.getAttribute('role')).toBe('banner');
  });

  it('should render the page title as an h1', () => {
    expect(element.querySelector('h1.toolbar__page-title')).toBeTruthy();
  });
});
