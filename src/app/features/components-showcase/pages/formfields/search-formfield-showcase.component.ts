import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { SearchFormfieldComponent } from '../../../../shared/components/formfields/search-formfield/search-formfield.component';

@Component({
  selector: 'app-search-formfield-showcase',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CodeBlockComponent, SearchFormfieldComponent],
  templateUrl: './search-formfield-showcase.component.html',
  styleUrl: './search-formfield-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFormfieldShowcaseComponent {
  private readonly focusDemo = viewChild<SearchFormfieldComponent>('focusDemo');

  readonly loading = signal(false);
  readonly lastSubmittedQuery = signal<string | null>(null);
  readonly lastClearedExample = signal<string | null>(null);

  readonly searchForm = new FormGroup({
    query: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  readonly basicControl = new FormControl('', { nonNullable: true });
  readonly contextualControl = new FormControl('Neon tetra', { nonNullable: true });
  readonly ariaOnlyControl = new FormControl('', { nonNullable: true });
  readonly invalidControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  readonly readonlyControl = new FormControl('Filtro canister', { nonNullable: true });
  readonly disabledControl = new FormControl(
    { value: 'Aquario principal', disabled: true },
    { nonNullable: true },
  );
  readonly loadingControl = new FormControl('Oscar', { nonNullable: true });
  readonly emptyLoadingControl = new FormControl('', { nonNullable: true });
  readonly reactiveControl = new FormControl('', { nonNullable: true });

  readonly reactiveStatus = toSignal(
    this.reactiveControl.valueChanges.pipe(
      startWith(this.reactiveControl.value),
      map((value) =>
        value
          ? `Consumidor observaria valueChanges para pesquisar por: "${value}".`
          : 'Consumidor observaria valueChanges para disparar a busca reativa.',
      ),
    ),
    {
      initialValue: 'Consumidor observaria valueChanges para disparar a busca reativa.',
    },
  );

  readonly submitSummary = computed(() =>
    this.lastSubmittedQuery()
      ? `Ultima submissao nativa do formulario: "${this.lastSubmittedQuery()}".`
      : 'Submeta o formulario com Enter para ver o fluxo explicito.',
  );

  readonly codeTs = `import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchFormfieldComponent } from '../../shared/components/formfields/search-formfield/search-formfield.component';

readonly form = new FormGroup({
  query: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  }),
});

search(): void {
  const value = this.form.controls.query.getRawValue();
  // O consumidor decide debounce, servicos e chamadas HTTP.
}`;

  readonly codeHtml = `<form [formGroup]="form" (ngSubmit)="search()">
  <aq-search-formfield
    formControlName="query"
    label="Buscar aquarios"
    placeholder="Buscar aquarios por nome"
    hint="Digite pelo menos 3 caracteres"
    [errorMessages]="{
      required: 'Campo obrigatorio.',
      minlength: 'Informe pelo menos 3 caracteres.'
    }"
  />
</form>`;

  readonly reactiveCodeTs = `readonly searchControl = new FormControl('', { nonNullable: true });

readonly searchPreview = toSignal(
  this.searchControl.valueChanges.pipe(
    startWith(this.searchControl.value),
    map((value) => value.trim()),
  ),
  { initialValue: '' },
);

// Debounce, cancelamento e chamadas externas ficam no consumidor.`;

  readonly reactiveCodeHtml = `<aq-search-formfield
  [formControl]="searchControl"
  ariaLabel="Buscar especies"
  placeholder="Buscar especies"
/>`;

  constructor() {
    this.invalidControl.markAsTouched();
  }

  submitSearch(): void {
    this.searchForm.markAllAsTouched();

    if (this.searchForm.invalid) {
      return;
    }

    this.lastSubmittedQuery.set(this.searchForm.controls.query.getRawValue());
  }

  toggleLoading(): void {
    this.loading.update((value) => !value);
  }

  focusSearchField(): void {
    this.focusDemo()?.focus();
  }

  onCleared(example: string): void {
    this.lastClearedExample.set(example);
  }
}
