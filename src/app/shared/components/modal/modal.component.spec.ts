import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MODAL_DATA } from '../../modal/modal-data.token';
import { ModalRef } from '../../modal/modal-ref';
import { ModalAction } from './modal-action.model';
import { ModalComponentData } from './modal-component-data.model';
import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  template: `
    <div class="dynamic-content">
      <h3>{{ heading() }}</h3>
      <p>{{ injectedData }}</p>
      <button type="button" class="dynamic-close" (click)="closeFromContent()">Close</button>
    </div>
  `,
})
class TestDynamicContentComponent {
  private readonly modalRef = inject(ModalRef);
  protected readonly injectedData = inject(MODAL_DATA) as string;

  readonly heading = input.required<string>();

  protected closeFromContent(): void {
    this.modalRef.close({ reason: 'programmatic' });
  }
}

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;
  let element: HTMLElement;
  let modalRef: ModalRef;
  let closeSpy: jest.SpyInstance;
  let actionEvents: ModalAction[];

  function createFixture(data: Partial<ModalComponentData['config']> = {}): void {
    modalRef = new ModalRef();
    closeSpy = jest.spyOn(modalRef, 'close').mockImplementation();
    actionEvents = [];
    modalRef.afterActionClicked().subscribe((action) => actionEvents.push(action));

    TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: {
            config: {
              size: 'medium',
              role: 'dialog',
              showCloseButton: false,
              closeOnBackdropClick: true,
              closeOnEscape: true,
              hasBackdrop: true,
              actions: [],
              contentComponentInputs: {},
              contentTemplateContext: {},
              ...data,
            },
            modalRef,
          } satisfies ModalComponentData,
        },
      ],
    });

    fixture = TestBed.createComponent(ModalComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    createFixture();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title and description from translation keys', () => {
    createFixture({
      titleKey: 'deleteAccountLabel',
      descriptionKey: 'deleteAccountWarning',
    });

    expect(element.textContent).toContain('Excluir Conta');
    expect(element.textContent).toContain('Esta ação não pode ser desfeita.');
  });

  it('should render the close button with translated aria-label', () => {
    createFixture({ showCloseButton: true });

    expect(element.querySelector('.modal__close-button')?.getAttribute('aria-label')).toBe(
      'Fechar modal',
    );
  });

  it('should prefer an explicit close aria label when provided', () => {
    createFixture({
      showCloseButton: true,
      i18nLabels: {
        closeAriaLabel: 'Encerrar diálogo',
      },
    });

    expect(element.querySelector('.modal__close-button')?.getAttribute('aria-label')).toBe(
      'Encerrar diálogo',
    );
  });

  it('should resolve the close aria label from a translation key', () => {
    createFixture({
      showCloseButton: true,
      i18nLabels: {
        closeAriaLabelKey: 'cancelLabel',
      },
    });

    expect(element.querySelector('.modal__close-button')?.getAttribute('aria-label')).toBe(
      'Cancelar',
    );
  });

  it('should render the dynamic component with injected modal data', () => {
    createFixture({
      contentComponent: TestDynamicContentComponent,
      contentComponentInputs: { heading: 'Dynamic content' },
      data: 'Injected modal data',
    });

    expect(element.textContent).toContain('Dynamic content');
    expect(element.textContent).toContain('Injected modal data');
  });

  it('should expose merged template context', () => {
    createFixture({
      data: { message: 'Conteúdo projetado' },
      contentTemplateContext: { extra: 'contexto adicional' },
    });

    expect(fixture.componentInstance['templateContext']()).toEqual({
      $implicit: { message: 'Conteúdo projetado' },
      data: { message: 'Conteúdo projetado' },
      modalRef,
      extra: 'contexto adicional',
    });
  });

  it('should close when the close button is clicked', () => {
    createFixture({ showCloseButton: true });

    (element.querySelector('.modal__close-button') as HTMLButtonElement).click();

    expect(closeSpy).toHaveBeenCalledWith({ reason: 'close-button' });
  });

  it('should emit action clicks and close when the action is configured to close', () => {
    createFixture({
      actions: [
        {
          id: 'confirm',
          label: 'Confirmar',
          closeOnClick: true,
        },
      ],
    });

    (element.querySelector('.modal__actions button') as HTMLButtonElement).click();

    expect(actionEvents).toEqual([
      expect.objectContaining({
        id: 'confirm',
      }),
    ]);
    expect(closeSpy).toHaveBeenCalledWith({
      reason: 'action',
      actionId: 'confirm',
      action: expect.objectContaining({ id: 'confirm' }),
    });
  });

  it('should emit action clicks without closing when closeOnClick is false', () => {
    createFixture({
      actions: [
        {
          id: 'review',
          label: 'Revisar',
          closeOnClick: false,
        },
      ],
    });

    (element.querySelector('.modal__actions button') as HTMLButtonElement).click();

    expect(actionEvents).toEqual([expect.objectContaining({ id: 'review' })]);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should not close when the action is disabled', () => {
    createFixture({
      actions: [
        {
          id: 'disabled',
          label: 'Desabilitado',
          disabled: true,
          closeOnClick: true,
        },
      ],
    });

    (element.querySelector('.modal__actions button') as HTMLButtonElement).click();

    expect(actionEvents).toHaveLength(0);
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should fall back to the action id when no label or labelKey is provided', () => {
    createFixture({
      actions: [
        {
          id: 'fallback-id',
        },
      ],
    });

    expect(element.querySelector('.modal__actions button')?.textContent).toContain('fallback-id');
  });

  it('should apply size and accessibility attributes', () => {
    createFixture({
      title: 'Modal title',
      description: 'Modal description',
      size: 'large',
    });

    const surface = element.querySelector('.modal__surface') as HTMLElement;

    expect(surface.classList).toContain('modal__surface--large');
    expect(surface.getAttribute('role')).toBe('dialog');
    expect(surface.getAttribute('aria-modal')).toBe('true');
    expect(surface.getAttribute('aria-labelledby')).toBeTruthy();
    expect(surface.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('should render without header and footer sections when optional content is absent', () => {
    createFixture({
      contentComponent: TestDynamicContentComponent,
      contentComponentInputs: { heading: 'Only content' },
    });

    expect(element.querySelector('.modal__header')).toBeNull();
    expect(element.querySelector('.modal__footer')).toBeNull();
    expect(fixture.nativeElement.className).toContain('modal modal--medium');
    expect(fixture.nativeElement.className).not.toContain('modal--has-footer');
  });

  it('should use empty fallbacks when actions and dynamic inputs are undefined', () => {
    createFixture({
      actions: undefined,
      contentComponentInputs: undefined,
      contentTemplateContext: undefined,
      data: undefined,
    });

    expect(fixture.componentInstance['hasFooter']()).toBe(false);
    expect(fixture.componentInstance['componentInputs']()).toEqual({});
    expect(fixture.componentInstance['templateContext']()).toEqual({
      $implicit: undefined,
      data: undefined,
      modalRef,
    });
  });
});
