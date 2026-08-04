import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { SelectFormfieldOption } from '../../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../../../../shared/components/formfields/select-formfield/select-formfield.component';

@Component({
  selector: 'app-select-formfield-showcase',
  standalone: true,
  imports: [ReactiveFormsModule, CodeBlockComponent, SelectFormfieldComponent],
  templateUrl: './select-formfield-showcase.component.html',
  styleUrl: './select-formfield-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFormfieldShowcaseComponent {
  readonly aquariumTypeOptions: SelectFormfieldOption[] = [
    { id: 'freshwater', title: 'Água doce', subtitle: 'Comunidade e plantados', icon: 'water' },
    { id: 'marine', title: 'Marinho', subtitle: 'Recifes e corais', icon: 'waves' },
    { id: 'paludarium', title: 'Paludário', subtitle: 'Zona terrestre e aquática', icon: 'forest' },
    { id: 'quarantine', title: 'Quarentena', subtitle: 'Uso temporário', disabled: true },
  ];

  readonly codeTs = `import { FormControl, Validators } from '@angular/forms';
import { SelectFormfieldComponent } from '../../shared/components/formfields/select-formfield/select-formfield.component';

readonly aquariumType = new FormControl<string | null>(null, {
  validators: [Validators.required],
});`;

  readonly codeHtml = `<aq-select-formfield
  [formControl]="aquariumType"
  label="Tipo do aquario"
  placeholder="Selecione o tipo"
  hint="Essa informacao ajuda a adaptar sugestoes e parametros"
  [options]="aquariumTypeOptions"
  [errorMessages]="{ required: 'Campo obrigatorio.' }"
/>`;

  readonly multipleCodeHtml = `<aq-select-formfield
  [formControl]="faunaProfile"
  label="Perfis da fauna"
  placeholder="Selecione um ou mais perfis"
  [options]="aquariumTypeOptions"
  [multiple]="true"
/>`;

  readonly exampleForm = new FormGroup({
    aquariumType: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    displayType: new FormControl<string | null>('marine'),
    faunaProfile: new FormControl<string[]>(['freshwater', 'paludarium'], {
      nonNullable: true,
    }),
  });

  readonly disabledControl = new FormControl<string | null>({
    value: 'freshwater',
    disabled: true,
  });
  readonly lastSelection = signal<string | null>(null);

  constructor() {
    this.exampleForm.controls.aquariumType.markAsTouched();
  }

  onSelectionChange(event: { option: SelectFormfieldOption }): void {
    this.lastSelection.set(event.option.title);
  }
}
