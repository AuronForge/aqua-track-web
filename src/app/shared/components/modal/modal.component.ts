import { CdkTrapFocus } from '@angular/cdk/a11y';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';
import { MODAL_DATA } from '../../modal/modal-data.token';
import { ModalRef } from '../../modal/modal-ref';
import { ButtonComponent } from '../button/button.component';
import { ModalAction } from './modal-action.model';
import { ModalComponentData } from './modal-component-data.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-modal',
  standalone: true,
  imports: [ButtonComponent, CdkTrapFocus, NgComponentOutlet, NgTemplateOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  providers: [
    {
      provide: ModalRef,
      useFactory: () => inject<ModalComponentData>(DIALOG_DATA).modalRef,
    },
    {
      provide: MODAL_DATA,
      useFactory: () => inject<ModalComponentData>(DIALOG_DATA).config.data,
    },
  ],
})
export class ModalComponent {
  private static nextId = 0;

  private readonly dialogData = inject<ModalComponentData>(DIALOG_DATA);
  private readonly languageService = inject(LanguageService);
  private readonly instanceId = ModalComponent.nextId++;

  protected readonly t = this.languageService.translation;
  protected readonly config = this.dialogData.config;
  protected readonly modalRef = this.dialogData.modalRef;

  protected readonly titleId = `aq-modal-title-${this.instanceId}`;
  protected readonly descriptionId = `aq-modal-description-${this.instanceId}`;

  protected readonly hostClass = computed(() =>
    `modal modal--${this.config.size} ${this.hasFooter() ? 'modal--has-footer' : ''}`.trim(),
  );

  protected readonly titleText = computed(() =>
    this.resolveText(this.config.title, this.config.titleKey),
  );

  protected readonly descriptionText = computed(() =>
    this.resolveText(this.config.description, this.config.descriptionKey),
  );

  protected readonly closeAriaLabel = computed(
    () =>
      this.resolveText(
        this.config.i18nLabels?.closeAriaLabel,
        this.config.i18nLabels?.closeAriaLabelKey,
      ) ?? this.t().modalCloseLabel,
  );

  protected readonly hasHeader = computed(
    () => !!this.titleText() || !!this.descriptionText() || !!this.config.showCloseButton,
  );

  protected readonly hasFooter = computed(() => (this.config.actions?.length ?? 0) > 0);

  protected readonly templateContext = computed(() => ({
    $implicit: this.config.data,
    data: this.config.data,
    modalRef: this.modalRef,
    ...(this.config.contentTemplateContext ?? {}),
  }));

  protected readonly componentInputs = computed(() => ({
    ...(this.config.contentComponentInputs ?? {}),
  }));

  protected readonly surfaceClass = computed(
    () => `modal__surface modal__surface--${this.config.size}`,
  );

  protected onCloseButtonClick(): void {
    this.modalRef.close({ reason: 'close-button' });
  }

  protected onActionClick(action: ModalAction): void {
    if (action.disabled) return;

    this.modalRef.emitActionClicked(action);

    if (!action.closeOnClick) return;

    this.modalRef.close({
      reason: 'action',
      actionId: action.id,
      action,
    });
  }

  protected resolveActionLabel(action: ModalAction): string {
    return this.resolveText(action.label, action.labelKey) ?? action.id;
  }

  private resolveText(
    text?: string,
    translationKey?: keyof ReturnType<LanguageService['translation']>,
  ): string | undefined {
    if (translationKey) {
      return this.t()[translationKey];
    }

    return text;
  }
}
