import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import {
  CardSelectionComponent,
  CardSelectionChange,
  CardSelectionCompareWith,
  CardSelectionContentDirective,
  CardSelectionOption,
} from '../../../../shared/components/card-selection';

enum AquariumType {
  Freshwater = 'freshwater',
  Planted = 'planted',
  Saltwater = 'saltwater',
  Shrimp = 'shrimp',
  Turtle = 'turtle',
}

interface AquariumCategory {
  id: number;
  slug: string;
}

@Component({
  selector: 'app-card-selection-showcase',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CodeBlockComponent,
    CardSelectionComponent,
    CardSelectionContentDirective,
  ],
  templateUrl: './card-selection-showcase.component.html',
  styleUrl: './card-selection-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardSelectionShowcaseComponent {
  readonly aquariumTypeOptions: CardSelectionOption<AquariumType>[] = [
    {
      value: AquariumType.Freshwater,
      title: 'Agua Doce',
      description: 'Aquario padrao de agua doce',
      iconName: 'water_drop',
    },
    {
      value: AquariumType.Planted,
      title: 'Plantado',
      description: 'Aquascaping com plantas vivas',
      iconName: 'psychiatry',
      iconPosition: 'end',
    },
    {
      value: AquariumType.Saltwater,
      title: 'Agua Salgada',
      description: 'Aquario marinho ou de recife',
      iconName: 'waves',
    },
    {
      value: AquariumType.Shrimp,
      title: 'Aquario de Camaroes',
      description: 'Especializado para reproducao de camaroes',
      disabled: true,
    },
    {
      value: AquariumType.Turtle,
      title: 'Aquario de Tartarugas',
      description: 'Configuracao para tartarugas aquaticas',
    },
  ];

  readonly titleOnlyOptions: CardSelectionOption<string>[] = [
    { value: 'freshwater', title: 'Agua Doce' },
    { value: 'planted', title: 'Plantado' },
    { value: 'saltwater', title: 'Agua Salgada' },
    { value: 'shrimp', title: 'Aquario de Camaroes' },
  ];

  readonly iconOptions: CardSelectionOption<string>[] = [
    {
      value: 'freshwater',
      title: 'Agua Doce',
      description: 'Boa para peixes comunitarios e rotinas estaveis.',
      iconName: 'water_drop',
      iconPosition: 'start',
    },
    {
      value: 'planted',
      title: 'Plantado',
      description: 'Destaque visual com plantas e iluminacao dedicada.',
      iconName: 'psychiatry',
      iconPosition: 'end',
    },
    {
      value: 'reef',
      title: 'Recife',
      description: 'Cenario marinho com foco em corais.',
      iconName: 'waves',
    },
  ];

  readonly longTextOptions: CardSelectionOption<string>[] = [
    {
      value: 'community',
      title: 'Aquario comunitario com especies de pequeno porte e comportamento pacifico',
      description:
        'Ideal para quem quer observar convivencia estavel com parametros consistentes ao longo da semana.',
    },
    {
      value: 'reef',
      title: 'Sistema marinho com corais e rotina de manutencao mais precisa',
      description:
        'Exige atencao maior com salinidade, reposicao de evaporacao e iluminacao dedicada.',
    },
  ];

  readonly objectOptions: CardSelectionOption<AquariumCategory>[] = [
    {
      value: { id: 1, slug: 'freshwater' },
      title: 'Agua Doce',
      description: 'Para rios, lagos e plantados',
    },
    {
      value: { id: 2, slug: 'saltwater' },
      title: 'Agua Salgada',
      description: 'Para aquarios marinhos e recifes',
    },
  ];

  readonly compareCategory: CardSelectionCompareWith<AquariumCategory> = (option, selected) =>
    option.id === selected.id;

  readonly requiredControl = new FormControl<AquariumType | null>(null, {
    validators: [Validators.required],
  });

  readonly disabledControl = new FormControl<AquariumType | null>({
    value: AquariumType.Planted,
    disabled: true,
  });
  readonly multipleControl = new FormControl<AquariumType[]>([
    AquariumType.Freshwater,
    AquariumType.Saltwater,
  ]);

  readonly reactiveForm = new FormGroup({
    type: new FormControl<AquariumType | null>(AquariumType.Saltwater, {
      validators: [Validators.required],
    }),
    category: new FormControl<AquariumCategory | null>({ id: 2, slug: 'saltwater' }),
    profiles: new FormControl<AquariumType[]>([AquariumType.Planted]),
  });

  lastMultipleChange: CardSelectionChange<AquariumType> | null = null;

  readonly codeTs = `import { FormControl, Validators } from '@angular/forms';
import {
  CardSelectionComponent,
  CardSelectionOption,
} from '../../shared/components/card-selection';

readonly aquariumType = new FormControl<AquariumType | null>(null, {
  validators: [Validators.required],
});

readonly aquariumTypeOptions: CardSelectionOption<AquariumType>[] = [
  {
    value: AquariumType.Freshwater,
    title: 'Agua Doce',
    description: 'Aquario padrao de agua doce',
    iconName: 'water_drop',
  },
];`;

  readonly codeHtml = `<aq-card-selection
  [formControl]="aquariumType"
  label="Tipo de aquario"
  hint="Selecione a configuracao que melhor representa o seu aquario."
  errorMessage="Selecione um tipo de aquario."
  [options]="aquariumTypeOptions"
  [required]="true"
/>`;

  readonly multipleCodeHtml = `<aq-card-selection
  [formControl]="profiles"
  label="Perfis do aquario"
  hint="Voce pode marcar mais de uma configuracao compativel."
  [options]="aquariumTypeOptions"
  [multiple]="true"
/>`;

  readonly iconCodeHtml = `<aq-card-selection
  label="Tipo de aquario"
  [options]="[
    {
      value: 'freshwater',
      title: 'Agua Doce',
      description: 'Boa para peixes comunitarios.',
      iconName: 'water_drop',
      iconPosition: 'start',
    },
    {
      value: 'planted',
      title: 'Plantado',
      description: 'Composicao com icone no fim.',
      iconName: 'psychiatry',
      iconPosition: 'end',
    },
  ]"
/>`;

  readonly projectedCodeHtml = `<aq-card-selection
  [options]="aquariumTypeOptions"
  label="Tipo de aquario"
>
  <ng-template aqCardSelectionContent let-option let-selected="selected">
    <div class="custom-option">
      <strong>{{ option.title }}</strong>
      @if (option.description) {
        <span>{{ option.description }}</span>
      }

      @if (selected) {
        <span>Selecionado</span>
      }
    </div>
  </ng-template>
</aq-card-selection>`;

  constructor() {
    this.requiredControl.markAsTouched();
  }
}
