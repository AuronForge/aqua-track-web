import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { TabComponent, TabsComponent } from '../../../../shared/components/tabs';

@Component({
  selector: 'app-tabs-showcase',
  standalone: true,
  imports: [ButtonComponent, CodeBlockComponent, TabComponent, TabsComponent],
  templateUrl: './tabs-showcase.component.html',
  styleUrl: './tabs-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsShowcaseComponent {
  readonly basicActiveTabId = signal('overview');
  readonly aquariumActiveTabId = signal('measurements');
  readonly overflowActiveTabId = signal('parameters');

  readonly codeTs = `readonly activeTabId = signal('overview');

onActiveTabChange(tabId: string): void {
  this.activeTabId.set(tabId);
}`;

  readonly codeHtml = `<aq-tabs
  [activeTabId]="activeTabId()"
  (activeTabChange)="onActiveTabChange($event)"
>
  <aq-tab id="overview" label="Visão Geral">
    Conteúdo da visão geral
  </aq-tab>

  <aq-tab id="measurements" label="Medições">
    Conteúdo das medições
  </aq-tab>
</aq-tabs>`;

  selectAquariumTab(tabId: string): void {
    this.aquariumActiveTabId.set(tabId);
  }
}
