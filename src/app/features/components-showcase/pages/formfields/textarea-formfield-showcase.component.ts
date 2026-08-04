import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { TextareaFormfieldComponent } from '../../../../shared/components/formfields/textarea-formfield/textarea-formfield.component';

@Component({
  selector: 'app-textarea-formfield-showcase',
  standalone: true,
  imports: [ReactiveFormsModule, CodeBlockComponent, TextareaFormfieldComponent],
  templateUrl: './textarea-formfield-showcase.component.html',
  styleUrl: './textarea-formfield-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFormfieldShowcaseComponent {
  readonly codeTs = `import { FormControl, Validators } from '@angular/forms';
import { TextareaFormfieldComponent } from '../../shared/components/formfields/textarea-formfield/textarea-formfield.component';

readonly notes = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(10)],
});`;

  readonly codeHtml = `<aq-textarea-formfield
  [formControl]="notes"
  label="Observacoes"
  placeholder="Descreva o aquario"
  hint="Use esse campo para detalhes que ajudam no acompanhamento"
  [rows]="5"
  [errorMessages]="{
    required: 'Campo obrigatorio.',
    minlength: 'Informe pelo menos 10 caracteres.'
  }"
/>`;

  readonly exampleForm = new FormGroup({
    notes: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    history: new FormControl(
      'Troca parcial de água feita ontem. Parâmetros estáveis e peixes ativos.',
      { nonNullable: true },
    ),
  });

  readonly readonlyControl = new FormControl(
    'Aquário de água doce com layout plantado e fauna comunitária.',
    { nonNullable: true },
  );
  readonly disabledControl = new FormControl(
    { value: 'Campo bloqueado para edição.', disabled: true },
    { nonNullable: true },
  );

  constructor() {
    this.exampleForm.controls.notes.markAsTouched();
  }
}
