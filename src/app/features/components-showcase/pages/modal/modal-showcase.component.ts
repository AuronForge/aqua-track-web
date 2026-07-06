import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { ModalAction } from '../../../../shared/components/modal/modal-action.model';
import { ModalSize } from '../../../../shared/components/modal/modal-size.type';
import { LanguageService } from '../../../../shared/services/language.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { ModalShowcaseDynamicContentComponent } from './modal-showcase-dynamic-content.component';

@Component({
  selector: 'app-modal-showcase',
  standalone: true,
  imports: [ButtonComponent, CodeBlockComponent],
  templateUrl: './modal-showcase.component.html',
  styleUrl: './modal-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalShowcaseComponent {
  private readonly modalService = inject(ModalService);
  private readonly languageService = inject(LanguageService);

  private readonly simpleTemplate = viewChild.required<TemplateRef<unknown>>('simpleTemplate');
  private readonly actionsTemplate = viewChild.required<TemplateRef<unknown>>('actionsTemplate');

  protected readonly t = this.languageService.translation;
  protected readonly lastEvent = signal('Nenhuma interação ainda.');
  protected readonly currentLanguage = computed(() => this.languageService.selectedLanguage());

  readonly codeTs = `import { inject } from '@angular/core';
import { ModalService } from '../../../../shared/services/modal.service';

private readonly modalService = inject(ModalService);

openDetails(): void {
  this.modalService.open({
    titleKey: 'deleteAccountLabel',
    descriptionKey: 'deleteAccountWarning',
    showCloseButton: true,
    contentTemplate: this.simpleTemplate(),
  });
}`;

  readonly codeHtml = `<ng-template #simpleTemplate>
  <p>Conteúdo renderizado por template dentro do modal.</p>
</ng-template>

<button aqButton type="button" color="primary" (click)="openSimpleModal()">
  Abrir modal
</button>`;

  protected openSimpleModal(): void {
    this.trackModal(
      this.modalService.open({
        title: 'Detalhes do parâmetro',
        description:
          'Use este modal para revisar informações importantes sem perder o contexto da tela atual.',
        contentTemplate: this.simpleTemplate(),
        showCloseButton: true,
        closeOnBackdropClick: true,
      }),
    );
  }

  protected openActionsModal(): void {
    this.trackModal(
      this.modalService.open({
        titleKey: 'deleteAccountLabel',
        descriptionKey: 'deleteAccountWarning',
        contentTemplate: this.actionsTemplate(),
        showCloseButton: true,
        closeOnBackdropClick: false,
        closeOnEscape: false,
        actions: [
          this.buildAction('cancel', 'cancelLabel', 'stroked', 'tertiary', true),
          this.buildAction('delete', 'deleteAccountLabel', 'flat', 'error', true),
        ],
      }),
    );
  }

  protected openBackdropClosableModal(): void {
    this.trackModal(
      this.modalService.open({
        title: 'Visualização rápida',
        description: 'Este exemplo pode ser fechado clicando fora da caixa do modal.',
        contentTemplate: this.simpleTemplate(),
        closeOnBackdropClick: true,
      }),
    );
  }

  protected openLockedBackdropModal(): void {
    this.trackModal(
      this.modalService.open({
        title: 'Confirmação importante',
        description: 'Este exemplo exige uma ação explícita para evitar fechamento acidental.',
        contentTemplate: this.actionsTemplate(),
        closeOnBackdropClick: false,
        closeOnEscape: false,
        showCloseButton: true,
        actions: [
          this.buildAction('back', 'cancelLabel', 'stroked', 'tertiary', true),
          this.buildAction('save', 'profileSaveChanges', 'flat', 'primary', true),
        ],
      }),
    );
  }

  protected openDynamicModal(): void {
    this.trackModal(
      this.modalService.open({
        title: 'Resumo de cuidados',
        description:
          'O conteúdo abaixo é um componente standalone renderizado dinamicamente dentro do modal.',
        contentComponent: ModalShowcaseDynamicContentComponent,
        contentComponentInputs: {
          heading: 'Checklist antes de confirmar',
          items: [
            'Revise os dados informados.',
            'Confirme a ação principal.',
            'Evite fechar o modal por engano.',
          ],
        },
        data: {
          note: 'O componente dinâmico também consegue fechar o modal usando ModalRef.',
        },
        showCloseButton: true,
        actions: [this.buildAction('done', 'homeErrorRetry', 'stroked', 'secondary', true)],
      }),
    );
  }

  protected openSizedModal(size: ModalSize): void {
    this.trackModal(
      this.modalService.open({
        title: `Modal ${size}`,
        description: 'O tamanho visual do modal é configurado pela propriedade size.',
        contentTemplate: this.simpleTemplate(),
        size,
        showCloseButton: true,
      }),
    );
  }

  protected openDisabledActionModal(): void {
    this.trackModal(
      this.modalService.open({
        title: 'Action desabilitada',
        description:
          'Use este cenário para validar que o botão continua visível, mas não dispara ação.',
        contentTemplate: this.simpleTemplate(),
        actions: [
          {
            id: 'disabled',
            label: 'Ação bloqueada',
            color: 'warning',
            disabled: true,
            closeOnClick: true,
          },
        ],
        showCloseButton: true,
      }),
    );
  }

  protected openManualCloseModal(): void {
    const modalRef = this.modalService.open({
      title: 'Action sem fechamento automático',
      description:
        'A action dispara evento, mas o modal permanece aberto até um fechamento manual.',
      contentTemplate: this.simpleTemplate(),
      actions: [
        {
          id: 'review',
          label: 'Revisar medição',
          color: 'primary',
          closeOnClick: false,
        },
        {
          id: 'close',
          label: 'Fechar',
          color: 'tertiary',
          variant: 'stroked',
          closeOnClick: true,
        },
      ],
      showCloseButton: true,
    });

    modalRef.afterActionClicked().subscribe((action) => {
      if (action.id === 'review') {
        this.lastEvent.set('Action "Revisar medição" disparada sem fechar o modal.');
      }
    });

    this.trackModal(modalRef, false);
  }

  private buildAction(
    id: string,
    labelKey: ModalAction['labelKey'],
    variant: ModalAction['variant'],
    color: ModalAction['color'],
    closeOnClick: boolean,
  ): ModalAction {
    return {
      id,
      labelKey,
      variant,
      color,
      closeOnClick,
    };
  }

  private trackModal(modalRef: ReturnType<ModalService['open']>, includeActionStream = true): void {
    modalRef.afterClosed().subscribe((result) => {
      this.lastEvent.set(`Fechamento: ${result?.reason ?? 'sem resultado'}.`);
    });

    modalRef.afterBackdropClicked().subscribe(() => {
      this.lastEvent.set('Backdrop clicado.');
    });

    if (!includeActionStream) return;

    modalRef.afterActionClicked().subscribe((action) => {
      this.lastEvent.set(`Action clicada: ${action.id}.`);
    });
  }
}
