import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { FeedbackMessageComponent } from '../../../../shared/components/feedback-message/feedback-message.component';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';

@Component({
  selector: 'app-feedback-message-showcase',
  standalone: true,
  imports: [ButtonComponent, CodeBlockComponent, FeedbackMessageComponent],
  templateUrl: './feedback-message-showcase.component.html',
  styleUrl: './feedback-message-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackMessageShowcaseComponent {
  private readonly feedbackMessageService = inject(FeedbackMessageService);

  readonly componentCodeTs = `import { FeedbackMessageComponent } from '../../shared/components/feedback-message/feedback-message.component';`;

  readonly serviceCodeTs = `import { inject } from '@angular/core';
import { FeedbackMessageService } from '../../shared/services/feedback-message.service';

private readonly feedbackMessageService = inject(FeedbackMessageService);

showSuccessMessage(): void {
  this.feedbackMessageService.showSuccess('Medição salva com sucesso.', {
    hasIcon: true,
    displayDurationMs: 5000,
    verticalPosition: 'end',
    horizontalPosition: 'bottom',
  });
}`;

  readonly codeHtml = `<aq-feedback-message
  label="Medição salva com sucesso."
  type="success"
  [displayDurationMs]="5000"
  [hasIcon]="true"
/>

<aq-feedback-message
  label="Não foi possível carregar os dados do aquário."
  type="error"
  verticalPosition="end"
  horizontalPosition="bottom"
  [displayDurationMs]="5000"
  [hasIcon]="true"
  iconPosition="end"
/>`;

  readonly serviceCodeHtml = `<button aqButton type="button" color="primary" (click)="showSuccessMessage()">
  Simular feedback global
</button>`;

  readonly serviceApiCodeTs = `this.feedbackMessageService.show('Mensagem informativa.', {
  type: 'information',
  hasIcon: true,
  displayDurationMs: 5000,
});

this.feedbackMessageService.showSuccess('Medição salva com sucesso.');
this.feedbackMessageService.showError('Não foi possível carregar os dados do aquário.');
this.feedbackMessageService.showWarning('Verifique os dados antes de continuar.');
this.feedbackMessageService.showInformation('Nenhuma medição encontrada para este período.');

this.feedbackMessageService.clear();`;

  readonly stackedServiceCodeTs = `showStackedMessages(): void {
  this.feedbackMessageService.showSuccess('Medição salva com sucesso.', {
    hasIcon: true,
    displayDurationMs: 5000,
    verticalPosition: 'end',
    horizontalPosition: 'bottom',
  });

  this.feedbackMessageService.showWarning('Verifique os dados antes de continuar.', {
    hasIcon: true,
    displayDurationMs: 5000,
    verticalPosition: 'end',
    horizontalPosition: 'bottom',
  });

  this.feedbackMessageService.showError('Não foi possível carregar os dados do aquário.', {
    hasIcon: true,
    displayDurationMs: 5000,
    verticalPosition: 'end',
    horizontalPosition: 'bottom',
  });
}`;

  protected showSuccessMessage(): void {
    this.feedbackMessageService.showSuccess('Medição salva com sucesso.', {
      hasIcon: true,
      displayDurationMs: 5000,
      verticalPosition: 'end',
      horizontalPosition: 'bottom',
    });
  }

  protected showErrorMessage(): void {
    this.feedbackMessageService.showError('Não foi possível carregar os dados do aquário.', {
      hasIcon: true,
      displayDurationMs: 5000,
      verticalPosition: 'center',
      horizontalPosition: 'top',
    });
  }

  protected showStackedMessages(): void {
    this.feedbackMessageService.showSuccess('Medição salva com sucesso.', {
      hasIcon: true,
      displayDurationMs: 5000,
      verticalPosition: 'end',
      horizontalPosition: 'bottom',
    });

    this.feedbackMessageService.showWarning('Verifique os dados antes de continuar.', {
      hasIcon: true,
      displayDurationMs: 5000,
      verticalPosition: 'end',
      horizontalPosition: 'bottom',
    });

    this.feedbackMessageService.showError('Não foi possível carregar os dados do aquário.', {
      hasIcon: true,
      displayDurationMs: 5000,
      verticalPosition: 'end',
      horizontalPosition: 'bottom',
    });
  }
}
