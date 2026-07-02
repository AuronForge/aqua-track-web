import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { InfoListItemBadge } from '../../../../shared/components/info-list-item/info-list-item-badge.model';
import { InfoListItemComponent } from '../../../../shared/components/info-list-item/info-list-item.component';

@Component({
  selector: 'app-info-list-item-showcase',
  standalone: true,
  imports: [CodeBlockComponent, InfoListItemComponent],
  templateUrl: './info-list-item-showcase.component.html',
  styleUrl: './info-list-item-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoListItemShowcaseComponent {
  readonly badgeNormal: InfoListItemBadge = { label: 'Normal', status: 'normal' };
  readonly badgeAttention: InfoListItemBadge = { label: 'Atenção', status: 'attention' };
  readonly badgeDanger: InfoListItemBadge = { label: 'Alto', status: 'danger' };
  readonly badgeNeutral: InfoListItemBadge = { label: 'Neutro', status: 'neutral' };

  readonly codeTs = `import { InfoListItemComponent } from '../../shared/components/info-list-item/info-list-item.component';
import { InfoListItemBadge } from '../../shared/components/info-list-item/info-list-item-badge.model';

readonly badge: InfoListItemBadge = { label: 'Normal', status: 'normal' };`;

  readonly codeHtml = `<aq-info-list-item
  title="pH"
  subtitle="Aquário Comunitário"
  value="7.2"
  metadata="09:30"
  [badge]="badge"
  [clickable]="true"
  (itemClick)="onItemClick()"
/>`;
}
