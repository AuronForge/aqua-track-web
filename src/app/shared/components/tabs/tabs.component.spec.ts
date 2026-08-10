import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabComponent } from './tab.component';
import { TabsComponent } from './tabs.component';

@Component({
  standalone: true,
  imports: [TabComponent, TabsComponent],
  template: `
    <aq-tabs
      [activeTabId]="activeTabId()"
      ariaLabel="Abas de teste"
      (activeTabChange)="activeTabId.set($event)"
    >
      <aq-tab id="overview" label="Visão Geral">Conteúdo geral</aq-tab>
      <aq-tab id="measurements" label="Medições">Conteúdo medições</aq-tab>
      <aq-tab id="disabled" label="Desabilitada" [disabled]="true">Conteúdo bloqueado</aq-tab>
    </aq-tabs>
  `,
})
class TabsHostComponent {
  readonly activeTabId = signal<string | null>('overview');
}

@Component({
  standalone: true,
  imports: [TabComponent, TabsComponent],
  template: `
    <aq-tabs [activeTabId]="null">
      <aq-tab id="disabled" label="Desabilitada" [disabled]="true">Conteúdo bloqueado</aq-tab>
    </aq-tabs>
  `,
})
class DisabledTabsHostComponent {}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<TabsHostComponent>;
  let host: TabsHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisabledTabsHostComponent, TabsHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.tabs__tab'));
  }

  it('renders the selected tab and accessible tab metadata', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.tabs__header')?.getAttribute('aria-label')).toBe(
      'Abas de teste',
    );
    expect(buttons()[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons()[0].classList).toContain('tabs__tab--selected');
    expect(element.querySelector('.tabs__panel')?.getAttribute('aria-labelledby')).toBe(
      'tab-overview',
    );
    expect(element.textContent).toContain('Conteúdo geral');
    expect(element.textContent).not.toContain('Conteúdo medições');
  });

  it('emits the selected tab id when an enabled inactive tab is clicked', () => {
    buttons()[1].click();
    fixture.detectChanges();

    expect(host.activeTabId()).toBe('measurements');
    expect(buttons()[1].getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Conteúdo medições');
  });

  it('does not emit when the current or disabled tab is clicked', () => {
    const component = fixture.debugElement.children[0].componentInstance as TabsComponent;
    const emitSpy = jest.spyOn(component.activeTabChange, 'emit');

    buttons()[0].click();
    buttons()[2].click();
    fixture.detectChanges();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(host.activeTabId()).toBe('overview');
  });

  it('falls back to the first enabled tab when no active tab is provided', () => {
    host.activeTabId.set(null);
    fixture.detectChanges();

    expect(buttons()[0].getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Conteúdo geral');
  });

  it('uses no selected panel metadata when all tabs are disabled and no active tab is provided', async () => {
    const disabledFixture = TestBed.createComponent(DisabledTabsHostComponent);
    disabledFixture.detectChanges();

    const panel = disabledFixture.nativeElement.querySelector('.tabs__panel') as HTMLElement;

    expect(panel.id).toBe('');
    expect(panel.getAttribute('aria-labelledby')).toBeNull();
    expect(
      disabledFixture.nativeElement.querySelector('.tabs__tab')?.getAttribute('aria-selected'),
    ).toBe('false');
  });
});
