import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCardMetric } from './info-card-metric.model';
import { InfoCardStatus } from './info-card-status.type';
import { InfoCardComponent } from './info-card.component';

@Component({
  standalone: true,
  imports: [InfoCardComponent],
  template: `
    <aq-info-card
      [clickable]="clickable()"
      [fillContainer]="fillContainer()"
      [icon]="icon()"
      [iconFamily]="iconFamily()"
      [status]="status()"
      [statusLabel]="statusLabel()"
      [title]="title()"
      [subtitleLabel]="subtitleLabel()"
      [subtitleValue]="subtitleValue()"
      [metrics]="metrics()"
      (cardClick)="onCardClick()"
    />
  `,
})
class TestHostComponent {
  readonly clickable = signal<boolean>(false);
  readonly fillContainer = signal<boolean>(false);
  readonly icon = signal<string>('');
  readonly iconFamily = signal<string>('material-icons-outlined');
  readonly status = signal<InfoCardStatus>('stable');
  readonly statusLabel = signal<string>('');
  readonly title = signal<string>('Card Title');
  readonly subtitleLabel = signal<string>('');
  readonly subtitleValue = signal<string>('');
  readonly metrics = signal<InfoCardMetric[]>([]);
  clickCount = 0;

  onCardClick(): void {
    this.clickCount += 1;
  }
}

describe('InfoCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getCard(): HTMLElement {
    return element.querySelector('aq-info-card') as HTMLElement;
  }

  function getComponent(): InfoCardComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getIconContainer(): HTMLElement | null {
    return element.querySelector('.info-card__icon-container');
  }

  function getIcon(): HTMLElement | null {
    return element.querySelector('.info-card__icon');
  }

  function getBadge(): HTMLElement | null {
    return element.querySelector('aq-badge');
  }

  function getTitle(): HTMLElement | null {
    return element.querySelector('.info-card__title');
  }

  function getSubtitle(): HTMLElement | null {
    return element.querySelector('.info-card__subtitle');
  }

  function getSubtitleLabel(): HTMLElement | null {
    return element.querySelector('.info-card__subtitle-label');
  }

  function getSubtitleSeparator(): HTMLElement | null {
    return element.querySelector('.info-card__subtitle-separator');
  }

  function getSubtitleValue(): HTMLElement | null {
    return element.querySelector('.info-card__subtitle-value');
  }

  function getDivider(): HTMLElement | null {
    return element.querySelector('.info-card__divider');
  }

  function getMetrics(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.info-card__metric');
  }

  function getMetricLabels(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.info-card__metric-label');
  }

  function getMetricValues(): NodeListOf<HTMLElement> {
    return element.querySelectorAll('.info-card__metric-value');
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

  // ── Default state ─────────────────────────────────────────────────────────

  it('should always have the base info-card class', () => {
    expect(getCard().classList).toContain('info-card');
  });

  it('should apply stable modifier class by default', () => {
    expect(getCard().classList).toContain('info-card--stable');
  });

  it('should not be interactive by default', () => {
    expect(getCard().classList).not.toContain('info-card--interactive');
    expect(getCard().classList).not.toContain('info-card--fill');
    expect(getCard().getAttribute('role')).toBeNull();
    expect(getCard().getAttribute('tabindex')).toBeNull();
  });

  it('should apply fill modifier only when requested', () => {
    hostFixture.componentInstance.fillContainer.set(true);
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('info-card--fill');
  });

  it('should expose button semantics when clickable', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('info-card--interactive');
    expect(getCard().getAttribute('role')).toBe('button');
    expect(getCard().getAttribute('tabindex')).toBe('0');
  });

  it('should emit click when interactive card is clicked', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getCard().click();

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should not emit click when card is not interactive', () => {
    getCard().click();

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });

  it('should emit click on Enter when interactive', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getCard().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should emit click on Space when interactive', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getCard().dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(hostFixture.componentInstance.clickCount).toBe(1);
  });

  it('should ignore non-activation keys when interactive', () => {
    hostFixture.componentInstance.clickable.set(true);
    hostFixture.detectChanges();

    getCard().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(hostFixture.componentInstance.clickCount).toBe(0);
  });

  // ── Icon ──────────────────────────────────────────────────────────────────

  it('should not render icon container when icon is empty', () => {
    expect(getIconContainer()).toBeNull();
  });

  it('should render icon container when icon is provided', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    expect(getIconContainer()).toBeTruthy();
  });

  it('should render the icon with the provided name', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    expect(getIcon()?.textContent?.trim()).toBe('water_drop');
  });

  it('should mark icon container as aria-hidden', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    expect(getIconContainer()?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should hide icon container when icon is removed', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    hostFixture.componentInstance.icon.set('');
    hostFixture.detectChanges();

    expect(getIconContainer()).toBeNull();
  });

  it('should apply material-icons-outlined class to icon by default', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    expect(getIcon()?.classList).toContain('material-icons-outlined');
  });

  it('should apply custom iconFamily class to icon', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.componentInstance.iconFamily.set('material-icons');
    hostFixture.detectChanges();

    expect(getIcon()?.classList).toContain('material-icons');
    expect(getIcon()?.classList).not.toContain('material-icons-outlined');
  });

  // ── Status ────────────────────────────────────────────────────────────────

  it('should not render badge when statusLabel is empty', () => {
    expect(getBadge()).toBeNull();
  });

  it('should render badge when statusLabel is provided', () => {
    hostFixture.componentInstance.statusLabel.set('Estável');
    hostFixture.detectChanges();

    expect(getBadge()).toBeTruthy();
  });

  it('should display the statusLabel text in the badge', () => {
    hostFixture.componentInstance.statusLabel.set('Estável');
    hostFixture.detectChanges();

    expect(getBadge()?.textContent?.trim()).toBe('Estável');
  });

  it('should apply stable modifier class when status is stable', () => {
    hostFixture.componentInstance.status.set('stable');
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('info-card--stable');
  });

  it('should apply attention modifier class when status is attention', () => {
    hostFixture.componentInstance.status.set('attention');
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('info-card--attention');
  });

  it('should apply success badge color when status is stable', () => {
    hostFixture.componentInstance.statusLabel.set('Estável');
    hostFixture.componentInstance.status.set('stable');
    hostFixture.detectChanges();

    expect(getBadge()?.classList).toContain('badge--success');
  });

  it('should apply warning badge color when status is attention', () => {
    hostFixture.componentInstance.statusLabel.set('Atenção');
    hostFixture.componentInstance.status.set('attention');
    hostFixture.detectChanges();

    expect(getBadge()?.classList).toContain('badge--warning');
  });

  it('should apply attention modifier even when statusLabel is empty', () => {
    hostFixture.componentInstance.status.set('attention');
    hostFixture.componentInstance.statusLabel.set('');
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('info-card--attention');
    expect(getBadge()).toBeNull();
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it('should render the title', () => {
    expect(getTitle()?.textContent?.trim()).toBe('Card Title');
  });

  it('should update title when input changes', () => {
    hostFixture.componentInstance.title.set('New Title');
    hostFixture.detectChanges();

    expect(getTitle()?.textContent?.trim()).toBe('New Title');
  });

  // ── Subtitle ──────────────────────────────────────────────────────────────

  it('should not render subtitle when both subtitleLabel and subtitleValue are empty', () => {
    expect(getSubtitle()).toBeNull();
  });

  it('should render subtitle when only subtitleLabel is provided', () => {
    hostFixture.componentInstance.subtitleLabel.set('Plantado');
    hostFixture.detectChanges();

    expect(getSubtitle()).toBeTruthy();
    expect(getSubtitleLabel()?.textContent?.trim()).toBe('Plantado');
    expect(getSubtitleSeparator()).toBeNull();
    expect(getSubtitleValue()).toBeNull();
  });

  it('should render subtitle when only subtitleValue is provided', () => {
    hostFixture.componentInstance.subtitleValue.set('120L');
    hostFixture.detectChanges();

    expect(getSubtitle()).toBeTruthy();
    expect(getSubtitleLabel()).toBeNull();
    expect(getSubtitleSeparator()).toBeNull();
    expect(getSubtitleValue()?.textContent?.trim()).toBe('120L');
  });

  it('should render both parts and separator when subtitleLabel and subtitleValue are provided', () => {
    hostFixture.componentInstance.subtitleLabel.set('Plantado');
    hostFixture.componentInstance.subtitleValue.set('120L');
    hostFixture.detectChanges();

    expect(getSubtitleLabel()?.textContent?.trim()).toBe('Plantado');
    expect(getSubtitleSeparator()).toBeTruthy();
    expect(getSubtitleValue()?.textContent?.trim()).toBe('120L');
  });

  it('should hide subtitle when both inputs are cleared', () => {
    hostFixture.componentInstance.subtitleLabel.set('Plantado');
    hostFixture.componentInstance.subtitleValue.set('120L');
    hostFixture.detectChanges();

    hostFixture.componentInstance.subtitleLabel.set('');
    hostFixture.componentInstance.subtitleValue.set('');
    hostFixture.detectChanges();

    expect(getSubtitle()).toBeNull();
  });

  it('should mark separator as aria-hidden', () => {
    hostFixture.componentInstance.subtitleLabel.set('Plantado');
    hostFixture.componentInstance.subtitleValue.set('120L');
    hostFixture.detectChanges();

    expect(getSubtitleSeparator()?.getAttribute('aria-hidden')).toBe('true');
  });

  // ── Metrics ───────────────────────────────────────────────────────────────

  it('should not render metrics section when array is empty', () => {
    expect(getMetrics().length).toBe(0);
  });

  it('should not render divider when metrics array is empty', () => {
    expect(getDivider()).toBeNull();
  });

  it('should render divider when metrics are present', () => {
    hostFixture.componentInstance.metrics.set([{ label: 'pH', value: '7.2' }]);
    hostFixture.detectChanges();

    expect(getDivider()).toBeTruthy();
  });

  it('should render a single metric correctly', () => {
    hostFixture.componentInstance.metrics.set([{ label: 'Nível de pH', value: '6.8' }]);
    hostFixture.detectChanges();

    expect(getMetrics().length).toBe(1);
    expect(getMetricLabels()[0].textContent?.trim()).toBe('Nível de pH');
    expect(getMetricValues()[0].textContent?.trim()).toBe('6.8');
  });

  it('should render two metrics correctly', () => {
    hostFixture.componentInstance.metrics.set([
      { label: 'Nível de pH', value: '6.8' },
      { label: 'Temp', value: '26°C' },
    ]);
    hostFixture.detectChanges();

    expect(getMetrics().length).toBe(2);
    expect(getMetricLabels()[0].textContent?.trim()).toBe('Nível de pH');
    expect(getMetricValues()[0].textContent?.trim()).toBe('6.8');
    expect(getMetricLabels()[1].textContent?.trim()).toBe('Temp');
    expect(getMetricValues()[1].textContent?.trim()).toBe('26°C');
  });

  it('should render the correct number of metrics', () => {
    hostFixture.componentInstance.metrics.set([
      { label: 'pH', value: '7.2' },
      { label: 'Temp', value: '25°C' },
      { label: 'NH3', value: '0 ppm' },
    ]);
    hostFixture.detectChanges();

    expect(getMetrics().length).toBe(3);
  });

  it('should hide metrics section when cleared', () => {
    hostFixture.componentInstance.metrics.set([{ label: 'pH', value: '7.2' }]);
    hostFixture.detectChanges();

    hostFixture.componentInstance.metrics.set([]);
    hostFixture.detectChanges();

    expect(getMetrics().length).toBe(0);
    expect(getDivider()).toBeNull();
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('should mark divider as aria-hidden', () => {
    hostFixture.componentInstance.metrics.set([{ label: 'pH', value: '7.2' }]);
    hostFixture.detectChanges();

    expect(getDivider()?.getAttribute('aria-hidden')).toBe('true');
  });
});
