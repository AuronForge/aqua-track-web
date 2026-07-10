import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NavMenuItem } from './nav-menu-item.model';
import { NavMenuComponent } from './nav-menu.component';

const MOCK_ITEMS: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
  { id: 'aquariums', label: 'Aquarios', icon: 'waves', route: '/aquariums' },
  {
    id: 'formfields',
    label: 'Formfields',
    icon: 'text_fields',
    children: [
      { id: 'text', label: 'Text Formfield', icon: 'text_fields', route: '/components/text' },
      {
        id: 'select',
        label: 'Select Formfield',
        icon: 'arrow_drop_down_circle',
        route: '/components/select',
      },
    ],
  },
  { id: 'admin', label: 'Admin', icon: 'admin_panel_settings', route: '/admin', roles: ['admin'] },
  {
    id: 'manager',
    label: 'Gestao',
    icon: 'manage_accounts',
    route: '/manager',
    roles: ['admin', 'manager'],
  },
];

@Component({
  standalone: true,
  imports: [NavMenuComponent],
  template: `<app-nav-menu [items]="items()" [userRoles]="userRoles()" [userPlan]="userPlan()" />`,
})
class TestHostComponent {
  readonly items = signal<NavMenuItem[]>(MOCK_ITEMS);
  readonly userRoles = signal<string[]>([]);
  readonly userPlan = signal<string | null>('FREE');
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

  function getSubLinks(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.nav-menu__sublink');
  }

  function getGroupTrigger(): HTMLButtonElement {
    return element.querySelector('.nav-menu__group-trigger') as HTMLButtonElement;
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

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  it('should render the brand icon', () => {
    const icon = element.querySelector('.nav-menu__brand-icon');
    expect(icon?.textContent?.trim()).toBe('waves');
  });

  it('should render the brand name when expanded', () => {
    expect(element.querySelector('.nav-menu__brand-name')?.textContent?.trim()).toBe('AquaTrack');
  });

  it('should render top-level item labels when expanded', () => {
    const labels = Array.from(element.querySelectorAll('.nav-menu__link-label'));
    expect(labels.map((label) => label.textContent?.trim())).toEqual([
      'Dashboard',
      'Aquarios',
      'Formfields',
    ]);
  });

  it('should render child links for expanded groups', () => {
    expect(getSubLinks().length).toBe(2);
    expect(getSubLinks()[0].textContent).toContain('Text Formfield');
  });

  it('should collapse a group when its trigger is clicked', () => {
    getGroupTrigger().click();
    hostFixture.detectChanges();

    expect(getSubLinks().length).toBe(0);
    expect(getGroupTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('should expand a group again when its trigger is clicked twice', () => {
    getGroupTrigger().click();
    hostFixture.detectChanges();
    getGroupTrigger().click();
    hostFixture.detectChanges();

    expect(getSubLinks().length).toBe(2);
    expect(getGroupTrigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should react to items input changes', () => {
    hostFixture.componentInstance.items.set([
      { id: 'only', label: 'Only One', icon: 'star', route: '/only' },
    ]);
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(1);
  });

  it('should show only items without roles when userRoles is empty', () => {
    hostFixture.componentInstance.userRoles.set([]);
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(2);
  });

  it('should show all top-level links when user has admin role', () => {
    hostFixture.componentInstance.userRoles.set(['admin']);
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(4);
  });

  it('should show item when user has at least one of the required roles', () => {
    hostFixture.componentInstance.userRoles.set(['manager']);
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(3);
  });

  it('should start in expanded state', () => {
    expect(getNavMenu().classList).not.toContain('nav-menu--collapsed');
  });

  it('should apply collapsed class when toggle is clicked', () => {
    getToggleButton().click();
    hostFixture.detectChanges();

    expect(getNavMenu().classList).toContain('nav-menu--collapsed');
  });

  it('should hide item labels when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();

    expect(element.querySelectorAll('.nav-menu__link-label').length).toBe(0);
    expect(element.querySelectorAll('.nav-menu__sublink').length).toBe(0);
  });

  it('should hide brand name when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();

    expect(element.querySelector('.nav-menu__brand-name')).toBeNull();
  });

  it('should set title attribute on links when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();

    const links = getLinks();
    expect(links[0].getAttribute('title')).toBe('Dashboard');
    expect(links[1].getAttribute('title')).toBe('Aquarios');
  });

  it('should set aria-label to collapseLabel value when expanded', () => {
    expect(getToggleButton().getAttribute('aria-label')).toBe('Collapse');
  });

  it('should set aria-label to expandLabel value when collapsed', () => {
    getToggleButton().click();
    hostFixture.detectChanges();

    expect(getToggleButton().getAttribute('aria-label')).toBe('Expand');
  });

  it('should hide items when displayRoute is false', () => {
    hostFixture.componentInstance.items.set([
      { id: 'ready', label: 'Ready', icon: 'done', route: '/ready', displayRoute: true },
      { id: 'draft', label: 'Draft', icon: 'draft', route: '/draft', displayRoute: false },
    ]);
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(1);
    expect(getLinks()[0].textContent).toContain('Ready');
  });

  it('should hide empty groups after filtering children', () => {
    hostFixture.componentInstance.items.set([
      {
        id: 'group',
        label: 'Group',
        icon: 'folder',
        children: [
          { id: 'hidden', label: 'Hidden', icon: 'lock', route: '/hidden', displayRoute: false },
        ],
      },
    ]);
    hostFixture.detectChanges();

    expect(element.querySelector('.nav-menu__group-trigger')).toBeNull();
  });

  it('should show plan-restricted items when user plan matches', () => {
    hostFixture.componentInstance.items.set([
      { id: 'free', label: 'Free', icon: 'eco', route: '/free' },
      { id: 'pro', label: 'Pro', icon: 'bolt', route: '/pro', allowedPlans: ['FREE', 'PREMIUM'] },
    ]);
    hostFixture.componentInstance.userPlan.set('FREE');
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(2);
  });

  it('should hide plan-restricted items when user plan does not match', () => {
    hostFixture.componentInstance.items.set([
      { id: 'free', label: 'Free', icon: 'eco', route: '/free' },
      { id: 'pro', label: 'Pro', icon: 'bolt', route: '/pro', allowedPlans: ['PREMIUM'] },
    ]);
    hostFixture.componentInstance.userPlan.set('FREE');
    hostFixture.detectChanges();

    expect(getLinks().length).toBe(1);
    expect(getLinks()[0].textContent).toContain('Free');
  });
});
