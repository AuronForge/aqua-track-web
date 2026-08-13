import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AqAlertComponent } from '../../../../shared/components/alert/alert.component';
import { AqAlertVariant } from '../../../../shared/components/alert/alert-variant.type';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

interface AlertShowcaseVariant {
  readonly variant: AqAlertVariant;
  readonly title: string;
  readonly message: string;
}

@Component({
  selector: 'app-alert-showcase',
  standalone: true,
  imports: [AqAlertComponent, ButtonComponent, CodeBlockComponent],
  templateUrl: './alert-showcase.component.html',
  styleUrl: './alert-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertShowcaseComponent {
  readonly showDismissibleAlert = signal(true);
  readonly dismissCount = signal(0);

  readonly componentCodeTs = `import { AqAlertComponent } from '../../shared/components/alert/alert.component';`;

  readonly codeHtml = `<aq-alert variant="info" title="Dica de cuidado">
  Pesquise as necessidades especificas da especie antes de adiciona-la ao aquario.
</aq-alert>

<aq-alert
  variant="warning"
  title="Parametros fora da faixa recomendada"
  [dismissible]="true"
  (dismissed)="hideAlert()"
>
  Revise as ultimas medicoes antes de adicionar novos habitantes.

  <button aqButton aqAlertAction type="button" variant="stroked" color="warning">
    Ver medicoes
  </button>
</aq-alert>`;

  readonly variants: AlertShowcaseVariant[] = [
    {
      variant: 'info',
      title: 'Dica de cuidado',
      message: 'Pesquise as necessidades da especie antes de adiciona-la ao aquario.',
    },
    {
      variant: 'success',
      title: 'Medicao registrada',
      message: 'Os parametros do aquario foram atualizados com sucesso.',
    },
    {
      variant: 'warning',
      title: 'Atencao aos parametros',
      message: 'O nivel de nitrato esta proximo do limite recomendado.',
    },
    {
      variant: 'error',
      title: 'Nao foi possivel salvar',
      message: 'Verifique os dados informados e tente novamente.',
    },
    {
      variant: 'neutral',
      title: 'Atualizacao agendada',
      message: 'A proxima atualizacao das medicoes ocorrera em alguns minutos.',
    },
  ];

  protected handleDismissed(): void {
    this.showDismissibleAlert.set(false);
    this.dismissCount.update((count) => count + 1);
  }

  protected restoreDismissibleAlert(): void {
    this.showDismissibleAlert.set(true);
  }
}
