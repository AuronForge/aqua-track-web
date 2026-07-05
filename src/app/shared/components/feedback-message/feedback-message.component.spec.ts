import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackMessageHorizontalPosition } from './feedback-message-horizontal-position.type';
import { FeedbackMessageIconPosition } from './feedback-message-icon-position.type';
import { FeedbackMessageType } from './feedback-message-type.type';
import { FeedbackMessageVerticalPosition } from './feedback-message-vertical-position.type';
import { FeedbackMessageComponent } from './feedback-message.component';

@Component({
  standalone: true,
  imports: [FeedbackMessageComponent],
  template: `
    <aq-feedback-message
      [label]="label()"
      [horizontalPosition]="horizontalPosition()"
      [verticalPosition]="verticalPosition()"
      [type]="type()"
      [hasIcon]="hasIcon()"
      [iconName]="iconName()"
      [iconPosition]="iconPosition()"
    />
  `,
})
class TestHostComponent {
  readonly label = signal('Medição salva com sucesso.');
  readonly horizontalPosition = signal<FeedbackMessageHorizontalPosition>('top');
  readonly verticalPosition = signal<FeedbackMessageVerticalPosition>('center');
  readonly type = signal<FeedbackMessageType>('information');
  readonly hasIcon = signal(false);
  readonly iconName = signal('');
  readonly iconPosition = signal<FeedbackMessageIconPosition>('start');
}

describe('FeedbackMessageComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getMessage(): HTMLElement {
    return element.querySelector('aq-feedback-message') as HTMLElement;
  }

  function getComponent(): FeedbackMessageComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getLabel(): HTMLElement | null {
    return element.querySelector('.feedback-message__label');
  }

  function getIcon(): HTMLElement | null {
    return element.querySelector('.feedback-message__icon');
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

  it('should render the received label', () => {
    expect(getLabel()?.textContent?.trim()).toBe('Medição salva com sucesso.');
  });

  it('should apply base and default classes', () => {
    const classList = getMessage().classList;

    expect(classList).toContain('feedback-message');
    expect(classList).toContain('feedback-message--information');
    expect(classList).toContain('feedback-message--pos-top');
    expect(classList).toContain('feedback-message--align-center');
    expect(classList).toContain('feedback-message--icon-start');
  });

  it('should apply success visual class', () => {
    hostFixture.componentInstance.type.set('success');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--success');
  });

  it('should apply error visual class', () => {
    hostFixture.componentInstance.type.set('error');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--error');
  });

  it('should apply warning visual class', () => {
    hostFixture.componentInstance.type.set('warning');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--warning');
  });

  it('should apply information visual class', () => {
    hostFixture.componentInstance.type.set('information');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--information');
  });

  it('should apply middle class for center horizontal position', () => {
    hostFixture.componentInstance.horizontalPosition.set('center');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--pos-middle');
  });

  it('should apply bottom position class', () => {
    hostFixture.componentInstance.horizontalPosition.set('bottom');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--pos-bottom');
  });

  it('should apply start alignment class', () => {
    hostFixture.componentInstance.verticalPosition.set('start');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--align-start');
  });

  it('should apply end alignment class', () => {
    hostFixture.componentInstance.verticalPosition.set('end');
    hostFixture.detectChanges();

    expect(getMessage().classList).toContain('feedback-message--align-end');
  });

  it('should not render icon when hasIcon is false', () => {
    expect(getIcon()).toBeNull();
  });

  it('should render icon when hasIcon is true', () => {
    hostFixture.componentInstance.hasIcon.set(true);
    hostFixture.componentInstance.iconName.set('check_circle');
    hostFixture.detectChanges();

    expect(getIcon()?.textContent?.trim()).toBe('check_circle');
  });

  it('should use fallback icon based on type when iconName is empty', () => {
    hostFixture.componentInstance.hasIcon.set(true);
    hostFixture.componentInstance.type.set('error');
    hostFixture.componentInstance.iconName.set('');
    hostFixture.detectChanges();

    expect(getIcon()?.textContent?.trim()).toBe('error');
  });

  it('should render icon before the label when iconPosition is start', () => {
    hostFixture.componentInstance.hasIcon.set(true);
    hostFixture.componentInstance.iconName.set('info');
    hostFixture.componentInstance.iconPosition.set('start');
    hostFixture.detectChanges();

    const content = element.querySelector('.feedback-message__content')?.children;

    expect(content?.[0].classList.contains('feedback-message__icon')).toBe(true);
    expect(content?.[1].classList.contains('feedback-message__label')).toBe(true);
  });

  it('should render icon after the label when iconPosition is end', () => {
    hostFixture.componentInstance.hasIcon.set(true);
    hostFixture.componentInstance.iconName.set('info');
    hostFixture.componentInstance.iconPosition.set('end');
    hostFixture.detectChanges();

    const content = element.querySelector('.feedback-message__content')?.children;

    expect(content?.[0].classList.contains('feedback-message__label')).toBe(true);
    expect(content?.[1].classList.contains('feedback-message__icon')).toBe(true);
  });

  it('should expose alert semantics for error messages', () => {
    hostFixture.componentInstance.type.set('error');
    hostFixture.detectChanges();

    expect(getMessage().getAttribute('role')).toBe('alert');
    expect(getMessage().getAttribute('aria-live')).toBe('assertive');
  });

  it('should expose alert semantics for warning messages', () => {
    hostFixture.componentInstance.type.set('warning');
    hostFixture.detectChanges();

    expect(getMessage().getAttribute('role')).toBe('alert');
    expect(getMessage().getAttribute('aria-live')).toBe('assertive');
  });

  it('should expose status semantics for success messages', () => {
    hostFixture.componentInstance.type.set('success');
    hostFixture.detectChanges();

    expect(getMessage().getAttribute('role')).toBe('status');
    expect(getMessage().getAttribute('aria-live')).toBe('polite');
  });

  it('should expose status semantics for information messages', () => {
    expect(getMessage().getAttribute('role')).toBe('status');
    expect(getMessage().getAttribute('aria-live')).toBe('polite');
  });
});
