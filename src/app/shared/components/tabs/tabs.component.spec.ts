import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [TabComponent, TabsComponent],
  template: `
    <aq-tabs
      ariaLabel="Aquarium detail sections"
      [activeTabId]="activeTabId()"
      (activeTabChange)="onActiveTabChange($event)"
    >
      @if (showOverview()) {
        <aq-tab id="overview" label="Visão Geral">
          <p data-testid="overview-panel">Overview content</p>
        </aq-tab>
      }

      <aq-tab id="measurements" label="Medições" [disabled]="measurementsDisabled()">
        <p data-testid="measurements-panel">Measurements content</p>
      </aq-tab>

      @if (showApplications()) {
        <aq-tab id="applications" label="Aplicações" [disabled]="applicationsDisabled()">
          <p data-testid="applications-panel">Applications content</p>
        </aq-tab>
      }
    </aq-tabs>
  `,
})
class TestHostComponent {
  readonly activeTabId = signal('');
  readonly showOverview = signal(true);
  readonly showApplications = signal(true);
  readonly measurementsDisabled = signal(false);
  readonly applicationsDisabled = signal(false);
  readonly emittedChanges: string[] = [];

  onActiveTabChange(tabId: string): void {
    this.emittedChanges.push(tabId);
    this.activeTabId.set(tabId);
  }
}

@Component({
  standalone: true,
  imports: [TabComponent, TabsComponent],
  template: `
    <aq-tabs>
      <aq-tab id="overview" label="Visão Geral" [disabled]="true">Overview content</aq-tab>
      <aq-tab id="measurements" label="Medições" [disabled]="true">Measurements content</aq-tab>
    </aq-tabs>
  `,
})
class AllDisabledHostComponent {}

@Component({
  standalone: true,
  imports: [TabsComponent],
  template: '<aq-tabs />',
})
class EmptyHostComponent {}

describe('TabsComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function createHost(): void {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  }

  function getTabs(): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll('[role="tab"]'));
  }

  function getTabPanel(): HTMLElement | null {
    return element.querySelector('[role="tabpanel"]');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDisabledHostComponent, EmptyHostComponent, TestHostComponent],
    }).compileComponents();

    createHost();
  });

  it('should render projected tabs', () => {
    expect(getTabs()).toHaveLength(3);
    expect(getTabs().map((tab) => tab.textContent?.trim())).toEqual([
      'Visão Geral',
      'Medições',
      'Aplicações',
    ]);
  });

  it('should select the first enabled tab when no active tab is provided', () => {
    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(getTabs()[0].tabIndex).toBe(0);
    expect(getTabPanel()?.textContent).toContain('Overview content');
  });

  it('should render only the selected panel', () => {
    expect(element.querySelector('[data-testid="overview-panel"]')).not.toBeNull();
    expect(element.querySelector('[data-testid="measurements-panel"]')).toBeNull();
    expect(element.querySelector('[data-testid="applications-panel"]')).toBeNull();
  });

  it('should select an initial tab from activeTabId', () => {
    hostFixture.componentInstance.activeTabId.set('applications');
    hostFixture.detectChanges();

    expect(getTabs()[2].getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Applications content');
  });

  it('should update selection programmatically', () => {
    hostFixture.componentInstance.activeTabId.set('measurements');
    hostFixture.detectChanges();

    expect(getTabs()[1].getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Measurements content');
  });

  it('should emit activeTabChange when a different tab is clicked', () => {
    getTabs()[1].click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.emittedChanges).toEqual(['measurements']);
    expect(hostFixture.componentInstance.activeTabId()).toBe('measurements');
  });

  it('should not emit when the selected tab is clicked again', () => {
    getTabs()[0].click();

    expect(hostFixture.componentInstance.emittedChanges).toEqual([]);
  });

  it('should expose WAI-ARIA tab relationships', () => {
    const firstTab = getTabs()[0];
    const panel = getTabPanel();

    expect(element.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Aquarium detail sections',
    );
    expect(firstTab.getAttribute('aria-controls')).toBe(panel?.id);
    expect(panel?.getAttribute('aria-labelledby')).toBe(firstTab.id);
  });

  it('should mark disabled tabs and prevent selection by click', () => {
    hostFixture.componentInstance.measurementsDisabled.set(true);
    hostFixture.detectChanges();

    expect(getTabs()[1].disabled).toBe(true);
    expect(getTabs()[1].getAttribute('aria-disabled')).toBe('true');

    getTabs()[1].click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.activeTabId()).toBe('');
    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should fallback when activeTabId does not exist', () => {
    hostFixture.componentInstance.activeTabId.set('missing');
    hostFixture.detectChanges();

    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Overview content');
  });

  it('should fallback when the active tab becomes disabled', () => {
    hostFixture.componentInstance.activeTabId.set('measurements');
    hostFixture.detectChanges();
    hostFixture.componentInstance.measurementsDisabled.set(true);
    hostFixture.detectChanges();

    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Overview content');
  });

  it('should fallback when the active tab is removed dynamically', () => {
    hostFixture.componentInstance.activeTabId.set('applications');
    hostFixture.detectChanges();
    hostFixture.componentInstance.showApplications.set(false);
    hostFixture.detectChanges();

    expect(getTabs()).toHaveLength(2);
    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
    expect(getTabPanel()?.textContent).toContain('Overview content');
  });

  it('should select the next enabled tab with ArrowRight', () => {
    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.emittedChanges).toEqual(['measurements']);
    expect(getTabs()[1].getAttribute('aria-selected')).toBe('true');
  });

  it('should select the previous enabled tab with ArrowLeft and wrap around', () => {
    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.emittedChanges).toEqual(['applications']);
    expect(getTabs()[2].getAttribute('aria-selected')).toBe('true');
  });

  it('should ignore disabled tabs during arrow navigation', () => {
    hostFixture.componentInstance.measurementsDisabled.set(true);
    hostFixture.detectChanges();

    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.activeTabId()).toBe('applications');
  });

  it('should select the first enabled tab with Home', () => {
    hostFixture.componentInstance.activeTabId.set('applications');
    hostFixture.detectChanges();

    getTabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.activeTabId()).toBe('overview');
  });

  it('should select the last enabled tab with End', () => {
    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.activeTabId()).toBe('applications');
  });

  it('should activate a focused tab with Enter or Space', () => {
    hostFixture.componentInstance.activeTabId.set('overview');
    hostFixture.detectChanges();

    getTabs()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    hostFixture.detectChanges();
    getTabs()[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.emittedChanges).toEqual(['measurements', 'applications']);
  });

  it('should move focus when navigating with arrows', () => {
    const focusSpy = jest.spyOn(getTabs()[1], 'focus');

    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    hostFixture.detectChanges();

    expect(focusSpy).toHaveBeenCalled();
  });

  it('should handle a single tab', () => {
    hostFixture.componentInstance.showApplications.set(false);
    hostFixture.componentInstance.measurementsDisabled.set(true);
    hostFixture.detectChanges();

    getTabs()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    hostFixture.detectChanges();

    expect(getTabs()).toHaveLength(2);
    expect(getTabs()[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should render no panel when there are no tabs', () => {
    const fixture = TestBed.createComponent(EmptyHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="tab"]')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]')).toBeNull();
  });

  it('should render no selected panel when all tabs are disabled', () => {
    const fixture = TestBed.createComponent(AllDisabledHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]')).toBeNull();
  });
});
