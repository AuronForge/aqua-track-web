import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';

@Component({
  selector: 'app-datepicker-formfield-showcase',
  standalone: true,
  imports: [ReactiveFormsModule, CodeBlockComponent, DatepickerFormfieldComponent],
  templateUrl: './datepicker-formfield-showcase.component.html',
  styleUrl: './datepicker-formfield-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerFormfieldShowcaseComponent {
  readonly codeTs = `import { FormControl, Validators } from '@angular/forms';
import { DatepickerFormfieldComponent } from '../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';

readonly birthDate = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required],
});`;

  readonly codeHtml = `<aq-datepicker-formfield
  [formControl]="birthDate"
  label="Data de nascimento"
  hint="Use a mesma data cadastrada na sua conta"
  [required]="true"
  [errorMessages]="{ required: 'Campo obrigatorio.' }"
/>\n`;

  readonly birthDateControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly presetDateControl = new FormControl('2024-06-15', {
    nonNullable: true,
  });

  readonly disabledControl = new FormControl(
    { value: '2022-11-03', disabled: true },
    { nonNullable: true },
  );

  constructor() {
    this.birthDateControl.markAsTouched();
  }
}
