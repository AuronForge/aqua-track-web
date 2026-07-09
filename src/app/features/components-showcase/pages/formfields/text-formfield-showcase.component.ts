import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { FormfieldAction } from '../../../../shared/components/formfields/formfield-action.model';
import { TextFormfieldComponent } from '../../../../shared/components/formfields/text-formfield/text-formfield.component';

@Component({
  selector: 'app-text-formfield-showcase',
  standalone: true,
  imports: [ReactiveFormsModule, CodeBlockComponent, TextFormfieldComponent],
  templateUrl: './text-formfield-showcase.component.html',
  styleUrl: './text-formfield-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFormfieldShowcaseComponent {
  readonly nameActions: FormfieldAction[] = [
    {
      id: 'clear-full-name',
      icon: 'close',
      ariaLabel: 'Limpar nome completo',
    },
  ];

  readonly usernameActions: FormfieldAction[] = [
    {
      id: 'copy-username',
      icon: 'content_copy',
      ariaLabel: 'Copiar nome de usuário',
    },
  ];

  readonly codeTs = `import { FormControl, Validators } from '@angular/forms';
import { TextFormfieldComponent } from '../../shared/components/formfields/text-formfield/text-formfield.component';

readonly fullName = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.minLength(3)],
});`;

  readonly codeHtml = `<aq-text-formfield
  [formControl]="fullName"
  label="Nome completo"
  placeholder="Ex: José Eduardo Trindade Marques"
  hint="Use o nome que será exibido no seu perfil"
  [errorMessages]="{
    required: 'Campo obrigatório.',
    minlength: 'Informe pelo menos 3 caracteres.'
  }"
/>`;

  readonly exampleForm = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    username: new FormControl('john_doe', { nonNullable: true }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    temperature: new FormControl('26', { nonNullable: true }),
    search: new FormControl('AquaTrack', { nonNullable: true }),
    readonlyName: new FormControl('José Eduardo Trindade Marques', { nonNullable: true }),
  });

  readonly hintControl = new FormControl('', { nonNullable: true });
  readonly requiredControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly minlengthControl = new FormControl('jo', {
    nonNullable: true,
    validators: [Validators.minLength(3)],
  });
  readonly prefixControl = new FormControl('11987654321', { nonNullable: true });
  readonly suffixControl = new FormControl('240', { nonNullable: true });
  readonly invalidControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly disabledControl = new FormControl(
    { value: 'Aquário principal', disabled: true },
    { nonNullable: true },
  );

  readonly lastAction = signal<string | null>(null);

  constructor() {
    this.requiredControl.markAsTouched();
    this.minlengthControl.markAsTouched();
    this.invalidControl.markAsTouched();
  }

  onActionClick(action: FormfieldAction): void {
    if (action.id === 'clear-full-name') {
      this.exampleForm.controls.fullName.setValue('');
      this.exampleForm.controls.fullName.markAsDirty();
      this.exampleForm.controls.fullName.markAsTouched();
    }

    this.lastAction.set(action.id);
  }
}
