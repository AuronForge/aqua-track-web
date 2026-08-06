import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqAlertVariant } from './alert-variant.type';
import { AqAlertComponent } from './alert.component';

@Component({
  standalone: true,
  imports: [AqAlertComponent],
  template: `
    <aq-alert
      [variant]="variant()"
      [title]="title()"
      [icon]="icon()"
      [showIcon]="showIcon()"
      [dismissible]="dismissible()"
      [ariaLabel]="ariaLabel()"
      (dismissed)="dismissedCount.set(dismissedCount() + 1)"
    >
      {{ message() }}
      @if (showAction()) {
        <button type="button" aqAlertAction>Ver medicoes</button>
      }
    </aq-alert>
  `,
})
class TestHostComponent {
  readonly variant = signal<AqAlertVariant>('info');
  readonly title = signal<string | undefined>('Dica de cuidado');
  readonly icon = signal<string | undefined>(undefined);
  readonly showIcon = signal(true);
  readonly dismissible = signal(false);
  readonly ariaLabel = signal<string | undefined>(undefined);
  readonly message = signal('Pesquise as necessidades da especie antes de adiciona-la.');
  readonly showAction = signal(false);
  readonly dismissedCount = signal(0);
}

describe('AqAlertComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getAlert(): HTMLElement {
    return element.querySelector('aq-alert') as HTMLElement;
  }

  function getComponent(): AqAlertComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getTitle(): HTMLElement | null {
    return element.querySelector('.alert__title');
  }

  function getMessage(): HTMLElement | null {
    return element.querySelector('.alert__message');
  }

  function getIcon(): HTMLElement | null {
    return element.querySelector('.alert__icon');
  }

  function getDismissButton(): HTMLButtonElement | null {
    return element.querySelector('.alert__dismiss');
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
    expect(getComponent()).toBeTruthy();
  });

  it('should apply info as default variant', () => {
    expect(getAlert().classList).toContain('alert--info');
  });

  it.each<AqAlertVariant>(['info', 'success', 'warning', 'error', 'neutral'])(
    'should apply the %s variant class',
    (variant) => {
      hostFixture.componentInstance.variant.set(variant);
      hostFixture.detectChanges();

      expect(getAlert().classList).toContain(`alert--${variant}`);
    },
  );

  it('should render the optional title', () => {
    expect(getTitle()?.textContent?.trim()).toBe('Dica de cuidado');
  });

  it('should not render title when it is empty', () => {
    hostFixture.componentInstance.title.set(undefined);
    hostFixture.detectChanges();

    expect(getTitle()).toBeNull();
    expect(getAlert().classList).toContain('alert--without-title');
  });

  it('should project the message content', () => {
    expect(getMessage()?.textContent).toContain(
      'Pesquise as necessidades da especie antes de adiciona-la.',
    );
  });

  it('should render the default icon for the variant', () => {
    hostFixture.componentInstance.variant.set('success');
    hostFixture.detectChanges();

    expect(getIcon()?.textContent?.trim()).toBe('check_circle');
  });

  it('should hide the icon when showIcon is false', () => {
    hostFixture.componentInstance.showIcon.set(false);
    hostFixture.detectChanges();

    expect(getIcon()).toBeNull();
    expect(getAlert().classList).toContain('alert--without-icon');
  });

  it('should render a custom icon when provided', () => {
    hostFixture.componentInstance.icon.set('water_drop');
    hostFixture.detectChanges();

    expect(getIcon()?.textContent?.trim()).toBe('water_drop');
  });

  it('should not render the dismiss button by default', () => {
    expect(getDismissButton()).toBeNull();
  });

  it('should render the dismiss button when dismissible', () => {
    hostFixture.componentInstance.dismissible.set(true);
    hostFixture.detectChanges();

    expect(getDismissButton()).toBeTruthy();
  });

  it('should emit dismissed when clicking the dismiss button', () => {
    hostFixture.componentInstance.dismissible.set(true);
    hostFixture.detectChanges();

    getDismissButton()?.click();

    expect(hostFixture.componentInstance.dismissedCount()).toBe(1);
  });

  it('should expose an accessible name on the dismiss button', () => {
    hostFixture.componentInstance.dismissible.set(true);
    hostFixture.detectChanges();

    expect(getDismissButton()?.getAttribute('aria-label')).toBe('Fechar alerta');
  });

  it('should expose alert semantics for warning and error variants', () => {
    hostFixture.componentInstance.variant.set('error');
    hostFixture.detectChanges();

    expect(getAlert().getAttribute('role')).toBe('alert');
    expect(getAlert().getAttribute('aria-live')).toBe('assertive');
  });

  it('should expose status semantics for non urgent variants', () => {
    hostFixture.componentInstance.variant.set('neutral');
    hostFixture.detectChanges();

    expect(getAlert().getAttribute('role')).toBe('status');
    expect(getAlert().getAttribute('aria-live')).toBe('polite');
  });

  it('should apply a custom aria-label when provided', () => {
    hostFixture.componentInstance.ariaLabel.set('Aviso sobre parametros da agua');
    hostFixture.detectChanges();

    expect(getAlert().getAttribute('aria-label')).toBe('Aviso sobre parametros da agua');
  });

  it('should render projected actions', () => {
    hostFixture.componentInstance.showAction.set(true);
    hostFixture.detectChanges();

    expect(element.querySelector('.alert__actions [aqAlertAction]')?.textContent?.trim()).toBe(
      'Ver medicoes',
    );
  });

  it('should render long content without errors', () => {
    hostFixture.componentInstance.message.set('Nitrato '.repeat(40));

    expect(() => hostFixture.detectChanges()).not.toThrow();
    expect(getMessage()?.textContent).toContain('Nitrato');
  });
});
