import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavMenuItem } from './nav-menu-item.model';
import { NavMenuComponent } from './nav-menu.component';

const MOCK_ITEMS: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
  { id: 'aquariums', label: 'Aquários', icon: 'waves', route: '/aquariums' },
  { id: 'admin', label: 'Admin', icon: 'admin_panel_settings', route: '/admin', roles: ['admin'] },
  {
    id: 'manager',
    label: 'Gestão',
    icon: 'manage_accounts',
    route: '/manager',
    roles: ['admin', 'manager'],
  },
];

@Component({
  standalone: true,
  imports: [NavMenuComponent],
  template: `<app-nav-menu [items]="items()" [userRoles]="userRoles()" />`,
})
class TestHostComponent {
  readonly items = signal<NavMenuItem[]>(MOCK_ITEMS);
  readonly userRoles = signal<string[]>([]);
}

describe('NavMenuComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getNavMenu(): HTMLElement {
    return element.querySelector('.nav-menu') as HTMLElement;
  }

  function getComponent(): NavMenuComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getLinks(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.nav-menu__link');
  }

  function getToggleButton(): HTMLElement {
    return element.querySelector('.nav-menu__toggle') as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  // ── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('should render the brand icon', () => {
    const icon = element.querySelector('.nav-menu__brand-icon');
    expect(icon).toBeTruthy();
    expect(icon?.textContent?.trim()).toBe('waves');
  });

  it('should render the brand name when expanded', () => {
    const name = element.querySelector('.nav-menu__brand-name');
    expect(name?.textContent?.trim()).toBe('AquaTrack');
  });

  it('should render item icons for visible items', () => {
    const icons = element.querySelectorAll('.nav-menu__link-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].textContent?.trim()).toBe('dashboard');
    expect(icons[1].textContent?.trim()).toBe('waves');
  });

  it('should render item labels when expanded', () => {
    const labels = element.querySelectorAll('.nav-menu__link-label');
    expect(labels.length).toBe(2);
    expect(labels[0].textContent?.trim()).toBe('Dashboard');
    expect(labels[1].textContent?.trim()).toBe('Aquários');
  });

  it('should render a toggle button', () => {
    expect(getToggleButton()).toBeTruthy();
  });

  it('should show collapse label on toggle button when expanded', () => {
    const label = element.querySelector('.nav-menu__toggle-label');
    expect(label?.textContent?.trim()).toBe('Collapse');
  });

  it('should react to items input changes', () => {
    hostFixture.componentInstance.items.set([
      { id: 'only', label: 'Only One', icon: 'star', route: '/only' },
    ]);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(1);
  });

  // ── Role-based filtering ───────────────────────────────────────────────────

  it('should show only items without roles when userRoles is empty', () => {
    hostFixture.componentInstance.userRoles.set([]);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(2);
  });

  it('should show all items when user has admin role', () => {
    hostFixture.componentInstance.userRoles.set(['admin']);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(4);
  });

  it('should not show role-restricted items when user role does not match', () => {
    hostFixture.componentInstance.userRoles.set(['viewer']);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(2);
  });

  it('should show item when user has at least one of the required roles', () => {
    hostFixture.componentInstance.userRoles.set(['manager']);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(3);
  });

  it('should show items with an empty roles array regardless of user roles', () => {
    hostFixture.componentInstance.items.set([
      { id: 'open', label: 'Open', icon: 'public', route: '/open', roles: [] },
    ]);
    hostFixture.componentInstance.userRoles.set([]);
    hostFixture.detectChanges();
    expect(getLinks().length).toBe(1);
  });

  // ── Collapse / Expand ──────────────────────────────────────────────────────

  it('should start in expanded state', () => {
    expect(getNavMenu().classList).not.toContain('nav-menu--collapsed');
  });

  it('should apply collapsed class when toggle is clicked', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(getNavMenu().classList).toContain('nav-menu--collapsed');
  });

  it('should expand again when toggle is clicked a second time', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(getNavMenu().classList).not.toContain('nav-menu--collapsed');
  });

  it('should hide item labels when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(element.querySelectorAll('.nav-menu__link-label').length).toBe(0);
  });

  it('should hide brand name when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(element.querySelector('.nav-menu__brand-name')).toBeNull();
  });

  it('should restore labels after re-expanding', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(element.querySelectorAll('.nav-menu__link-label').length).toBe(2);
  });

  it('should hide toggle label when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(element.querySelector('.nav-menu__toggle-label')).toBeNull();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('should set title attribute on links when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    const links = getLinks();
    expect(links[0].getAttribute('title')).toBe('Dashboard');
    expect(links[1].getAttribute('title')).toBe('Aquários');
  });

  it('should have empty title on links when expanded', () => {
    const links = getLinks();
    expect(links[0].getAttribute('title')).toBe('');
    expect(links[1].getAttribute('title')).toBe('');
  });

  it('should set aria-label Recolher menu when expanded', () => {
    expect(getToggleButton().getAttribute('aria-label')).toBe('Recolher menu');
  });

  it('should set aria-label Expandir menu when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();
    expect(getToggleButton().getAttribute('aria-label')).toBe('Expandir menu');
  });
});
