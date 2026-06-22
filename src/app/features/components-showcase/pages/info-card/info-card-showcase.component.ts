import { ChangeDetectionStrategy, Component } from '@angular/core';

import { InfoCardComponent } from '../../../../shared/components/info-card/info-card.component';
import { InfoCardMetric } from '../../../../shared/components/info-card/info-card-metric.model';

@Component({
  selector: 'app-info-card-showcase',
  standalone: true,
  imports: [InfoCardComponent],
  templateUrl: './info-card-showcase.component.html',
  styleUrl: './info-card-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardShowcaseComponent {
  readonly infoCardPhMetrics: InfoCardMetric[] = [
    { label: 'Nível de pH', value: '6.8' },
    { label: 'Temp', value: '26°C' },
  ];

  readonly infoCardSalinityMetrics: InfoCardMetric[] = [
    { label: 'Nível de pH', value: '8.2' },
    { label: 'Temp', value: '25°C' },
  ];

  readonly infoCardSingleMetric: InfoCardMetric[] = [{ label: 'Nível de pH', value: '7.0' }];
}
