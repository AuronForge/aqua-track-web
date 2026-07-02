import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { InputSelectChangeEvent } from '../../../../shared/components/select/input-select-change-event.model';
import { InputSelectComponent } from '../../../../shared/components/select/input-select.component';
import { InputSelectOption } from '../../../../shared/components/select/input-select-option.model';

@Component({
  selector: 'app-input-select-showcase',
  standalone: true,
  imports: [CodeBlockComponent, InputSelectComponent],
  templateUrl: './input-select-showcase.component.html',
  styleUrl: './input-select-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectShowcaseComponent {
  readonly environmentOptions: InputSelectOption[] = [
    { id: 'prod', title: 'Produção', subtitle: 'us-east-1 • Ativo', icon: 'cloud' },
    { id: 'staging', title: 'Homologação', subtitle: 'sa-east-1 • Ativo', icon: 'cloud_queue' },
    {
      id: 'dev',
      title: 'Desenvolvimento',
      subtitle: 'Local • Em configuração',
      icon: 'developer_mode',
    },
    {
      id: 'legacy',
      title: 'Legado',
      subtitle: 'Desabilitado pelo time',
      icon: 'cloud_off',
      disabled: true,
    },
  ];

  readonly projectOptions: InputSelectOption[] = [
    { id: 'alpha', title: 'Projeto Alpha', subtitle: 'Frontend • 5 membros' },
    { id: 'beta', title: 'Projeto Beta', subtitle: 'Backend • 3 membros' },
    { id: 'gamma', title: 'Projeto Gamma', subtitle: 'Full Stack • 8 membros' },
  ];

  readonly selectedEnvironment = signal<InputSelectOption | null>(this.environmentOptions[0]);
  readonly selectedProject = signal<InputSelectOption | null>(null);
  readonly lastChange = signal<InputSelectChangeEvent | null>(null);

  readonly codeTs = `import { InputSelectComponent } from '../../shared/components/select/input-select.component';
import { InputSelectOption } from '../../shared/components/select/input-select-option.model';
import { InputSelectChangeEvent } from '../../shared/components/select/input-select-change-event.model';

readonly options: InputSelectOption[] = [
  { id: '1', title: 'Produção', subtitle: 'us-east-1 • Ativo', icon: 'cloud' },
  { id: '2', title: 'Homologação', subtitle: 'sa-east-1 • Ativo', icon: 'cloud_queue' },
  { id: '3', title: 'Legado', subtitle: 'Desabilitado', icon: 'cloud_off', disabled: true },
];

readonly selected = signal<InputSelectOption | null>(null);

onSelectionChange(event: InputSelectChangeEvent): void {
  this.selected.set(event.option);
}`;

  readonly codeHtml = `<aq-input-select
  [options]="options"
  [selectedOption]="selected()"
  placeholder="Selecione um ambiente"
  (selectionChange)="onSelectionChange($event)"
/>`;

  onEnvironmentChange(event: InputSelectChangeEvent): void {
    this.selectedEnvironment.set(event.option);
    this.lastChange.set(event);
  }

  onProjectChange(event: InputSelectChangeEvent): void {
    this.selectedProject.set(event.option);
    this.lastChange.set(event);
  }
}
